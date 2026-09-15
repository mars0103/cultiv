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
      }}
      initial={{ opacity: 0, y: 24, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.7, delay: item.delay, ease: "easeOut" }}
    >
      <motion.div
        className="flex h-full w-full items-center gap-[8%] px-[4.4%]"
        animate={{ y: [0, -6, 0] }}
        transition={{
          duration: 4.5,
          repeat: Infinity,
          ease: "easeInOut",
          delay: item.delay,
        }}
      >
        <div className="relative aspect-square h-[62%] shrink-0 overflow-hidden rounded-full">
          <Image src={item.icon} alt="" fill sizes="42px" className="object-cover" />
        </div>
        <div className="flex min-w-0 flex-1 flex-col justify-center gap-[2px]">
          <div className="flex items-baseline justify-between gap-2">
            <p className="truncate font-sans text-[13px] font-bold text-cultiv-muted">
              {item.title}
            </p>
            <p className="shrink-0 font-sans text-[13px] font-bold text-cultiv-muted">
              {item.value}
            </p>
          </div>
          <p className="truncate font-sans text-[13px] text-cultiv-muted">{item.date}</p>
        </div>
      </motion.div>
    </motion.div>
  );
}
