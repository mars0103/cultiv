"use client";

import { motion } from "framer-motion";
import { WhatsAppScreen } from "./WhatsAppScreen";
import { MountainSky } from "@/components/decor/MountainSky";
import { LeafRain } from "@/components/decor/LeafRain";
import { Ribbon } from "@/components/decor/Ribbon";
import { RevealLine } from "@/components/decor/Reveal";
import { EASE_OUT } from "@/lib/motion";

function FloatingWhatsAppIcon({ className = "" }: { className?: string }) {
  return (
    <motion.div
      className={`absolute flex h-14 w-14 items-center justify-center rounded-full bg-[#25d366] shadow-lg ${className}`}
      animate={{ y: [0, -14, 0], rotate: [0, 6, 0] }}
      transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
    >
      <svg viewBox="0 0 24 24" fill="white" className="h-7 w-7">
        <path d="M12 2a10 10 0 00-8.5 15.3L2 22l4.9-1.3A10 10 0 1012 2zm0 18a8 8 0 01-4.1-1.1l-.3-.2-3 .8.8-2.9-.2-.3A8 8 0 1112 20zm4.4-5.9c-.2-.1-1.4-.7-1.6-.8-.2-.1-.4-.1-.5.1s-.6.8-.7.9-.3.2-.5.1a6.6 6.6 0 01-1.9-1.2 7 7 0 01-1.3-1.6c-.1-.2 0-.4.1-.5l.4-.4c.1-.1.1-.2.2-.4a.4.4 0 000-.4c-.1-.1-.5-1.3-.7-1.8s-.4-.4-.5-.4h-.5a.9.9 0 00-.6.3 2.7 2.7 0 00-.8 2 4.8 4.8 0 001 2.5 10.7 10.7 0 004.1 3.6c.6.2 1 .4 1.4.5a3.3 3.3 0 001.5.1 2.5 2.5 0 001.6-1.1 2 2 0 00.1-1.1c-.1-.1-.2-.1-.4-.2z" />
      </svg>
    </motion.div>
  );
}

export function WhatsAppSection() {
  return (
    <section className="relative w-full overflow-hidden bg-white py-24 md:min-h-screen md:py-0">
      <MountainSky behindMountain={<FloatingWhatsAppIcon className="left-[30%] top-[47%] md:left-[32%] md:top-[46%]" />}>
        <LeafRain count={8} />
      </MountainSky>
      <Ribbon path="s" color="#AD0E44" strokeWidth={42} className="bottom-8 right-8 z-[5] hidden h-[120px] w-[360px] opacity-35 md:block" />

      <div className="relative z-10 mx-auto max-w-4xl px-6 pt-24 text-center md:absolute md:left-1/2 md:top-24 md:-translate-x-1/2 md:pt-0">
        <RevealLine as="h2" className="font-title text-4xl text-cultiv-ink md:text-6xl">
          Sua vida financeira cabe numa conversa de WhatsApp
        </RevealLine>
        <RevealLine as="p" delay={0.08} className="mx-auto mt-4 max-w-lg font-subtitle text-base text-cultiv-muted md:text-xl">
          Sem abrir o app. Pergunte pra Flora quanto gastou, o que pode cortar ou quanto já guardou. Ela responde na hora.
        </RevealLine>
      </div>

      <div className="relative z-10 mx-auto mt-10 flex w-full max-w-md flex-col items-center gap-0 px-6 md:absolute md:inset-0 md:mt-0 md:block md:max-w-none md:px-0">
        <motion.div
          className="relative w-[220px] shrink-0 md:absolute md:bottom-0 md:left-[18%] md:h-[62%] md:w-auto"
          initial={{ opacity: 0, x: -60 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease: EASE_OUT }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/mulherolhandoocelular.svg" alt="" className="w-full md:h-full md:w-auto" />
        </motion.div>

        <motion.div
          className="-mt-1 w-[260px] shrink-0 overflow-hidden rounded-[28px] shadow-2xl md:absolute md:bottom-[12%] md:left-[52%] md:mt-0 md:w-[300px]"
          style={{ aspectRatio: "340 / 400" }}
          initial={{ opacity: 0, x: 60 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, delay: 0.15, ease: EASE_OUT }}
        >
          <WhatsAppScreen />
        </motion.div>
      </div>
    </section>
  );
}
