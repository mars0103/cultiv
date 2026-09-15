"use client";

import Image from "next/image";
import { motion } from "framer-motion";

type Msg = { from: "flora" | "me"; text: string; time: string };

const MESSAGES: Msg[] = [
  { from: "flora", text: "Oi! Vi que você gastou R$ 45,00 no iFood hoje 🍔 Quer que eu anote como Alimentação?", time: "16:20" },
  { from: "me", text: "Sim, pode anotar!", time: "16:21" },
  { from: "flora", text: "Prontinho ✅ Esse mês você já gastou R$ 320,00 com alimentação.", time: "16:21" },
  { from: "me", text: "E como tá meu saldo?", time: "16:22" },
  { from: "flora", text: "Seu saldo atual é R$ 1.240,00 💰 Está indo bem esse mês!", time: "16:22" },
];

export function WhatsAppScreen() {
  return (
    <div className="flex h-full w-full flex-col overflow-hidden rounded-[10%] bg-[#e5ddd5]">
      {/* header */}
      <div className="flex items-center gap-3 bg-[#075e54] px-4 py-3">
        <span className="text-white/90">‹</span>
        <div className="relative h-9 w-9 shrink-0 overflow-hidden rounded-full bg-white">
          <Image src="/images/hero/flora-avatar.png" alt="Flora" fill className="scale-125 object-contain" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate font-display text-[13px] font-bold text-white">Flora</p>
          <p className="truncate font-display text-[9px] text-white/80">online</p>
        </div>
        <svg viewBox="0 0 24 24" fill="white" className="h-4 w-4 opacity-90">
          <path d="M17 10.5V7a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h12a1 1 0 001-1v-3.5l4 4v-11l-4 4z" />
        </svg>
      </div>

      {/* messages */}
      <div className="flex flex-1 flex-col gap-2 overflow-hidden px-3 py-3">
        {MESSAGES.map((m, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.4, delay: i * 0.15 }}
            className={`max-w-[80%] rounded-lg px-2.5 py-1.5 text-[10.5px] leading-snug shadow-sm ${
              m.from === "me" ? "self-end rounded-tr-none bg-[#dcf8c6] text-[#1f2c22]" : "self-start rounded-tl-none bg-white text-[#1f2c22]"
            }`}
          >
            {m.text}
            <span className="ml-2 float-right mt-1 text-[8px] text-black/40">{m.time}</span>
          </motion.div>
        ))}
      </div>

      {/* input bar */}
      <div className="flex items-center gap-2 bg-[#f0f0f0] px-3 py-2">
        <div className="flex-1 rounded-full bg-white px-3 py-1.5 text-[9.5px] text-[#9a9a9a]">Mensagem</div>
        <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#075e54]">
          <svg viewBox="0 0 24 24" fill="white" className="h-3 w-3">
            <path d="M3 11.5L21 3L13.5 21L11 13L3 11.5Z" />
          </svg>
        </div>
      </div>
    </div>
  );
}
