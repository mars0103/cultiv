"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import type { Goal } from "./goals-data";

const FILL_DURATION = 1.3; // seconds to count up / fill the bar once a goal becomes active

function AnimatedAmount({ target }: { target: number }) {
  const value = useMotionValue(0);
  const rounded = useTransform(value, (v) => `R$ ${Math.round(v).toLocaleString("pt-BR")}`);
  const [display, setDisplay] = useState("R$ 0");

  useEffect(() => {
    const unsub = rounded.on("change", setDisplay);
    const controls = animate(value, target, { duration: FILL_DURATION, ease: "easeOut" });
    return () => {
      unsub();
      controls.stop();
    };
  }, [value, rounded, target]);

  return <>{display}</>;
}

const AVATAR_COLORS = ["#F4A261", "#AD0E44"];

export function GoalCard({ goal }: { goal: Goal }) {
  const savedFraction = 0.2 + ((goal.label.length * 13) % 15) / 100; // ~20–35%, varies per goal but deterministic
  const saved = Math.round(goal.target * savedFraction);
  const remaining = goal.target - saved;
  const pct = Math.round(savedFraction * 100);

  return (
    <motion.div
      className="w-full max-w-[420px] rounded-3xl bg-white p-6 shadow-[0_16px_40px_rgba(13,59,37,0.18)]"
      initial={{ opacity: 0, y: 24, scale: 0.94 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <div className="-ml-1 flex items-center gap-2">
        <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-[#E4EEFF] text-3xl">
          {goal.emoji}
        </div>
        <div className="min-w-0 flex-1">
          <p className="font-display text-base font-bold text-cultiv-ink">{goal.label}</p>
          <p className="font-subtitle text-xs text-cultiv-muted">Meta: {goal.dateLabel}</p>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <div className="flex -space-x-2">
            {AVATAR_COLORS.map((c) => (
              <div key={c} className="h-6 w-6 rounded-full border-2 border-white" style={{ background: c }} />
            ))}
            <div className="flex h-6 w-6 items-center justify-center rounded-full border-2 border-white bg-[#eef1ef] text-[9px] font-bold text-cultiv-muted">
              +2
            </div>
          </div>
          <span className="text-lg leading-none text-cultiv-muted">⋮</span>
        </div>
      </div>

      <div className="mt-5 flex items-end justify-between">
        <p className="font-title text-3xl font-bold text-cultiv-ink">
          <AnimatedAmount target={saved} />
        </p>
        <p className="font-subtitle text-sm text-cultiv-muted">
          meta: <span className="font-semibold text-cultiv-ink">R$ {goal.target.toLocaleString("pt-BR")}</span>
        </p>
      </div>

      <div className="mt-3 h-2.5 w-full overflow-hidden rounded-full bg-[#eef0f4]">
        <motion.div
          className="h-full rounded-full bg-[#6C7CF0]"
          initial={{ width: "0%" }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: FILL_DURATION, ease: "easeOut" }}
        />
      </div>
      <div className="mt-2 flex items-center justify-between font-subtitle text-xs text-cultiv-muted">
        <span>{pct}% economizado</span>
        <span>{goal.monthsLeft}</span>
      </div>

      <div className="mt-5 flex items-center justify-between border-t border-[#eef0f4] pt-4">
        <p className="font-subtitle text-sm text-cultiv-muted">
          Ainda falta: <span className="font-bold text-cultiv-ink">R$ {remaining.toLocaleString("pt-BR")}</span>
        </p>
        <span className="flex items-center gap-1 rounded-full bg-cultiv-pink/10 px-3 py-1.5 font-display text-xs font-semibold text-cultiv-pink">
          👍 No caminho certo
        </span>
      </div>
    </motion.div>
  );
}
