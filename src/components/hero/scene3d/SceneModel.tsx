"use client";

import { Suspense, useMemo } from "react";
import { useGLTF } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import type { MotionValue } from "framer-motion";
import * as THREE from "three";

// Same Blender(Z-up) -> glTF/Three(Y-up) mapping used on export: (x,y,z) -> (x,z,-y)
export const b2t = (x: number, y: number, z: number): [number, number, number] => [x, z, -y];

// Broad key light, high and to the left, slightly toward the camera (front)
// rather than directly overhead — matches the reference's soft top-left sun.
export const KEY_LIGHT_POS = b2t(-19, -5, 13);
export const FILL_LIGHT_POS = b2t(8, -12, 5);

function makeBumpTexture() {
  const size = 256;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d")!;
  const img = ctx.createImageData(size, size);
  // cheap value-noise: a handful of low-frequency sine layers, not per-pixel
  // random static — keeps it a soft undulation instead of visible grain.
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const u = x / size;
      const v = y / size;
      let n =
        Math.sin(u * 12.3 + v * 7.1) * 0.5 +
        Math.sin(u * 23.7 - v * 17.9 + 1.7) * 0.3 +
        Math.sin(u * 41.1 + v * 31.4 + 4.2) * 0.2;
      n = (n + 1) / 2; // 0..1
      const val = Math.round(n * 255);
      const idx = (y * size + x) * 4;
      img.data[idx] = val;
      img.data[idx + 1] = val;
      img.data[idx + 2] = val;
      img.data[idx + 3] = 255;
    }
  }
  ctx.putImageData(img, 0, 0);
  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(24, 24);
  tex.needsUpdate = true;
  return tex;
}

// Bank icon glyph (a small institution/columns silhouette) drawn straight
// onto a transparent canvas — used as the decal texture on each bank
// token's face plane, so the icon is real geometry-mapped content instead
// of a DOM overlay, and correctly foreshortens with the scene's perspective.
function makeBankIconTexture() {
  const size = 256;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d")!;
  ctx.fillStyle = "#5fa46c";
  const s = size / 24;
  ctx.beginPath();
  ctx.moveTo(12 * s, 3.5 * s);
  ctx.lineTo(3.2 * s, 9 * s);
  ctx.lineTo(20.8 * s, 9 * s);
  ctx.closePath();
  ctx.fill();
  const colX = [4.4, 8.5, 12.6, 16.7];
  for (const cx of colX) {
    ctx.fillRect(cx * s, 10 * s, 2.1 * s, 8.6 * s);
  }
  ctx.fillRect(3 * s, 19.4 * s, 18 * s, 2 * s);
  const tex = new THREE.CanvasTexture(canvas);
  tex.needsUpdate = true;
  return tex;
}

function makeLabelTexture(text: string) {
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 128;
  const ctx = canvas.getContext("2d")!;
  // The label plane's true front (per its Blender rotation) ends up facing
  // away from the camera, so DoubleSide shows its back — which mirrors the
  // texture horizontally. Pre-mirroring the draw cancels that out instead
  // of chasing the exact rotation math.
  ctx.translate(canvas.width, 0);
  ctx.scale(-1, 1);
  ctx.font = "800 74px Inter, sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  // white text with a soft dark outline reads clearly against the mint
  // pedestal (a flat dark-green fill nearly disappeared into it).
  ctx.lineWidth = 10;
  ctx.strokeStyle = "rgba(13,59,37,0.55)";
  ctx.strokeText(text, canvas.width / 2, canvas.height / 2 + 4);
  ctx.fillStyle = "#ffffff";
  ctx.fillText(text, canvas.width / 2, canvas.height / 2 + 4);
  const tex = new THREE.CanvasTexture(canvas);
  tex.needsUpdate = true;
  return tex;
}

const BANK_LABELS: Record<string, string> = {
  "01": "Conta 01",
  "02": "Conta 02",
  "03": "Conta 03",
};

function loadImage(src: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

// Same back-facing-plane quirk as the bank labels (see makeLabelTexture) —
// pre-mirror the bitmap so the phone bezel's notch/buttons land on the
// correct side once the plane's true front (facing away from camera) shows
// through.
async function makeMirroredTexture(src: string) {
  const img = await loadImage(src);
  const canvas = document.createElement("canvas");
  canvas.width = img.naturalWidth;
  canvas.height = img.naturalHeight;
  const ctx = canvas.getContext("2d")!;
  ctx.translate(canvas.width, 0);
  ctx.scale(-1, 1);
  ctx.drawImage(img, 0, 0);
  const tex = new THREE.CanvasTexture(canvas);
  tex.needsUpdate = true;
  return tex;
}

/** Fades the 3D phone bezel out as the hero's own DOM phone bezel fades in
 * (see Hero.tsx's domBezelOpacity) — timed to finish before progress 0.12,
 * when DissolveRig's camera fov starts widening for the dissolve. The
 * bezel's screen-lock only compensates for camera position, not fov, so the
 * crossfade has to be done before fov drifts or the two visibly separate. */
function PhoneBezelFade({ root, progress }: { root: THREE.Object3D; progress: MotionValue<number> }) {
  const material = useMemo<THREE.MeshStandardMaterial | null>(() => {
    let found: THREE.MeshStandardMaterial | null = null;
    root.traverse((obj) => {
      if (obj.name === "Phone3D_Bezel" && obj instanceof THREE.Mesh) {
        found = obj.material as THREE.MeshStandardMaterial;
      }
    });
    return found;
  }, [root]);

  useFrame(() => {
    if (!material) return;
    const p = progress.get();
    const fadeOut = Math.min(1, Math.max(0, (p - 0.05) / 0.07));
    material.opacity = 1 - fadeOut;
    material.visible = material.opacity > 0.01;
  });

  return null;
}

// A handful of small emissive markers sit along each ground wire (baked in
// Blender at fixed points). Rather than actually translate them each frame
// (which would need the wire's centerline, lost once glTF turns the curve
// into a solid tube), each marker's own emissive intensity is pulsed with a
// phase offset tied to its position along the path — several fixed points
// brightening in sequence reads as a slow light traveling the wire.
function PulseMarkers({ root }: { root: THREE.Object3D }) {
  const markers = useMemo(() => {
    const found: { mesh: THREE.Mesh; material: THREE.MeshStandardMaterial; phase: number }[] = [];
    root.traverse((obj) => {
      const match = obj.name.match(/^Pulse_Bank(\d+)_(\d+)$/);
      if (match && obj instanceof THREE.Mesh) {
        const bankPhase = parseInt(match[1], 10) * 0.6;
        const idxPhase = parseInt(match[2], 10) * 0.9;
        const material = new THREE.MeshStandardMaterial({
          color: "#e4ffd2",
          emissive: "#d6ffb8",
          emissiveIntensity: 0.4,
          roughness: 0.5,
        });
        obj.material = material;
        obj.castShadow = false;
        obj.receiveShadow = false;
        found.push({ mesh: obj, material, phase: bankPhase + idxPhase });
      }
    });
    return found;
  }, [root]);

  useFrame((state) => {
    const t = state.clock.getElapsedTime() * 0.6;
    for (const { material, phase } of markers) {
      const wave = Math.max(0, Math.sin(t - phase));
      material.emissiveIntensity = 0.25 + wave * wave * 1.3;
    }
  });

  return null;
}

// The terrain's Blender material drives its color via a procedural node graph
// (noise texture -> color ramp -> bump) that glTF's PBR export can't carry
// over, so it comes back flat/gray. Swap it for a hand-tuned equivalent —
// height-based vertex-color gradient (baked in Blender: light green ridges,
// forest green valleys) plus a very subtle bump — while keeping the tree
// materials (simple flat colors, already correct) exactly as exported.
function Model({ progress }: { progress: MotionValue<number> }) {
  const { scene } = useGLTF("/models/cenario-colinas.glb");
  const bumpTex = useMemo(() => makeBumpTexture(), []);
  const bankIconTex = useMemo(() => makeBankIconTexture(), []);

  // useGLTF caches and returns the SAME scene graph across every call site,
  // so the Hero canvas and the scroll-dissolve canvas would otherwise fight
  // over one Object3D — adding it as a <primitive> in the second Canvas
  // reparents it out of the first, leaving that scene empty. Each mount
  // needs its own independent clone.
  const localScene = useMemo(() => scene.clone(true), [scene]);

  useMemo(() => {
    localScene.traverse((obj) => {
      if (!(obj instanceof THREE.Mesh)) return;
      obj.castShadow = true;
      obj.receiveShadow = true;

      const name = obj.name;
      if (name.toLowerCase().includes("terreno")) {
        obj.material = new THREE.MeshStandardMaterial({
          vertexColors: true,
          roughness: 0.8,
          metalness: 0,
          bumpMap: bumpTex,
          bumpScale: 0.01,
        });
        return;
      }

      const bankFaceMatch = name.match(/^BankToken_(\d+)_Face$/);
      if (bankFaceMatch) {
        obj.material = new THREE.MeshBasicMaterial({ map: bankIconTex, transparent: true, side: THREE.DoubleSide });
        return;
      }

      const bankLabelMatch = name.match(/^BankToken_(\d+)_Label$/);
      if (bankLabelMatch) {
        const label = BANK_LABELS[bankLabelMatch[1]] ?? `Conta ${bankLabelMatch[1]}`;
        obj.material = new THREE.MeshBasicMaterial({
          map: makeLabelTexture(label),
          transparent: true,
          side: THREE.DoubleSide,
        });
        return;
      }

      if (name.startsWith("Pulse_")) return; // handled by PulseMarkers

      if (name === "Phone3D_Bezel") {
        const mat = new THREE.MeshStandardMaterial({
          color: "#0c0c0e",
          roughness: 0.35,
          transparent: true,
          opacity: 1,
          side: THREE.DoubleSide,
        });
        obj.material = mat;
        obj.renderOrder = 10;
        obj.castShadow = false;
        obj.receiveShadow = false;
        makeMirroredTexture("/images/hero/mockup-vazio.png").then((tex) => {
          mat.map = tex;
          mat.color.set("#ffffff");
          mat.needsUpdate = true;
        });
        return;
      }

      // "Open Finance" wires — force the glow client-side rather than trust
      // the glTF round-trip of Blender's emission strength. Low emission,
      // no shadow-casting (a thin bright line casting shadows on itself
      // reads as noisy, not glowing).
      if (name.startsWith("Wire_")) {
        obj.material = new THREE.MeshStandardMaterial({
          color: "#d8f5c0",
          emissive: "#cdf5ae",
          emissiveIntensity: 0.55,
          roughness: 0.55,
        });
        obj.castShadow = false;
      }
    });
  }, [localScene, bumpTex, bankIconTex]);

  return (
    <>
      <primitive object={localScene} />
      <PulseMarkers root={localScene} />
      <PhoneBezelFade root={localScene} progress={progress} />
    </>
  );
}

// The terrain mesh is only ~48x52 units — plenty for the front hero framing,
// but once the camera pulls up into the top-down "satellite" view its wide
// fov sees well past that footprint, exposing the mesh's straight edge as a
// hard-cut square against the sky. A large flat skirt at the same ground
// level (~y=0, sampled from the terrain's own perimeter vertices) fills
// everything beyond it with matching color, so it just fog-fades to white
// like the rest of the scene instead of cutting off.
function GroundExtension() {
  return (
    <mesh position={[0, -0.35, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
      <planeGeometry args={[800, 800]} />
      <meshStandardMaterial color="#5a9a5e" roughness={0.85} metalness={0} />
    </mesh>
  );
}

/** Preloaded GLB (terrain + trees), shared by the Hero canvas and the
 * scroll-driven dissolve canvas so both render identically at the handoff. */
export function SceneModel({ progress }: { progress: MotionValue<number> }) {
  return (
    <Suspense fallback={null}>
      <GroundExtension />
      <Model progress={progress} />
    </Suspense>
  );
}

export function SceneLights() {
  return (
    <>
      {/* moderate ambient fill — enough to keep shadow detail without
       * flattening the light/dark contrast that reads as volume */}
      <ambientLight intensity={0.24} color="#eafbe9" />
      <hemisphereLight args={["#d8f3d9", "#3f7a4d", 0.26]} />
      <directionalLight
        position={KEY_LIGHT_POS}
        intensity={2.4}
        color="#fff6df"
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-camera-left={-30}
        shadow-camera-right={30}
        shadow-camera-top={30}
        shadow-camera-bottom={-30}
        shadow-camera-near={1}
        shadow-camera-far={70}
        shadow-bias={-0.0004}
        shadow-normalBias={0.045}
        shadow-radius={4}
      />
      <directionalLight position={FILL_LIGHT_POS} intensity={0.2} color="#cfe8ff" />
    </>
  );
}

useGLTF.preload("/models/cenario-colinas.glb");
