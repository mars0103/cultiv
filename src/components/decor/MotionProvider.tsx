"use client";

import { MotionConfig } from "framer-motion";
import type { ReactNode } from "react";

// Applies prefers-reduced-motion to every framer-motion animation in the
// app at once ("user" = respect the OS setting) instead of hand-checking it
// in each component.
export function MotionProvider({ children }: { children: ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
