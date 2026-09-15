"use client";

import { useMemo } from "react";
import * as THREE from "three";
import { hillHeight, blenderToThree } from "./hillMath";

const X_RANGE: [number, number] = [-26, 26];
const Y_RANGE: [number, number] = [-22, 34];
const RES_X = 120;
const RES_Y = 110;

export function Terrain() {
  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    const positions: number[] = [];
    const indices: number[] = [];

    const [x0, x1] = X_RANGE;
    const [y0, y1] = Y_RANGE;

    for (let j = 0; j < RES_Y; j++) {
      const y = y0 + ((y1 - y0) * j) / (RES_Y - 1);
      for (let i = 0; i < RES_X; i++) {
        const x = x0 + ((x1 - x0) * i) / (RES_X - 1);
        const z = hillHeight(x, y);
        const [tx, ty, tz] = blenderToThree(x, y, z);
        positions.push(tx, ty, tz);
      }
    }

    for (let j = 0; j < RES_Y - 1; j++) {
      for (let i = 0; i < RES_X - 1; i++) {
        const a = j * RES_X + i;
        const b = j * RES_X + i + 1;
        const c = (j + 1) * RES_X + i;
        const d = (j + 1) * RES_X + i + 1;
        indices.push(a, c, b, b, c, d);
      }
    }

    geo.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
    geo.setIndex(indices);
    geo.computeVertexNormals();
    return geo;
  }, []);

  return (
    <mesh geometry={geometry} receiveShadow>
      <meshStandardMaterial color="#8cc682" roughness={0.95} metalness={0} flatShading={false} />
    </mesh>
  );
}
