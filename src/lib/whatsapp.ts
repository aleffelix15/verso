import { storeConfig } from "@/data/products";

export type WhatsAppOrderItem = {
  name: string;
  size: string;
  color: string;
  quantity: number;
  priceCents: number;
};

export type WhatsAppOrderParams = {
  items: WhatsAppOrderItem[];
  subtotalCents: number;
  shippingOption?: { name: string; priceCents: number } | null;
  phoneNumber?: string;
};

export function formatMoneyPtBr(cents: number): string {
  return (cents / 100).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export function formatWhatsAppOrderMessage({
  items,
  subtotalCents,
  shippingOption,
}: WhatsAppOrderParams): string {
  const lines: string[] = ["Olá, VERSO! Gostaria de fazer o pedido:", ""];

  if (items.length === 0) {
    lines.push("(Nenhum item selecionado)");
  } else {
    for (const item of items) {
      lines.push(
        `• ${item.name} (${item.color} / ${item.size}) x${item.quantity} — ${formatMoneyPtBr(
          item.priceCents * item.quantity,
        )}`,
      );
    }
  }

  lines.push("");
  lines.push(`Subtotal: ${formatMoneyPtBr(subtotalCents)}`);

  if (shippingOption) {
    const shippingPrice =
      shippingOption.priceCents === 0 ? "Grátis" : formatMoneyPtBr(shippingOption.priceCents);
    lines.push(`Frete (${shippingOption.name}): ${shippingPrice}`);
    lines.push(`Total estimado: ${formatMoneyPtBr(subtotalCents + shippingOption.priceCents)}`);
  } else {
    lines.push(`Total estimado: ${formatMoneyPtBr(subtotalCents)}`);
  }

  lines.push("");
  lines.push("Poderiam confirmar a disponibilidade e prazo de entrega?");

  return lines.join("\n");
}

export function buildWhatsAppOrderUrl(params: WhatsAppOrderParams): string {
  const phone = params.phoneNumber || storeConfig.whatsapp;
  const cleanPhone = phone.replace(/\D/g, "");
  const message = formatWhatsAppOrderMessage(params);
  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
}

export function buildWhatsAppProductInquiryUrl(
  product: { name: string; slug: string; priceCents: number },
  size?: string,
  color?: string,
): string {
  const phone = storeConfig.whatsapp;
  const cleanPhone = phone.replace(/\D/g, "");
  const details = [size ? `tamanho: ${size}` : null, color ? `cor: ${color}` : null]
    .filter(Boolean)
    .join(", ");
  const detailStr = details ? ` (${details})` : "";
  const message = `Olá, VERSO! Gostaria de tirar uma dúvida sobre a peça ${product.name}${detailStr} (${formatMoneyPtBr(product.priceCents)}):\nhttps://verso.com.br/produto/${product.slug}`;
  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
}
