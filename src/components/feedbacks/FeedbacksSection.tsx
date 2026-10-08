"use client";

import { TestimonialsColumn, type Feedback } from "./TestimonialsColumn";
import { Ribbon } from "@/components/decor/Ribbon";
import { RevealLine, Reveal } from "@/components/decor/Reveal";

// Placeholder testimonials — swap for real customer feedback before launch.
const FEEDBACKS: Feedback[] = [
  { name: "Marina", city: "São Paulo, SP", quote: "Finalmente entendo pra onde meu dinheiro vai. A Flora resume tudo num minuto." },
  { name: "Lucas", city: "Belo Horizonte, MG", quote: "Conectei o banco e pronto — nunca mais precisei abrir uma planilha." },
  { name: "Beatriz", city: "Curitiba, PR", quote: "O jeito que ela organiza os gastos por categoria mudou como eu economizo." },
  { name: "Rafael", city: "Recife, PE", quote: "Pergunto pelo WhatsApp mesmo, sem precisar nem abrir o app. Muito prático." },
  { name: "Camila", city: "Porto Alegre, RS", quote: "Achei que fosse mais um app de finanças, mas é bem mais simples que os outros." },
  { name: "Diego", city: "Florianópolis, SC", quote: "Gosto de saber que os dados ficam só comigo — isso pesou muito na escolha." },
];

const firstColumn = FEEDBACKS.slice(0, 2);
const secondColumn = FEEDBACKS.slice(2, 4);
const thirdColumn = FEEDBACKS.slice(4, 6);

export function FeedbacksSection() {
  return (
    <section className="relative w-full overflow-hidden bg-[#FDF1F5] py-24 md:py-32">
      <Ribbon path="hook" color="#AD0E44" strokeWidth={50} className="-right-10 top-0 h-[320px] w-[320px] opacity-80" rotate={140} />
      <Ribbon path="wave" color="#C1FFBC" strokeWidth={72} className="-left-24 bottom-0 h-[300px] w-[520px] opacity-90" delay={0.2} />

      <div className="relative z-10 mx-auto w-full max-w-6xl px-6">
        <div className="mx-auto max-w-xl text-center">
          <Reveal duration={0.5} className="inline-flex items-center rounded-full bg-cultiv-pink/10 px-4 py-1.5 font-display text-xs font-bold uppercase tracking-wide text-cultiv-pink">
            Comunidade Cultiv
          </Reveal>

          <RevealLine as="h2" delay={0.1} className="mt-4 font-title text-4xl text-cultiv-ink md:text-6xl">
            Não é só a gente que fala bem
          </RevealLine>
          <Reveal delay={0.2} className="mx-auto mt-4 font-subtitle text-lg text-cultiv-muted md:text-xl">
            Gente de verdade, organizando a vida financeira de verdade.
          </Reveal>
        </div>

        <div
          className="relative z-10 mx-auto mt-14 flex max-h-[560px] max-w-4xl justify-center gap-6 overflow-hidden"
          style={{ maskImage: "linear-gradient(to bottom, transparent, black 10%, black 90%, transparent)" }}
        >
          <TestimonialsColumn feedbacks={firstColumn} duration={15} />
          <TestimonialsColumn feedbacks={secondColumn} duration={19} className="hidden sm:block" />
          <TestimonialsColumn feedbacks={thirdColumn} duration={17} className="hidden lg:block" />
        </div>
      </div>
    </section>
  );
}
