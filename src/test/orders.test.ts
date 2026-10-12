import { describe, expect, it, beforeEach } from "vitest";
import {
  createOrder,
  getOrderById,
  getOrderByExternalReference,
  updateOrderPayment,
  findOrderByIdempotencyKey,
  _resetOrdersStoreForTesting,
} from "@/server/orders";

describe("Server Orders System", () => {
  beforeEach(() => {
    _resetOrdersStoreForTesting();
  });

  it("creates a persistent order with explicit initial status and fields", async () => {
    const order = await createOrder({
      items: [
        {
          slug: "camiseta-exodo",
          name: "Camiseta Oversized “Êxodo”",
          size: "G",
          color: "Preto lavado",
          quantity: 2,
          unitPriceCents: 13900,
          totalCents: 27800,
        },
      ],
      customer: {
        name: "João Silva",
        email: "joao@example.com",
        phone: "11999999999",
        address: {
          street: "Av Paulista",
          number: "1000",
          neighborhood: "Bela Vista",
          city: "São Paulo",
          state: "SP",
          cep: "01310100",
        },
      },
      shipping: {
        id: "pac",
        name: "PAC (Econômico)",
        priceCents: 1990,
        estimatedDays: 5,
      },
      financial: {
        subtotalCents: 27800,
        shippingCents: 1990,
        totalCents: 29790,
        currency: "BRL",
      },
      idempotencyKey: "test-idem-key-123",
    });

    expect(order.id).toMatch(/^ORD-\d{8}-[A-Z0-9]+$/);
    expect(order.external_reference).toContain(`verso_${order.id}`);
    expect(order.status).toBe("created");
    expect(order.financial.totalCents).toBe(29790);

    // Retrieve by ID
    const retrievedById = await getOrderById(order.id);
    expect(retrievedById).toEqual(order);

    // Retrieve by external reference
    const retrievedByRef = await getOrderByExternalReference(order.external_reference);
    expect(retrievedByRef).toEqual(order);
  });

  it("enforces valid state transitions and rejects illegal transitions", async () => {
    const order = await createOrder({
      items: [],
      customer: {
        name: "Maria",
        email: "maria@test.com",
        phone: "11888888888",
        address: {
          street: "Rua A",
          number: "1",
          neighborhood: "B",
          city: "C",
          state: "SP",
          cep: "01001000",
        },
      },
      shipping: { id: "pac", name: "PAC", priceCents: 0, estimatedDays: 5 },
      financial: { subtotalCents: 30000, shippingCents: 0, totalCents: 30000, currency: "BRL" },
    });

    // Valid: created -> pending_payment
    const pending = await updateOrderPayment(order.external_reference, "pending_payment", {
      preferenceId: "pref-123",
      initPoint: "https://mercadopago.com/init",
    });
    expect(pending?.status).toBe("pending_payment");
    expect(pending?.payment.preferenceId).toBe("pref-123");

    // Valid: pending_payment -> approved
    const approved = await updateOrderPayment(order.external_reference, "approved", {
      mpPaymentId: "pay-999",
      paidAmountCents: 30000,
    });
    expect(approved?.status).toBe("approved");

    // Invalid: approved -> pending_payment (reversão ilegal de pedido aprovado)
    const illegalRevert = await updateOrderPayment(order.external_reference, "pending_payment", {});
    expect(illegalRevert).toBeNull();
    // Continua approved
    const current = await getOrderById(order.id);
    expect(current?.status).toBe("approved");

    // Valid: approved -> refunded
    const refunded = await updateOrderPayment(order.external_reference, "refunded", {});
    expect(refunded?.status).toBe("refunded");

    // Terminal: refunded -> approved (re-aprovação de estornado rejeitada)
    const illegalReapprove = await updateOrderPayment(order.external_reference, "approved", {});
    expect(illegalReapprove).toBeNull();
  });

  it("detects and prevents duplicate orders via idempotency keys", async () => {
    const order1 = await createOrder({
      items: [],
      customer: {
        name: "Pedro",
        email: "pedro@test.com",
        phone: "11999990000",
        address: {
          street: "Rua B",
          number: "2",
          neighborhood: "C",
          city: "D",
          state: "SP",
          cep: "01001000",
        },
      },
      shipping: { id: "pac", name: "PAC", priceCents: 0, estimatedDays: 5 },
      financial: { subtotalCents: 15000, shippingCents: 0, totalCents: 15000, currency: "BRL" },
      idempotencyKey: "idem-double-click-prevent",
    });

    const existing = findOrderByIdempotencyKey("idem-double-click-prevent");
    expect(existing).not.toBeNull();
    expect(existing?.id).toBe(order1.id);
  });
});
