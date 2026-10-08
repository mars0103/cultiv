"use client";

import type { ReactNode } from "react";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion, useMotionValueEvent, useScroll, useTransform } from "framer-motion";
import { ChatScreen, PhoneChatMockup } from "./PhoneChatMockup";
import { notifications } from "./notification-data";
import { PhoneFrame } from "@/components/phone/PhoneFrame";
import { SignupScreen, OpenFinanceScreen, HomeScreen } from "@/components/steps/PhoneScreens";
import { LogoScreen } from "@/components/steps/LogoScreen";
import { MountainSky } from "@/components/decor/MountainSky";
import { LeafRain } from "@/components/decor/LeafRain";
import { EASE_OUT } from "@/lib/motion";

const AVATAR_COLORS = ["#F4A261", "#6C7CF0", "#AD0E44"];

function Highlight({ children }: { children: ReactNode }) {
  return (
    <span className="rounded-full bg-cultiv-mint px-2 py-0.5 font-semibold text-cultiv-forest-dark">{children}</span>
  );
}

const STEPS = [
  {
    n: "01",
    title: "Cadastro em menos de 1 minuto",
    desc: "Só seu e-mail uma senha e poucos dados, sem burocracia.",
    character: "/images/mulherapontando1.svg",
    Screen: SignupScreen,
  },
  {
    n: "02",
    title: "Conecte seu banco com segurança",
    desc: "Via Open Finance, sem senhas ou dados sensíveis compartilhados com a gente.",
    character: "/images/mulherapontando2.svg",
    Screen: OpenFinanceScreen,
  },
  {
    n: "03",
    title: "Tudo aparece automaticamente",
    desc: "Ganhos, despesas, cartões - organizados sem você digitar nada.",
    character: "/images/Mulher sorrindo olhando para frente.svg",
    Screen: HomeScreen,
  },
  {
    n: "04",
    title: "Pergunte, a Flora responde",
    desc: "Converse com a Flora e entenda seus gastos em segundos, quando quiser.",
    character: "/images/Mulher sorrindo e levantando os bracos.svg",
    Screen: ChatScreen,
  },
];

// Section budget: 2 units for the hero dwell + "card grows to fullscreen"
// transition, then 1 unit per numbered step — one continuous pinned scroll,
// so the handoff from Hero into Steps is a real, continuous transform (the
// mountain+phone card scaling up) instead of a hard cut between sections.
const GROW_UNITS = 2;
const TOTAL_UNITS = GROW_UNITS + STEPS.length;
const GROW_FRACTION = GROW_UNITS / TOTAL_UNITS;

const clampedLerp = (p: number, start: number, end: number, from: number, to: number) =>
  from + (to - from) * Math.min(1, Math.max(0, (p - start) / (end - start)));

export function Hero() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const cardSlotRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: rawProgress } = useScroll({ target: wrapperRef, offset: ["start start", "end end"] });

  const growProgress = useTransform(rawProgress, (p) => Math.min(1, p / GROW_FRACTION));

  // The small "card" (mountain scene + phone) in the hero's image row is
  // measured once (and on resize) relative to the pinned sticky box, so it
  // can grow from that exact rect to fill the whole screen — the same
  // measure-then-animate trick as the old hero used for the phone slide.
  // Kept in state (not just a ref) so measuring it triggers a render: a
  // plain `useTransform(growProgress, fn)` only re-evaluates `fn` when
  // `growProgress` itself changes, so at rest (scroll still at 0) it would
  // otherwise keep showing whatever `fn` returned on the very first render,
  // before the measurement effect had even run — a blank, zero-size card.
  const [rects, setRects] = useState({ left: 0, top: 0, width: 0, height: 0, containerW: 0, containerH: 0 });
  useEffect(() => {
    function measure() {
      const sticky = stickyRef.current;
      const slot = cardSlotRef.current;
      if (!sticky || !slot) return;
      const s = sticky.getBoundingClientRect();
      const c = slot.getBoundingClientRect();
      setRects({
        left: c.left - s.left,
        top: c.top - s.top,
        width: c.width,
        height: c.height,
        containerW: s.width,
        containerH: s.height,
      });
    }
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  const GROW_START = 0.12;
  const GROW_END = 0.62;

  // Same reasoning as above: every value below depends on scroll progress
  // AND on the measured rect, so it's tracked as plain render-time state
  // (updated on every scroll tick) rather than useTransform, which would
  // only recompute on progress changes and could show stale/zero values.
  const [growP, setGrowP] = useState(0);
  useMotionValueEvent(growProgress, "change", setGrowP);

  const growE = clampedLerp(growP, GROW_START, GROW_END, 0, 1);
  const cardLeft = `${rects.left * (1 - growE)}px`;
  const cardTop = `${rects.top * (1 - growE)}px`;
  const cardWidth = `${rects.width + (rects.containerW - rects.width) * growE}px`;
  const cardHeight = `${rects.height + (rects.containerH - rects.height) * growE}px`;
  const cardRadius = `${clampedLerp(growE, 0, 1, 28, 0)}px`;

  // Everything else in the hero (nav links, headline, subtitle, CTAs, badge,
  // the right photo card, social proof) fades+slides away early, well before
  // the card finishes growing.
  const heroChromeOpacity = clampedLerp(growP, 0.04, 0.32, 1, 0);
  const heroChromeY = clampedLerp(growP, 0.04, 0.32, 0, -24);

  // The phone inside the growing card moves from its small centered-bottom
  // spot to the Steps layout's spot (right side, upper area) — using plain
  // left/top/width (no translate-centering) so the two states interpolate
  // cleanly as one continuous move.
  const phoneLeft = `${clampedLerp(growP, GROW_START, GROW_END, 29, 54.7)}%`;
  const phoneTop = `${clampedLerp(growP, GROW_START, GROW_END, 20, 6)}%`;
  const phoneWidth = `${clampedLerp(growP, GROW_START, GROW_END, 42, 19)}%`;

  const headlineOpacity =
    clampedLerp(growP, 0.62, 0.82, 0, 1) * (1 - clampedLerp(growP, 0.93, 1, 0, 1));
  const headlineY = clampedLerp(growP, 0.62, 0.82, 20, 0);

  const showStepsChrome = growP > 0.68;

  const [inSteps, setInSteps] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);
  useMotionValueEvent(rawProgress, "change", (p) => {
    setInSteps(p > GROW_FRACTION + 0.001);
    const stepsP = Math.min(1, Math.max(0, (p - GROW_FRACTION) / (1 - GROW_FRACTION)));
    const idx = Math.min(STEPS.length - 1, Math.floor(stepsP * STEPS.length));
    setStepIndex((prev) => (prev !== idx ? idx : prev));
  });
  const activeStep = STEPS[stepIndex];
  const ActiveScreen = activeStep.Screen;

  // The brief "arriving" beat — card fully grown, logo on screen, steps
  // haven't started yet — gets its own phone spot (bottom-center) instead of
  // the Steps layout's spot (right side), so the headline above it has room
  // to sit centered. Once the numbered steps begin, the phone settles into
  // its usual Steps position.
  const inTransitionBeat = showStepsChrome && !inSteps;
  const transitionPhoneWidth = 15;
  const displayPhoneLeft = inTransitionBeat ? `${50 - transitionPhoneWidth / 2}%` : phoneLeft;
  const displayPhoneWidth = inTransitionBeat ? `${transitionPhoneWidth}%` : phoneWidth;
  const displayPhoneTop = inTransitionBeat ? undefined : phoneTop;
  const displayPhoneBottom = inTransitionBeat ? "7%" : undefined;

  return (
    <section ref={wrapperRef} className="relative w-full md:h-[600vh]">
      {/* ---------- DESKTOP / TABLET: one pinned viewport, hero morphs into steps ---------- */}
      <div ref={stickyRef} className="sticky top-0 hidden h-screen w-full overflow-hidden bg-gradient-to-b from-[#EAFBEE] to-white md:block">
        <LeafRain count={8} />

        {/* hero chrome — fades away as the card grows. The nav itself now
            lives in the global <FloatingNav>, fixed above every section, so
            this only needs top padding to clear it. */}
        <motion.div className="absolute inset-0 z-20" style={{ opacity: heroChromeOpacity, y: heroChromeY }}>
          <div className="mx-auto w-full max-w-7xl px-6 pt-24 md:px-10 md:pt-28 lg:px-14">
            <div className="mx-auto flex max-w-5xl flex-col items-center text-center">
              <h1 className="flex flex-col items-center overflow-hidden font-title text-4xl leading-[1.1] text-cultiv-ink md:text-6xl lg:text-[68px]">
                <span className="flex flex-wrap items-center justify-center gap-x-3">
                  <motion.span
                    className="inline-block"
                    initial={{ y: "115%" }}
                    animate={{ y: "0%" }}
                    transition={{ duration: 0.7, ease: EASE_OUT }}
                  >
                    Sua vida financeira
                  </motion.span>
                  <motion.span
                    initial={{ opacity: 0, scale: 0.6 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.35, ease: EASE_OUT }}
                    className="relative inline-flex h-8 w-8 items-center justify-center rounded-full bg-cultiv-pink align-middle lg:h-10 lg:w-10"
                  >
                    <span className="relative h-[55%] w-[55%]">
                      <Image src="/images/brand/logo-icon.svg" alt="" fill className="object-contain brightness-0 invert" />
                    </span>
                  </motion.span>
                </span>
                <motion.span
                  className="inline-block"
                  initial={{ y: "115%" }}
                  animate={{ y: "0%" }}
                  transition={{ duration: 0.7, delay: 0.08, ease: EASE_OUT }}
                >
                  muito mais organizada com o Cultiv
                </motion.span>
              </h1>

              <motion.p
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3, ease: EASE_OUT }}
                className="mt-5 max-w-2xl font-subtitle text-base leading-relaxed text-cultiv-title lg:text-lg"
              >
                Conecte seu banco, <Highlight>veja seus gastos</Highlight> automaticamente e{" "}
                <Highlight>converse com a Flora</Highlight> sempre que quiser — tudo em um só lugar, sem planilhas.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.42, ease: EASE_OUT }}
                className="mt-5 flex gap-3"
              >
                <button className="group flex items-center gap-1.5 rounded-full bg-cultiv-forest-dark px-6 py-3 font-display text-sm font-bold text-white transition-transform hover:scale-[1.02] active:scale-[0.98]">
                  Teste por 7 dias grátis
                  <span className="inline-block transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5">↗</span>
                </button>
                <a
                  href="#como-funciona"
                  className="flex items-center justify-center rounded-full border border-cultiv-ink/15 bg-white px-6 py-3 font-display text-sm font-bold text-cultiv-ink transition-colors hover:bg-cultiv-mint/30 active:scale-[0.98]"
                >
                  Ver como funciona
                </a>
              </motion.div>
            </div>

            <div className="relative mt-8 grid grid-cols-[1.35fr_1fr] gap-5">
              {/* invisible spacer: reserves the grid slot the growing card starts from */}
              <div ref={cardSlotRef} className="invisible min-h-[440px] rounded-[28px]" />

              <motion.div
                initial={{ opacity: 0, scale: 1.04 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.7, delay: 0.5, ease: EASE_OUT }}
                className="relative min-h-[440px] overflow-hidden rounded-[28px] shadow-xl"
              >
                <Image src="/images/photo-hero-woman.jpg" alt="Mulher sorrindo usando o celular" fill className="object-cover" priority />
              </motion.div>

              {/* floating stat card — bleeds past the photo's edge onto the
                  plain background, the "bento" flourish from the reference */}
              <motion.div
                initial={{ opacity: 0, y: 16, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.75, ease: EASE_OUT }}
                className="absolute -bottom-6 right-4 z-20 flex items-center gap-3 rounded-2xl bg-white px-4 py-3 shadow-[0_16px_36px_rgba(18,27,22,0.18)] lg:right-8"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-cultiv-mint text-lg">🌱</div>
                <div className="text-left">
                  <p className="font-display text-sm font-bold leading-none text-cultiv-ink">+2.500 famílias</p>
                  <p className="mt-1 font-subtitle text-xs text-cultiv-muted">organizando as finanças</p>
                </div>
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.65, ease: EASE_OUT }}
              className="mt-10 flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <div className="flex -space-x-2.5">
                  {AVATAR_COLORS.map((c) => (
                    <div key={c} className="h-8 w-8 rounded-full border-2 border-white" style={{ background: c }} />
                  ))}
                </div>
                <p className="font-display text-xs text-cultiv-muted lg:text-sm">
                  Usado por <span className="font-bold text-cultiv-ink">milhares de pessoas</span> pra organizar as finanças
                </p>
              </div>

              <div className="flex items-center gap-2">
                {["ellipse-uber.png", "ellipse-ifood.png", "ellipse-shopee.png"].map((src) => (
                  <div key={src} className="relative h-8 w-8 overflow-hidden rounded-full border border-cultiv-ink/10">
                    <Image src={`/images/hero/${src}`} alt="" fill className="object-cover" />
                  </div>
                ))}
                <p className="ml-2 hidden font-display text-xs text-cultiv-muted lg:block lg:text-sm">e centenas de bancos e apps conectados</p>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* the growing card — mountain scene + phone, small at rest, fills the screen as you scroll */}
        <motion.div
          className="absolute z-10 overflow-hidden shadow-xl"
          style={{ left: cardLeft, top: cardTop, width: cardWidth, height: cardHeight, borderRadius: cardRadius }}
        >
          <MountainSky>
            <LeafRain count={9} />
          </MountainSky>

          <motion.div
            className="absolute z-10"
            style={{ left: displayPhoneLeft, top: displayPhoneTop, bottom: displayPhoneBottom, width: displayPhoneWidth }}
          >
            <PhoneFrame>
              <AnimatePresence mode="wait">
                {showStepsChrome ? (
                  inSteps ? (
                    <motion.div
                      key={`step-${stepIndex}`}
                      className="absolute inset-0"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1, transition: { duration: 0.25 } }}
                      exit={{ opacity: 0, transition: { duration: 0.2 } }}
                    >
                      <ActiveScreen />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="logo"
                      className="absolute inset-0"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1, transition: { duration: 0.25 } }}
                      exit={{ opacity: 0, transition: { duration: 0.2 } }}
                    >
                      <LogoScreen />
                    </motion.div>
                  )
                ) : (
                  <motion.div
                    key="chat"
                    className="absolute inset-0"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1, transition: { duration: 0.25 } }}
                    exit={{ opacity: 0, transition: { duration: 0.2 } }}
                  >
                    <ChatScreen />
                  </motion.div>
                )}
              </AnimatePresence>
            </PhoneFrame>
          </motion.div>
        </motion.div>

        {/* transition headline — fades in once the card has settled fullscreen.
            Vertically centered on the phone: the outer div pins the static
            center point (top:49%, translateY(-50%) — the phone's own
            vertical midpoint across typical viewport aspect ratios), while
            the inner motion.p only handles the scroll-driven fade/slide. */}
        <div className="absolute z-20 text-center" style={{ left: "50%", top: "12%", width: "60%", transform: "translateX(-50%)" }}>
          <motion.p
            className="font-title leading-[1.15] text-cultiv-ink"
            style={{ fontSize: "clamp(28px, 3.2vw, 52px)", opacity: headlineOpacity, y: headlineY }}
          >
            4 passos pra uma vida
            <br />
            financeira organizada
          </motion.p>
        </div>

        {inSteps && (
          <div className="absolute z-20" style={{ left: "20.6%", top: "9%", width: "34%" }}>
            <AnimatePresence mode="popLayout">
              <motion.div
                key={stepIndex}
                initial={{ opacity: 0, x: -60 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -60 }}
                transition={{ duration: 0.45, ease: "easeOut" }}
              >
                <p className="font-title font-bold leading-none text-cultiv-ink" style={{ fontSize: "clamp(48px, 8vw, 130px)" }}>
                  {activeStep.n}
                </p>
                <h3 className="mt-2 font-title font-bold text-cultiv-ink" style={{ fontSize: "clamp(18px, 1.8vw, 30px)" }}>
                  {activeStep.title}
                </h3>
                <p className="mt-3 max-w-md font-subtitle text-cultiv-title" style={{ fontSize: "clamp(13px, 1vw, 17px)" }}>
                  {activeStep.desc}
                </p>
              </motion.div>
            </AnimatePresence>
            <div className="mt-8 flex gap-2">
              {STEPS.map((s, i) => (
                <span
                  key={s.n}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    i === stepIndex ? "w-8 bg-cultiv-accent" : "w-4 bg-white/70"
                  }`}
                />
              ))}
            </div>
          </div>
        )}

        {inSteps && (
          <div className="absolute bottom-0 left-[19.1%] z-20 h-[57%] w-[26.2%]">
            <AnimatePresence mode="popLayout">
              <motion.div
                key={stepIndex}
                className="absolute bottom-0 left-0 h-full w-full"
                initial={{ opacity: 0, x: -120 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -120 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={activeStep.character} alt="" className="h-full w-full object-contain object-bottom" />
              </motion.div>
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* ---------- MOBILE: simple static stack, no scroll-jack ---------- */}
      <div className="relative flex w-full flex-col items-center gap-6 overflow-hidden bg-gradient-to-b from-[#EAFBEE] to-white px-6 pb-16 pt-20 md:hidden">
        <LeafRain count={6} />

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative z-10 text-center font-title text-[38px] leading-[1.1] text-cultiv-ink"
        >
          Sua vida financeira muito mais organizada com o Cultiv
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="relative z-10 text-center font-subtitle text-base text-cultiv-title"
        >
          Conecte seu banco e deixe o Cultiv organizar seu mundo financeiro automaticamente.
        </motion.p>
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          whileTap={{ y: 2 }}
          className="relative z-10 rounded-full bg-cultiv-mint px-8 py-3.5 font-display text-[15px] font-bold text-[#1e1e1e]"
          style={{ boxShadow: "-4px 5px 0px 0px black" }}
        >
          Teste por 7 dias grátis
        </motion.button>

        <div className="relative z-10 mt-4 w-[220px]">
          <PhoneChatMockup />
        </div>

        <div className="relative z-10 grid w-full max-w-md grid-cols-1 gap-3">
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
