import { createNoise3D } from "simplex-noise";

// Ported 1:1 from the Blender scene's parameters (criar_cenario.py) so the
// real-time hero terrain matches the offline 3D render we built for Cultiv.
export const SEED = 42;

export const HILLS = [
  { cx: -7.5, cy: 2.5, rx: 10.5, ry: 7.5, height: 2.5, rot: 14 },
  { cx: 1.0, cy: 1.0, rx: 9.5, ry: 4.5, height: -1.35, rot: -8 },
  { cx: -4.0, cy: 10.5, rx: 7.5, ry: 6.5, height: 3.7, rot: 18 },
  { cx: 8.5, cy: 7.0, rx: 12.5, ry: 6.5, height: 2.65, rot: -9 },
  { cx: -1.0, cy: 17.0, rx: 5.5, ry: 4.0, height: 1.55, rot: 6 },
  { cx: 3.8, cy: 19.0, rx: 4.5, ry: 3.5, height: 1.25, rot: -14 },
  { cx: -3.7, cy: 20.5, rx: 4.2, ry: 3.2, height: 1.4, rot: 11 },
];

const EDGE_NOISE = 0.35;
const MICRO_NOISE = 0.05;

const noise3D = createNoise3D(() => SEED / 100);
// Blender's mathutils.noise.noise() returns 0..1; simplex-noise returns -1..1.
const noise01 = (x: number, y: number, z: number) => (noise3D(x, y, z) + 1) / 2;

function smoothstep(t: number) {
  const c = Math.min(1, Math.max(0, t));
  return c * c * (3 - 2 * c);
}

/** Height field in Blender/world XY space (x, y are the "ground plane" axes). */
export function hillHeight(x: number, y: number): number {
  let z = 0;
  for (const h of HILLS) {
    const ang = (h.rot * Math.PI) / 180;
    const dx = x - h.cx;
    const dy = y - h.cy;
    const rx = dx * Math.cos(ang) + dy * Math.sin(ang);
    const ry = -dx * Math.sin(ang) + dy * Math.cos(ang);
    const d = Math.sqrt((rx / h.rx) ** 2 + (ry / h.ry) ** 2);
    z += smoothstep(1 - d) * h.height;
  }
  const edgeN = (noise01(x * 0.1, y * 0.1, SEED * 0.13) - 0.5) * EDGE_NOISE;
  const microN = (noise01(x * 0.55, y * 0.55, SEED * 0.07 + 5.0) - 0.5) * MICRO_NOISE;
  return z + edgeN * smoothstep(Math.abs(z) / 1.5) + microN;
}

/** Blender is Z-up with "into the scene" = +Y. Three.js is Y-up, camera looks
 * down -Z by default, so we map blender(x, y, z) -> three(x, z, -y). */
export function blenderToThree(x: number, y: number, z: number): [number, number, number] {
  return [x, z, -y];
}
