"use client";

import { motion } from "framer-motion";

const STEPS = [
  {
    label: "Conexão 100% criptografada",
    icon: (
      <path d="M12 2a5 5 0 00-5 5v3H6a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2v-8a2 2 0 00-2-2h-1V7a5 5 0 00-5-5zm-3 8V7a3 3 0 016 0v3H9zm3 4a2 2 0 110 4 2 2 0 010-4z" />
    ),
  },
  {
    label: "Acesso só de leitura — nunca movemos seu dinheiro",
    icon: (
      <path d="M12 5c-5.5 0-9.5 4.5-10 7 .5 2.5 4.5 7 10 7s9.5-4.5 10-7c-.5-2.5-4.5-7-10-7zm0 11.5a4.5 4.5 0 110-9 4.5 4.5 0 010 9zM12 10a2 2 0 100 4 2 2 0 000-4z" />
    ),
  },
  {
    label: "Você controla e pode desconectar quando quiser",
    icon: (
      <path d="M12 2l8 4v6c0 5-3.4 8.7-8 10-4.6-1.3-8-5-8-10V6l8-4zm-1 13l5.5-5.5-1.4-1.4L11 12.2l-2.1-2.1-1.4 1.4L11 15z" />
    ),
  },
];

export function LGPDSection() {
  return (
    <section className="mx-auto w-full max-w-5xl px-6 py-24 text-center md:py-32">
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="font-display text-2xl font-bold text-cultiv-ink md:text-[39px]"
      >
        Seus dados nunca ficam com a gente
      </motion.h2>
      <p className="mx-auto mt-4 max-w-2xl text-base text-cultiv-title md:text-lg">
        Trabalhamos com Open Finance regulado pelo Banco Central e seguimos a LGPD à risca:
        conectamos seus dados só pra te mostrar sua vida financeira — nada mais.
      </p>

      <div className="mt-16 flex flex-col items-center gap-10 md:flex-row md:items-start md:justify-between md:gap-4">
        {STEPS.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.15 }}
            className="relative flex w-full max-w-[220px] flex-col items-center gap-4"
          >
            {i < STEPS.length - 1 && (
              <div className="absolute left-1/2 top-[42px] hidden h-px w-[calc(100%+2rem)] -translate-x-0 bg-cultiv-accent/40 md:block" />
            )}
            <div className="relative z-10 flex h-[84px] w-[84px] items-center justify-center rounded-full bg-cultiv-forest-dark text-cultiv-mint shadow-md">
              <svg viewBox="0 0 24 24" fill="currentColor" className="h-9 w-9">
                {s.icon}
              </svg>
            </div>
            <p className="font-display text-sm font-medium text-cultiv-ink">{s.label}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
