import { createFileRoute } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import { ArrowLeft, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/pagamento/pendente")({
  component: PendingPage,
});

function PendingPage() {
  return (
    <section className="container-verso section-space flex flex-col items-center text-center">
      <Clock size={80} className="text-yellow-500 mb-6" />
      <h1 className="text-4xl font-display mb-4">PAGAMENTO PENDENTE.</h1>
      <p className="text-muted-foreground mb-8 max-w-md">
        Seu pedido foi registrado, mas o pagamento ainda está sendo processado (Pix ou Boleto).
        Assim que o banco confirmar, enviaremos um e-mail para você.
      </p>
      <Button asChild variant="ink">
        <Link href="/">Voltar para o início</Link>
      </Button>
    </section>
  );
}
