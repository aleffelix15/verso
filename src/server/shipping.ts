import { createServerFn } from "@tanstack/react-start";
import { calculateFreightWithProvider, freightServiceRequestSchema } from "./freight-service";

export const calculateFreight = createServerFn({ method: "POST" })
  .validator(freightServiceRequestSchema)
  .handler(async ({ data }) => {
    const result = await calculateFreightWithProvider(data);
    return {
      success: true as const,
      options: result.options,
      expiresAt: result.expiresAt,
      isFreeShippingEligible: result.isFreeShippingEligible,
    };
  });
