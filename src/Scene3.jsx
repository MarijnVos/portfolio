import * as THREE from 'three';
import { useFrame, Canvas } from '@react-three/fiber';
import { useRef, useMemo } from 'react';
import { OrbitControls } from "@react-three/drei";

function Line({ start, end }) {
  const ref = useRef();
  const progress = useRef(Math.random()); // Start with a random progress point
  const speed = useMemo(() => 0.5 + Math.random() * 0.5, []); // Random animation speed
  const direction = useRef(1); // Direction of animation (1 for forward, -1 for backward)

  useFrame((state, delta) => {
    //ref.current.rotation.y = Math.sin(state.clock.elapsedTime*0.2)
    if (ref.current) {
      // Update progress
      progress.current += delta * speed * direction.current;

      // Reverse direction when progress exceeds bounds
      if (progress.current > 1 || progress.current < 0) {
        direction.current *= -1;
        progress.current = THREE.MathUtils.clamp(progress.current, 0, 1);
      }

      // Interpolate the endpoint
      const newEnd = new THREE.Vector3().lerpVectors(start, end, progress.current);

      // Update geometry points
      const positions = ref.current.geometry.attributes.position.array;
      positions[3] = newEnd.x;
      positions[4] = newEnd.y;
      positions[5] = newEnd.z;
      ref.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  // Create geometry with initial points
  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    const positions = new Float32Array([
      start.x, start.y, start.z, // Start point
      end.x, end.y, end.z,       // End point
    ]);
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    return geo;
  }, [start, end]);

  return (
    <line ref={ref} geometry={geometry}>
      <lineBasicMaterial attach="material" color="rgb(135, 255, 255)" linewidth={0.1} />
    </line>
  );
}

function Lines() {
  const linesData = useMemo(() => {
    const lines = [];
    for (let i = 0; i < 400; i++) {
      const start = new THREE.Vector3(Math.random() * 2 - 1.25, (Math.random() * 2 - 1)*0.5, Math.random() * 2 - 1);
      const end = new THREE.Vector3(0.5, 0, 0).add(start);
      lines.push({ start, end });
    }
    return lines;
  }, []);

  return (
    <>
      {linesData.map((line, i) => (
        <Line key={i} start={line.start} end={line.end} />
      ))}
    </>
  );
}

function Scene3() {
  
  return   <Canvas 
        linear
        gl={{ antialias: false, alpha: false }}
        camera={{ position: [1, 0, 2] }}
        onCreated={({ gl }) => gl.setClearColor('#000000')}>
        <Lines />;
        <OrbitControls 
                        enableZoom={false} 
                        enenablePan={false} 
                        autoRotateSpeed={1}
                        minPolarAngle={0} // Allow the camera to look directly up
                        maxPolarAngle={Math.PI*0.4} // Allow the camera to look directly down
                        />
      </Canvas>
  
}

export default Scene3;
