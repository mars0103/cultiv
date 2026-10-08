// Shared entrance-animation language for the whole site: one easing curve,
// one set of durations/distances, so every section's "reveal" reads as the
// same choreography instead of a pile of one-off transitions.
export const EASE_OUT = [0.16, 1, 0.3, 1] as const;

export const VIEWPORT_ONCE = { once: true, margin: "-80px" } as const;

export function fadeUp(distance = 22, duration = 0.6, delay = 0) {
  return {
    initial: { opacity: 0, y: distance },
    whileInView: { opacity: 1, y: 0 },
    viewport: VIEWPORT_ONCE,
    transition: { duration, delay, ease: EASE_OUT },
  };
}

export function scaleReveal(duration = 0.7, delay = 0) {
  return {
    initial: { opacity: 0, scale: 1.04 },
    whileInView: { opacity: 1, scale: 1 },
    viewport: VIEWPORT_ONCE,
    transition: { duration, delay, ease: EASE_OUT },
  };
}

// Card-grid stagger: ~70ms per item, capped so large grids don't take
// forever to finish appearing.
export function staggerDelay(index: number, step = 0.07, cap = 0.42) {
  return Math.min(index * step, cap);
}
