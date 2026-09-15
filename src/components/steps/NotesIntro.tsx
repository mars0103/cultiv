"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";

/**
 * Scroll-driven (not scroll-jacked — sticky, so native scrolling stays
 * smooth/accessible) transition: two banknotes slide across the screen while
 * the headline builds up, before releasing into the steps section below.
 */
export function NotesIntro() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });

  const note100X = useTransform(scrollYProgress, [0.05, 0.55], ["-30vw", "115vw"]);
  const note100Rot = useTransform(scrollYProgress, [0.05, 0.55], [-8, 6]);
  const note50X = useTransform(scrollYProgress, [0.15, 0.65], ["130vw", "-25vw"]);
  const note50Rot = useTransform(scrollYProgress, [0.15, 0.65], [10, -4]);

  const words = "Organize seu dinheiro em apenas quatro passos".split(" ");

  return (
    <section ref={ref} className="relative h-[260vh] bg-[#f4f6f5]">
      <div className="sticky top-0 flex h-screen w-full flex-col items-center justify-center overflow-hidden">
        <motion.div
          className="absolute top-[18%] w-[340px] sm:w-[420px] md:w-[520px]"
          style={{ x: note100X, rotate: note100Rot }}
        >
          <Image src="/images/notes/nota-100.png" alt="" width={600} height={269} className="h-auto w-full drop-shadow-xl" />
        </motion.div>
        <motion.div
          className="absolute bottom-[18%] w-[300px] sm:w-[380px] md:w-[460px]"
          style={{ x: note50X, rotate: note50Rot }}
        >
          <Image src="/images/notes/nota-50.png" alt="" width={600} height={281} className="h-auto w-full drop-shadow-xl" />
        </motion.div>

        <p className="relative z-10 mx-auto max-w-4xl px-6 text-center font-display text-3xl font-bold text-cultiv-ink sm:text-4xl md:text-[52px] md:leading-[1.15]">
          {words.map((w, i) => {
            const start = 0.1 + (i / words.length) * 0.55;
            const end = start + 0.08;
            return (
              <Word key={i} progress={scrollYProgress} start={start} end={end}>
                {w}
              </Word>
            );
          })}
        </p>
      </div>
    </section>
  );
}

function Word({
  children,
  progress,
  start,
  end,
}: {
  children: string;
  progress: ReturnType<typeof useScroll>["scrollYProgress"];
  start: number;
  end: number;
}) {
  const opacity = useTransform(progress, [start, end], [0.15, 1]);
  const y = useTransform(progress, [start, end], [14, 0]);
  return (
    <motion.span style={{ opacity, y, display: "inline-block" }} className="mr-[0.28em]">
      {children}
    </motion.span>
  );
}
