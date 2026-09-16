"use client";

import { useEffect, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SceneModel, SceneLights } from "./scene3d/SceneModel";
import { CAMERA_POS, CAMERA_TARGET } from "./scene3d/HillsScene";
import { PhoneChatMockup } from "./PhoneChatMockup";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

// Hero's own scroll-parallax has fully played out (p=1) by the time its
// section scrolls out of view, so this scene must pick up from THAT pose —
// not the raw resting CAMERA_POS — or there's a visible jump at the handoff.
const START_POS: [number, number, number] = [CAMERA_POS[0], CAMERA_POS[1] + 3.6, CAMERA_POS[2] + 7.5];
const START_TARGET = CAMERA_TARGET;

// End: high above, pulled back, looking straight down at the terrain —
// the "camera becomes a satellite view" beat.
const END_POS: [number, number, number] = [0, 46, 8];
const END_TARGET = new THREE.Vector3(0, 0, 6);

function DissolveRig({ progressRef }: { progressRef: React.MutableRefObject<number> }) {
  const { camera, scene } = useThree();
  const pos = useRef(new THREE.Vector3());
  const target = useRef(new THREE.Vector3());
  const fogColorA = useRef(new THREE.Color("#bfe6c4"));
  const fogColorB = useRef(new THREE.Color("#ffffff"));

  useFrame(() => {
    const p = progressRef.current;
    const ease = p * p * (3 - 2 * p); // smoothstep

    pos.current.set(
      THREE.MathUtils.lerp(START_POS[0], END_POS[0], ease),
      THREE.MathUtils.lerp(START_POS[1], END_POS[1], ease),
      THREE.MathUtils.lerp(START_POS[2], END_POS[2], ease)
    );
    target.current.lerpVectors(START_TARGET, END_TARGET, ease);
    camera.position.copy(pos.current);
    camera.lookAt(target.current);

    const cam = camera as THREE.PerspectiveCamera;
    cam.fov = THREE.MathUtils.lerp(26, 62, ease);
    cam.updateProjectionMatrix();

    if (scene.fog instanceof THREE.Fog) {
      scene.fog.color.copy(fogColorA.current).lerp(fogColorB.current, ease);
      scene.fog.near = THREE.MathUtils.lerp(22, 3, ease);
      scene.fog.far = THREE.MathUtils.lerp(58, 22, ease);
    }
  });

  return null;
}

/**
 * The cinematic hand-off between the Hero and the rest of the page: the
 * camera pulls up into a top-down "satellite" view and the world dissolves
 * to white, while the phone stays put and only gently shrinks — reads as
 * "the same phone" continuing into the steps section, not a hard cut.
 */
export function SceneDissolve() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const phoneRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef(0);

  useEffect(() => {
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: wrapperRef.current,
        start: "top top",
        end: "bottom bottom",
        scrub: 0.6,
        onUpdate: (self) => {
          progressRef.current = self.progress;
          if (overlayRef.current) {
            overlayRef.current.style.opacity = String(Math.min(1, Math.max(0, (self.progress - 0.5) / 0.45)));
          }
          if (phoneRef.current) {
            const scale = 1 - self.progress * 0.36;
            phoneRef.current.style.transform = `scale(${scale})`;
          }
        },
      });
    }, wrapperRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={wrapperRef} className="relative h-[220vh] bg-white">
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        <div className="absolute inset-0">
          <Canvas
            gl={{ alpha: true, antialias: true }}
            camera={{ position: START_POS, fov: 26, near: 0.5, far: 140 }}
            dpr={[1, 1.75]}
          >
            <fog attach="fog" args={["#bfe6c4", 22, 58]} />
            <SceneLights />
            <SceneModel />
            <DissolveRig progressRef={progressRef} />
          </Canvas>
        </div>

        <div ref={overlayRef} className="pointer-events-none absolute inset-0 bg-white opacity-0" />

        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <div ref={phoneRef} className="w-[240px] origin-center sm:w-[270px] md:w-[300px]">
            <PhoneChatMockup />
          </div>
        </div>
      </div>
    </section>
  );
}
