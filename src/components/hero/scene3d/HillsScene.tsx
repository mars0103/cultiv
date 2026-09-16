"use client";

import { Suspense, useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import type { MotionValue } from "framer-motion";
import * as THREE from "three";

// Same Blender(Z-up) -> glTF/Three(Y-up) mapping used on export: (x,y,z) -> (x,z,-y)
const b2t = (x: number, y: number, z: number): [number, number, number] => [x, z, -y];

const CAMERA_POS = b2t(-2, -16, 1.6);
const CAMERA_TARGET = new THREE.Vector3(...b2t(0, 10, 0.6));
// Broad key light, high and to the left, slightly toward the camera (front)
// rather than directly overhead — matches the reference's soft top-left sun.
const KEY_LIGHT_POS = b2t(-19, -5, 13);
const FILL_LIGHT_POS = b2t(8, -12, 5);

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

  useMemo(() => {
    scene.traverse((obj) => {
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
  }, [scene, bumpTex]);

  return <primitive object={scene} />;
}

function ParallaxRig({ scrollYProgress }: { scrollYProgress: MotionValue<number> }) {
  const { camera } = useThree();
  const t = useRef(0);
  const mouse = useRef({ x: 0, y: 0 });

  useFrame((state) => {
    t.current += state.clock.getDelta();
    const p = scrollYProgress.get();

    // gentle idle drift so the scene never feels static, plus a real
    // scroll-driven parallax (camera rises/pulls back as you scroll past hero)
    const idleX = Math.sin(t.current * 0.15) * 0.15;
    const idleY = Math.cos(t.current * 0.18) * 0.06;

    mouse.current.x += (state.pointer.x - mouse.current.x) * 0.02;
    mouse.current.y += (state.pointer.y - mouse.current.y) * 0.02;

    camera.position.set(
      CAMERA_POS[0] + idleX + mouse.current.x * 0.4,
      CAMERA_POS[1] + idleY + p * 3.6 + mouse.current.y * 0.15,
      CAMERA_POS[2] + p * 7.5
    );
    camera.lookAt(CAMERA_TARGET);
  });

  return null;
}

export function HillsScene({
  scrollYProgress,
  className = "",
}: {
  scrollYProgress: MotionValue<number>;
  className?: string;
}) {
  return (
    <div className={className}>
      <Canvas
        gl={{ alpha: true, antialias: true }}
        camera={{ position: CAMERA_POS, fov: 26, near: 0.5, far: 120 }}
        dpr={[1, 1.75]}
      >
        <fog attach="fog" args={["#bfe6c4", 22, 58]} />
        {/* moderate ambient fill — enough to keep shadow detail without
         * flattening the light/dark contrast that reads as volume */}
        <ambientLight intensity={0.32} color="#eafbe9" />
        <hemisphereLight args={["#d8f3d9", "#3f7a4d", 0.3]} />
        <directionalLight position={KEY_LIGHT_POS} intensity={2.1} color="#fff6df" />
        <directionalLight position={FILL_LIGHT_POS} intensity={0.22} color="#cfe8ff" />
        <Suspense fallback={null}>
          <Model />
        </Suspense>
        <ParallaxRig scrollYProgress={scrollYProgress} />
      </Canvas>
    </div>
  );
}

useGLTF.preload("/models/cenario-colinas.glb");
