import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import { community, pageHead } from "@/data/products";
import { Button } from "@/components/ui/button";
import { Newsletter } from "@/components/store/newsletter";
export const Route = createFileRoute("/sobre")({
  staticData: { sitemap: true },
  head: () =>
    pageHead(
      "Nossa história",
      "Jovem, cristão e sem fantasia. Conheça a ideia por trás da VERSO: streetwear autêntico e propósito nos detalhes.",
      "/sobre",
    ),
  component: About,
});
function About() {
  return (
    <div className="bg-[#EDEAE4] dark:bg-[#1E1E1E] text-[#0E0E0E] dark:text-[#EDEAE4] min-h-[75vh] transition-colors duration-200">
      <div className="container-verso page-heading border-b border-black/10 dark:border-white/10 pb-8">
        <p className="font-mono text-xs uppercase tracking-widest text-[#0E0E0E]/60 dark:text-[#A0A0A0] mb-2 font-medium">
          VERSO / NOSSA ESSÊNCIA
        </p>
        <h1 className="font-display text-5xl sm:text-7xl font-bold uppercase tracking-tight text-[#0E0E0E] dark:text-[#F5F5F5]">
          FÉ NÃO É FIGURINO.
        </h1>
      </div>
      <section className="container-verso editorial-page pt-10">
        <img
          src={community}
          alt="Jovens diversos com streetwear VERSO"
          width={1600}
          height={1008}
          className="border border-black/10 dark:border-white/10"
        />
        <div className="editorial-copy">
          <p className="font-mono text-xs uppercase tracking-widest text-brand font-semibold mb-3">
            ROUPA DE VERDADE. MENSAGEM TAMBÉM.
          </p>
          <h2 className="font-display text-4xl sm:text-5xl font-bold uppercase text-[#0E0E0E] dark:text-[#F5F5F5] leading-tight mb-6">
            A GENTE VESTE
            <br />O QUE ACREDITA.
          </h2>
          <p className="text-sm sm:text-base text-[#0E0E0E]/80 dark:text-[#A0A0A0] leading-relaxed mb-4">
            A VERSO parte de uma vontade simples: criar a roupa que a gente queria usar. Porque ser
            jovem, ter fé e gostar de streetwear nunca deveriam ser coisas que se excluem.
          </p>
          <p className="text-sm sm:text-base text-[#0E0E0E]/80 dark:text-[#A0A0A0] leading-relaxed mb-4">
            Não queremos transformar roupa em fantasia. Nem fazer você explicar quem é toda vez que
            sai de casa. Queremos peças que caibam na sua vida — na rua, no encontro, no caminho.
          </p>
          <p className="text-sm sm:text-base text-[#0E0E0E]/80 dark:text-[#A0A0A0] leading-relaxed mb-4">
            A fé está na referência pequena. Na etiqueta. Numa frase que você percebe de perto. O
            propósito não precisa gritar para existir.
          </p>
          <p className="text-sm sm:text-base text-[#0E0E0E]/80 dark:text-[#A0A0A0] leading-relaxed mb-8 font-medium">
            Verso é uma parte de uma história maior. Este é o nosso primeiro.
          </p>
          <Button asChild variant="brand" size="lg">
            <Link to="/loja" className="inline-flex items-center gap-2">
              Encontre seu verso <ArrowUpRight />
            </Link>
          </Button>
          <p className="mt-6 text-[10px] text-[#0E0E0E]/50 font-mono uppercase tracking-wider">
            Manifesto oficial da marca VERSO · Drop 01.
          </p>
        </div>
      </section>
      <Newsletter />
    </div>
  );
}
