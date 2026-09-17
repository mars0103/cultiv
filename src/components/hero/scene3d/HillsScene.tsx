"use client";

import { useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import type { MotionValue } from "framer-motion";
import * as THREE from "three";
import { SceneModel, SceneLights, b2t } from "./SceneModel";

export const CAMERA_POS = b2t(-2, -16, 1.6);
export const CAMERA_TARGET = new THREE.Vector3(...b2t(0, 10, 0.6));

// End of the dissolve: camera pulls straight up into a top-down "satellite"
// view, pulled back far enough (with a wide fov) that the hills read as a
// small patch about to disappear into fog/white.
const END_POS: [number, number, number] = [0, 46, 8];
const END_TARGET = new THREE.Vector3(0, 0, 6);
const START_FOG_COLOR = new THREE.Color("#bfe6c4");
const END_FOG_COLOR = new THREE.Color("#ffffff");

/**
 * Drives the whole Hero-to-steps handoff from a single scroll progress value
 * (0 = resting hero, 1 = fully dissolved to white): a gentle time-based idle
 * drift while at rest, then the camera lerps up into the satellite view as
 * the surrounding hero copy fades away (see Hero.tsx), fog and fov lerping
 * along with it so it reads as one continuous camera move.
 *
 * There's no mouse/hover-driven parallax here — it made the camera rotate to
 * keep looking at a fixed target as its position shifted with the pointer,
 * which read as distracting. The idle drift is purely clock-driven.
 */
function DissolveRig({ progress }: { progress: MotionValue<number> }) {
  const { camera, scene } = useThree();
  const t = useRef(0);
  const pos = useRef(new THREE.Vector3());
  const target = useRef(new THREE.Vector3());

  useFrame((state) => {
    t.current += state.clock.getDelta();
    const p = progress.get();
    // The dissolve itself only starts once the hero copy begins fading
    // (matches Hero.tsx's contentOpacity range) so scrolling the first bit
    // just settles the idle drift instead of immediately moving.
    const raw = Math.min(1, Math.max(0, (p - 0.12) / 0.88));
    const ease = raw * raw * (3 - 2 * raw); // smoothstep
    const idleAmount = 1 - ease;

    const idleX = Math.sin(t.current * 0.15) * 0.15 * idleAmount;
    const idleY = Math.cos(t.current * 0.18) * 0.06 * idleAmount;

    pos.current.set(
      THREE.MathUtils.lerp(CAMERA_POS[0], END_POS[0], ease) + idleX,
      THREE.MathUtils.lerp(CAMERA_POS[1], END_POS[1], ease) + idleY,
      THREE.MathUtils.lerp(CAMERA_POS[2], END_POS[2], ease)
    );
    target.current.lerpVectors(CAMERA_TARGET, END_TARGET, ease);
    camera.position.copy(pos.current);
    camera.lookAt(target.current);

    const cam = camera as THREE.PerspectiveCamera;
    cam.fov = THREE.MathUtils.lerp(26, 62, ease);
    cam.updateProjectionMatrix();

    if (scene.fog instanceof THREE.Fog) {
      scene.fog.color.copy(START_FOG_COLOR).lerp(END_FOG_COLOR, ease);
      scene.fog.near = THREE.MathUtils.lerp(22, 3, ease);
      scene.fog.far = THREE.MathUtils.lerp(58, 22, ease);
    }
  });

  return null;
}

export function HillsScene({
  progress,
  className = "",
}: {
  progress: MotionValue<number>;
  className?: string;
}) {
  return (
    <div className={className}>
      <Canvas
        gl={{ alpha: true, antialias: true }}
        dpr={[1, 1.75]}
        shadows="soft"
        camera={{ position: CAMERA_POS, fov: 26, near: 0.5, far: 140 }}
      >
        <fog attach="fog" args={["#bfe6c4", 22, 58]} />
        <SceneLights />
        <SceneModel />
        <DissolveRig progress={progress} />
      </Canvas>
    </div>
  );
}
