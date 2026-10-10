import { randomUUID } from "node:crypto";
import { createServerFn } from "@tanstack/react-start";
import { MercadoPagoConfig, Preference } from "mercadopago";
import { checkoutRequestSchema } from "@/lib/checkout-schema";
import { checkoutFailure } from "@/lib/checkout-error";
import { getEnv } from "@/lib/env";
import { getProductBySlug } from "@/data/products";
import { calculateFreightOptions } from "./freight-calculator";

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
      if (!env.MP_ACCESS_TOKEN) throw new Error("Mercado Pago is not configured");

      const client = new MercadoPagoConfig({
        accessToken: env.MP_ACCESS_TOKEN,
        options: { timeout: 5000 },
      });
      const preference = new Preference(client);
      const mpItems: MercadoPagoItem[] = [];

      for (const item of payload.items) {
        const product = getProductBySlug(item.slug);
        if (
          !product ||
          !product.sizes.includes(item.size) ||
          !product.colors.includes(item.color)
        ) {
          throw new Error("Invalid product selection");
        }

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

      const freightOptions = calculateFreightOptions({
        cep: payload.shipping_cep,
        items: payload.items.map(({ slug, quantity }) => ({ slug, quantity })),
      });
      const selectedShipping = freightOptions.find(({ id }) => id === payload.shipping_method);
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

      const body = {
        items: mpItems,
        payer: payload.payer,
        back_urls: {
          success: new URL("/pagamento/sucesso", env.PUBLIC_SITE_URL).href,
          pending: new URL("/pagamento/pendente", env.PUBLIC_SITE_URL).href,
          failure: new URL("/pagamento/recusado", env.PUBLIC_SITE_URL).href,
        },
        auto_return: "approved" as const,
        payment_methods: {
          excluded_payment_methods: [],
          excluded_payment_types: [],
          installments: 3,
        },
        notification_url: new URL("/api/webhook/mercadopago", env.PUBLIC_SITE_URL).href,
        statement_descriptor: "VERSO STREETWEAR",
        external_reference: correlationId,
      } satisfies Parameters<typeof preference.create>[0]["body"];

      const response = await preference.create({ body });
      return {
        success: true as const,
        init_point: response.init_point,
        id: response.id,
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
