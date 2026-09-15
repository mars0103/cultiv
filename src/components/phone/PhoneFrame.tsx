"use client";

import Image from "next/image";
import type { ReactNode } from "react";

/**
 * Reusable iPhone-style frame (from Figma's "mockup vazio" asset) with a
 * transparent cutout — screen content is rendered as a normal absolutely
 * positioned child underneath it.
 */
export function PhoneFrame({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`relative w-full ${className}`} style={{ aspectRatio: "445.488 / 972.675" }}>
      <div
        className="absolute overflow-hidden rounded-[10%]"
        style={{ left: "6.5%", top: "14.2%", width: "87.3%", height: "84.9%" }}
      >
        {children}
      </div>
      <Image
        src="/images/hero/mockup-vazio.png"
        alt=""
        fill
        sizes="(min-width: 1024px) 30vw, 60vw"
        className="pointer-events-none select-none object-contain"
      />
    </div>
  );
}
