import { z } from "zod";
import { getProductBySlug } from "@/data/products";

export const freightRequestSchema = z
  .object({
    cep: z.string().regex(/^\d{8}$/, "CEP deve conter 8 dígitos"),
    items: z
      .array(
        z
          .object({
            slug: z.string().min(1).max(100),
            quantity: z.number().int().min(1).max(10),
          })
          .strict(),
      )
      .min(1)
      .max(50),
  })
  .strict();

export type FreightRequest = z.infer<typeof freightRequestSchema>;

export type FreightOption = {
  id: "pac" | "sedex";
  name: string;
  priceCents: number;
  estimatedDays: number;
};

export function calculateFreightOptions(request: FreightRequest): FreightOption[] {
  const { cep, items } = freightRequestSchema.parse(request);
  let subtotalCents = 0;
  let totalWeightGrams = 0;

  for (const item of items) {
    const product = getProductBySlug(item.slug);
    if (!product) throw new Error("Invalid cart item");
    subtotalCents += product.priceCents * item.quantity;
    totalWeightGrams += 400 * item.quantity;
  }

  if (subtotalCents >= 29900) {
    return [
      { id: "pac", name: "Frete Grátis (Econômico)", priceCents: 0, estimatedDays: 7 },
      { id: "sedex", name: "Sedex (Expresso)", priceCents: 2990, estimatedDays: 3 },
    ];
  }

  const regionCode = Number(cep[0]);
  let pacCents = 1990;
  let sedexCents = 3590;
  let pacDays = 5;
  let sedexDays = 2;

  if (regionCode >= 4 && regionCode <= 5) {
    pacCents = 2990;
    sedexCents = 5590;
    pacDays = 9;
    sedexDays = 4;
  } else if (regionCode >= 6 && regionCode <= 7) {
    pacCents = 3490;
    sedexCents = 6590;
    pacDays = 12;
    sedexDays = 5;
  } else if (regionCode >= 8) {
    pacCents = 2490;
    sedexCents = 4290;
    pacDays = 6;
    sedexDays = 3;
  }

  const weightChargeCents = totalWeightGrams > 1000 ? Math.floor(totalWeightGrams / 1000) * 200 : 0;

  return [
    {
      id: "pac",
      name: "PAC (Econômico)",
      priceCents: pacCents + weightChargeCents,
      estimatedDays: pacDays,
    },
    {
      id: "sedex",
      name: "Sedex (Expresso)",
      priceCents: sedexCents + weightChargeCents,
      estimatedDays: sedexDays,
    },
  ];
}
