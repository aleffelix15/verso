import { describe, expect, it } from "vitest";
import { checkoutFailure } from "@/lib/checkout-error";

describe("checkout error boundary", () => {
  it("keeps provider details and credentials out of the client response", () => {
    const result = checkoutFailure(
      new Error("Provider failed using secret-token-value"),
      "request-123",
      ["secret-token-value"],
    );

    expect(result.response.error).toBe("Não foi possível iniciar o pagamento. Tente novamente.");
    expect(result.response.error).not.toContain("Provider failed");
    expect(result.logMessage).toContain("Provider failed");
    expect(result.logMessage).not.toContain("secret-token-value");
  });
});
