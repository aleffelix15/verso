import { createFileRoute } from "@tanstack/react-router";
import { LegalLayout } from "@/components/store/legal-layout";
import { pageHead } from "@/data/products";

export const Route = createFileRoute("/trocas")({
  staticData: { sitemap: true },
  head: () => pageHead("Trocas e devoluções", "Informações sobre devolução e troca.", "/trocas"),
  component: ExchangesPage,
});

function ExchangesPage() {
  return (
    <LegalLayout title="Trocas e devoluções">
      <p>
        Esta política-base não substitui os direitos previstos na legislação e ainda precisa ser
        completada com o canal oficial, o endereço de devolução e o procedimento operacional da
        VERSO antes da abertura da loja.
      </p>
      <section>
        <h2 className="font-semibold text-foreground">Direito de arrependimento</h2>
        <p>
          Nas compras feitas fora do estabelecimento comercial, o Código de Defesa do Consumidor
          prevê o direito de arrependimento no prazo de 7 dias, contado da assinatura ou do
          recebimento do produto, conforme aplicável. O exercício desse direito deve permitir a
          devolução dos valores pagos nos termos da legislação.
        </p>
      </section>
      <section>
        <h2 className="font-semibold text-foreground">Troca por tamanho, cor ou preferência</h2>
        <p>
          As condições adicionais de troca, disponibilidade de tamanhos, custos de envio e prazo
          para solicitar devem ser definidos pela loja e informados claramente antes da compra. Não
          há um procedimento operacional ativo nesta demonstração.
        </p>
      </section>
      <p>
        Consulte o art. 49 do CDC e solicite revisão jurídica profissional antes da publicação
        comercial.
      </p>
    </LegalLayout>
  );
}
