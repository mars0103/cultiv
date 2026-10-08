"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import type { NotificationItem } from "./notification-data";

export function NotificationCard({ item }: { item: NotificationItem }) {
  return (
    <motion.div
      className="absolute rounded-2xl border border-cultiv-accent bg-white shadow-lg shadow-black/10"
      style={{
        left: `${item.left}%`,
        top: `${item.top}%`,
        width: `${item.width}%`,
        aspectRatio: "315 / 68",
        willChange: "transform",
      }}
      // continuous float on the WHOLE card (border, shadow, background included)
      animate={{ y: [0, -8, 0] }}
      transition={{
        duration: 4.5,
        repeat: Infinity,
        ease: "easeInOut",
        delay: item.delay + 0.7,
      }}
    >
      <motion.div
        className="flex h-full w-full items-center gap-[8%] rounded-2xl px-[4.4%]"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.7, delay: item.delay, ease: "easeOut" }}
      >
        <div className="relative aspect-square h-[62%] shrink-0 overflow-hidden rounded-full">
          <Image src={item.icon} alt="" fill sizes="42px" className="object-cover" />
        </div>
        <div className="flex min-w-0 flex-1 flex-col justify-center gap-[2px]">
          <div className="flex items-baseline justify-between gap-2">
            <p className="truncate font-sans text-[11px] font-bold whitespace-nowrap text-cultiv-muted">
              {item.title}
            </p>
            <p className="shrink-0 font-sans text-[11px] font-bold text-cultiv-muted">
              {item.value}
            </p>
          </div>
          <p className="truncate font-sans text-[10px] whitespace-nowrap text-cultiv-muted">{item.date}</p>
        </div>
      </motion.div>
    </motion.div>
  );
}
