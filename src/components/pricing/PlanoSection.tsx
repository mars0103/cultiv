"use client";

import { motion } from "framer-motion";
import { Ribbon } from "@/components/decor/Ribbon";
import { RevealLine, Reveal } from "@/components/decor/Reveal";
import { EASE_OUT, staggerDelay } from "@/lib/motion";
import { SIGNUP_URL } from "@/lib/links";

const FEATURES = [
  { title: "Metas ilimitadas", text: "crie quantos objetivos quiser" },
  { title: "Todos os agentes", text: "acesso completo às ferramentas da Cultiv" },
  { title: "WhatsApp sem limites", text: "converse com a Flora sempre que precisar" },
  { title: "Bancos e cartões", text: "conexões ilimitadas via Open Finance" },
  { title: "Acompanhamento automático", text: "categorias e relatórios dos seus gastos" },
];

export function PlanoSection() {
  return (
    <section id="plano" className="relative w-full overflow-hidden bg-[#F0FBEA] py-24 md:py-32">
      <Ribbon path="s" color="#AD0E44" strokeWidth={50} className="-left-16 top-16 z-20 h-24 w-60 opacity-70 md:left-0 md:top-8 md:h-[160px] md:w-[380px]" rotate={-6} />
      <Ribbon path="hook" color="#00C853" strokeWidth={50} className="-bottom-8 -right-24 z-20 h-44 w-44 opacity-50 md:bottom-8 md:right-0 md:h-[280px] md:w-[280px]" delay={0.2} rotate={30} />

      <div className="relative z-10 mx-auto w-full max-w-5xl px-6 text-center">
        <Reveal duration={0.5} className="inline-flex items-center rounded-full bg-cultiv-pink/10 px-4 py-1.5 font-display text-xs font-bold uppercase tracking-wide text-cultiv-pink">
          Plano Cultiv
        </Reveal>

        <RevealLine as="h2" delay={0.1} className="mt-4 font-title text-4xl text-cultiv-ink md:text-6xl">
          Acesso completo para organizar sua vida financeira
        </RevealLine>
        <Reveal delay={0.2} className="mx-auto mt-4 max-w-lg font-subtitle text-lg text-cultiv-muted md:text-xl">
          Todos os agentes, metas ilimitadas e acompanhamento pelo WhatsApp, sem limite de mensagens.
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
              className="relative order-1 mx-auto w-full max-w-xl shrink-0 overflow-hidden rounded-[33px] border border-cultiv-accent/40 bg-[#06150f] text-left text-white shadow-2xl md:order-2"
            >
              <div className="px-7 py-9 md:px-10 md:py-11">
                <p className="inline-flex rounded-xl bg-cultiv-accent px-5 py-2.5 font-display text-sm font-bold uppercase tracking-[0.08em] text-[#06150f]">
                  Plano Cultiv
                </p>
                <h3 className="mt-7 font-display text-3xl font-bold text-white md:text-4xl">Acesso completo</h3>
                <p className="mt-3 max-w-lg font-subtitle text-base leading-relaxed text-white/60 md:text-lg">
                  Todos os agentes, metas ilimitadas e acompanhamento pelo WhatsApp, sem limite de mensagens.
                </p>

                <p className="mt-8 font-subtitle text-base text-white/55">Plano anual por apenas</p>
                <div className="mt-1 flex items-end gap-2">
                  <span className="pb-3 font-display text-2xl font-bold text-white/65">R$</span>
                  <span className="font-display text-[72px] font-bold leading-none tracking-[-0.08em] text-cultiv-accent md:text-[92px]">
                    29,15
                  </span>
                  <span className="pb-3 font-subtitle text-xl text-white/55">/mês*</span>
                </div>

                <p className="mt-4 font-subtitle text-base leading-relaxed text-white/60 md:text-lg">
                  Menos de <strong className="text-white">R$ 1 por dia</strong>, mais barato que o café que você toma sem nem pensar.
                  Esse aqui te devolve dinheiro no fim do mês.
                </p>

                <a href={SIGNUP_URL} className="mt-8 flex w-full items-center justify-center gap-3 rounded-2xl bg-cultiv-accent py-4 font-display text-lg font-bold text-[#06150f] transition-transform hover:scale-[1.02]">
                  Começar agora <span aria-hidden="true">→</span>
                </a>
                <p className="mt-5 text-center font-display text-base font-bold text-cultiv-accent">14 dias grátis para testar</p>
                <p className="mx-auto mt-1 max-w-sm text-center font-subtitle text-sm leading-relaxed text-white/45">
                  *Valor mensal equivalente. Cobrança única anual de R$ 349,90.
                </p>
              </div>

              <div className="border-t border-white/10 bg-white/[0.025] px-7 py-9 md:px-10 md:py-11">
                <p className="font-display text-sm font-bold uppercase tracking-[0.15em] text-white/50">Tudo isso incluso</p>
                <ul className="mt-7 flex flex-col gap-5">
                {FEATURES.map((f, i) => (
                  <motion.li
                    key={f.title}
                    initial={{ opacity: 0, x: -12 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: "-80px" }}
                    transition={{ duration: 0.4, delay: staggerDelay(i), ease: EASE_OUT }}
                    className="flex items-start gap-3 font-subtitle text-base text-white/60"
                  >
                    <svg viewBox="0 0 20 20" fill="none" className="mt-0.5 h-6 w-6 shrink-0 rounded-md border border-cultiv-accent/40 bg-cultiv-accent/10 p-1 text-cultiv-accent">
                      <path d="M4 10.5l3.5 3.5L16 6" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <span><strong className="text-white">{f.title}:</strong> {f.text}</span>
                  </motion.li>
                ))}
                </ul>
              </div>
            </motion.div>
        </div>
      </div>
    </section>
  );
}
