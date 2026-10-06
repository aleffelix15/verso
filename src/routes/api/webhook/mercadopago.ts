import { MercadoPagoConfig, Payment } from "mercadopago";
import crypto from "crypto";
import { env } from "../../src/lib/env";

const client = new MercadoPagoConfig({ accessToken: env.MP_ACCESS_TOKEN });

export default async function handler(request: Request) {
  if (request.method !== "POST") return new Response("Method Not Allowed", { status: 405 });

  try {
    const url = new URL(request.url);
    const xSignature = request.headers.get("x-signature");
    const xRequestId = request.headers.get("x-request-id");

    // Proteção de assinatura (Requisito 1.4)
    if (!xSignature || !xRequestId || !env.MP_WEBHOOK_SECRET) {
      return new Response("Missing signature or secret", { status: 400 });
    }

    const parts = xSignature.split(",");
    let ts, v1;
    for (const part of parts) {
      const [key, value] = part.split("=");
      if (key === "ts") ts = value;
      if (key === "v1") v1 = value;
    }

    if (!ts || !v1) {
      return new Response("Invalid signature format", { status: 400 });
    }

    const dataID = url.searchParams.get("data.id");
    if (!dataID) return new Response("No data.id provided", { status: 400 });

    const manifest = `id:${dataID};request-id:${xRequestId};ts:${ts};`;
    const hmac = crypto.createHmac("sha256", env.MP_WEBHOOK_SECRET);
    hmac.update(manifest);
    const expectedSignature = hmac.digest("hex");

    if (!crypto.timingSafeEqual(Buffer.from(expectedSignature), Buffer.from(v1))) {
      return new Response("Unauthorized", { status: 401 });
    }

    const payload = await request.json().catch(() => ({}));
    const type = url.searchParams.get("type") || payload.type;

    if (type === "payment") {
      const paymentId = Number(dataID);
      const payment = await new Payment(client).get({ id: paymentId });
      console.log(
        `[MP Webhook] Payment ${payment.id} status: ${payment.status} | ref: ${payment.external_reference}`,
      );
    }

    return new Response("OK", { status: 200 });
  } catch (error) {
    console.error("Webhook processing error:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
