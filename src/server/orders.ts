import { randomUUID } from "node:crypto";
import { getEnv } from "@/lib/env";

export type OrderStatus =
  "created" | "pending_payment" | "approved" | "rejected" | "cancelled" | "refunded";

export type OrderItem = {
  slug: string;
  name: string;
  size: string;
  color: string;
  quantity: number;
  unitPriceCents: number;
  totalCents: number;
};

export type OrderCustomer = {
  name: string;
  email: string;
  phone: string;
  address: {
    street: string;
    number: string;
    neighborhood: string;
    city: string;
    state: string;
    cep: string;
  };
};

export type OrderFinancial = {
  subtotalCents: number;
  shippingCents: number;
  totalCents: number;
  currency: "BRL";
};

export type OrderPaymentInfo = {
  preferenceId?: string | undefined;
  initPoint?: string | undefined;
  mpPaymentId?: string | undefined;
  paymentMethodId?: string | undefined;
  paymentStatus?: string | undefined;
  statusDetail?: string | undefined;
  paidAmountCents?: number | undefined;
  paidAt?: string | undefined;
};

export type Order = {
  id: string;
  external_reference: string;
  createdAt: string;
  updatedAt: string;
  status: OrderStatus;
  items: OrderItem[];
  customer: OrderCustomer;
  shipping: {
    id: string;
    name: string;
    priceCents: number;
    estimatedDays: number;
  };
  financial: OrderFinancial;
  payment: OrderPaymentInfo;
  idempotencyKey?: string | undefined;
};

export type CreateOrderInput = {
  items: OrderItem[];
  customer: OrderCustomer;
  shipping: {
    id: string;
    name: string;
    priceCents: number;
    estimatedDays: number;
  };
  financial: OrderFinancial;
  idempotencyKey?: string | undefined;
};

// Transições válidas de estado do pedido para integridade financeira
const VALID_TRANSITIONS: Record<OrderStatus, OrderStatus[]> = {
  created: ["pending_payment", "rejected", "cancelled"],
  pending_payment: ["approved", "rejected", "cancelled"],
  approved: ["refunded"],
  rejected: [],
  cancelled: [],
  refunded: [],
};

// Armazenamento em memória do servidor resiliente (funciona em todos os ambientes/testes e como cache serverless)
const serverOrdersStore = new Map<string, Order>();
const idempotencyStore = new Map<string, { orderId: string; expiresAt: number }>();

function generateOrderId(): string {
  const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, "");
  const randomSuffix = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `ORD-${dateStr}-${randomSuffix}`;
}

export async function createOrder(input: CreateOrderInput): Promise<Order> {
  const id = generateOrderId();
  const external_reference = `verso_${id}_${randomUUID().slice(0, 8)}`;
  const now = new Date().toISOString();

  const order: Order = {
    id,
    external_reference,
    createdAt: now,
    updatedAt: now,
    status: "created",
    items: input.items,
    customer: input.customer,
    shipping: input.shipping,
    financial: input.financial,
    payment: {},
    idempotencyKey: input.idempotencyKey,
  };

  serverOrdersStore.set(order.id, order);
  serverOrdersStore.set(order.external_reference, order);

  if (input.idempotencyKey) {
    idempotencyStore.set(input.idempotencyKey, {
      orderId: order.id,
      expiresAt: Date.now() + 10 * 60 * 1000, // 10 minutos
    });
  }

  // Se o Supabase estiver configurado, persiste de forma segura no servidor
  await persistToSupabaseIfConfigured(order);

  return order;
}

export async function getOrderById(orderId: string): Promise<Order | null> {
  const cached = serverOrdersStore.get(orderId);
  if (cached) return cached;

  const fromSupabase = await fetchFromSupabase("id", orderId);
  if (fromSupabase) {
    serverOrdersStore.set(fromSupabase.id, fromSupabase);
    serverOrdersStore.set(fromSupabase.external_reference, fromSupabase);
    return fromSupabase;
  }

  return null;
}

export async function getOrderByExternalReference(
  externalReference: string,
): Promise<Order | null> {
  const cached = serverOrdersStore.get(externalReference);
  if (cached) return cached;

  const fromSupabase = await fetchFromSupabase("external_reference", externalReference);
  if (fromSupabase) {
    serverOrdersStore.set(fromSupabase.id, fromSupabase);
    serverOrdersStore.set(fromSupabase.external_reference, fromSupabase);
    return fromSupabase;
  }

  return null;
}

export function findOrderByIdempotencyKey(key: string): Order | null {
  const entry = idempotencyStore.get(key);
  if (!entry) return null;
  if (Date.now() > entry.expiresAt) {
    idempotencyStore.delete(key);
    return null;
  }
  return serverOrdersStore.get(entry.orderId) ?? null;
}

export async function updateOrderPayment(
  externalReference: string,
  newStatus: OrderStatus,
  paymentDetails: Partial<OrderPaymentInfo>,
): Promise<Order | null> {
  const order = await getOrderByExternalReference(externalReference);
  if (!order) return null;

  // Validação estrita de transição de estado
  if (order.status !== newStatus) {
    const allowed = VALID_TRANSITIONS[order.status];
    if (!allowed || !allowed.includes(newStatus)) {
      console.warn(
        `[Orders] Transição de estado inválida de '${order.status}' para '${newStatus}' no pedido ${order.id}`,
      );
      return null;
    }
  }

  order.status = newStatus;
  order.updatedAt = new Date().toISOString();
  order.payment = {
    ...order.payment,
    ...paymentDetails,
  };

  serverOrdersStore.set(order.id, order);
  serverOrdersStore.set(order.external_reference, order);

  await persistToSupabaseIfConfigured(order);

  return order;
}

// Limpeza de testes e resets
export function _resetOrdersStoreForTesting(): void {
  serverOrdersStore.clear();
  idempotencyStore.clear();
}

// Integração de servidor com Supabase (quando credenciais forem fornecidas)
async function persistToSupabaseIfConfigured(order: Order): Promise<void> {
  const env = getEnv();
  if (!env.SUPABASE_URL || !env.SUPABASE_SERVICE_ROLE_KEY) return;

  try {
    const url = `${env.SUPABASE_URL}/rest/v1/orders`;
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: env.SUPABASE_SERVICE_ROLE_KEY,
        Authorization: `Bearer ${env.SUPABASE_SERVICE_ROLE_KEY}`,
        Prefer: "resolution=merge-duplicates",
      },
      body: JSON.stringify({
        id: order.id,
        external_reference: order.external_reference,
        status: order.status,
        customer_email: order.customer.email,
        customer_name: order.customer.name,
        total_cents: order.financial.totalCents,
        order_data: order,
        updated_at: order.updatedAt,
      }),
    });

    if (!res.ok) {
      console.error(
        `[Supabase] Erro ao sincronizar pedido ${order.id}: ${res.status} ${res.statusText}`,
      );
    }
  } catch (err) {
    console.error(`[Supabase] Falha de conexão ao sincronizar pedido ${order.id}:`, err);
  }
}

async function fetchFromSupabase(
  field: "id" | "external_reference",
  value: string,
): Promise<Order | null> {
  const env = getEnv();
  if (!env.SUPABASE_URL || !env.SUPABASE_SERVICE_ROLE_KEY) return null;

  try {
    const url = `${env.SUPABASE_URL}/rest/v1/orders?${field}=eq.${encodeURIComponent(value)}&select=order_data&limit=1`;
    const res = await fetch(url, {
      headers: {
        apikey: env.SUPABASE_SERVICE_ROLE_KEY,
        Authorization: `Bearer ${env.SUPABASE_SERVICE_ROLE_KEY}`,
      },
    });

    if (res.ok) {
      const data = (await res.json()) as Array<{ order_data: Order }>;
      return data[0]?.order_data ?? null;
    }
  } catch (err) {
    console.error(`[Supabase] Erro ao buscar pedido por ${field}=${value}:`, err);
  }
  return null;
}
