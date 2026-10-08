"use client";

import { motion } from "framer-motion";
import { Ribbon } from "@/components/decor/Ribbon";
import { RevealLine, Reveal } from "@/components/decor/Reveal";
import { EASE_OUT, staggerDelay } from "@/lib/motion";

const FEATURES = [
  "Conexão ilimitada de bancos e cartões",
  "Flora, sua IA financeira, no app e no WhatsApp",
  "Categorização automática de gastos",
  "Relatórios mensais e ritmo de gastos",
  "Seus dados nunca são vendidos ou compartilhados",
];

export function PlanoSection() {
  return (
    <section id="plano" className="relative w-full overflow-hidden bg-[#F0FBEA] py-24 md:py-32">
      <Ribbon path="s" color="#AD0E44" strokeWidth={50} className="-left-16 top-10 h-[220px] w-[520px] opacity-80" rotate={-6} />
      <Ribbon path="hook" color="#00C853" strokeWidth={50} className="-right-20 -bottom-10 h-[360px] w-[360px] opacity-60" delay={0.2} rotate={30} />

      <div className="relative z-10 mx-auto w-full max-w-5xl px-6 text-center">
        <Reveal duration={0.5} className="inline-flex items-center rounded-full bg-cultiv-pink/10 px-4 py-1.5 font-display text-xs font-bold uppercase tracking-wide text-cultiv-pink">
          Sem letra miúda
        </Reveal>

        <RevealLine as="h2" delay={0.1} className="mt-4 font-title text-4xl text-cultiv-ink md:text-6xl">
          Um preço. Tudo incluso. Cancele quando quiser.
        </RevealLine>
        <Reveal delay={0.2} className="mx-auto mt-4 max-w-lg font-subtitle text-lg text-cultiv-muted md:text-xl">
          Menos que um streaming, pra organizar o resto de todos os outros gastos.
        </Reveal>

        <div className="relative mt-16 flex flex-col items-center justify-center gap-4 md:flex-row md:items-end md:justify-center md:gap-0">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.65, ease: EASE_OUT }}
              className="order-2 hidden w-[340px] shrink-0 md:-mr-10 md:order-1 md:block"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/images/mulhermostrandoocelular.svg" alt="" className="w-full" />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 40, rotate: -3, scale: 0.94 }}
              whileInView={{ opacity: 1, y: 0, rotate: 0, scale: 1 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.7, delay: 0.1, ease: EASE_OUT }}
              className="relative order-1 mx-auto w-full max-w-lg shrink-0 overflow-hidden rounded-[33px] bg-cultiv-forest-dark px-8 py-10 text-left text-white shadow-2xl md:order-2"
            >
              <p className="font-display text-sm font-medium uppercase tracking-wide text-cultiv-mint">Cultiv Premium</p>
              <div className="mt-3 flex items-end gap-2">
                <p className="font-display text-5xl font-bold">R$ 19,90</p>
                <p className="pb-2 text-white/70">/mês</p>
              </div>
              <p className="mt-1 font-subtitle text-sm text-white/70">7 dias grátis, cancele quando quiser.</p>

              <ul className="mt-8 flex flex-col gap-3">
                {FEATURES.map((f, i) => (
                  <motion.li
                    key={f}
                    initial={{ opacity: 0, x: -12 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: "-80px" }}
                    transition={{ duration: 0.4, delay: staggerDelay(i), ease: EASE_OUT }}
                    className="flex items-start gap-3 text-sm text-white/90"
                  >
                    <svg viewBox="0 0 20 20" fill="none" className="mt-0.5 h-5 w-5 shrink-0 text-cultiv-mint">
                      <path d="M4 10.5l3.5 3.5L16 6" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    {f}
                  </motion.li>
                ))}
              </ul>

              <button className="mt-8 w-full rounded-full bg-cultiv-mint py-3.5 font-display font-bold text-[#1e1e1e] transition-transform hover:scale-[1.02]">
                Teste por 7 dias grátis
              </button>
            </motion.div>
        </div>
      </div>
    </section>
  );
}
