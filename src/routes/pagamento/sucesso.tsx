import { createFileRoute } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import { ArrowLeft, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/pagamento/sucesso")({
  staticData: { sitemap: true },
  component: SuccessPage,
});

function SuccessPage() {
  return (
    <section className="container-verso section-space flex flex-col items-center text-center">
      <CheckCircle2 size={80} className="text-primary mb-6" />
      <h1 className="text-4xl font-display mb-4">PAGAMENTO APROVADO.</h1>
      <p className="text-muted-foreground mb-8 max-w-md">
        Seu pedido foi confirmado e o pagamento recebido com sucesso. Enviaremos as atualizações de
        envio para o seu e-mail de contato.
      </p>
      <Button asChild variant="brand">
        <Link to="/">Voltar para o início</Link>
      </Button>
    </section>
  );
}
