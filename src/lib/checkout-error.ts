const PUBLIC_CHECKOUT_ERROR = "Não foi possível iniciar o pagamento. Tente novamente.";

export function checkoutFailure(error: unknown, correlationId: string, secrets: string[] = []) {
  const detail = error instanceof Error ? error.message : "Unknown checkout error";
  const redactedDetail = secrets.reduce(
    (redacted, secret) => (secret ? redacted.replaceAll(secret, "[redacted]") : redacted),
    detail,
  );

  return {
    logMessage: `[checkout:${correlationId}] ${redactedDetail}`,
    response: {
      success: false as const,
      error: PUBLIC_CHECKOUT_ERROR,
      correlationId,
    },
  };
}
