import * as THREE from 'three'
import React, { useRef } from 'react'
import { useFrame, Canvas } from '@react-three/fiber'
import { OrbitControls } from "@react-three/drei";
import { clamp } from "three/src/math/MathUtils";

function sidecheck(id, neighbour, rows, data) {
  if (
    neighbour >= 0 &&
    neighbour < rows * rows &&
    step(neighbour, rows) === step(id, rows)
  ) {
    return data[neighbour].scale > 1.85 && data[neighbour].scale < 1.95;
  } else {
    return false;
  }
}

function step(value, stepSize) {
  return Math.floor(value / stepSize);
}

function distanceVector(v1, v2) {
  const dx = v1.x - v2.x;
  const dy = v1.y - v2.y;
  const dz = v1.z - v2.z;
  return Math.sqrt(dx * dx + dy * dy + dz * dz);
}

function interpolateThreeColors(color1, color2, color3, factor) {
  if (factor <= 0.5) {
    // Blend between color1 and color2
    return new THREE.Color().lerpColors(color1, color2, factor * 2);
  } else {
    // Blend between color2 and color3
    return new THREE.Color().lerpColors(color2, color3, (factor - 0.5) * 2);
  }
}

const tempObject = new THREE.Object3D();
const rows = 31;
const data = Array.from({ length: rows * rows }, () => ({ scale: 1 }));

function Boxes() {
  const meshRef = useRef();

  // Define gradient colors
  const startColor = new THREE.Color("rgb(251, 211, 205)"); // Green
  const midColor = new THREE.Color("rgb(160, 170, 185)");  // Yellow
  const endColor = new THREE.Color("rgb(0, 0, 0)"); // Red

  useFrame((state, delta) => {
    const time = state.clock.getElapsedTime();
    const cameraPosition = state.camera.position;

    let i = 0;
    for (let x = 0; x < rows; x++) {
      for (let z = 0; z < rows; z++) {
        const id = i++;
        const y =
          0.4 * Math.sin(time * 0.5 + x * 0.5) * Math.sin(time * 0.05) +
          0.5 * Math.sin(time * 0.5 + z * Math.sin(time * 0.1));
        tempObject.position.set(rows / 2 - x, y, rows / 2 - z);

        if (data[id].scale > 1) {
          data[id].scale -= delta;
        }

        if (data[id].scale <= 1) {
          if (
            sidecheck(id, id - 1, rows, data) ||
            sidecheck(id, id + 1, rows, data)
          ) {
            data[id].scale = 2;
          }
        }

        tempObject.scale.y = data[id].scale;
        tempObject.updateMatrix();
        meshRef.current.setMatrixAt(id, tempObject.matrix);

        const dist = distanceVector(tempObject.position, cameraPosition);
        const maxDist = 19; // Maximum distance for color blending
        const minDist = -3; // Maximum distance for color blending
        const blendFactor = clamp((dist-0) / (maxDist-minDist), 0, 1);
        const blendedColor = interpolateThreeColors(
          startColor,
          midColor,
          endColor,
          blendFactor
        );

        meshRef.current.setColorAt(id, blendedColor);
      }
    }

    meshRef.current.instanceMatrix.needsUpdate = true;
    meshRef.current.instanceColor.needsUpdate = true;
  });

  return (
    <instancedMesh
      ref={meshRef}
      args={[null, null, rows * rows]}
      onClick={(e) => {
        data[e.instanceId].scale = 2;
      }}
    >
      <boxGeometry args={[1, 1, 1]} />
      <meshBasicMaterial />
    </instancedMesh>
  );
}

function Scene4() {
  return (
    <>
      <Canvas
        linear
        gl={{ antialias: false, alpha: false }}
        camera={{ position: [4, 3, 5] }}
        onCreated={({ gl }) => gl.setClearColor("#000000")}
      >
        <Boxes />
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          autoRotateSpeed={1}
          minPolarAngle={0}
          maxPolarAngle={Math.PI * 0.4}
        />
      </Canvas>
    </>
  );
}

export default Scene4;
