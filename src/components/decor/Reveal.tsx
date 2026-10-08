"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";
import { EASE_OUT, VIEWPORT_ONCE } from "@/lib/motion";

// Masked vertical reveal for headings — the line slides up from behind an
// overflow-hidden edge instead of just fading, which reads as "revealed"
// rather than "faded in". Falls back to a static render for
// prefers-reduced-motion instead of skipping the animation silently, so the
// heading is never invisible if JS or motion is unavailable.
const lineVariants = {
  hidden: { y: "115%" },
  visible: { y: "0%" },
};

export function RevealLine({
  children,
  className = "",
  delay = 0,
  as = "span",
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  as?: "span" | "div" | "h2" | "h3" | "p";
}) {
  const reduce = useReducedMotion();
  if (reduce) {
    const Tag = as;
    return <Tag className={className}>{children}</Tag>;
  }
  // The outer tag is the one whileInView observes — its own box is never
  // transformed, only its children are, so it never clips itself out of its
  // own visibility check. (Observing the translated inner span directly is
  // a deadlock: overflow-hidden clips it out of the viewport intersection
  // *because* of the very offset it needs "in view" to animate away.) The
  // inner span has no viewport logic of its own — it just follows the
  // outer element's hidden/visible state via variants.
  const MotionTag = motion[as as "span"];
  return (
    <MotionTag className={`block overflow-hidden ${className}`} initial="hidden" whileInView="visible" viewport={VIEWPORT_ONCE}>
      <motion.span className="block" variants={lineVariants} transition={{ duration: 0.7, delay, ease: EASE_OUT }}>
        {children}
      </motion.span>
    </MotionTag>
  );
}

// Plain fade+rise for body copy, badges, CTAs — anything that isn't a
// headline. Reduced-motion just renders in place (opacity/transform skipped).
export function Reveal({
  children,
  className = "",
  delay = 0,
  distance = 22,
  duration = 0.6,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  distance?: number;
  duration?: number;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduce ? false : { opacity: 0, y: distance }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={VIEWPORT_ONCE}
      transition={{ duration, delay, ease: EASE_OUT }}
    >
      {children}
    </motion.div>
  );
}
