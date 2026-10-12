import { z } from "zod";
import { getProductBySlug } from "@/data/products";
import { getEnv } from "@/lib/env";

export const freightServiceRequestSchema = z
  .object({
    cep: z.string().regex(/^\d{8}$/, "CEP deve conter 8 dígitos numéricos"),
    items: z
      .array(
        z
          .object({
            slug: z.string().min(1).max(100),
            quantity: z.number().int().min(1).max(10),
          })
          .strict(),
      )
      .min(1, "Carrinho vazio")
      .max(50, "Limite de itens excedido"),
  })
  .strict();

export type FreightServiceRequest = z.infer<typeof freightServiceRequestSchema>;

export type FreightOption = {
  id: "pac" | "sedex";
  name: string;
  priceCents: number;
  estimatedDays: number;
  provider: "live" | "table_estimate";
  providerName: string;
  isEstimate: boolean;
};

export type FreightQuote = {
  success: boolean;
  cep: string;
  options: FreightOption[];
  calculatedAt: string;
  expiresAt: string;
  isFreeShippingEligible: boolean;
  totalWeightGrams: number;
  subtotalCents: number;
};

const FREE_SHIPPING_THRESHOLD_CENTS = 29900; // R$ 299,00
const QUOTE_VALIDITY_MS = 30 * 60 * 1000; // 30 minutos

export async function calculateFreightWithProvider(
  input: FreightServiceRequest,
): Promise<FreightQuote> {
  const { cep, items } = freightServiceRequestSchema.parse(input);
  const now = new Date();
  const expiresAt = new Date(now.getTime() + QUOTE_VALIDITY_MS).toISOString();

  let subtotalCents = 0;
  let totalWeightGrams = 0;

  for (const item of items) {
    const product = getProductBySlug(item.slug);
    if (!product) {
      throw new Error(`Produto não encontrado no catálogo: ${item.slug}`);
    }
    subtotalCents += product.priceCents * item.quantity;
    totalWeightGrams += 400 * item.quantity; // 400g por peça de streetwear
  }

  const isFreeShipping = subtotalCents >= FREE_SHIPPING_THRESHOLD_CENTS;
  const env = getEnv();

  // Tentativa de cotação via provedor real se FREIGHT_API_TOKEN estiver configurado
  if (env.FREIGHT_API_TOKEN) {
    try {
      const liveOptions = await fetchLiveCarrierQuote(cep, totalWeightGrams, env.FREIGHT_API_TOKEN);
      if (liveOptions && liveOptions.length > 0) {
        if (isFreeShipping) {
          const pacOpt = liveOptions.find((o) => o.id === "pac");
          if (pacOpt) {
            pacOpt.priceCents = 0;
            pacOpt.name = "Frete Grátis (Econômico)";
          }
        }
        return {
          success: true,
          cep,
          options: liveOptions,
          calculatedAt: now.toISOString(),
          expiresAt,
          isFreeShippingEligible: isFreeShipping,
          totalWeightGrams,
          subtotalCents,
        };
      }
    } catch (carrierError) {
      console.warn(
        "[FreightService] Provedor de frete em tempo real indisponível; recorrendo a estimativa por tabela:",
        carrierError,
      );
    }
  }

  // Fallback transparente: Estimativa por Tabela Regional
  const tableOptions = calculateTableEstimate(cep, totalWeightGrams, isFreeShipping);

  return {
    success: true,
    cep,
    options: tableOptions,
    calculatedAt: now.toISOString(),
    expiresAt,
    isFreeShippingEligible: isFreeShipping,
    totalWeightGrams,
    subtotalCents,
  };
}

function calculateTableEstimate(
  cep: string,
  totalWeightGrams: number,
  isFreeShipping: boolean,
): FreightOption[] {
  if (isFreeShipping) {
    return [
      {
        id: "pac",
        name: "Frete Grátis (Econômico)",
        priceCents: 0,
        estimatedDays: 7,
        provider: "table_estimate",
        providerName: "Estimativa por Tabela Regional",
        isEstimate: true,
      },
      {
        id: "sedex",
        name: "Sedex (Expresso)",
        priceCents: 2990,
        estimatedDays: 3,
        provider: "table_estimate",
        providerName: "Estimativa por Tabela Regional",
        isEstimate: true,
      },
    ];
  }

  const regionCode = Number(cep[0]);
  let pacCents = 1990;
  let sedexCents = 3590;
  let pacDays = 5;
  let sedexDays = 2;

  if (regionCode >= 4 && regionCode <= 5) {
    // Nordeste
    pacCents = 2990;
    sedexCents = 5590;
    pacDays = 9;
    sedexDays = 4;
  } else if (regionCode >= 6 && regionCode <= 7) {
    // Norte / Centro-Oeste
    pacCents = 3490;
    sedexCents = 6590;
    pacDays = 12;
    sedexDays = 5;
  } else if (regionCode >= 8) {
    // Sul
    pacCents = 2490;
    sedexCents = 4290;
    pacDays = 6;
    sedexDays = 3;
  }

  // Adicional de peso para pacotes acima de 1kg (R$ 2,00 por kg adicional)
  const weightChargeCents = totalWeightGrams > 1000 ? Math.floor(totalWeightGrams / 1000) * 200 : 0;

  return [
    {
      id: "pac",
      name: "PAC (Econômico)",
      priceCents: pacCents + weightChargeCents,
      estimatedDays: pacDays,
      provider: "table_estimate",
      providerName: "Estimativa por Tabela Regional",
      isEstimate: true,
    },
    {
      id: "sedex",
      name: "Sedex (Expresso)",
      priceCents: sedexCents + weightChargeCents,
      estimatedDays: sedexDays,
      provider: "table_estimate",
      providerName: "Estimativa por Tabela Regional",
      isEstimate: true,
    },
  ];
}

async function fetchLiveCarrierQuote(
  cep: string,
  totalWeightGrams: number,
  apiToken: string,
): Promise<FreightOption[] | null> {
  // Chamada com timeout rigoroso de 4s
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 4000);

  try {
    const res = await fetch("https://api.melhorenvio.com/v2/me/shipment/calculate", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiToken}`,
      },
      body: JSON.stringify({
        from: { postal_code: "01001000" }, // Origem SP
        to: { postal_code: cep },
        products: [
          {
            id: "verso-pkg",
            width: 25,
            height: 10,
            length: 30,
            weight: totalWeightGrams / 1000,
            insurance_value: 150,
            quantity: 1,
          },
        ],
      }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!res.ok) return null;

    const data = (await res.json()) as Array<{
      id: number;
      name: string;
      price: string;
      delivery_time: number;
      error?: string;
    }>;

    const pacService = data.find((s) => s.name.toLowerCase().includes("pac") && !s.error);
    const sedexService = data.find((s) => s.name.toLowerCase().includes("sedex") && !s.error);

    if (!pacService && !sedexService) return null;

    const options: FreightOption[] = [];
    if (pacService) {
      options.push({
        id: "pac",
        name: `PAC (${pacService.name})`,
        priceCents: Math.round(parseFloat(pacService.price) * 100),
        estimatedDays: pacService.delivery_time,
        provider: "live",
        providerName: "Melhor Envio (API ao vivo)",
        isEstimate: false,
      });
    }
    if (sedexService) {
      options.push({
        id: "sedex",
        name: `Sedex (${sedexService.name})`,
        priceCents: Math.round(parseFloat(sedexService.price) * 100),
        estimatedDays: sedexService.delivery_time,
        provider: "live",
        providerName: "Melhor Envio (API ao vivo)",
        isEstimate: false,
      });
    }

    return options.length > 0 ? options : null;
  } catch {
    clearTimeout(timeoutId);
    return null;
  }
}
