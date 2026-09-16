"use client";

import { motion } from "framer-motion";

function BankIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="h-[46%] w-[46%]">
      <path d="M12 2.2 2.4 8h19.2L12 2.2Z" fill="#4c5c52" />
      <rect x="4" y="9.2" width="2.1" height="8.4" rx="0.4" fill="#4c5c52" />
      <rect x="8.3" y="9.2" width="2.1" height="8.4" rx="0.4" fill="#4c5c52" />
      <rect x="12.6" y="9.2" width="2.1" height="8.4" rx="0.4" fill="#4c5c52" />
      <rect x="16.9" y="9.2" width="2.1" height="8.4" rx="0.4" fill="#4c5c52" />
      <rect x="3" y="18.4" width="18" height="2.1" rx="0.5" fill="#4c5c52" />
    </svg>
  );
}

/**
 * A "connected bank" marker sitting on the hills — a soft-toon token (card +
 * pedestal, matching the site's chunky flat-shadow style) rather than a
 * true 3D mesh, consistent with how the floating notification cards already
 * overlay the WebGL background as flat UI instead of scene geometry.
 */
export function BankToken({
  left,
  top,
  size,
  label,
  delay,
}: {
  left: string;
  top: string;
  size: string;
  label: string;
  delay: number;
}) {
  return (
    <motion.div
      className="absolute flex -translate-x-1/2 flex-col items-center"
      style={{ left, top }}
      initial={{ opacity: 0, y: 18, scale: 0.85 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.7, delay, ease: "easeOut" }}
    >
      <motion.div
        className="flex flex-col items-center"
        animate={{ y: [0, -7, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: delay + 0.6 }}
      >
        <div
          className="relative flex items-center justify-center rounded-[26%] bg-gradient-to-b from-white to-[#eaf2ec]"
          style={{ width: size, aspectRatio: "1 / 1", boxShadow: "0 10px 0 0 rgba(13,59,37,0.18), 0 14px 18px rgba(13,59,37,0.16)" }}
        >
          <BankIcon />
        </div>
        <div
          className="-mt-[6%] rounded-full bg-gradient-to-b from-cultiv-mint to-[#78cf8c]"
          style={{ width: `calc(${size} * 1.22)`, height: `calc(${size} * 0.24)` }}
        />
        <div
          className="mt-[6%] rounded-full bg-black/10 blur-[3px]"
          style={{ width: `calc(${size} * 1.35)`, height: `calc(${size} * 0.16)` }}
        />
      </motion.div>
      <p className="mt-[8%] whitespace-nowrap font-display text-sm font-bold text-[#0d3b25]">{label}</p>
    </motion.div>
  );
}
