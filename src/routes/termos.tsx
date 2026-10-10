import { createFileRoute } from "@tanstack/react-router";
import { LegalLayout } from "@/components/store/legal-layout";
import { pageHead } from "@/data/products";

export const Route = createFileRoute("/termos")({
  staticData: { sitemap: true },
  head: () => pageHead("Termos de uso", "Condições de navegação e compra na VERSO.", "/termos"),
  component: TermsPage,
});

function TermsPage() {
  return (
    <LegalLayout title="Termos de uso">
      <p>
        Este é um modelo inicial, não uma oferta de venda. O catálogo, preços, imagens, frete,
        prazos e contatos exibidos podem ser demonstrativos enquanto a loja não informar
        expressamente que o checkout está ativo.
      </p>
      <section>
        <h2 className="font-semibold text-foreground">Pedidos e pagamentos</h2>
        <p>
          Quando as vendas forem ativadas, a confirmação do pedido dependerá da aprovação do
          pagamento e da confirmação de disponibilidade. O pagamento será processado no ambiente do
          Mercado Pago. Antes do lançamento, a VERSO deve preencher as condições comerciais, prazos
          de entrega, identificação do fornecedor e canais de atendimento exigidos para a operação.
        </p>
      </section>
      <section>
        <h2 className="font-semibold text-foreground">Conteúdo e atendimento</h2>
        <p>
          Não use conteúdo demonstrativo como informação definitiva sobre produto, disponibilidade
          ou condições de compra. Os canais oficiais e os dados do responsável pela loja devem ser
          confirmados e publicados antes da abertura.
        </p>
      </section>
      <p>
        Estes termos precisam ser adaptados à operação real e revisados por profissional jurídico
        antes de qualquer venda.
      </p>
    </LegalLayout>
  );
}
