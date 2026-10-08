"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";

const LEAF_SRCS = ["/images/decor/leaf-1.svg", "/images/decor/leaf-2.svg", "/images/decor/leaf-3.svg"];

type Leaf = {
  src: string;
  top: number;
  size: number;
  duration: number;
  delay: number;
  bob: number;
  rotateFrom: number;
  rotateTo: number;
  hue: number;
  opacity: number;
  rightward: boolean;
};

const round = (n: number) => Math.round(n * 100) / 100;

function makeLeaf(seed: number): Leaf {
  // Deterministic-ish pseudo-random per index so re-renders don't reshuffle mid-flight.
  const rand = (n: number) => {
    const x = Math.sin(seed * 999 + n * 37.7) * 43758.5453;
    return x - Math.floor(x);
  };
  return {
    src: LEAF_SRCS[seed % LEAF_SRCS.length],
    top: round(rand(1) * 100),
    size: round(18 + rand(2) * 30),
    duration: round(10 + rand(3) * 9),
    delay: round(rand(4) * 8),
    bob: round(20 + rand(5) * 40),
    rotateFrom: round(rand(6) * 360),
    rotateTo: round(rand(6) * 360 + (rand(7) > 0.5 ? 200 : -200)),
    hue: round((rand(8) - 0.5) * 50),
    opacity: round(0.55 + rand(9) * 0.4),
    rightward: seed % 2 === 0,
  };
}

/**
 * Persistent "leaf rain" — the brand leaf SVGs blowing sideways across the
 * section like a gust of wind (mostly horizontal drift, with a light
 * vertical bob and continuous rotation), not falling straight down. Driven
 * by Framer Motion (not a CSS @keyframes + inline `animation` reference) —
 * that CSS approach turned out to never actually start on server-rendered/
 * hydrated elements in this app (verified: the exact same style, on a
 * client-created element, animated instantly; on the hydrated one, it
 * never did, even though computed style reported "running"). Motion
 * side-steps that entirely by driving transform from JS.
 */
export function LeafRain({ count = 10, className = "" }: { count?: number; className?: string }) {
  const leaves = useMemo(() => Array.from({ length: count }, (_, i) => makeLeaf(i + 1)), [count]);

  return (
    <div className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`} aria-hidden>
      {leaves.map((leaf, i) => {
        const from = leaf.rightward ? -15 : 115;
        const to = leaf.rightward ? 120 : -20;
        const mid1 = leaf.rightward ? 30 : 75;
        const mid2 = leaf.rightward ? 60 : 45;
        const mid3 = leaf.rightward ? 90 : 15;
        const rotMid = round((leaf.rotateFrom + leaf.rotateTo) / 2);
        return (
          <motion.div
            key={i}
            className="absolute left-0"
            style={{ top: `${leaf.top}%`, width: leaf.size, height: leaf.size, opacity: leaf.opacity, filter: `hue-rotate(${leaf.hue}deg)` }}
            animate={{
              x: [`${from}vw`, `${mid1}vw`, `${mid2}vw`, `${mid3}vw`, `${to}vw`],
              y: [0, -leaf.bob, leaf.bob, -leaf.bob, 0],
              rotate: [leaf.rotateFrom, rotMid, leaf.rotateTo, rotMid, leaf.rotateFrom],
            }}
            transition={{ duration: leaf.duration, delay: leaf.delay, repeat: Infinity, ease: "easeInOut" }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={leaf.src} alt="" width={leaf.size} height={leaf.size} className="h-full w-full" />
          </motion.div>
        );
      })}
    </div>
  );
}
