import { z } from "zod";

const checkoutItemSchema = z
  .object({
    slug: z.string().min(1).max(100),
    size: z.string().min(1).max(20),
    color: z.string().min(1).max(50),
    quantity: z.number().int().min(1).max(10),
  })
  .strict();

const payerSchema = z
  .object({
    name: z.string().trim().min(2).max(120),
    surname: z.string().trim().max(80).optional().default(""),
    email: z.string().trim().email().max(254),
    phone: z
      .object({
        area_code: z.string().regex(/^\d{2}$/),
        number: z.string().regex(/^\d{8,9}$/),
      })
      .strict(),
    address: z
      .object({
        zip_code: z.string().regex(/^\d{8}$/),
        street_name: z.string().trim().min(2).max(120),
        street_number: z.string().trim().min(1).max(20),
      })
      .strict(),
  })
  .strict();

export const checkoutRequestSchema = z
  .object({
    items: z.array(checkoutItemSchema).min(1).max(50),
    payer: payerSchema,
    shipping_cep: z.string().regex(/^\d{8}$/),
    shipping_method: z.enum(["pac", "sedex"]),
  })
  .strict()
  .refine((data) => data.shipping_cep === data.payer.address.zip_code, {
    message: "O CEP do frete deve corresponder ao endereço de entrega",
    path: ["shipping_cep"],
  });

export type CheckoutRequest = z.infer<typeof checkoutRequestSchema>;
