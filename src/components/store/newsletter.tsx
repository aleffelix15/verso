import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { z } from "zod";
import { Reveal } from "@/components/store/reveal";

export function Newsletter() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  return (
    <section className="w-full bg-surface border-y border-border py-14 sm:py-20 my-10 sm:my-16">
      <div className="container-verso">
        <Reveal>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            {/* Left Column: Eyebrow, Title, Copy */}
            <div>
              <div className="eyebrow-red mb-2">NEWSLETTER</div>
              <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-extrabold uppercase text-foreground tracking-tight">
                ENTRE PARA A LISTA
              </h2>
              <p className="mt-2 text-xs sm:text-sm text-muted-foreground max-w-md leading-relaxed">
                Receba novidades, lançamentos e conteúdos exclusivos da Verso.
              </p>
            </div>

            {/* Right Column: Email input and rectangular red button */}
            <div>
              <form
                className="flex flex-col sm:flex-row items-stretch gap-2 sm:gap-0"
                onSubmit={(e) => {
                  e.preventDefault();
                  const parsed = z.string().trim().email().max(254).safeParse(email);
                  setMessage(
                    parsed.success
                      ? "A lista abre em breve. Nesta demonstração, seu e-mail não foi cadastrado."
                      : "Confere seu e-mail e tenta de novo.",
                  );
                }}
              >
                <input
                  type="email"
                  required
                  maxLength={254}
                  aria-label="Seu e-mail para a newsletter"
                  placeholder="Seu e-mail"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full sm:flex-1 bg-background border border-border sm:border-r-0 text-foreground placeholder:text-muted-foreground px-4 py-3.5 text-xs sm:text-sm rounded-none focus:outline-none focus:border-brand"
                />
                <button
                  type="submit"
                  className="bg-brand hover:bg-brand-hover text-on-brand px-7 py-3.5 font-mono text-xs uppercase tracking-widest font-semibold inline-flex items-center justify-center gap-2 rounded-none transition-colors shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-brand"
                >
                  INSCREVER <ArrowRight size={14} />
                </button>
              </form>
              <p className="mt-2 text-[10px] text-muted-foreground/75 font-mono uppercase tracking-wider">
                Sem spam. Saia quando quiser. Demonstração de loja conceito.
              </p>
              {message && (
                <p role="status" className="mt-3 text-xs leading-5 text-muted-foreground">
                  {message}
                </p>
              )}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
