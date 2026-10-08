"use client";

import { motion } from "framer-motion";

/** Small flat "Conta 0X" card shown near the hero's phone — these used to be
 * 3D bank-token geometry sitting on pedestals in the scene; the connections
 * concept (wires running across the hill) was dropped along with the old
 * side-hill terrain, so the banks are now just sharp HTML cards close to the
 * phone, matching how the rest of the hero's overlay content is drawn. */
export function BankCard({
  label,
  left,
  top,
  delay = 0,
}: {
  label: string;
  left: number;
  top: number;
  delay?: number;
}) {
  return (
    <motion.div
      className="absolute flex -translate-y-1/2 flex-col items-center gap-1 rounded-2xl bg-[#FFFEFA] px-4 py-2.5 shadow-[0_6px_16px_rgba(13,59,37,0.12)]"
      style={{ left: `${left}%`, top: `${top}%` }}
      initial={{ opacity: 0, y: 10, scale: 0.92 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.6, delay, ease: "easeOut" }}
    >
      <svg viewBox="0 0 24 24" className="h-5 w-5 shrink-0" fill="#4a9c5d">
        <path d="M12 2.5 3 8h18l-9-5.5z" />
        <rect x="4.4" y="9.5" width="2.1" height="8" />
        <rect x="9" y="9.5" width="2.1" height="8" />
        <rect x="13.5" y="9.5" width="2.1" height="8" />
        <rect x="18" y="9.5" width="2.1" height="8" />
        <rect x="3" y="18.5" width="18" height="2" />
      </svg>
      <p className="whitespace-nowrap font-display text-xs font-bold text-cultiv-ink">{label}</p>
    </motion.div>
  );
}
