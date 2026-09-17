"use client";

import { useMemo, useRef, useState } from "react";
import type { RefObject } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { PerspectiveCamera } from "@react-three/drei";
import type { MotionValue } from "framer-motion";
import * as THREE from "three";
import { SceneModel, SceneLights, PhoneBezelFade, b2t } from "./SceneModel";

export const CAMERA_POS = b2t(-2, -16, 1.6);
export const CAMERA_TARGET = new THREE.Vector3(...b2t(0, 10, 0.6));

// End of the dissolve: camera pulls straight up into a top-down "satellite"
// view, pulled back far enough (with a wide fov) that the hills read as a
// small patch about to disappear into fog/white.
const END_POS: [number, number, number] = [0, 46, 8];
const END_TARGET = new THREE.Vector3(0, 0, 6);
const START_FOG_COLOR = new THREE.Color("#bfe6c4");
const END_FOG_COLOR = new THREE.Color("#ffffff");

const BEZEL_DEPTH = 5;

/** Keeps the 3D phone bezel projected exactly onto the real DOM phone
 * element's rect, at any viewport size/layout state, by reading its actual
 * getBoundingClientRect() every frame instead of re-deriving it from
 * hardcoded box-letterboxing fractions. Those fractions had to independently
 * match Hero.tsx's own CSS/JS-computed phone rect and drifted out of sync
 * with it (visible as the bezel only "snapping" into place once a scroll
 * swapped it out for the flat DOM bezel) — reading the live rect directly
 * makes that whole class of bug impossible. */
function PhoneBezelTransform({
  bezel,
  phoneRef,
}: {
  bezel: THREE.Object3D;
  phoneRef: RefObject<HTMLDivElement | null>;
}) {
  const { camera, gl } = useThree();

  const nativeWidth = useMemo(() => {
    const mesh = bezel as THREE.Mesh;
    if (!mesh.geometry.boundingBox) mesh.geometry.computeBoundingBox();
    const box = mesh.geometry.boundingBox!;
    return box.max.x - box.min.x;
  }, [bezel]);

  useFrame(() => {
    const phoneEl = phoneRef.current;
    if (!phoneEl) return;
    const canvasRect = gl.domElement.getBoundingClientRect();
    if (canvasRect.width === 0 || canvasRect.height === 0) return;
    const phoneRect = phoneEl.getBoundingClientRect();

    const pixelCenterX = phoneRect.left + phoneRect.width / 2 - canvasRect.left;
    const pixelCenterY = phoneRect.top + phoneRect.height / 2 - canvasRect.top;

    const ndcX = (pixelCenterX / canvasRect.width) * 2 - 1;
    const ndcY = 1 - (pixelCenterY / canvasRect.height) * 2;
    const widthFracOfViewport = phoneRect.width / canvasRect.width;

    const cam = camera as THREE.PerspectiveCamera;
    const vFovRad = (cam.fov * Math.PI) / 180;
    const visibleHeightAtDepth = 2 * BEZEL_DEPTH * Math.tan(vFovRad / 2);
    const visibleWidthAtDepth = visibleHeightAtDepth * cam.aspect;

    bezel.position.set(ndcX * (visibleWidthAtDepth / 2), ndcY * (visibleHeightAtDepth / 2), -BEZEL_DEPTH);
    bezel.scale.setScalar((widthFracOfViewport * visibleWidthAtDepth) / nativeWidth);
  });

  return null;
}

/**
 * Drives the whole Hero-to-steps handoff from a single scroll progress value
 * (0 = resting hero, 1 = fully dissolved to white): a gentle time-based idle
 * drift while at rest, then the camera lerps up into the satellite view as
 * the surrounding hero copy fades away (see Hero.tsx), fog and fov lerping
 * along with it so it reads as one continuous camera move.
 *
 * There's no mouse/hover-driven parallax here anymore — it made the camera
 * rotate to keep looking at a fixed target as its position shifted with the
 * pointer, and that rotation was enough to read as the phone frame/screen
 * subtly detaching from each other on hover. The idle drift is purely
 * clock-driven so it never fights the screen-locked phone bezel.
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
  phoneRef,
}: {
  progress: MotionValue<number>;
  className?: string;
  /** The real DOM element the flat phone bezel/screen render into (in
   * Hero.tsx) — read every frame to screen-lock the 3D bezel onto it. */
  phoneRef: RefObject<HTMLDivElement | null>;
}) {
  // The bezel is loaded as part of the GLB (so it shares materials/pipeline
  // with the rest of the scene), but it needs to live under <PerspectiveCamera>
  // as a real React child to stay screen-locked — mutating its parent
  // imperatively (camera.attach()) fought against R3F's own reconciliation
  // of this declarative tree and got silently undone on a later re-render.
  // SceneModel hands it up here once its GLB traversal finds it.
  const [phoneBezel, setPhoneBezel] = useState<THREE.Object3D | null>(null);

  return (
    <div className={className}>
      <Canvas gl={{ alpha: true, antialias: true }} dpr={[1, 1.75]} shadows="soft">
        <fog attach="fog" args={["#bfe6c4", 22, 58]} />
        <SceneLights />
        <SceneModel progress={progress} onBezelFound={setPhoneBezel} />
        <PerspectiveCamera makeDefault position={CAMERA_POS} fov={26} near={0.5} far={140}>
          {phoneBezel && <primitive object={phoneBezel} />}
        </PerspectiveCamera>
        {phoneBezel && (
          <>
            <PhoneBezelTransform bezel={phoneBezel} phoneRef={phoneRef} />
            <PhoneBezelFade bezel={phoneBezel} progress={progress} />
          </>
        )}
        <DissolveRig progress={progress} />
      </Canvas>
    </div>
  );
}
