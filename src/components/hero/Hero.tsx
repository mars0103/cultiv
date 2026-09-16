"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform, useMotionValue, useSpring } from "framer-motion";
import { PhoneChatMockup } from "./PhoneChatMockup";
import { NotificationCard } from "./NotificationCard";
import { notifications } from "./notification-data";
import { HillsScene } from "./scene3d/HillsScene";
import { useMediaQuery } from "@/lib/useMediaQuery";

const X = (px: number) => `${((px / 1920) * 100).toFixed(3)}%`;
const Y = (px: number) => `${((px / 996) * 100).toFixed(3)}%`;
/** The canvas is full viewport width (no max-width), so vw maps 1:1 to canvas %. */
const FS = (px: number) => `${((px / 1920) * 100).toFixed(3)}vw`;

export function Hero() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });
  // Avoid mounting a second, hidden WebGL context on mobile (perf/battery).
  const isDesktop = useMediaQuery("(min-width: 768px)");

  // Layered parallax as you scroll past the Hero: text (mid-ground) drifts up
  // a little, the phone (foreground) drifts up more, the 3D background (in
  // HillsScene) pans/zooms the least of all — closer layers move faster.
  const textY = useTransform(scrollYProgress, [0, 1], [0, -60]);
  const phoneY = useTransform(scrollYProgress, [0, 1], [0, -140]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.9, 1], [1, 1, 0]);

  // Mouse-hover parallax: layers shift sideways with the cursor, foreground
  // (phone) more than mid-ground (text) — same "closer = faster" depth cue.
  const rawMouseX = useMotionValue(0);
  const mouseX = useSpring(rawMouseX, { stiffness: 55, damping: 14, mass: 0.4 });
  const textMouseX = useTransform(mouseX, [-1, 1], [-8, 8]);
  const phoneMouseX = useTransform(mouseX, [-1, 1], [-22, 22]);

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    rawMouseX.set(((e.clientX - rect.left) / rect.width - 0.5) * 2);
  };
  const handleMouseLeave = () => rawMouseX.set(0);

  return (
    <section
      ref={sectionRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative w-full overflow-hidden bg-gradient-to-b from-[#06432d] via-[35%] via-[#46a357] to-[#46a357]"
    >
      {/* ---------- DESKTOP / TABLET: faithful absolute canvas ---------- */}
      <div className="relative mx-auto hidden w-full md:block" style={{ aspectRatio: "1920 / 996" }}>
        {/* real-time 3D background (the actual Blender terrain/trees), with scroll parallax */}
        {isDesktop && <HillsScene scrollYProgress={scrollYProgress} className="absolute inset-0" />}
        <div className="absolute inset-0 bg-gradient-to-t from-[#06432d]/10 via-transparent to-[#06432d]/40" />

        {/* logo */}
        <div className="absolute" style={{ left: X(86), top: Y(65), width: X(226), height: Y(65) }}>
          <Image src="/images/brand/cultiv-logo.png" alt="Cultiv" fill className="object-contain object-left" />
        </div>

        {/* heading — mid-ground parallax layer */}
        <motion.div className="absolute inset-0" style={{ y: textY, x: textMouseX, opacity: heroOpacity }}>
          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="absolute -translate-x-1/2 text-center font-title font-bold leading-[1.15] text-white"
            style={{ left: "50%", top: Y(95), width: X(793), fontSize: FS(39) }}
          >
            Sua vida financeira muito mais organizada com a Cultiv
          </motion.p>
          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.12, ease: "easeOut" }}
            className="absolute -translate-x-1/2 text-center font-subtitle leading-snug text-white/90"
            style={{ left: "50%", top: Y(200), width: X(600), fontSize: FS(21) }}
          >
            Conecte seu banco e deixe a Cultiv organizar seu mundo financeiro automaticamente.
          </motion.p>

          <motion.button
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.24, ease: "easeOut" }}
            whileHover={{ y: -3, boxShadow: "-7px 9px 0px 0px black" }}
            whileTap={{ y: 2, boxShadow: "-2px 3px 0px 0px black" }}
            className="absolute -translate-x-1/2 rounded-full bg-cultiv-mint font-display font-bold text-[#1e1e1e]"
            style={{
              left: "50%",
              top: Y(285),
              width: X(422),
              height: Y(63),
              fontSize: FS(20),
              boxShadow: "-5.44px 6.801px 0px 0px black",
            }}
          >
            Teste por 7 dias grátis
          </motion.button>
        </motion.div>

        {/* phone + floating notifications — foreground parallax layer, moves fastest */}
        <motion.div className="absolute inset-0" style={{ y: phoneY, x: phoneMouseX, opacity: heroOpacity }}>
          <div className="absolute" style={{ left: X(726), top: Y(295), width: X(445.5), height: Y(600) }}>
            <PhoneChatMockup />
          </div>

          {notifications.map((n) => (
            <NotificationCard key={n.id} item={n} />
          ))}
        </motion.div>
      </div>

      {/* ---------- MOBILE: stacked layout ---------- */}
      <div className="relative flex w-full flex-col items-center gap-6 px-6 pt-8 pb-16 md:hidden">
        <div className="absolute inset-0 -z-10">
          <Image
            src="/images/hero/hills-3d.png"
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover object-bottom blur-[1px]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#06432d]/20 via-transparent to-[#06432d]/50" />
        </div>

        <div className="relative h-[26px] w-[95px] self-start">
          <Image src="/images/brand/cultiv-logo.png" alt="Cultiv" fill className="object-contain object-left" />
        </div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center font-title text-[28px] font-bold leading-tight text-white"
        >
          Sua vida financeira muito mais organizada com a Cultiv
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-center font-subtitle text-[15px] text-white/90"
        >
          Conecte seu banco e deixe a Cultiv organizar seu mundo financeiro automaticamente.
        </motion.p>
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="rounded-full bg-cultiv-mint px-8 py-3.5 font-display text-[15px] font-bold text-[#1e1e1e]"
          style={{ boxShadow: "-4px 5px 0px 0px black" }}
        >
          Teste por 7 dias grátis
        </motion.button>

        <div className="relative mt-4 w-[220px]">
          <PhoneChatMockup />
        </div>

        <div className="grid w-full max-w-md grid-cols-1 gap-3">
          {notifications.map((n, i) => (
            <motion.div
              key={n.id}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="flex items-center gap-3 rounded-2xl border border-cultiv-accent bg-white p-3"
            >
              <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full">
                <Image src={n.icon} alt="" fill className="object-cover" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-baseline justify-between gap-2">
                  <p className="truncate font-sans text-[13px] font-bold text-cultiv-muted">{n.title}</p>
                  <p className="shrink-0 font-sans text-[13px] font-bold text-cultiv-muted">{n.value}</p>
                </div>
                <p className="truncate font-sans text-[12px] text-cultiv-muted">{n.date}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
