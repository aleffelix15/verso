import { describe, expect, it } from "vitest";
import crypto from "crypto";
import {
  verifyWebhookSignature,
  mapMercadoPagoStatus,
  isEventAlreadyProcessed,
  markEventAsProcessed,
  _clearProcessedEventsForTesting,
} from "@/routes/api/webhook/mercadopago";

describe("Mercado Pago Webhook Security and Verification", () => {
  const secret = "test_webhook_secret_key_12345";
  const dataId = "987654321";
  const requestId = "req-uuid-abc-123";
  const ts = "1728000000";

  it("successfully validates an authentic official HMAC-SHA256 signature", () => {
    const manifest = `id:${dataId};request-id:${requestId};ts:${ts};`;
    const hmac = crypto.createHmac("sha256", secret);
    hmac.update(manifest);
    const validV1 = hmac.digest("hex");

    const result = verifyWebhookSignature({
      xSignature: `ts=${ts},v1=${validV1}`,
      xRequestId: requestId,
      dataId,
      secret,
    });

    expect(result.valid).toBe(true);
  });

  it("rejects forged, tampered, or mismatched signatures", () => {
    const fakeV1 = "0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef";

    const result = verifyWebhookSignature({
      xSignature: `ts=${ts},v1=${fakeV1}`,
      xRequestId: requestId,
      dataId,
      secret,
    });

    expect(result.valid).toBe(false);
    expect(result.reason).toBe("Assinatura não confere");
  });

  it("rejects requests missing critical authentication headers", () => {
    expect(
      verifyWebhookSignature({
        xSignature: null,
        xRequestId: requestId,
        dataId,
        secret,
      }).valid,
    ).toBe(false);

    expect(
      verifyWebhookSignature({
        xSignature: "ts=123,v1=abc",
        xRequestId: null,
        dataId,
        secret,
      }).valid,
    ).toBe(false);

    expect(
      verifyWebhookSignature({
        xSignature: "malformed-without-ts-and-v1",
        xRequestId: requestId,
        dataId,
        secret,
      }).valid,
    ).toBe(false);
  });

  it("maps Mercado Pago payment statuses to explicit internal OrderStatus values", () => {
    expect(mapMercadoPagoStatus("approved")).toBe("approved");
    expect(mapMercadoPagoStatus("pending")).toBe("pending_payment");
    expect(mapMercadoPagoStatus("in_process")).toBe("pending_payment");
    expect(mapMercadoPagoStatus("rejected")).toBe("rejected");
    expect(mapMercadoPagoStatus("cancelled")).toBe("cancelled");
    expect(mapMercadoPagoStatus("refunded")).toBe("refunded");
    expect(mapMercadoPagoStatus("charged_back")).toBe("refunded");
  });

  it("handles event deduplication and prevents re-processing", () => {
    _clearProcessedEventsForTesting();
    const eventKey = "pay_99999:approved";

    expect(isEventAlreadyProcessed(eventKey)).toBe(false);

    markEventAsProcessed(eventKey);

    expect(isEventAlreadyProcessed(eventKey)).toBe(true);
  });
});
