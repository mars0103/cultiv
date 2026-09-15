"use client";

import Image from "next/image";
import { motion } from "framer-motion";

/** All positions are percentages relative to the 389x826 chat-screen design box. */
const pct = (px: number, basis: number) => `${((px / basis) * 100).toFixed(2)}%`;
const X = (px: number) => pct(px, 389);
const Y = (px: number) => pct(px, 826);
/** Font-size needs container-relative units (cqw), since % resolves against
 * the parent's font-size, not the box width. Requires container-type on the root. */
const FSX = (px: number) => `${((px / 389) * 100).toFixed(2)}cqw`;

export function ChatScreen({ inputOffset = 0 }: { inputOffset?: number } = {}) {
  return (
    <div
      className="relative h-full w-full overflow-hidden rounded-[12.34%] bg-[#f4f6f5] [container-type:inline-size]"
    >
      {/* header */}
      <div
        className="absolute overflow-hidden rounded-full bg-white"
        style={{ left: X(51), top: Y(74), width: X(48), height: Y(48) }}
      >
        <Image
          src="/images/hero/flora-avatar.png"
          alt="Flora"
          fill
          sizes="48px"
          className="scale-125 object-contain"
        />
      </div>
      <p
        className="absolute font-display font-bold leading-none text-[#282828]"
        style={{ left: X(106), top: Y(80), fontSize: FSX(18) }}
      >
        Flora
      </p>
      <p
        className="absolute font-display font-light leading-tight text-[#282828]"
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
        className="absolute overflow-hidden rounded-full bg-white shadow-sm"
        style={{ left: X(17), top: Y(82), width: X(29), height: Y(29) }}
      />
      <div
        className="absolute rounded-full"
        style={{ left: X(85), top: Y(114), width: X(8), height: Y(8), background: "#51d98a" }}
      />
      <div className="absolute bg-[#e3e7e5]" style={{ left: 0, top: Y(139), width: "100%", height: 1 }} />

      {/* flora response bubble */}
      <div
        className="absolute overflow-hidden rounded-full bg-white"
        style={{ left: X(28), top: Y(290), width: X(37.7), height: Y(37.7) }}
      >
        <Image
          src="/images/hero/flora-avatar.png"
          alt=""
          fill
          sizes="38px"
          className="scale-125 object-contain"
        />
      </div>
      <div
        className="absolute rounded-tl-[7%] rounded-tr-[7%] rounded-br-[7%] rounded-bl-[1.5%] bg-white shadow-sm"
        style={{ left: X(74.9), top: Y(239), width: X(243.9), height: Y(76) }}
      />
      <p
        className="absolute font-display leading-snug text-[#686868]"
        style={{ left: X(94), top: Y(247), width: X(194), fontSize: FSX(10) }}
      >
        Neste mês (setembro de 2026) você gastou um total de R$ 456,00. Está indo bem esse
        mês se precisar de mais alguma coisa, é só dizer 😊
      </p>

      {/* user message */}
      <div
        className="absolute rounded-tl-[7%] rounded-tr-[7%] rounded-bl-[7%] rounded-br-[1.5%]"
        style={{ left: X(175), top: Y(195), width: X(191.4), height: Y(32), background: "#0e3821" }}
      />
      <p
        className="absolute text-right font-display font-light leading-snug text-white"
        style={{ left: X(183.7), top: Y(204), width: X(175), fontSize: FSX(9.5) }}
      >
        Flora, quanto gastei esse mês?
      </p>

      {/* suggestion pills */}
      {[
        { left: 28, top: 391 + inputOffset, w: 108.5, label: "Resumo dos gastos" },
        { left: 141.3, top: 391 + inputOffset, w: 152.3, label: "Como estão minhas finanças?" },
        { left: 299.3, top: 391 + inputOffset, w: 121.9, label: "Qual meu saldo este mês?" },
      ].map((p) => (
        <div key={p.label} className="absolute" style={{ left: X(p.left), top: Y(p.top), width: X(p.w), height: Y(22) }}>
          <div className="h-full w-full rounded-full" style={{ background: "#51d98a" }} />
          <p
            className="absolute inset-0 flex items-center justify-center px-1 text-center font-display font-light leading-none text-[#252525]"
            style={{ fontSize: FSX(6.8) }}
          >
            {p.label}
          </p>
        </div>
      ))}

      {/* input bar */}
      <div
        className="absolute rounded-full bg-white"
        style={{ left: X(28), top: Y(424 + inputOffset), width: X(33), height: Y(33) }}
      >
        <p
          className="absolute inset-0 flex items-center justify-center font-display font-light text-[#686868]"
          style={{ fontSize: FSX(17) }}
        >
          +
        </p>
      </div>
      <div
        className="absolute rounded-full bg-white"
        style={{ left: X(76.2), top: Y(424 + inputOffset), width: X(236), height: Y(33) }}
      >
        <p
          className="absolute inset-0 flex items-center px-[6%] font-display font-light text-[#c7c7c7]"
          style={{ fontSize: FSX(10.5) }}
        >
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
