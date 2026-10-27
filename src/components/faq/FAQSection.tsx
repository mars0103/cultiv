"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Ribbon } from "@/components/decor/Ribbon";
import { RevealLine, Reveal } from "@/components/decor/Reveal";
import { EASE_OUT, staggerDelay } from "@/lib/motion";

const FAQS = [
  {
    q: "É seguro conectar meu banco na Cultiv?",
    a: "Sim. Usamos o Open Finance, regulado pelo Banco Central, com acesso somente leitura. A Cultiv nunca movimenta seu dinheiro nem tem acesso às suas senhas bancárias.",
  },
  {
    q: "A Cultiv guarda meus dados financeiros?",
    a: "Seus dados ficam criptografados e são usados só para te mostrar sua própria vida financeira. Não vendemos nem compartilhamos suas informações com terceiros.",
  },
  {
    q: "Posso cancelar quando quiser?",
    a: "Pode sim, a qualquer momento, direto pelo app, sem multa e sem burocracia.",
  },
  {
    q: "Preciso trocar de banco para usar a Cultiv?",
    a: "Não! A Cultiv se conecta aos bancos que você já usa e organiza tudo automaticamente, sem que você precise abrir uma nova conta.",
  },
];

export function FAQSection() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="faq" className="relative w-full overflow-hidden bg-white py-24 md:py-32">
      <Ribbon path="arc" color="#AD0E44" strokeWidth={50} className="right-8 top-8 hidden h-[150px] w-[260px] opacity-60 md:block" />

      <div className="relative z-10 mx-auto w-full max-w-3xl px-6">
        <div className="text-center">
          <Reveal duration={0.5} className="inline-flex items-center rounded-full bg-cultiv-pink/10 px-4 py-1.5 font-display text-xs font-bold uppercase tracking-wide text-cultiv-pink">
            Dúvidas
          </Reveal>

          <RevealLine as="h2" delay={0.1} className="mt-4 font-title text-4xl text-cultiv-ink md:text-6xl">
            Antes que você pergunte
          </RevealLine>
          <Reveal delay={0.2} className="mx-auto mt-4 font-subtitle text-lg text-cultiv-muted md:text-xl">
            As perguntas que mais recebemos, sem enrolação.
          </Reveal>
        </div>

          <div className="mx-auto mt-12 flex max-w-2xl flex-col gap-4">
            {FAQS.map((f, i) => {
              const isOpen = open === i;
              return (
                <motion.div
                  key={f.q}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-80px" }}
                  transition={{ duration: 0.4, delay: staggerDelay(i), ease: EASE_OUT }}
                  className="overflow-hidden rounded-[24px] bg-[#f4f6f5]"
                >
                  <button
                    onClick={() => setOpen(isOpen ? null : i)}
                    className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left transition-colors hover:bg-black/[0.02] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-cultiv-accent"
                  >
                    <span className="font-display text-base font-bold text-cultiv-ink">{f.q}</span>
                    <motion.span
                      animate={{ rotate: isOpen ? 45 : 0 }}
                      transition={{ duration: 0.25 }}
                      className="shrink-0 text-2xl leading-none text-cultiv-accent"
                    >
                      +
                    </motion.span>
                  </button>
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <p className="px-6 pb-5 font-subtitle text-sm leading-relaxed text-cultiv-muted">{f.a}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>
      </div>
    </section>
  );
}
