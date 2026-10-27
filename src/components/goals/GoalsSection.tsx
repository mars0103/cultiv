"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { LeafRain } from "@/components/decor/LeafRain";
import { Ribbon } from "@/components/decor/Ribbon";
import { RevealLine } from "@/components/decor/Reveal";
import { EASE_OUT } from "@/lib/motion";
import { GoalCard } from "./GoalCard";
import { GOALS } from "./goals-data";

const CYCLE_MS = 3200;

export function GoalsSection() {
  const [goalIndex, setGoalIndex] = useState(0);
  useEffect(() => {
    const id = window.setInterval(() => setGoalIndex((v) => (v + 1) % GOALS.length), CYCLE_MS);
    return () => window.clearInterval(id);
  }, [goalIndex]);
  const goal = GOALS[goalIndex];

  return (
    <section className="relative w-full overflow-hidden bg-[#F5FBF1] py-24 md:py-32">
      <Ribbon path="hook" color="#AD0E44" strokeWidth={64} className="-left-24 top-2 z-20 h-44 w-44 opacity-65 md:left-0 md:top-8 md:h-[300px] md:w-[300px]" rotate={-12} />
      <Ribbon path="wave" color="#C1FFBC" strokeWidth={90} className="-bottom-8 -right-28 z-20 h-36 w-72 opacity-60 md:bottom-8 md:right-0 md:h-[280px] md:w-[460px]" delay={0.2} />
      <LeafRain count={7} />

      <div className="relative z-10 mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-10 px-6 md:grid-cols-2 md:gap-16 md:px-16">
        <div className="flex flex-col items-center gap-5 md:items-start">
          <RevealLine
            as="h2"
            className="max-w-lg text-center font-title text-4xl leading-[1.05] text-cultiv-ink md:max-w-xl md:text-left md:text-6xl"
          >
            Defina suas metas e deixe que o cultiv te ajude a alcançá-las
          </RevealLine>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="flex flex-wrap items-center justify-center gap-2 md:justify-start"
          >
            {GOALS.map((g, i) => {
              const active = i === goalIndex;
              return (
                <button
                  key={g.label}
                  onClick={() => setGoalIndex(i)}
                  className={`relative flex items-center gap-2 rounded-full px-4 py-2 font-display text-sm font-semibold transition-colors ${
                    active ? "text-white" : "text-cultiv-muted hover:text-cultiv-ink"
                  }`}
                >
                  {active && (
                    <motion.span
                      layoutId="goal-pill-bg"
                      className="absolute inset-0 rounded-full bg-cultiv-ink"
                      transition={{ type: "spring", duration: 0.5, bounce: 0.15 }}
                    />
                  )}
                  <span className="relative">{g.emoji}</span>
                  <span className="relative">{g.label}</span>
                </button>
              );
            })}
          </motion.div>
        </div>

        <div className="relative mx-auto w-full max-w-[420px]">
          <motion.div
            initial={{ opacity: 0, scale: 1.04 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7, ease: EASE_OUT }}
            className="mx-auto w-[78%] overflow-hidden rounded-[32px] shadow-xl md:w-[85%]"
          >
            <Image
              src="/images/photo-goal-woman.jpg"
              alt="Mulher sorrindo, pensando em suas metas financeiras"
              width={820}
              height={978}
              className="h-auto w-full object-cover"
              priority
            />
          </motion.div>

          <div className="relative z-10 -mt-20 flex justify-center md:-mt-24">
            <AnimatePresence mode="wait">
              <motion.div
                key={goal.label}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.35 }}
                className="w-full max-w-[460px]"
              >
                <GoalCard goal={goal} />
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
