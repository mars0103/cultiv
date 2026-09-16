"use client";

import { motion } from "framer-motion";

const PATHS = [
  "M 490 405 C 555 470, 630 500, 726 520",
  "M 311 700 C 430 655, 560 600, 726 520",
  "M 1515 486 C 1415 480, 1275 470, 1171 460",
];

/**
 * Glowing "Open Finance" wires from each bank token into the phone — a soft
 * base glow plus a marching-dash overlay so small points of light appear to
 * travel along the wire, matching the reference's connected-world motif.
 */
export function ConnectionLines() {
  return (
    <svg
      viewBox="0 0 1920 996"
      className="absolute inset-0 h-full w-full overflow-visible"
      preserveAspectRatio="none"
      aria-hidden
    >
      {PATHS.map((d, i) => (
        <motion.g
          key={d}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 + i * 0.15 }}
        >
          <path d={d} fill="none" stroke="#eafcd0" strokeWidth={9} strokeLinecap="round" opacity={0.45} style={{ filter: "blur(5px)" }} />
          <path d={d} fill="none" stroke="#c7f0ae" strokeWidth={2.6} strokeLinecap="round" opacity={0.95} />
          <path
            d={d}
            fill="none"
            stroke="#fffef2"
            strokeWidth={3.2}
            strokeLinecap="round"
            strokeDasharray="1.5 15"
            style={{ filter: "drop-shadow(0 0 3px #fffef2)" }}
          >
            <animate attributeName="stroke-dashoffset" from="0" to="-33" dur="1.1s" repeatCount="indefinite" />
          </path>
        </motion.g>
      ))}
    </svg>
  );
}
