import type { ReactNode } from "react";

export function LegalLayout({ title, children }: { title: string; children: ReactNode }) {
  return (
    <article className="container-verso section-space mx-auto max-w-3xl">
      <p className="eyebrow text-primary">INFORMAÇÕES DA LOJA</p>
      <h1 className="mt-4 font-display text-5xl uppercase">{title}</h1>
      <div className="mt-8 space-y-6 text-sm leading-7 text-muted-foreground">{children}</div>
      <p className="mt-10 border-t border-border pt-5 text-xs font-semibold text-primary">
        DOCUMENTO-BASE: requer revisão jurídica e preenchimento dos dados oficiais antes da abertura
        da loja.
      </p>
    </article>
  );
}
