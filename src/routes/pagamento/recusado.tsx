import { createFileRoute } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import { ArrowLeft, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/pagamento/recusado")({ staticData: { sitemap: true }, 
  component: FailurePage,
});

function FailurePage() {
  return (
    <section className="container-verso section-space flex flex-col items-center text-center">
      <XCircle size={80} className="text-red-500 mb-6" />
      <h1 className="text-4xl font-display mb-4">PAGAMENTO RECUSADO.</h1>
      <p className="text-muted-foreground mb-8 max-w-md">
        Infelizmente o seu pagamento não foi aprovado pela operadora. Você pode tentar novamente
        utilizando outra forma de pagamento.
      </p>
      <div className="flex gap-4">
        <Button asChild variant="brand">
          <Link href="/loja">Tentar Novamente</Link>
        </Button>
      </div>
    </section>
  );
}
