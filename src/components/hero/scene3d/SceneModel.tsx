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

// The terrain's Blender material drives its color via a procedural node graph
// (noise texture -> color ramp -> bump) that glTF's PBR export can't carry
// over, so it comes back flat/gray. Swap it for a hand-tuned equivalent —
// soft toon green with a very subtle bump — while keeping the tree
// materials (simple flat colors, already correct) exactly as exported.
function Model() {
  const { scene } = useGLTF("/models/cenario-colinas.glb");
  const bumpTex = useMemo(() => makeBumpTexture(), []);

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
      if (obj.name.toLowerCase().includes("terreno")) {
        obj.material = new THREE.MeshStandardMaterial({
          color: "#6dbb73",
          roughness: 0.92,
          metalness: 0,
          bumpMap: bumpTex,
          bumpScale: 0.012,
        });
      }
    });
  }, [localScene, bumpTex]);

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
