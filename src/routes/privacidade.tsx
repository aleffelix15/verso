import { createFileRoute } from "@tanstack/react-router";
import { LegalLayout } from "@/components/store/legal-layout";
import { pageHead } from "@/data/products";

export const Route = createFileRoute("/privacidade")({
  staticData: { sitemap: true },
  head: () => pageHead("Privacidade", "Como a VERSO trata dados pessoais.", "/privacidade"),
  component: PrivacyPage,
});

function PrivacyPage() {
  return (
    <LegalLayout title="Privacidade">
      <p>
        Esta página é um documento-base para a VERSO Streetwear. O responsável pela loja deve
        confirmar a identidade e os contatos oficiais, as bases legais, os prazos de retenção e os
        fornecedores envolvidos antes de ativar vendas ou coleta de dados.
      </p>
      <section>
        <h2 className="font-semibold text-foreground">Dados e finalidades</h2>
        <p>
          Quando o checkout estiver ativo, dados como nome, e-mail, telefone, endereço e itens do
          pedido serão usados para processar a compra, entrega, atendimento e obrigações legais. O
          pagamento será processado pelo Mercado Pago; a VERSO não deve solicitar nem armazenar
          dados completos de cartão. O CEP pode ser consultado no ViaCEP para auxiliar o
          preenchimento do endereço.
        </p>
      </section>
      <section>
        <h2 className="font-semibold text-foreground">Armazenamento e compartilhamento</h2>
        <p>
          A versão atual é demonstrativa. Antes de usar o Supabase para armazenar pedidos ou ativar
          uma newsletter, esta página deve ser atualizada com as operações realmente ativas, os
          dados armazenados, os prazos de retenção e os operadores contratados. Não envie dados
          pessoais para fins incompatíveis com a finalidade informada.
        </p>
      </section>
      <section>
        <h2 className="font-semibold text-foreground">Direitos e contato</h2>
        <p>
          A pessoa titular pode solicitar confirmação e acesso, correção, informação sobre uso e
          compartilhamento, revogação de consentimento e demais direitos previstos na LGPD. Defina e
          publique um canal oficial de privacidade antes do lançamento; ele não deve ser substituído
          por um endereço de demonstração.
        </p>
      </section>
      <p>
        A VERSO deve observar os princípios e direitos previstos na Lei nº 13.709/2018 (LGPD).
        Consulte o texto oficial e obtenha revisão profissional antes da publicação.
      </p>
    </LegalLayout>
  );
}
