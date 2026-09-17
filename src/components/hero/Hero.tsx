"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion, useMotionValueEvent, useScroll, useTransform } from "framer-motion";
import { ChatScreen, PhoneChatMockup } from "./PhoneChatMockup";
import { NotificationCard } from "./NotificationCard";
import { notifications } from "./notification-data";
import { HillsScene } from "./scene3d/HillsScene";
import { PhoneFrame } from "@/components/phone/PhoneFrame";
import { SignupScreen } from "@/components/steps/PhoneScreens";
import { useMediaQuery } from "@/lib/useMediaQuery";

const X = (px: number) => `${((px / 1920) * 100).toFixed(3)}%`;
const Y = (px: number) => `${((px / 996) * 100).toFixed(3)}%`;
/** The canvas is full viewport width (no max-width), so vw maps 1:1 to canvas %. */
const FS = (px: number) => `${((px / 1920) * 100).toFixed(3)}vw`;

// Reuse the existing icon/title/value/date; only the position changes —
// these two live as sharp HTML overlay cards close to the phone rather
// than as 3D scene geometry, so they never pick up the scene's shadows.
const ifoodNotification = notifications.find((n) => n.id === "ifood")!;
const uberNotification = notifications.find((n) => n.id === "uber")!;

export function Hero() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const aspectBoxRef = useRef<HTMLDivElement>(null);
  const endGhostRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: progress } = useScroll({
    target: wrapperRef,
    offset: ["start start", "end end"],
  });

  // Avoid mounting a second, hidden WebGL context on mobile (perf/battery).
  const isDesktop = useMediaQuery("(min-width: 768px)");

  // One continuous story across the whole pin: hold on the resting hero,
  // then the copy fades away while the camera lifts into a top-down view
  // and the scene dissolves to white (camera/fog handled inside HillsScene,
  // driven by this same `progress`). The phone itself is the throughline:
  // it switches from the chat screen to the signup screen and slides into
  // the exact spot/size where the steps section's own phone sits, then
  // Hero DWELLS there — showing step "01" itself, fully — before unpinning.
  // That matters because two adjacent sticky-pinned sections can't hand off
  // at the same instant (the outgoing one has to scroll a full viewport off
  // before the next can engage); if both sides showed the same phone across
  // that gap it read as two overlapping phones. Ending Hero on ITS OWN
  // step-01, and starting the steps section at "02", makes that unavoidable
  // gap a normal (different-content) scroll transition instead.
  // NOTE: plain array-range useTransform(value, [in], [out]) has a bug in the
  // installed framer-motion version where the DOM style stops tracking the
  // motion value correctly once the input passes the clamp boundary (it
  // drifts back up instead of staying at the clamped output) — the function
  // form below computes the clamp itself and doesn't hit that bug.
  const clampedLerp = (p: number, start: number, end: number, from: number, to: number) =>
    from + (to - from) * Math.min(1, Math.max(0, (p - start) / (end - start)));
  const contentOpacity = useTransform(progress, (p) => clampedLerp(p, 0.1, 0.3, 1, 0));
  const contentY = useTransform(progress, (p) => clampedLerp(p, 0.1, 0.32, 0, -30));
  const overlayOpacity = useTransform(progress, (p) => clampedLerp(p, 0.42, 0.7, 0, 1));
  const dwellOpacity = useTransform(progress, (p) => clampedLerp(p, 0.68, 0.85, 0, 1));

  const [showStepScreen, setShowStepScreen] = useState(false);
  useMotionValueEvent(progress, "change", (p) => setShowStepScreen(p > 0.48));

  // The phone's start rect is computed analytically from the same X()/Y()
  // percentages used for its old static position (726/1920, 295/996,
  // 445.5/1920, 600/996) against the live size of the 1920x996 UI box. The
  // end rect is measured off an invisible clone of the steps section's own
  // phone slot (same classes, so it tracks that layout exactly, including
  // its sm:/md: responsive width) — both measured relative to the sticky
  // container, which is what the animated phone is positioned against.
  const phoneRectsRef = useRef({
    start: { left: 0, top: 0, width: 0 },
    end: { left: 0, top: 0, width: 0 },
  });

  useEffect(() => {
    function measure() {
      const sticky = stickyRef.current;
      const box = aspectBoxRef.current;
      const ghost = endGhostRef.current;
      if (!sticky || !box || !ghost) return;
      const stickyRect = sticky.getBoundingClientRect();
      const boxRect = box.getBoundingClientRect();
      const ghostRect = ghost.getBoundingClientRect();
      phoneRectsRef.current = {
        start: {
          left: boxRect.left - stickyRect.left + (726 / 1920) * boxRect.width,
          top: boxRect.top - stickyRect.top + (295 / 996) * boxRect.height,
          width: (445.5 / 1920) * boxRect.width,
        },
        end: {
          left: ghostRect.left - stickyRect.left,
          top: ghostRect.top - stickyRect.top,
          width: ghostRect.width,
        },
      };
    }
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  const phoneLeft = useTransform(progress, (p) => {
    const e = clampedLerp(p, 0.5, 0.78, 0, 1);
    const { start, end } = phoneRectsRef.current;
    return `${start.left + (end.left - start.left) * e}px`;
  });
  const phoneTop = useTransform(progress, (p) => {
    const e = clampedLerp(p, 0.5, 0.78, 0, 1);
    const { start, end } = phoneRectsRef.current;
    return `${start.top + (end.top - start.top) * e}px`;
  });
  const phoneWidth = useTransform(progress, (p) => {
    const e = clampedLerp(p, 0.5, 0.78, 0, 1);
    const { start, end } = phoneRectsRef.current;
    return `${start.width + (end.width - start.width) * e}px`;
  });

  return (
    <section ref={wrapperRef} className="relative w-full md:h-[300vh]">
      {/* ---------- DESKTOP / TABLET: pinned hero that dissolves into the steps ---------- */}
      <div
        ref={stickyRef}
        className="sticky top-0 hidden h-screen w-full items-center justify-center overflow-hidden bg-gradient-to-b from-[#eefaf0] via-[#dcf3e1] to-[#bfe8c9] md:flex"
      >
        {/* real-time 3D background (the actual Blender terrain/trees), fills the whole pinned viewport */}
        {isDesktop && <HillsScene progress={progress} className="absolute inset-0" />}

        {/* white dissolve wash, above the scene, below the UI */}
        <motion.div className="pointer-events-none absolute inset-0 bg-white" style={{ opacity: overlayOpacity }} />

        {/* Step "01" content: same grid classes as the steps section's own
            layout (so the phone slot below measures out to exactly where
            that section will show its phone), but rendered here for real —
            this is Hero owning its own dwell on step 01, not a placeholder. */}
        <div className="pointer-events-none absolute inset-0 flex items-center">
          <div className="mx-auto grid w-full max-w-6xl grid-cols-1 items-center gap-10 px-6 md:grid-cols-2 md:gap-16">
            <motion.div className="order-2 md:order-1" style={{ opacity: dwellOpacity }}>
              <p className="font-title text-[90px] font-bold leading-none text-cultiv-accent md:text-[120px]">01</p>
              <h2 className="mt-2 font-title text-2xl font-bold text-cultiv-ink md:text-4xl">
                Crie sua conta em segundos
              </h2>
              <p className="mt-4 max-w-md font-subtitle text-base text-cultiv-title md:text-lg">
                Cadastro simples, confirmado direto pelo WhatsApp — sem burocracia.
              </p>
              <div className="mt-8 flex gap-2">
                <span className="h-1.5 w-8 rounded-full bg-cultiv-accent" />
                <span className="h-1.5 w-4 rounded-full bg-gray-200" />
                <span className="h-1.5 w-4 rounded-full bg-gray-200" />
                <span className="h-1.5 w-4 rounded-full bg-gray-200" />
              </div>
            </motion.div>
            {/* invisible measurement stub — the actual phone is a separate,
                independently animated element sliding into this slot */}
            <div ref={endGhostRef} className="relative order-1 mx-auto w-[220px] sm:w-[260px] md:order-2 md:w-[300px] opacity-0">
              <div className="w-full" style={{ aspectRatio: "445.488 / 972.675" }} />
            </div>
          </div>
        </div>

        {/* UI overlay: the original 1920x996 design grid, centered and never
            overflowing the pinned viewport in either dimension. Pointer
            events pass through to whatever's behind it — re-enabled only on
            the button below, which needs its own hover/tap. */}
        <div
          ref={aspectBoxRef}
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
              Todos os seus bancos.
              <br />
              Uma vida mais organizada.
            </motion.p>
            <motion.p
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.12, ease: "easeOut" }}
              className="absolute -translate-x-1/2 text-center font-subtitle leading-snug text-cultiv-title"
              style={{ left: "50%", top: Y(200), width: X(600), fontSize: FS(21) }}
            >
              Conecte suas contas e deixe a Flora organizar tudo para você.
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

            {/* the bank tokens + glowing wires live inside the 3D scene
                itself (real geometry on the hills in HillsScene/SceneModel),
                but the transaction notifications stay sharp HTML overlays
                close to the phone — they never picked up scene shadows or
                shrank to illegible size this way. */}
            <NotificationCard item={{ ...ifoodNotification, left: 6, top: 73 }} />
            <NotificationCard item={{ ...uberNotification, left: 79.5, top: 68 }} />

            <motion.div
              className="absolute flex -translate-x-1/2 -translate-y-1/2 items-center gap-3 rounded-full bg-white py-2 pr-5 pl-2 shadow-[0_8px_20px_rgba(13,59,37,0.18)]"
              style={{ left: X(1385), top: Y(818) }}
              initial={{ opacity: 0, y: 16, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.7, delay: 1.3, ease: "easeOut" }}
            >
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#25d366]">
                <svg viewBox="0 0 24 24" fill="white" className="h-[55%] w-[55%]">
                  <path d="M12 2a10 10 0 00-8.5 15.3L2 22l4.9-1.3A10 10 0 1012 2zm0 18a8 8 0 01-4.1-1.1l-.3-.2-3 .8.8-2.9-.2-.3A8 8 0 1112 20zm4.4-5.9c-.2-.1-1.4-.7-1.6-.8-.2-.1-.4-.1-.5.1s-.6.8-.7.9-.3.2-.5.1a6.6 6.6 0 01-1.9-1.2 7 7 0 01-1.3-1.6c-.1-.2 0-.4.1-.5l.4-.4c.1-.1.1-.2.2-.4a.4.4 0 000-.4c-.1-.1-.5-1.3-.7-1.8s-.4-.4-.5-.4h-.5a.9.9 0 00-.6.3 2.7 2.7 0 00-.8 2 4.8 4.8 0 001 2.5 10.7 10.7 0 004.1 3.6c.6.2 1 .4 1.4.5a3.3 3.3 0 001.5.1 2.5 2.5 0 001.6-1.1 2 2 0 00.1-1.1c-.1-.1-.2-.1-.4-.2z" />
                </svg>
              </div>
              <p className="whitespace-nowrap font-display text-sm font-semibold text-[#0d3b25]">
                Flora também no WhatsApp
              </p>
              <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4 shrink-0">
                <path d="M9 6l6 6-6 6" stroke="#0d3b25" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </motion.div>
          </motion.div>
        </div>

        {/* phone — the throughline element: positioned in pixels against the
            sticky container (not the 1920x996 UI grid above) so it can slide
            from its hero spot into the exact rect the steps section's own
            phone occupies, switching from the chat screen to the signup
            screen just before it starts moving. Never two phones on screen —
            this is the only one, all the way through the handoff. */}
        <motion.div
          className="absolute"
          style={{
            left: phoneLeft,
            top: phoneTop,
            width: phoneWidth,
            aspectRatio: "445.488 / 972.675",
          }}
        >
          <AnimatePresence>
            {showStepScreen ? (
              <motion.div
                key="signup"
                className="absolute inset-0"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1, transition: { duration: 0.2 } }}
                exit={{ opacity: 0, transition: { duration: 0.2 } }}
              >
                <PhoneFrame>
                  <SignupScreen />
                </PhoneFrame>
              </motion.div>
            ) : (
              <motion.div
                key="chat"
                className="absolute inset-0"
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1, transition: { duration: 0.7, delay: 0.5, ease: "easeOut" } }}
                exit={{ opacity: 0, transition: { duration: 0.2 } }}
              >
                <PhoneFrame>
                  <ChatScreen />
                </PhoneFrame>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
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
          Todos os seus bancos. Uma vida mais organizada.
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-center font-subtitle text-[15px] text-cultiv-title"
        >
          Conecte suas contas e deixe a Flora organizar tudo para você.
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
