"use client";

import { Suspense, useMemo } from "react";
import { useGLTF } from "@react-three/drei";
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
  ctx.fillStyle = "#4c5c52";
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

function loadImage(src: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

// Matches the 2D NotificationCard's layout (icon circle + title/value on
// one line, date beneath) baked into a single decal texture instead of a
// DOM element, so it sits as real, perspective-correct content on the 3D
// card mesh's face.
async function makeNotifTexture(icon: string, title: string, value: string, date: string) {
  const w = 630, h = 136;
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d")!;
  const img = await loadImage(icon).catch(() => null);

  const cy = h / 2;
  const r = 44;
  const cx = r + 14;
  if (img) {
    ctx.save();
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.clip();
    ctx.drawImage(img, cx - r, cy - r, r * 2, r * 2);
    ctx.restore();
  }

  const textX = cx + r + 26;
  ctx.textBaseline = "alphabetic";
  ctx.fillStyle = "#526059";
  ctx.font = "700 34px Inter, sans-serif";
  ctx.textAlign = "left";
  ctx.fillText(title, textX, cy - 4);
  ctx.textAlign = "right";
  ctx.fillText(value, w - 24, cy - 4);
  ctx.font = "400 28px Inter, sans-serif";
  ctx.textAlign = "left";
  ctx.fillText(date, textX, cy + 34);

  const tex = new THREE.CanvasTexture(canvas);
  tex.needsUpdate = true;
  return tex;
}

const BANK_LABELS: Record<string, string> = {
  "01": "Conta 01",
  "02": "Conta 02",
  "03": "Conta 03",
};

const NOTIF_CONTENT: Record<string, { icon: string; title: string; value: string; date: string }> = {
  Alimentacao: { icon: "/images/hero/ellipse-ifood.png", title: "Alimentação", value: "R$ 58,00", date: "10 de setembro" },
  Transporte: { icon: "/images/hero/ellipse-uber.png", title: "Transporte", value: "R$ 23,00", date: "16 de setembro" },
};

// The terrain's Blender material drives its color via a procedural node graph
// (noise texture -> color ramp -> bump) that glTF's PBR export can't carry
// over, so it comes back flat/gray. Swap it for a hand-tuned equivalent —
// soft toon green with a very subtle bump — while keeping the tree
// materials (simple flat colors, already correct) exactly as exported.
function Model() {
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
          color: "#6dbb73",
          roughness: 0.92,
          metalness: 0,
          bumpMap: bumpTex,
          bumpScale: 0.012,
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

      const notifFaceMatch = name.match(/^NotifCard_(\w+)_Face$/);
      if (notifFaceMatch) {
        const content = NOTIF_CONTENT[notifFaceMatch[1]];
        if (content) {
          const mat = new THREE.MeshBasicMaterial({ transparent: true, side: THREE.DoubleSide });
          obj.material = mat;
          makeNotifTexture(content.icon, content.title, content.value, content.date).then((tex) => {
            mat.map = tex;
            mat.needsUpdate = true;
          });
        }
        return;
      }

      // "Open Finance" wires — force the glow client-side rather than trust
      // the glTF round-trip of Blender's emission strength.
      if (name.startsWith("Wire_")) {
        obj.material = new THREE.MeshStandardMaterial({
          color: "#eafcd0",
          emissive: "#daffb0",
          emissiveIntensity: 2.2,
          roughness: 0.4,
        });
      }
    });
  }, [localScene, bumpTex, bankIconTex]);

  return <primitive object={localScene} />;
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
    <mesh position={[0, -0.05, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
      <planeGeometry args={[800, 800]} />
      <meshStandardMaterial color="#6dbb73" roughness={0.92} metalness={0} />
    </mesh>
  );
}

/** Preloaded GLB (terrain + trees), shared by the Hero canvas and the
 * scroll-driven dissolve canvas so both render identically at the handoff. */
export function SceneModel() {
  return (
    <Suspense fallback={null}>
      <GroundExtension />
      <Model />
    </Suspense>
  );
}

export function SceneLights() {
  return (
    <>
      {/* moderate ambient fill — enough to keep shadow detail without
       * flattening the light/dark contrast that reads as volume */}
      <ambientLight intensity={0.32} color="#eafbe9" />
      <hemisphereLight args={["#d8f3d9", "#3f7a4d", 0.3]} />
      <directionalLight position={KEY_LIGHT_POS} intensity={2.1} color="#fff6df" />
      <directionalLight position={FILL_LIGHT_POS} intensity={0.22} color="#cfe8ff" />
    </>
  );
}

useGLTF.preload("/models/cenario-colinas.glb");
