"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "framer-motion";
import { PhoneFrame } from "@/components/phone/PhoneFrame";
import { SignupScreen, OpenFinanceScreen, HomeScreen } from "./PhoneScreens";
import { ChatScreen } from "@/components/hero/PhoneChatMockup";
import { notifications } from "@/components/hero/notification-data";

const STEPS = [
  {
    n: "01",
    title: "Crie sua conta em segundos",
    desc: "Cadastro simples, confirmado direto pelo WhatsApp — sem burocracia.",
    Screen: SignupScreen,
  },
  {
    n: "02",
    title: "Conecte seu banco com segurança",
    desc: "Via Open Finance, sem senhas ou dados sensíveis compartilhados com a gente.",
    Screen: OpenFinanceScreen,
  },
  {
    n: "03",
    title: "Tudo aparece automaticamente",
    desc: "Ganhos, despesas, cartões - organizados sem você digitar nada.",
    Screen: HomeScreen,
  },
  {
    n: "04",
    title: "Pergunte, a Flora responde",
    desc: "Converse com a Flora e entenda seus gastos em segundos, quando quiser.",
    Screen: () => <ChatScreen inputOffset={92} />,
  },
];

const cardPos = [
  { left: "-8%", top: "6%" },
  { left: "72%", top: "14%" },
  { left: "-12%", top: "58%" },
  { left: "70%", top: "66%" },
];

export function StepsShowcase() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const [step, setStep] = useState(0);

  useMotionValueEvent(scrollYProgress, "change", (p) => {
    const idx = Math.min(STEPS.length - 1, Math.max(0, Math.floor(p * STEPS.length)));
    setStep((prev) => (prev !== idx ? idx : prev));
  });

  const active = STEPS[step];
  const Screen = active.Screen;

  return (
    <section ref={ref} className="relative bg-white" style={{ height: `${STEPS.length * 100}vh` }}>
      <div className="sticky top-0 flex h-screen w-full items-center overflow-hidden">
        <div className="mx-auto grid w-full max-w-6xl grid-cols-1 items-center gap-10 px-6 md:grid-cols-2 md:gap-16">
          <div className="order-2 md:order-1">
            <AnimatePresence mode="wait">
              <motion.div
                key={step}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{ duration: 0.4 }}
              >
                <p className="font-title text-[90px] font-bold leading-none text-cultiv-accent md:text-[120px]">
                  {active.n}
                </p>
                <h2 className="mt-2 font-title text-2xl font-bold text-cultiv-ink md:text-4xl">
                  {active.title}
                </h2>
                <p className="mt-4 max-w-md font-subtitle text-base text-cultiv-title md:text-lg">{active.desc}</p>
              </motion.div>
            </AnimatePresence>

            <div className="mt-8 flex gap-2">
              {STEPS.map((s, i) => (
                <span
                  key={s.n}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    i === step ? "w-8 bg-cultiv-accent" : "w-4 bg-gray-200"
                  }`}
                />
              ))}
            </div>
          </div>

          <div className="relative order-1 mx-auto w-[220px] sm:w-[260px] md:order-2 md:w-[300px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={step}
                initial={{ opacity: 0, scale: 0.94 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.35 }}
              >
                <PhoneFrame>
                  <Screen />
                </PhoneFrame>
              </motion.div>
            </AnimatePresence>

            {step === 2 && (
              <div className="pointer-events-none absolute inset-0 hidden lg:block">
                {notifications.slice(0, 4).map((n, i) => (
                  <motion.div
                    key={n.id}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.15 * i }}
                    className="absolute w-[190px] rounded-xl border border-cultiv-accent bg-white p-2 shadow-lg"
                    style={cardPos[i]}
                  >
                    <div className="flex items-center gap-2">
                      <div className="relative h-7 w-7 shrink-0 overflow-hidden rounded-full">
                        <Image src={n.icon} alt="" fill className="object-cover" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-baseline justify-between gap-1">
                          <p className="truncate font-sans text-[10px] font-bold text-cultiv-muted">{n.title}</p>
                          <p className="shrink-0 font-sans text-[10px] font-bold text-cultiv-muted">{n.value}</p>
                        </div>
                        <p className="truncate font-sans text-[9px] text-cultiv-muted">{n.date}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
