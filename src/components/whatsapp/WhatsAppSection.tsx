"use client";

import { motion } from "framer-motion";
import { PhoneFrame } from "@/components/phone/PhoneFrame";
import { WhatsAppScreen } from "./WhatsAppScreen";

export function WhatsAppSection() {
  return (
    <section className="mx-auto flex w-full max-w-6xl flex-col items-center gap-12 px-6 py-24 md:py-32">
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="mx-auto max-w-4xl text-center font-title text-2xl font-bold text-cultiv-ink md:text-[39px]"
      >
        Para sua comodidade, você também pode entender suas finanças, anotar gastos... tudo pelo whatsapp
      </motion.h2>
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.96 }}
        whileInView={{ opacity: 1, y: 0, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="w-[220px] sm:w-[260px]"
      >
        <PhoneFrame>
          <WhatsAppScreen />
        </PhoneFrame>
      </motion.div>
    </section>
  );
}
