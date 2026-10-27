"use client";

import Image from "next/image";
import { SIGNUP_URL } from "@/lib/links";

const NAV_LINKS = [
  { label: "Como funciona", href: "#como-funciona" },
  { label: "Plano", href: "#plano" },
  { label: "Perguntas frequentes", href: "#faq" },
];

// Fixed, floating on top of every section (not just the Hero) — a single
// pill nav for the whole page, instead of one that only lived inside the
// Hero's scroll-jacked chrome and faded away past it.
export function FloatingNav() {
  return (
    <div className="fixed inset-x-0 top-4 z-[100] px-4 md:top-6 md:px-6">
      <div className="mx-auto flex w-full max-w-4xl items-center justify-between rounded-full border border-black/5 bg-white px-4 py-2.5 shadow-[0_10px_30px_rgba(18,27,22,0.1)] md:px-5">
        <a href="#" className="relative h-[26px] w-[95px] shrink-0 md:h-[34px] md:w-[120px]">
          <Image src="/images/brand/logo escura.svg" alt="Cultiv" fill className="object-contain object-left" />
        </a>
        <nav className="hidden items-center gap-8 md:flex">
          {NAV_LINKS.map((l) => (
            <a key={l.label} href={l.href} className="font-display text-sm font-medium text-cultiv-title transition-colors hover:text-cultiv-ink">
              {l.label}
            </a>
          ))}
        </nav>
        <a href={SIGNUP_URL} className="rounded-full bg-cultiv-forest-dark px-5 py-2 font-display text-xs font-bold text-white transition-transform hover:scale-[1.03] active:scale-[0.98] md:px-6 md:py-2.5 md:text-sm">
          Cadastrar
        </a>
      </div>
    </div>
  );
}
