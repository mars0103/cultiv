"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
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
  const wrapperRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: progress } = useScroll({
    target: wrapperRef,
    offset: ["start start", "end end"],
  });

  // Avoid mounting a second, hidden WebGL context on mobile (perf/battery).
  const isDesktop = useMediaQuery("(min-width: 768px)");

  // One continuous story across the whole pin: hold on the resting hero,
  // then the copy fades away while the camera lifts into a top-down view
  // and the scene dissolves to white (camera/fog handled inside HillsScene,
  // driven by this same `progress`) — the phone alone stays put and just
  // shrinks a touch, so it reads as the same phone carrying into the steps
  // section right below, no separate section or notes-flying transition.
  // NOTE: plain array-range useTransform(value, [in], [out]) has a bug in the
  // installed framer-motion version where the DOM style stops tracking the
  // motion value correctly once the input passes the clamp boundary (it
  // drifts back up instead of staying at the clamped output) — the function
  // form below computes the clamp itself and doesn't hit that bug.
  const clampedLerp = (p: number, start: number, end: number, from: number, to: number) =>
    from + (to - from) * Math.min(1, Math.max(0, (p - start) / (end - start)));
  const contentOpacity = useTransform(progress, (p) => clampedLerp(p, 0.12, 0.38, 1, 0));
  const contentY = useTransform(progress, (p) => clampedLerp(p, 0.12, 0.4, 0, -30));
  const phoneScale = useTransform(progress, (p) => clampedLerp(p, 0.25, 1, 1, 0.6));
  const overlayOpacity = useTransform(progress, (p) => clampedLerp(p, 0.55, 0.95, 0, 1));

  return (
    <section ref={wrapperRef} className="relative w-full md:h-[260vh]">
      {/* ---------- DESKTOP / TABLET: pinned hero that dissolves into the steps ---------- */}
      <div className="sticky top-0 hidden h-screen w-full items-center justify-center overflow-hidden bg-gradient-to-b from-[#eefaf0] via-[#dcf3e1] to-[#bfe8c9] md:flex">
        {/* real-time 3D background (the actual Blender terrain/trees), fills the whole pinned viewport */}
        {isDesktop && <HillsScene progress={progress} className="absolute inset-0" />}

        {/* white dissolve wash, above the scene, below the UI */}
        <motion.div className="pointer-events-none absolute inset-0 bg-white" style={{ opacity: overlayOpacity }} />

        {/* UI overlay: the original 1920x996 design grid, centered and never
            overflowing the pinned viewport in either dimension. Pointer
            events pass through so mouse movement reaches the canvas behind
            it (that's what drives the background parallax) — re-enabled
            only on the button below, which needs its own hover/tap. */}
        <div
          className="pointer-events-none relative w-full"
          style={{ aspectRatio: "1920 / 996", width: "min(100%, 192.77vh)" }}
        >
          {/* logo — stays put as a brand anchor through the whole dissolve */}
          <div className="absolute" style={{ left: X(86), top: Y(70), width: X(226), height: Y(55) }}>
            <Image src="/images/brand/logo escura.svg" alt="Cultiv" fill className="object-contain object-left" />
          </div>

          {/* heading, subtitle, button, notifications — all fade away together */}
          <motion.div className="absolute inset-0" style={{ y: contentY, opacity: contentOpacity }}>
            <motion.p
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: "easeOut" }}
              className="absolute -translate-x-1/2 text-center font-title font-bold leading-[1.15] text-[#0d3b25]"
              style={{ left: "50%", top: Y(95), width: X(793), fontSize: FS(39) }}
            >
              Sua vida financeira muito mais organizada com a Cultiv
            </motion.p>
            <motion.p
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.12, ease: "easeOut" }}
              className="absolute -translate-x-1/2 text-center font-subtitle leading-snug text-cultiv-title"
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
              className="pointer-events-auto absolute -translate-x-1/2 rounded-full bg-cultiv-mint font-display font-bold text-[#1e1e1e]"
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

            {notifications.map((n) => (
              <NotificationCard key={n.id} item={n} />
            ))}
          </motion.div>

          {/* phone — the persistent element: never fades, only shrinks a touch
              as the scene dissolves, carrying visually into the steps below */}
          <motion.div
            className="absolute"
            style={{
              left: X(726),
              top: Y(295),
              width: X(445.5),
              height: Y(600),
              scale: phoneScale,
            }}
          >
            <PhoneChatMockup />
          </motion.div>
        </div>
      </div>

      {/* ---------- MOBILE: stacked layout ---------- */}
      <div className="relative flex w-full flex-col items-center gap-6 bg-gradient-to-b from-[#eefaf0] via-[#dcf3e1] to-[#bfe8c9] px-6 pt-8 pb-16 md:hidden">
        <div className="absolute inset-0 -z-10 opacity-90">
          <Image
            src="/images/hero/hills-3d.png"
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover object-bottom blur-[1px]"
          />
        </div>

        <div className="relative h-[26px] w-[95px] self-start">
          <Image src="/images/brand/logo escura.svg" alt="Cultiv" fill className="object-contain object-left" />
        </div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center font-title text-[28px] font-bold leading-tight text-[#0d3b25]"
        >
          Sua vida financeira muito mais organizada com a Cultiv
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-center font-subtitle text-[15px] text-cultiv-title"
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
