import { createFileRoute } from "@tanstack/react-router";
import { MercadoPagoConfig, Payment } from "mercadopago";
import crypto from "crypto";
import { getEnv } from "@/lib/env";
import { getOrderByExternalReference, updateOrderPayment, type OrderStatus } from "@/server/orders";

// Registro de eventos processados para garantir idempotência e evitar reprocessamento
const processedEvents = new Map<string, number>();

export function isEventAlreadyProcessed(eventId: string): boolean {
  const processedAt = processedEvents.get(eventId);
  if (!processedAt) return false;
  // Expira após 24 horas
  if (Date.now() - processedAt > 24 * 60 * 60 * 1000) {
    processedEvents.delete(eventId);
    return false;
  }
  return true;
}

export function markEventAsProcessed(eventId: string): void {
  processedEvents.set(eventId, Date.now());
}

export function _clearProcessedEventsForTesting(): void {
  processedEvents.clear();
}

export function verifyWebhookSignature({
  xSignature,
  xRequestId,
  dataId,
  secret,
}: {
  xSignature: string | null;
  xRequestId: string | null;
  dataId: string;
  secret: string;
}): { valid: boolean; reason?: string } {
  if (!xSignature || !xRequestId) {
    return { valid: false, reason: "Cabeçalhos x-signature ou x-request-id ausentes" };
  }

  const parts = xSignature.split(",");
  let ts: string | undefined;
  let v1: string | undefined;

  for (const part of parts) {
    const [rawKey, rawValue] = part.split("=");
    const key = rawKey?.trim();
    const value = rawValue?.trim();
    if (key === "ts") ts = value;
    if (key === "v1") v1 = value;
  }

  if (!ts || !v1) {
    return { valid: false, reason: "Formato inválido de x-signature" };
  }

  const manifest = `id:${dataId};request-id:${xRequestId};ts:${ts};`;
  const hmac = crypto.createHmac("sha256", secret);
  hmac.update(manifest);
  const expectedHex = hmac.digest("hex");

  try {
    const providedBuffer = Buffer.from(v1, "hex");
    const expectedBuffer = Buffer.from(expectedHex, "hex");

    if (
      providedBuffer.length !== expectedBuffer.length ||
      !crypto.timingSafeEqual(expectedBuffer, providedBuffer)
    ) {
      return { valid: false, reason: "Assinatura não confere" };
    }
  } catch {
    return { valid: false, reason: "Erro ao decodificar assinatura" };
  }

  return { valid: true };
}

export function mapMercadoPagoStatus(mpStatus: string): OrderStatus {
  switch (mpStatus) {
    case "approved":
      return "approved";
    case "pending":
    case "in_process":
    case "authorized":
      return "pending_payment";
    case "rejected":
      return "rejected";
    case "cancelled":
      return "cancelled";
    case "refunded":
    case "charged_back":
      return "refunded";
    default:
      return "pending_payment";
  }
}

export const Route = createFileRoute("/api/webhook/mercadopago")({
  staticData: { sitemap: false },
  server: {
    handlers: {
      POST: async ({ request }: { request: Request }) => {
        try {
          const env = getEnv();
          if (!env.MP_ACCESS_TOKEN || !env.MP_WEBHOOK_SECRET) {
            console.error(
              "[MP Webhook] Configuração incompleta: MP_ACCESS_TOKEN ou MP_WEBHOOK_SECRET ausente.",
            );
            return new Response("Webhook indisponível: configuração ausente", { status: 500 });
          }

          const url = new URL(request.url);
          const xSignature = request.headers.get("x-signature");
          const xRequestId = request.headers.get("x-request-id");

          const rawBody = await request.text();
          let payload: Record<string, unknown> = {};
          if (rawBody.trim()) {
            try {
              payload = JSON.parse(rawBody);
            } catch {
              return new Response("Payload JSON malformado", { status: 400 });
            }
          }

          // Extração do ID do recurso (data.id da query ou payload['data'].id ou payload['id'])
          const payloadData = payload["data"];
          const payloadId = payload["id"];
          const dataID =
            url.searchParams.get("data.id") ||
            (payloadData && typeof payloadData === "object" && "id" in payloadData
              ? String((payloadData as Record<string, unknown>)["id"])
              : undefined) ||
            (payloadId ? String(payloadId) : undefined);

          if (!dataID) {
            return new Response("data.id não informado", { status: 400 });
          }

          // 1. Validação criptográfica da assinatura conforme o protocolo oficial
          const verification = verifyWebhookSignature({
            xSignature,
            xRequestId,
            dataId: dataID,
            secret: env.MP_WEBHOOK_SECRET,
          });

          if (!verification.valid) {
            console.warn(`[MP Webhook] Assinatura rejeitada: ${verification.reason}`);
            return new Response(`Unauthorized: ${verification.reason}`, { status: 401 });
          }

          // 2. Identificação do tipo do evento
          const payloadType = typeof payload["type"] === "string" ? payload["type"] : undefined;
          const type = url.searchParams.get("type") || payloadType;
          const action = typeof payload["action"] === "string" ? payload["action"] : undefined;

          // Se não for evento de pagamento, responde 200 OK (ex: merchant_order, test ping)
          if (type !== "payment" && action !== "payment.created" && action !== "payment.updated") {
            return new Response("OK (ignorado tipo não-pagamento)", { status: 200 });
          }

          const paymentId = Number(dataID);
          if (isNaN(paymentId)) {
            return new Response("ID de pagamento inválido", { status: 400 });
          }

          // 3. Consulta do recurso atualizado diretamente na API do Mercado Pago
          // NUNCA confiamos exclusivamente no payload recebido
          const client = new MercadoPagoConfig({ accessToken: env.MP_ACCESS_TOKEN });
          const payment = await new Payment(client).get({ id: paymentId });

          if (!payment || !payment.status) {
            console.error(`[MP Webhook] Pagamento ${paymentId} não encontrado na API do MP`);
            return new Response("Pagamento não localizado na API", { status: 404 });
          }

          const externalReference = payment.external_reference;
          if (!externalReference) {
            console.warn(`[MP Webhook] Pagamento ${payment.id} sem external_reference associado`);
            return new Response("OK (sem pedido associado)", { status: 200 });
          }

          // 4. Verificação de Idempotência
          const eventKey = `${payment.id}:${payment.status}`;
          if (isEventAlreadyProcessed(eventKey)) {
            return new Response("OK (já processado)", { status: 200 });
          }

          // 5. Associação segura com o pedido persistido
          const order = await getOrderByExternalReference(externalReference);
          if (!order) {
            console.warn(
              `[MP Webhook] Pedido com external_reference '${externalReference}' não localizado`,
            );
            return new Response("OK (pedido não encontrado)", { status: 200 });
          }

          // 6. Integridade Financeira: conferir montante pago quando aprovado
          const paidAmountCents = Math.round(Number(payment.transaction_amount ?? 0) * 100);
          if (payment.status === "approved" && paidAmountCents < order.financial.totalCents) {
            console.error(
              `[MP Webhook] ALERTA DE SEGURANÇA: Valor pago (${paidAmountCents}) menor que o total do pedido (${order.financial.totalCents}) para ${order.id}`,
            );
            // Não marca como aprovado em caso de subpagamento não autorizado
            return new Response("Valor divergente do pedido", { status: 400 });
          }

          // 7. Atualização do estado com transição válida
          const newStatus = mapMercadoPagoStatus(payment.status);
          const updated = await updateOrderPayment(order.external_reference, newStatus, {
            mpPaymentId: String(payment.id),
            paymentMethodId: payment.payment_method_id ?? undefined,
            paymentStatus: payment.status,
            statusDetail: payment.status_detail ?? undefined,
            paidAmountCents,
            paidAt: payment.date_approved ?? new Date().toISOString(),
          });

          if (!updated && order.status !== newStatus) {
            console.warn(
              `[MP Webhook] Transição de estado de ${order.status} para ${newStatus} bloqueada para ${order.id}`,
            );
          }

          markEventAsProcessed(eventKey);

          console.log(
            `[MP Webhook] Pedido ${order.id} atualizado para status '${newStatus}' (MP status: ${payment.status})`,
          );

          return new Response("OK", { status: 200 });
        } catch (error) {
          console.error("[MP Webhook] Erro inesperado ao processar notificação:", error);
          // Retorna 500 para permitir que o Mercado Pago reenvie a notificação em caso de falha temporária
          return new Response("Internal Server Error", { status: 500 });
        }
      },
    },
  },
});
