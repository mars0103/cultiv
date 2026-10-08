import type { ReactNode } from "react";
import { motion, type MotionValue } from "framer-motion";

/**
 * Shared sky-gradient + mountain backdrop reused across Hero, Steps and
 * WhatsApp sections in the Figma redesign — all three reuse the exact same
 * "montanhas" SVG and sky gradient, just cropped/positioned differently.
 */
// The "montanhas" SVG's own viewBox has a few percent of empty transparent
// margin below the actual mountain shapes (it wasn't cropped tight in
// Figma's export) — anchoring the image at bottom:0% put that gap right at
// the section edge, showing the sky gradient through as a thin light bar.
// Shifting it down hides that margin below the fold instead.
const MOUNTAIN_BOTTOM_OFFSET = "-4%";

export function MountainSky({
  children,
  behindMountain,
  mountainBottom = MOUNTAIN_BOTTOM_OFFSET,
  mountainOpacity = 1,
  className = "",
}: {
  children?: ReactNode;
  /** Rendered BEFORE the mountain image, so it paints underneath/behind it
   * (e.g. the WhatsApp badge peeking out from behind the hills) — `children`
   * paints in front instead, for things like the leaf rain. */
  behindMountain?: ReactNode;
  /** Shifts the mountain image up/down — a plain string for a static crop,
   * or a MotionValue to tie it to scroll progress (e.g. the mountain
   * receding a bit as Hero swaps into the Steps layout). */
  mountainBottom?: string | MotionValue<string>;
  mountainOpacity?: number;
  className?: string;
}) {
  return (
    <div
      className={`absolute inset-0 overflow-hidden ${className}`}
      style={{ background: "linear-gradient(180deg, #D9FFDD 0%, #FFFFF3 78%)" }}
    >
      {behindMountain}
      <motion.img
        src="/images/decor/montanhas.svg"
        alt=""
        className="absolute left-1/2 w-[110%] max-w-none -translate-x-1/2"
        style={{ bottom: mountainBottom, opacity: mountainOpacity }}
      />
      {children}
    </div>
  );
}
