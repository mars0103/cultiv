"use client";

import { motion } from "framer-motion";

export type Feedback = { name: string; city: string; quote: string };

/**
 * One vertically auto-scrolling column of testimonial cards — the list is
 * duplicated once and the whole thing translates -50%, so the loop point is
 * invisible (the duplicate picks up exactly where the original left off).
 */
export function TestimonialsColumn({
  feedbacks,
  duration = 15,
  className = "",
}: {
  feedbacks: Feedback[];
  duration?: number;
  className?: string;
}) {
  return (
    <div className={className}>
      <motion.ul
        animate={{ translateY: "-50%" }}
        transition={{ duration, repeat: Infinity, ease: "linear" }}
        className="m-0 flex list-none flex-col gap-6 p-0 pb-6"
      >
        {[0, 1].map((dup) =>
          feedbacks.map((f, i) => (
            <motion.li
              key={`${dup}-${i}`}
              aria-hidden={dup === 1}
              tabIndex={dup === 1 ? -1 : 0}
              whileHover={{ scale: 1.03, y: -6, transition: { type: "spring", stiffness: 400, damping: 17 } }}
              className="w-full max-w-xs shrink-0 select-none rounded-[24px] border border-black/5 bg-white p-6 shadow-sm transition-shadow duration-300 hover:shadow-lg"
            >
              <blockquote className="m-0 flex flex-col gap-4 p-0">
                <div className="flex text-cultiv-accent">
                  {Array.from({ length: 5 }).map((_, s) => (
                    <svg key={s} viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
                      <path d="M10 1.5l2.6 5.6 6 .7-4.5 4.1 1.2 6-5.3-3-5.3 3 1.2-6L1.4 7.8l6-.7L10 1.5z" />
                    </svg>
                  ))}
                </div>
                <p className="font-subtitle text-sm leading-relaxed text-cultiv-muted">&ldquo;{f.quote}&rdquo;</p>
                <footer className="mt-auto flex items-center gap-3 pt-2">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-cultiv-forest-dark font-display text-sm font-bold text-cultiv-mint">
                    {f.name[0]}
                  </div>
                  <div>
                    <cite className="font-display text-sm font-bold not-italic text-cultiv-ink">{f.name}</cite>
                    <p className="text-xs text-cultiv-muted">{f.city}</p>
                  </div>
                </footer>
              </blockquote>
            </motion.li>
          ))
        )}
      </motion.ul>
    </div>
  );
}
