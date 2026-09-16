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
const KEY_LIGHT_POS = b2t(-21, 1, 7);
const FILL_LIGHT_POS = b2t(6, -14, 6);
// Must sit inside the camera's ~26deg-FOV frustum (checked against
// CAMERA_POS/CAMERA_TARGET) or the glow sprite never actually renders.
const SUN_POS: [number, number, number] = [-4, 5.6, -18];

function makeGlowTexture() {
  const size = 256;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d")!;
  const grad = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  grad.addColorStop(0, "rgba(255, 250, 235, 1)");
  grad.addColorStop(0.25, "rgba(255, 240, 200, 0.55)");
  grad.addColorStop(0.6, "rgba(255, 225, 170, 0.15)");
  grad.addColorStop(1, "rgba(255, 225, 170, 0)");
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, size, size);
  const tex = new THREE.CanvasTexture(canvas);
  tex.needsUpdate = true;
  return tex;
}

/** A soft sun glow + bright core, billboarded toward the camera. */
function SunGlow() {
  const glowTex = useMemo(() => makeGlowTexture(), []);
  return (
    <group position={SUN_POS}>
      <sprite scale={[26, 26, 1]}>
        <spriteMaterial
          map={glowTex}
          color="#fff3d6"
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          opacity={0.9}
        />
      </sprite>
      <sprite scale={[4.5, 4.5, 1]}>
        <spriteMaterial
          map={glowTex}
          color="#ffffff"
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          opacity={1}
        />
      </sprite>
    </group>
  );
}

// The terrain's Blender material drives its color via a procedural node graph
// (noise texture -> color ramp -> bump) that glTF's PBR export can't carry
// over, so it comes back flat/gray. Swap it for a hand-tuned equivalent while
// keeping the tree materials (simple flat colors) exactly as exported.
function Model() {
  const { scene } = useGLTF("/models/cenario-colinas.glb");

  useMemo(() => {
    scene.traverse((obj) => {
      if (!(obj instanceof THREE.Mesh)) return;
      obj.castShadow = true;
      obj.receiveShadow = true;
      if (obj.name.toLowerCase().includes("terreno")) {
        obj.material = new THREE.MeshStandardMaterial({
          color: "#79bd6e",
          roughness: 0.95,
          metalness: 0,
        });
      }
    });
  }, [scene]);

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
        <fog attach="fog" args={["#2f6b45", 18, 55]} />
        <ambientLight intensity={0.42} color="#dff5e6" />
        <hemisphereLight args={["#bfe9c9", "#0c3c2c", 0.42]} />
        <directionalLight position={KEY_LIGHT_POS} intensity={2.8} color="#ffd9a0" />
        <directionalLight position={FILL_LIGHT_POS} intensity={0.3} color="#d9f0ff" />
        <Suspense fallback={null}>
          <Model />
          <SunGlow />
        </Suspense>
        <ParallaxRig scrollYProgress={scrollYProgress} />
      </Canvas>
    </div>
  );
}

useGLTF.preload("/models/cenario-colinas.glb");
