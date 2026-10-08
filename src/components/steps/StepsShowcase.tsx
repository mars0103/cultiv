"use client";

import { motion } from "framer-motion";
import { PhoneFrame } from "@/components/phone/PhoneFrame";
import { LogoScreen } from "./LogoScreen";
import { MountainSky } from "@/components/decor/MountainSky";
import { LeafRain } from "@/components/decor/LeafRain";

// Mobile has no room for a pinned/scroll-jacked composition (see
// StepsSection for the desktop version) — each step is just its own
// scroll-triggered block, stacked normally down the page.
const STEPS = [
  {
    n: "01",
    title: "Cadastro em menos de 1 minuto",
    desc: "Só seu e-mail uma senha e poucos dados, sem burocracia.",
    character: "/images/mulherapontando1.svg",
  },
  {
    n: "02",
    title: "Conecte seu banco com segurança",
    desc: "Via Open Finance, sem senhas ou dados sensíveis compartilhados com a gente.",
    character: "/images/mulherapontando2.svg",
  },
  {
    n: "03",
    title: "Tudo aparece automaticamente",
    desc: "Ganhos, despesas, cartões - organizados sem você digitar nada.",
    character: "/images/Mulher sorrindo olhando para frente.svg",
  },
  {
    n: "04",
    title: "Pergunte, a Flora responde",
    desc: "Converse com a Flora e entenda seus gastos em segundos, quando quiser.",
    character: "/images/Mulher sorrindo e levantando os bracos.svg",
  },
];

export function StepsShowcase() {
  return (
    <section className="relative w-full overflow-hidden md:hidden">
      <MountainSky>
        <LeafRain count={5} />
      </MountainSky>
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="relative z-10 px-6 pt-14 text-center font-title text-2xl font-bold text-cultiv-ink"
      >
        Em apenas 04 passos você terá acesso a uma vida financeira mais organizada!
      </motion.h2>

      <div className="relative z-10 flex flex-col gap-16 px-6 py-12">
        {STEPS.map((s, i) => (
          <motion.div
            key={s.n}
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-15%" }}
            transition={{ duration: 0.6, delay: i * 0.05 }}
            className="flex flex-col items-center gap-4"
          >
            <p className="font-title text-6xl font-bold leading-none text-cultiv-ink">{s.n}</p>
            <h3 className="text-center font-title text-xl font-bold text-cultiv-ink">{s.title}</h3>
            <p className="max-w-xs text-center font-subtitle text-sm text-cultiv-title">{s.desc}</p>
            <div className="flex w-full items-end justify-center gap-2">
              <div className="h-[180px] w-[130px] shrink-0">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={s.character} alt="" className="h-full w-full object-contain object-bottom" />
              </div>
              <div className="w-[110px] shrink-0">
                <PhoneFrame>
                  <LogoScreen />
                </PhoneFrame>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
