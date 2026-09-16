"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const FAQS = [
  {
    q: "É seguro conectar meu banco na Cultiv?",
    a: "Sim. Usamos o Open Finance, regulado pelo Banco Central, com acesso somente leitura — a Cultiv nunca movimenta seu dinheiro nem tem acesso às suas senhas bancárias.",
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
    a: "Não! A Cultiv se conecta aos bancos que você já usa — ela organiza tudo automaticamente, sem que você precise abrir uma nova conta.",
  },
];

export function FAQSection() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section className="mx-auto w-full max-w-3xl px-6 py-24 md:py-32">
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="text-center font-title text-2xl font-bold text-cultiv-ink md:text-[39px]"
      >
        Perguntas frequentes
      </motion.h2>

      <div className="mt-12 flex flex-col gap-4">
        {FAQS.map((f, i) => {
          const isOpen = open === i;
          return (
            <motion.div
              key={f.q}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.06 }}
              className="overflow-hidden rounded-[24px] bg-[#f4f6f5]"
            >
              <button
                onClick={() => setOpen(isOpen ? null : i)}
                className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
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
    </section>
  );
}
