"use client";

import Image from "next/image";
import { motion, type MotionValue } from "framer-motion";
import type { ReactNode } from "react";

/**
 * Reusable iPhone-style frame (from Figma's "mockup vazio" asset) with a
 * transparent cutout — screen content is rendered as a normal absolutely
 * positioned child underneath it.
 */
export function PhoneFrame({
  children,
  className = "",
  bezelOpacity = 1,
}: {
  children: ReactNode;
  className?: string;
  /** Lets the hero crossfade this flat bezel in as its 3D counterpart
   * (rendered in the scene behind it) fades out — everywhere else this
   * just stays fully opaque. */
  bezelOpacity?: MotionValue<number> | number;
}) {
  return (
    <div className={`relative w-full ${className}`} style={{ aspectRatio: "445.488 / 972.675" }}>
      <div
        className="absolute overflow-hidden rounded-[10%]"
        style={{ left: "6.5%", top: "14.2%", width: "87.3%", height: "84.9%" }}
      >
        {children}
      </div>
      <motion.div className="pointer-events-none absolute inset-0" style={{ opacity: bezelOpacity }}>
        <Image
          src="/images/hero/mockup-vazio.png"
          alt=""
          fill
          sizes="(min-width: 1024px) 30vw, 60vw"
          className="pointer-events-none select-none object-contain"
        />
      </motion.div>
    </div>
  );
}
