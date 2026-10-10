import { createServerFn } from "@tanstack/react-start";
import { calculateFreightOptions, freightRequestSchema } from "./freight-calculator";

export const calculateFreight = createServerFn({ method: "POST" })
  .validator(freightRequestSchema)
  .handler(async ({ data }) => ({
    success: true as const,
    options: calculateFreightOptions(data),
  }));
