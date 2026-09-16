"use client";

import { useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import type { MotionValue } from "framer-motion";
import * as THREE from "three";
import { SceneModel, SceneLights, b2t } from "./SceneModel";

export const CAMERA_POS = b2t(-2, -16, 1.6);
export const CAMERA_TARGET = new THREE.Vector3(...b2t(0, 10, 0.6));

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
        <SceneLights />
        <SceneModel />
        <ParallaxRig scrollYProgress={scrollYProgress} />
      </Canvas>
    </div>
  );
}
