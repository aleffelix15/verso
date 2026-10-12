import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { CheckCircle2, Clock, PackageCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getOrderStatus } from "@/server/checkout";
import { money } from "@/data/products";
import { z } from "zod";

const successSearchSchema = z.object({
  ref: z.string().optional(),
  external_reference: z.string().optional(),
  payment_id: z.string().optional(),
  status: z.string().optional(),
});

export const Route = createFileRoute("/pagamento/sucesso")({
  staticData: { sitemap: false },
  validateSearch: (search) => successSearchSchema.parse(search),
  component: SuccessPage,
});

type OrderData = {
  id: string;
  external_reference: string;
  status: string;
  createdAt: string;
  financial: { totalCents: number; subtotalCents: number; shippingCents: number };
  items: Array<{
    name: string;
    quantity: number;
    size: string;
    color: string;
    unitPriceCents: number;
  }>;
  shipping: { name: string; estimatedDays: number };
};

function SuccessPage() {
  const search = Route.useSearch();
  const ref = search.ref || search.external_reference;
  const [order, setOrder] = useState<OrderData | null>(null);
  const [loading, setLoading] = useState(Boolean(ref));

  useEffect(() => {
    if (!ref) return;
    let active = true;
    void getOrderStatus({ data: { externalReference: ref } })
      .then((res) => {
        if (!active) return;
        if (res.success && res.order) {
          setOrder(res.order as OrderData);
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [ref]);

  const isFullyApproved = order?.status === "approved";

  return (
    <section className="container-verso section-space flex flex-col items-center text-center max-w-2xl mx-auto">
      {isFullyApproved ? (
        <CheckCircle2 size={72} className="text-brand mb-6" />
      ) : (
        <Clock size={72} className="text-brand mb-6 animate-pulse" />
      )}

      <h1 className="text-4xl sm:text-5xl font-display font-bold uppercase tracking-wider mb-3">
        {isFullyApproved ? "PAGAMENTO CONFIRMADO." : "PEDIDO REGISTRADO."}
      </h1>

      <p className="text-muted-foreground text-sm leading-relaxed mb-6 max-w-lg">
        {isFullyApproved
          ? "Seu pagamento foi confirmado pelo gateway financeiro. Seu pedido já entrou em preparação e enviaremos o código de rastreamento no seu e-mail."
          : "Recebemos o seu pedido. A confirmação final é processada e reconciliada automaticamente pelo webhook do Mercado Pago. Você receberá todas as atualizações no seu e-mail."}
      </p>

      {/* Detalhes do Pedido Real Persistido */}
      {order && (
        <div className="w-full bg-[#F5F2EB] dark:bg-[#262626] border border-black/10 dark:border-white/10 p-6 text-left mb-8 space-y-4">
          <div className="flex flex-wrap justify-between items-center border-b border-black/10 dark:border-white/10 pb-3 gap-2">
            <div>
              <span className="font-mono text-[10px] text-muted-foreground uppercase tracking-widest block">
                NÚMERO DO PEDIDO
              </span>
              <span className="font-mono text-sm font-bold text-brand">{order.id}</span>
            </div>
            <div className="text-right">
              <span className="font-mono text-[10px] text-muted-foreground uppercase tracking-widest block">
                STATUS
              </span>
              <span className="font-mono text-xs font-semibold uppercase px-2 py-0.5 bg-black/5 dark:bg-white/10">
                {order.status === "approved" ? "Aprovado" : "Aguardando Confirmação"}
              </span>
            </div>
          </div>

          <div className="space-y-2 pt-2">
            <span className="font-mono text-[10px] text-muted-foreground uppercase tracking-widest block">
              ITENS COMPRADOS
            </span>
            {order.items.map((item, idx) => (
              <div key={idx} className="flex justify-between text-xs py-1">
                <span>
                  {item.quantity}x {item.name} ({item.size} / {item.color})
                </span>
                <span className="font-mono font-medium">
                  {money(item.unitPriceCents * item.quantity)}
                </span>
              </div>
            ))}
          </div>

          <div className="border-t border-black/10 dark:border-white/10 pt-3 flex justify-between text-sm font-semibold">
            <span>Total com frete ({order.shipping.name})</span>
            <span className="font-mono text-brand">{money(order.financial.totalCents)}</span>
          </div>
        </div>
      )}

      {loading && (
        <div className="py-6 text-xs font-mono text-muted-foreground">
          Sincronizando status seguro do pedido...
        </div>
      )}

      <div className="flex flex-wrap gap-4 justify-center">
        <Button asChild variant="brand" size="lg">
          <Link to="/">Voltar para o início</Link>
        </Button>
        <Button asChild variant="outline" size="lg">
          <Link to="/loja">Ver mais peças</Link>
        </Button>
      </div>
    </section>
  );
}
