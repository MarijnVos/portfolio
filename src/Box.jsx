import React, { useRef, useEffect, useState } from 'react';
import { useGLTF } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export default function Model(props) {
  const { nodes } = useGLTF('/portfolio/box.gltf');
  const [linePositions, setLinePositions] = useState([]);
  const [animatedPositions, setAnimatedPositions] = useState([]);
  const [visibleSegments, setVisibleSegments] = useState(1); // Tracks visible segments
  const [progress, setProgress] = useState(1); // Animation progress for interpolation
  const [growing, setGrowing] = useState(true); // Tracks growing/shrinking state
  const [animatingToOutward, setAnimatingToOutward] = useState(true); // Animation direction
  const lineRef = useRef();

  useEffect(() => {
    if (nodes['Cube']) {
      const geometry = nodes['Cube'].geometry;
      const positions = geometry.attributes.position.array;

      const lineVertices = [];
      for (let i = 0; i < 25000; i += 8) {
        lineVertices.push(new THREE.Vector3(positions[i], positions[i + 1], positions[i + 2]));
      }
      setLinePositions(lineVertices);

      const outwardPositions = lineVertices.map((point) =>
        point.clone().normalize().multiplyScalar(Math.random()*0.8)
      );
      setAnimatedPositions(outwardPositions);
    }
  }, [nodes]);

  // Handle click to toggle outward or inward animation
  const handleClick = () => {
    setAnimatingToOutward(true);
    setProgress(0); // Reset progress
  };

  // Animation logic
  useFrame((state,delta) => {
    if (lineRef.current && linePositions.length > 0 && animatedPositions.length > 0) {
      // Determine the start and end positions based on animation direction
      const startPositions = animatingToOutward ? linePositions : animatedPositions;
      const endPositions = animatingToOutward ? animatedPositions : linePositions;

      // Interpolate between start and end positions
      const interpolatedPositions = startPositions.map((start, i) => {
        const end = endPositions[i];
        return new THREE.Vector3().lerpVectors(start, end, progress);
      });

      // Control the number of visible segments
      const currentVisiblePoints = interpolatedPositions.slice(0, Math.floor(visibleSegments));
      const geometry = new THREE.BufferGeometry().setFromPoints(currentVisiblePoints);
      lineRef.current.geometry.dispose(); // Dispose of old geometry
      lineRef.current.geometry = geometry;

      // Update progress for interpolation
      if (progress < 1) {
        setProgress((prev) => Math.min(prev + delta*10, 1)); // Adjust speed of interpolation
      }
      else{
        if(animatingToOutward){
          setAnimatingToOutward(false);
          setProgress(0); // Reset progress
        }
      }

      // Growing/Shrinking effect
      if (growing) {
        if (visibleSegments < interpolatedPositions.length) {
          setVisibleSegments((prev) => prev + 3); // Increase segments
        } else {
          setGrowing(false); // Switch to shrinking
        }
      } else {
        if (visibleSegments > 1) {
          setVisibleSegments((prev) => prev - 3); // Decrease segments
        } else {
          setGrowing(true); // Switch to growing
        }
      }
    }
  });

  return (
    <group onPointerDown={handleClick}>
      <line ref={lineRef} position={[0, -0.15, 0]}>
        <lineBasicMaterial color="rgb(135, 253, 255)" />
      </line>
    </group>
  );
}

useGLTF.preload('/portfolio/box.gltf');
