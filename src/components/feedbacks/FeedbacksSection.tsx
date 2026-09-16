"use client";

import Image from "next/image";
import { motion } from "framer-motion";

// Placeholder testimonials — swap for real customer feedback before launch.
const FEEDBACKS = [
  { name: "Marina", city: "São Paulo, SP", quote: "Finalmente entendo pra onde meu dinheiro vai. A Flora resume tudo num minuto." },
  { name: "Lucas", city: "Belo Horizonte, MG", quote: "Conectei o banco e pronto — nunca mais precisei abrir uma planilha." },
  { name: "Beatriz", city: "Curitiba, PR", quote: "O jeito que ela organiza os gastos por categoria mudou como eu economizo." },
  { name: "Rafael", city: "Recife, PE", quote: "Pergunto pelo WhatsApp mesmo, sem precisar nem abrir o app. Muito prático." },
  { name: "Camila", city: "Porto Alegre, RS", quote: "Achei que fosse mais um app de finanças, mas é bem mais simples que os outros." },
  { name: "Diego", city: "Florianópolis, SC", quote: "Gosto de saber que os dados ficam só comigo — isso pesou muito na escolha." },
];

export function FeedbacksSection() {
  return (
    <section className="relative mx-auto w-full max-w-6xl px-6 py-24 md:py-32">
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="text-center font-display text-2xl font-bold text-cultiv-ink md:text-[39px]"
      >
        Feedbacks
      </motion.h2>

      <div className="relative mt-14 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        <div className="pointer-events-none absolute left-1/2 top-1/2 hidden w-[220px] -translate-x-1/2 -translate-y-1/2 opacity-90 lg:block">
          <Image src="/images/decor/tree-illustration.png" alt="" width={970} height={637} className="h-auto w-full" />
        </div>

        {FEEDBACKS.map((f, i) => (
          <motion.div
            key={f.name}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: (i % 3) * 0.1 }}
            className="relative z-10 flex flex-col gap-4 rounded-[24px] border border-black/5 bg-white p-6 shadow-sm"
          >
            <div className="flex text-cultiv-accent">
              {Array.from({ length: 5 }).map((_, s) => (
                <svg key={s} viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
                  <path d="M10 1.5l2.6 5.6 6 .7-4.5 4.1 1.2 6-5.3-3-5.3 3 1.2-6L1.4 7.8l6-.7L10 1.5z" />
                </svg>
              ))}
            </div>
            <p className="font-subtitle text-sm leading-relaxed text-cultiv-muted">&ldquo;{f.quote}&rdquo;</p>
            <div className="mt-auto flex items-center gap-3 pt-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-cultiv-forest-dark font-display text-sm font-bold text-cultiv-mint">
                {f.name[0]}
              </div>
              <div>
                <p className="font-display text-sm font-bold text-cultiv-ink">{f.name}</p>
                <p className="text-xs text-cultiv-muted">{f.city}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
