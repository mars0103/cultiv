"use client";

import { motion } from "framer-motion";
import { Ribbon } from "@/components/decor/Ribbon";
import { RevealLine, Reveal } from "@/components/decor/Reveal";
import { EASE_OUT, staggerDelay } from "@/lib/motion";

const CARDS = [
  {
    label: "Seu Banco",
    desc: "Seus dados de transações reais protegidos na origem.",
    icon: (
      <path d="M12 2a5 5 0 00-5 5v3H6a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2v-8a2 2 0 00-2-2h-1V7a5 5 0 00-5-5zm-3 8V7a3 3 0 016 0v3H9zm3 4a2 2 0 110 4 2 2 0 010-4z" />
    ),
  },
  {
    label: "Banco Central",
    desc: "Infraestrutura regulada pelo ecossistema de Open Finance.",
    icon: (
      <path d="M9 2v2H7a2 2 0 00-2 2v2H3v2h2v2H3v2h2v2a2 2 0 002 2h2v2h2v-2h2v2h2v-2h2a2 2 0 002-2v-2h2v-2h-2v-2h2V8h-2V6a2 2 0 00-2-2h-2V2h-2v2h-2V2H9zm-1 6h8v8H8V8z" />
    ),
  },
  {
    label: "App (Somente leitura)",
    desc: "Análise sem permissão para saques ou transferências.",
    icon: (
      <path d="M12 5c-5.5 0-9.5 4.5-10 7 .5 2.5 4.5 7 10 7s9.5-4.5 10-7c-.5-2.5-4.5-7-10-7zm0 11.5a4.5 4.5 0 110-9 4.5 4.5 0 010 9zM12 10a2 2 0 100 4 2 2 0 000-4z" />
    ),
  },
];

// Looping "data flowing through the pipeline" timing: each card glows in
// turn, each arrow pulses right after the card behind it lights up, then it
// loops back to the start — a continuous cycle instead of a one-shot reveal.
const STEP = 1.1;
const HOLD = 0.6;
const CYCLE = STEP * CARDS.length;

export function LGPDSection() {
  return (
    <section className="relative flex w-full flex-col items-center overflow-hidden bg-[#00C853] px-6 py-24 text-center md:py-32">
      <Ribbon path="arc" color="#AD0E44" strokeWidth={56} className="-left-20 -top-10 h-[300px] w-[440px] opacity-80" rotate={8} />
      <Ribbon path="wave" color="#0b1f14" strokeWidth={42} className="-right-16 bottom-8 h-[220px] w-[480px] opacity-30" delay={0.15} />

      <RevealLine as="h2" className="relative z-10 font-title text-4xl text-white md:text-7xl">
        Seus dados nunca ficam com a gente
      </RevealLine>
      <Reveal delay={0.1} className="relative z-10 mt-4 max-w-lg font-subtitle text-base text-white/70 md:text-xl">
        A Cultiv só lê o que precisa pra te mostrar seus números — nunca move um centavo, nunca vende um dado.
      </Reveal>

      <div className="relative z-10 mx-auto mt-14 flex w-full max-w-5xl flex-col items-stretch justify-center gap-4 md:flex-row md:items-center md:gap-4">
        {CARDS.map((c, i) => (
          <div key={c.label} className="flex items-center gap-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.7, rotate: i % 2 === 0 ? -6 : 6 }}
              whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              animate={{
                boxShadow: [
                  "0 4px 20px rgba(0,0,0,0.3)",
                  "0 4px 20px rgba(0,0,0,0.3)",
                  "0 0 32px rgba(193,255,188,0.65)",
                  "0 4px 20px rgba(0,0,0,0.3)",
                ],
              }}
              transition={{
                opacity: { duration: 0.55, delay: staggerDelay(i), ease: EASE_OUT },
                scale: { duration: 0.55, delay: staggerDelay(i), ease: EASE_OUT },
                rotate: { duration: 0.55, delay: staggerDelay(i), ease: EASE_OUT },
                boxShadow: { duration: HOLD, repeat: Infinity, repeatDelay: CYCLE - HOLD, delay: i * STEP, ease: "easeInOut" },
              }}
              className="flex w-full flex-col gap-3 rounded-2xl bg-[#0b1f14] px-7 py-6 text-left shadow-lg md:w-[280px]"
            >
              <motion.div
                animate={{ backgroundColor: ["rgba(193,255,188,0.15)", "rgba(193,255,188,0.15)", "rgba(193,255,188,0.9)", "rgba(193,255,188,0.15)"] }}
                transition={{ duration: HOLD, repeat: Infinity, repeatDelay: CYCLE - HOLD, delay: i * STEP, ease: "easeInOut" }}
                className="flex h-11 w-11 items-center justify-center rounded-lg text-cultiv-mint"
              >
                <svg viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6">
                  {c.icon}
                </svg>
              </motion.div>
              <p className="font-display text-base font-bold text-white">{c.label}</p>
              <p className="font-subtitle text-sm leading-snug text-white/60">{c.desc}</p>
            </motion.div>

            {i < CARDS.length - 1 && (
              <motion.svg
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                animate={{ opacity: [0.4, 0.4, 1, 0.4], x: [0, 0, 6, 0] }}
                transition={{
                  opacity: { duration: 0.5, delay: i * STEP + STEP * 0.55, repeat: Infinity, repeatDelay: CYCLE - 0.5 },
                  x: { duration: 0.5, delay: i * STEP + STEP * 0.55, repeat: Infinity, repeatDelay: CYCLE - 0.5 },
                }}
                viewBox="0 0 24 24"
                fill="none"
                className="hidden h-6 w-6 shrink-0 text-cultiv-mint md:block"
              >
                <path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
              </motion.svg>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
