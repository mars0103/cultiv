"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

/** All positions are percentages relative to the 389x826 chat-screen design box
 * (matches the Figma "TELA CHAT" frame 1:1). */
const pct = (px: number, basis: number) => `${((px / basis) * 100).toFixed(3)}%`;
const X = (px: number) => pct(px, 389);
const Y = (px: number) => pct(px, 826);
/** Font-size needs container-relative units (cqw), since % resolves against
 * the parent's font-size, not the box width. Requires container-type on the root. */
const FSX = (px: number) => `${((px / 389) * 100).toFixed(3)}cqw`;

type Exchange = { q: string; a: string };

const SCRIPT: Exchange[] = [
  {
    q: "Flora, quanto gastei esse mês?",
    a: "Neste mês (setembro de 2026) você gastou um total de R$ 456,00. Está indo bem esse mês, se precisar de mais alguma coisa é só dizer 😊",
  },
  {
    q: "Resumo dos gastos",
    a: "Alimentação R$ 180, Transporte R$ 95, Compras R$ 140 — no total, R$ 415 esse mês 📊",
  },
  {
    q: "Como estão minhas finanças?",
    a: "Estão indo bem! Você guardou 24% da sua renda esse mês 🌱",
  },
  {
    q: "Qual meu saldo este mês?",
    a: "Seu saldo atual é R$ 1.240,00 💰",
  },
];

const BUBBLE_RADIUS = FSX(16);
const BUBBLE_TAIL = FSX(5);
const bubbleRadius = (tailCorner: "bl" | "br") =>
  tailCorner === "bl"
    ? `${BUBBLE_RADIUS} ${BUBBLE_RADIUS} ${BUBBLE_RADIUS} ${BUBBLE_TAIL}`
    : `${BUBBLE_RADIUS} ${BUBBLE_RADIUS} ${BUBBLE_TAIL} ${BUBBLE_RADIUS}`;

const QUESTION_HOLD = 900;
const TYPING_HOLD = 1500;
const ANSWER_HOLD = 3800;

function useConversation() {
  const [round, setRound] = useState(0);
  const [phase, setPhase] = useState<"question" | "typing" | "answer">("question");

  useEffect(() => {
    const delay = phase === "question" ? QUESTION_HOLD : phase === "typing" ? TYPING_HOLD : ANSWER_HOLD;
    const id = window.setTimeout(() => {
      if (phase === "question") setPhase("typing");
      else if (phase === "typing") setPhase("answer");
      else {
        setRound((r) => (r + 1) % SCRIPT.length);
        setPhase("question");
      }
    }, delay);
    return () => window.clearTimeout(id);
  }, [phase, round]);

  return { exchange: SCRIPT[round], phase, round };
}

function TypingDots() {
  return (
    <div className="flex h-full items-center gap-[6%] px-[8%]">
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="rounded-full bg-[#a9b3ae]"
          style={{ width: FSX(8), height: FSX(8) }}
          animate={{ opacity: [0.3, 1, 0.3], y: [0, -4, 0] }}
          transition={{ duration: 0.9, repeat: Infinity, delay: i * 0.15, ease: "easeInOut" }}
        />
      ))}
    </div>
  );
}

export function ChatScreen({ inputOffset = 0 }: { inputOffset?: number } = {}) {
  const { exchange, phase, round } = useConversation();

  return (
    <div className="relative h-full w-full overflow-hidden rounded-[12.34%] bg-[#f4f6f5] [container-type:inline-size]">
      {/* header */}
      <div
        className="absolute overflow-hidden rounded-full bg-white"
        style={{ left: X(51), top: Y(74), width: X(48), height: Y(48) }}
      >
        <Image src="/images/hero/flora-avatar.png" alt="Flora" fill sizes="48px" className="scale-90 object-contain" />
      </div>
      <p
        className="absolute font-display font-bold leading-none text-[#282828]"
        style={{ left: X(106), top: Y(80), fontSize: FSX(18) }}
      >
        Flora
      </p>
      <p
        className="absolute font-subtitle font-normal leading-tight text-[#282828]"
        style={{ left: X(106), top: Y(102), width: X(199), fontSize: FSX(10) }}
      >
        Vê seus dados até hoje, 16:31
      </p>
      {[321, 327, 333].map((l) => (
        <span
          key={l}
          className="absolute rounded-full bg-[#282828]"
          style={{ left: X(l), top: Y(89), width: X(3), height: Y(3) }}
        />
      ))}
      <div
        className="absolute flex items-center justify-center overflow-hidden rounded-full bg-white shadow-sm"
        style={{ left: X(17), top: Y(82), width: X(29), height: Y(29) }}
      >
        <Image
          src="/images/hero/chevron-back.svg"
          alt=""
          width={6}
          height={10}
          className="-scale-x-100"
          style={{ width: FSX(4.7), height: "auto" }}
        />
      </div>
      <div
        className="absolute rounded-full"
        style={{ left: X(85), top: Y(114), width: X(8), height: Y(8), background: "#51d98a" }}
      />
      <div className="absolute bg-[#e3e7e5]" style={{ left: 0, top: Y(139), width: "100%", height: 1 }} />

      {/* Flora avatar next to the reply slot */}
      <div
        className="absolute overflow-hidden rounded-full bg-white"
        style={{ left: X(28), top: Y(290), width: X(37.7), height: Y(37.7) }}
      >
        <Image src="/images/hero/flora-avatar.png" alt="" fill sizes="38px" className="scale-90 object-contain" />
      </div>

      {/* reply slot: typing indicator <-> answer bubble */}
      <div className="absolute" style={{ left: X(74.9), top: Y(225), width: X(280), minHeight: Y(90) }}>
        <AnimatePresence mode="wait">
          {phase === "typing" ? (
            <motion.div
              key="typing"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.25 }}
              className="bg-white shadow-sm"
              style={{ width: X(84), height: Y(62), borderRadius: bubbleRadius("bl") }}
            >
              <TypingDots />
            </motion.div>
          ) : phase === "answer" ? (
            <motion.div
              key={`answer-${round}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-white p-0 shadow-sm"
              style={{
                width: X(268),
                borderRadius: bubbleRadius("bl"),
                paddingTop: Y(16),
                paddingBottom: Y(16),
                paddingLeft: X(18),
                paddingRight: X(18),
              }}
            >
              <p className="font-subtitle leading-snug text-[#686868]" style={{ fontSize: FSX(13) }}>
                {exchange.a}
              </p>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>

      {/* user question bubble */}
      <div className="absolute" style={{ left: X(70), top: Y(180), width: X(296) }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={`q-${round}`}
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="ml-auto w-fit max-w-full bg-[#0e3821]"
            style={{
              borderRadius: bubbleRadius("br"),
              paddingTop: Y(15),
              paddingBottom: Y(15),
              paddingLeft: X(20),
              paddingRight: X(20),
            }}
          >
            <p
              className="text-right font-subtitle leading-snug text-white"
              style={{ fontSize: FSX(12.5) }}
            >
              {exchange.q}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* suggestion pills — auto-scrolling carousel, so labels stay full size */}
      <div
        className="absolute overflow-hidden"
        style={{
          left: X(26),
          top: Y(370 + inputOffset),
          width: X(337),
          height: Y(48),
          maskImage: "linear-gradient(to right, black 92%, transparent 100%)",
        }}
      >
        <motion.div
          className="flex items-center"
          style={{ width: "max-content", gap: X(12) }}
          animate={{ x: ["0%", "-50%"] }}
          transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
        >
          {[...SCRIPT.slice(1), ...SCRIPT.slice(1)].map((ex, i) => (
            <div
              key={i}
              className="flex shrink-0 items-center justify-center whitespace-nowrap rounded-full"
              style={{ background: "#51d98a", height: Y(48), paddingLeft: X(18), paddingRight: X(18) }}
            >
              <p className="font-display font-light leading-none text-[#252525]" style={{ fontSize: FSX(10) }}>
                {ex.q}
              </p>
            </div>
          ))}
        </motion.div>
      </div>

      {/* input bar */}
      <div
        className="absolute flex items-center justify-center rounded-full bg-white"
        style={{ left: X(28), top: Y(424 + inputOffset), width: X(33), height: Y(33) }}
      >
        <p className="font-display font-light text-[#686868]" style={{ fontSize: FSX(17) }}>
          +
        </p>
      </div>
      <div
        className="absolute flex items-center rounded-full bg-white"
        style={{ left: X(76.2), top: Y(424 + inputOffset), width: X(236), height: Y(33), paddingLeft: X(14) }}
      >
        <p className="font-subtitle text-[#c7c7c7]" style={{ fontSize: FSX(10.5) }}>
          Pergunte à flora...
        </p>
      </div>
      <div
        className="absolute flex items-center justify-center rounded-full"
        style={{ left: X(327.5), top: Y(424 + inputOffset), width: X(33), height: Y(33), background: "#0e3821" }}
      >
        <svg viewBox="0 0 24 24" fill="none" style={{ width: "45%", height: "45%" }}>
          <path d="M3 11.5L21 3L13.5 21L11 13L3 11.5Z" fill="white" />
        </svg>
      </div>
    </div>
  );
}

export function PhoneChatMockup({ className = "" }: { className?: string }) {
  return (
    <div className={`relative w-full ${className}`} style={{ aspectRatio: "445.488 / 972.675" }}>
      <motion.div
        className="absolute overflow-hidden"
        style={{ left: "6.5%", top: "14.2%", width: "87.3%", height: "84.9%" }}
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.7, delay: 0.5, ease: "easeOut" }}
      >
        <ChatScreen />
      </motion.div>
      <Image
        src="/images/hero/mockup-vazio.png"
        alt=""
        fill
        priority
        sizes="(min-width: 1024px) 30vw, 60vw"
        className="pointer-events-none select-none object-contain"
      />
    </div>
  );
}
