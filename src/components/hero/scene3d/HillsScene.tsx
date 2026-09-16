"use client";

import { useMemo, useRef, useState } from "react";
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

// Hero.tsx's UI overlay is a 1920x996-aspect box centered in the viewport
// (letterboxed on whichever axis doesn't match), and the phone sits at a
// fixed rect within it (X(726)/Y(295)/445.5 wide, height following its own
// image aspect ratio since it isn't clamped to the box). A single hardcoded
// local offset for the 3D bezel only matched one specific viewport size —
// wrong on any other window, since the letterboxing changes with aspect
// ratio. PhoneBezelTransform below recomputes the projection every frame
// instead, so it tracks the DOM rect at any viewport size.
const UI_BOX_ASPECT = 1920 / 996;
const DOM_PHONE_RECT = {
  left: 726 / 1920,
  top: 295 / 996,
  width: 445.5 / 1920,
  height: (445.5 * (972.675 / 445.488)) / 996,
};
const BEZEL_DEPTH = 5;

/** Keeps the 3D phone bezel projected exactly onto the DOM phone's rect,
 * at any viewport size/aspect ratio, by re-deriving its camera-local
 * position and scale from the same box-letterboxing math Hero.tsx's CSS
 * uses, every frame. */
function PhoneBezelTransform({ bezel }: { bezel: THREE.Object3D }) {
  const { camera, size } = useThree();

  const nativeWidth = useMemo(() => {
    const mesh = bezel as THREE.Mesh;
    if (!mesh.geometry.boundingBox) mesh.geometry.computeBoundingBox();
    const box = mesh.geometry.boundingBox!;
    return box.max.x - box.min.x;
  }, [bezel]);

  useFrame(() => {
    const viewportAspect = size.width / size.height;
    let boxWidth: number, boxHeight: number, offsetX: number, offsetY: number;
    if (viewportAspect <= UI_BOX_ASPECT) {
      boxWidth = size.width;
      boxHeight = size.width / UI_BOX_ASPECT;
      offsetX = 0;
      offsetY = (size.height - boxHeight) / 2;
    } else {
      boxHeight = size.height;
      boxWidth = size.height * UI_BOX_ASPECT;
      offsetX = (size.width - boxWidth) / 2;
      offsetY = 0;
    }

    const centerXFrac = DOM_PHONE_RECT.left + DOM_PHONE_RECT.width / 2;
    const centerYFrac = DOM_PHONE_RECT.top + DOM_PHONE_RECT.height / 2;
    const pixelCenterX = offsetX + centerXFrac * boxWidth;
    const pixelCenterY = offsetY + centerYFrac * boxHeight;
    const pixelWidth = DOM_PHONE_RECT.width * boxWidth;

    const ndcX = (pixelCenterX / size.width) * 2 - 1;
    const ndcY = 1 - (pixelCenterY / size.height) * 2;
    const widthFracOfViewport = pixelWidth / size.width;

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
 * (0 = resting hero, 1 = fully dissolved to white): idle drift + mouse
 * parallax while at rest, then the camera lerps up into the satellite view
 * as the surrounding hero copy fades away (see Hero.tsx), fog and fov
 * lerping along with it so it reads as one continuous camera move.
 *
 * The mouse parallax lives entirely here, on the background camera — the
 * phone/text overlay in Hero.tsx stays put so the hover reads as "the
 * background shifts to peek around it", not the UI sliding on top of it.
 */
function DissolveRig({ progress }: { progress: MotionValue<number> }) {
  const { camera, scene } = useThree();
  const t = useRef(0);
  const mouse = useRef({ x: 0, y: 0 });
  const pos = useRef(new THREE.Vector3());
  const target = useRef(new THREE.Vector3());

  useFrame((state) => {
    t.current += state.clock.getDelta();
    const p = progress.get();
    // The dissolve itself only starts once the hero copy begins fading
    // (matches Hero.tsx's contentOpacity range) so scrolling the first bit
    // just settles the idle/mouse parallax instead of immediately moving.
    const raw = Math.min(1, Math.max(0, (p - 0.12) / 0.88));
    const ease = raw * raw * (3 - 2 * raw); // smoothstep
    const idleAmount = 1 - ease;

    const idleX = Math.sin(t.current * 0.15) * 0.15 * idleAmount;
    const idleY = Math.cos(t.current * 0.18) * 0.06 * idleAmount;
    mouse.current.x += (state.pointer.x - mouse.current.x) * 0.08;
    mouse.current.y += (state.pointer.y - mouse.current.y) * 0.08;

    pos.current.set(
      THREE.MathUtils.lerp(CAMERA_POS[0], END_POS[0], ease) + idleX + mouse.current.x * 4.5 * idleAmount,
      THREE.MathUtils.lerp(CAMERA_POS[1], END_POS[1], ease) + idleY + mouse.current.y * 1.6 * idleAmount,
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
            <PhoneBezelTransform bezel={phoneBezel} />
            <PhoneBezelFade bezel={phoneBezel} progress={progress} />
          </>
        )}
        <DissolveRig progress={progress} />
      </Canvas>
    </div>
  );
}
