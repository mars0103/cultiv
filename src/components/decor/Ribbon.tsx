"use client";

import { motion, useReducedMotion } from "framer-motion";
import { EASE_OUT } from "@/lib/motion";

// Curved decorative "ribbon" — a thick stroked SVG path that draws itself in
// like a worm sliding into frame (animating pathLength 0→1), instead of just
// fading. Reusable across the sections below the Hero to build a consistent
// but non-repetitive background language: same building block, different
// curve/color/rotation/size per placement.
const PATHS = {
  // gentle single wave
  wave: "M-40,120 C120,20 220,220 400,110 S680,10 860,130",
  // loose spiral hook
  hook: "M20,10 C220,-60 320,140 140,220 C-40,300 60,420 260,380",
  // tight S-curve
  s: "M0,140 Q140,0 280,140 T560,140",
  // open arc
  arc: "M0,260 C100,60 340,60 440,260",
};

type RibbonPath = keyof typeof PATHS;

export function Ribbon({
  path,
  color,
  strokeWidth = 46,
  viewBox = "0 0 800 400",
  className = "",
  delay = 0,
  duration = 1.5,
  rotate = 0,
}: {
  path: RibbonPath;
  color: string;
  strokeWidth?: number;
  viewBox?: string;
  className?: string;
  delay?: number;
  duration?: number;
  rotate?: number;
}) {
  const reduce = useReducedMotion();
  return (
    <svg
      viewBox={viewBox}
      fill="none"
      className={`pointer-events-none absolute ${className}`}
      style={{ transform: `rotate(${rotate}deg)`, overflow: "visible" }}
    >
      <motion.path
        d={PATHS[path]}
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        initial={reduce ? false : { pathLength: 0, opacity: 0 }}
        whileInView={{ pathLength: 1, opacity: 1 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration, delay, ease: EASE_OUT }}
      />
    </svg>
  );
}
