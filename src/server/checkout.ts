import { randomUUID } from "node:crypto";
import { createServerFn } from "@tanstack/react-start";
import { MercadoPagoConfig, Preference } from "mercadopago";
import { z } from "zod";
import { checkoutRequestSchema } from "@/lib/checkout-schema";
import { checkoutFailure } from "@/lib/checkout-error";
import { getEnv } from "@/lib/env";
import { getProductBySlug } from "@/data/products";
import { calculateFreightWithProvider } from "./freight-service";
import {
  createOrder,
  findOrderByIdempotencyKey,
  getOrderByExternalReference,
  getOrderById,
  updateOrderPayment,
  type OrderItem,
} from "./orders";

type MercadoPagoItem = {
  id: string;
  title: string;
  quantity: number;
  unit_price: number;
  currency_id: "BRL";
  picture_url: string;
  category_id: string;
};

export const createPaymentPreference = createServerFn({ method: "POST" })
  .validator(checkoutRequestSchema)
  .handler(async ({ data: payload }) => {
    const correlationId = randomUUID();
    const env = getEnv();

    try {
      // 1. Verificação de idempotência (previne cliques duplos e pedidos duplicados)
      if (payload.idempotency_key) {
        const existingOrder = findOrderByIdempotencyKey(payload.idempotency_key);
        if (existingOrder && existingOrder.payment.initPoint) {
          return {
            success: true as const,
            init_point: existingOrder.payment.initPoint,
            id: existingOrder.payment.preferenceId,
            order_id: existingOrder.id,
            external_reference: existingOrder.external_reference,
          };
        }
      }

      if (!env.MP_ACCESS_TOKEN) throw new Error("Mercado Pago is not configured");

      const client = new MercadoPagoConfig({
        accessToken: env.MP_ACCESS_TOKEN,
        options: { timeout: 5000 },
      });
      const preference = new Preference(client);
      const mpItems: MercadoPagoItem[] = [];
      const orderItems: OrderItem[] = [];

      let subtotalCents = 0;

      // 2. Validação estrita de itens e preços a partir do catálogo confiável
      for (const item of payload.items) {
        const product = getProductBySlug(item.slug);
        if (
          !product ||
          !product.sizes.includes(item.size) ||
          !product.colors.includes(item.color)
        ) {
          throw new Error("Invalid product selection");
        }

        const lineTotalCents = product.priceCents * item.quantity;
        subtotalCents += lineTotalCents;

        orderItems.push({
          slug: product.slug,
          name: product.name,
          size: item.size,
          color: item.color,
          quantity: item.quantity,
          unitPriceCents: product.priceCents,
          totalCents: lineTotalCents,
        });

        const image = product.images[0] ?? "/favicon.svg";
        mpItems.push({
          id: `${product.slug}-${item.color}-${item.size}`,
          title: `${product.name} - ${item.size} - ${item.color}`,
          quantity: item.quantity,
          unit_price: product.priceCents / 100,
          currency_id: "BRL",
          picture_url: image.startsWith("http") ? image : new URL(image, env.PUBLIC_SITE_URL).href,
          category_id: product.category,
        });
      }

      // 3. Validação e cálculo seguro do frete no servidor
      const freightQuote = await calculateFreightWithProvider({
        cep: payload.shipping_cep,
        items: payload.items.map(({ slug, quantity }) => ({ slug, quantity })),
      });
      const selectedShipping = freightQuote.options.find(
        ({ id }) => id === payload.shipping_method,
      );
      if (!selectedShipping) throw new Error("Invalid shipping option");

      if (selectedShipping.priceCents > 0) {
        mpItems.push({
          id: "shipping",
          title: `Frete - ${selectedShipping.name}`,
          quantity: 1,
          unit_price: selectedShipping.priceCents / 100,
          currency_id: "BRL",
          picture_url: new URL("/favicon.svg", env.PUBLIC_SITE_URL).href,
          category_id: "shipping",
        });
      }

      const totalCents = subtotalCents + selectedShipping.priceCents;

      // 4. Criação do pedido persistente ANTES da inicialização no Mercado Pago
      const order = await createOrder({
        items: orderItems,
        customer: {
          name: payload.payer.name,
          email: payload.payer.email,
          phone: `${payload.payer.phone.area_code}${payload.payer.phone.number}`,
          address: {
            street: payload.payer.address.street_name,
            number: payload.payer.address.street_number,
            neighborhood: "",
            city: "",
            state: "",
            cep: payload.payer.address.zip_code,
          },
        },
        shipping: {
          id: selectedShipping.id,
          name: selectedShipping.name,
          priceCents: selectedShipping.priceCents,
          estimatedDays: selectedShipping.estimatedDays,
        },
        financial: {
          subtotalCents,
          shippingCents: selectedShipping.priceCents,
          totalCents,
          currency: "BRL",
        },
        idempotencyKey: payload.idempotency_key,
      });

      // 5. Configuração da Preferência no Mercado Pago associada ao pedido
      const body = {
        items: mpItems,
        payer: payload.payer,
        back_urls: {
          success: new URL(
            `/pagamento/sucesso?ref=${order.external_reference}`,
            env.PUBLIC_SITE_URL,
          ).href,
          pending: new URL(
            `/pagamento/pendente?ref=${order.external_reference}`,
            env.PUBLIC_SITE_URL,
          ).href,
          failure: new URL(
            `/pagamento/recusado?ref=${order.external_reference}`,
            env.PUBLIC_SITE_URL,
          ).href,
        },
        auto_return: "approved" as const,
        payment_methods: {
          excluded_payment_methods: [],
          excluded_payment_types: [],
          installments: 3,
        },
        notification_url: new URL("/api/webhook/mercadopago", env.PUBLIC_SITE_URL).href,
        statement_descriptor: "VERSO STREETWEAR",
        external_reference: order.external_reference,
      } satisfies Parameters<typeof preference.create>[0]["body"];

      const response = await preference.create({ body });

      // 6. Atualização do estado do pedido para pendente_pagamento com os dados da preferência
      await updateOrderPayment(order.external_reference, "pending_payment", {
        preferenceId: response.id,
        initPoint: response.init_point,
      });

      return {
        success: true as const,
        init_point: response.init_point,
        id: response.id,
        order_id: order.id,
        external_reference: order.external_reference,
      };
    } catch (error: unknown) {
      const failure = checkoutFailure(error, correlationId, [
        env.MP_ACCESS_TOKEN ?? "",
        env.MP_WEBHOOK_SECRET ?? "",
        env.SUPABASE_SERVICE_ROLE_KEY ?? "",
      ]);
      console.error(failure.logMessage);
      return failure.response;
    }
  });

export const getOrderStatusQuerySchema = z.object({
  orderId: z.string().optional(),
  externalReference: z.string().optional(),
});

export const getOrderStatus = createServerFn({ method: "GET" })
  .validator(getOrderStatusQuerySchema)
  .handler(async ({ data }) => {
    let order = null;
    if (data.externalReference) {
      order = await getOrderByExternalReference(data.externalReference);
    } else if (data.orderId) {
      order = await getOrderById(data.orderId);
    }

    if (!order) {
      return { success: false as const, error: "Pedido não encontrado" };
    }

    return {
      success: true as const,
      order: {
        id: order.id,
        external_reference: order.external_reference,
        status: order.status,
        createdAt: order.createdAt,
        updatedAt: order.updatedAt,
        items: order.items,
        shipping: order.shipping,
        financial: order.financial,
        payment: {
          status: order.payment.paymentStatus,
          statusDetail: order.payment.statusDetail,
          paidAmountCents: order.payment.paidAmountCents,
          paidAt: order.payment.paidAt,
        },
      },
    };
  });
