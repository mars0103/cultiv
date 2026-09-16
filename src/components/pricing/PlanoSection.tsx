"use client";

import { motion } from "framer-motion";

const FEATURES = [
  "Conexão ilimitada de bancos e cartões",
  "Flora, sua IA financeira, no app e no WhatsApp",
  "Categorização automática de gastos",
  "Relatórios mensais e ritmo de gastos",
  "Seus dados nunca são vendidos ou compartilhados",
];

export function PlanoSection() {
  return (
    <section className="mx-auto w-full max-w-4xl px-6 py-24 text-center md:py-32">
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="font-title text-2xl font-bold text-cultiv-ink md:text-[39px]"
      >
        Plano
      </motion.h2>

      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.97 }}
        whileInView={{ opacity: 1, y: 0, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="relative mx-auto mt-12 max-w-lg overflow-hidden rounded-[33px] bg-cultiv-forest-dark px-8 py-10 text-left text-white shadow-xl"
      >
        <p className="font-display text-sm font-medium uppercase tracking-wide text-cultiv-mint">Cultiv Premium</p>
        <div className="mt-3 flex items-end gap-2">
          <p className="font-display text-5xl font-bold">R$ 19,90</p>
          <p className="pb-2 text-white/70">/mês</p>
        </div>
        <p className="mt-1 font-subtitle text-sm text-white/70">7 dias grátis, cancele quando quiser.</p>

        <ul className="mt-8 flex flex-col gap-3">
          {FEATURES.map((f) => (
            <li key={f} className="flex items-start gap-3 text-sm text-white/90">
              <svg viewBox="0 0 20 20" fill="none" className="mt-0.5 h-5 w-5 shrink-0 text-cultiv-mint">
                <path d="M4 10.5l3.5 3.5L16 6" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              {f}
            </li>
          ))}
        </ul>

        <button className="mt-8 w-full rounded-full bg-cultiv-mint py-3.5 font-display font-bold text-[#1e1e1e] transition-transform hover:scale-[1.02]">
          Teste por 7 dias grátis
        </button>
      </motion.div>
    </section>
  );
}
