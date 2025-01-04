import { Canvas, useFrame } from '@react-three/fiber';
import { Environment, OrbitControls } from '@react-three/drei';
import { useRef, useState } from 'react';
import * as THREE from 'three'; // Import THREE

const SEPARATION_RADIUS = 2.0; // How close spheres should stay to each other
const ALIGNMENT_RADIUS = 2.0;  // The range to consider for alignment
const COHESION_RADIUS = 2.0;   // The range to consider for cohesion
const MIN_VELOCITY = 0.01;     // Minimum velocity before we add some drift
const MAX_SPEED = 0.1;         // Maximum speed limit for the spheres
const ATTRACTION_STRENGTH = 0.02; // Adjusted attraction strength

// Create a simple Boid-like behavior for the spheres
function FlockingSphere({ position, speed, spheresRef }) {
  const ref = useRef();
  const [velocity, setVelocity] = useState([Math.random() - 0.0, Math.random() - 0.0, Math.random() - 0.0]);

  useFrame(() => {
    let separationForce = [0, 0, 0];
    let alignmentForce = [0, 0, 0];
    let cohesionForce = [0, 0, 0];
    let totalSeparation = 0;
    let totalAlignment = 0;
    let totalCohesion = 0;

    // Compute the forces
    spheresRef.current.forEach((otherRef) => {
      if (otherRef !== ref && otherRef.current) {
        const distance = ref.current.position.distanceTo(otherRef.current.position);

        // Separation: Avoid overcrowding
        if (distance < SEPARATION_RADIUS && distance !== 0) {
          const direction = ref.current.position
            .clone()
            .sub(otherRef.current.position)
            .normalize();
          separationForce = separationForce.map((f, idx) => f + direction.toArray()[idx]);
          totalSeparation++;
        }

        // Alignment: Align with the direction of nearby spheres
        if (distance < ALIGNMENT_RADIUS) {
          const velocityDiff = otherRef.current.velocity || [0, 0, 0];
          alignmentForce = alignmentForce.map((f, idx) => f + velocityDiff[idx]);
          totalAlignment++;
        }

        // Cohesion: Move towards the average center of nearby spheres
        if (distance < COHESION_RADIUS) {
          const direction = otherRef.current.position
            .clone()
            .sub(ref.current.position)
            .normalize();
          cohesionForce = cohesionForce.map((f, idx) => f + direction.toArray()[idx]);
          totalCohesion++;
        }
      }
    });

    // Average the forces to smooth out the behavior
    if (totalSeparation > 0) {
      separationForce = separationForce.map((f) => f / totalSeparation);
    }
    if (totalAlignment > 0) {
      alignmentForce = alignmentForce.map((f) => f / totalAlignment);
    }
    if (totalCohesion > 0) {
      cohesionForce = cohesionForce.map((f) => f / totalCohesion);
    }

    // Combine all forces
    const newVelocity = velocity
      .map((v, idx) => v * 0.98 + separationForce[idx] * 0.01 + alignmentForce[idx] * 0.01 + cohesionForce[idx] * 0.01);

    // Add a small drift to ensure the spheres never stop
    const drift = [Math.random() * 0.01 - 0.005, Math.random() * 0.01 - 0.005, Math.random() * 0.01 - 0.005];
    const newVelocityWithDrift = newVelocity.map((v, idx) => v + drift[idx]);

    // Make sure the spheres always have some movement, even when the forces are low
    const magnitude = Math.sqrt(newVelocityWithDrift.reduce((sum, v) => sum + v * v, 0));
    if (magnitude < MIN_VELOCITY) {
      // If the velocity is too small, apply a random force to keep it moving
      const boost = [Math.random() * 0.1-0.05, Math.random() * 0.1-0.05, Math.random() * 0.1-0.05
      ];
      setVelocity(boost);
    } else {
      // Clamp the velocity to the max speed if it exceeds the threshold
      const clampedVelocity = newVelocityWithDrift.map((v) => {
        const mag = Math.sqrt(v * v);
        if (mag > MAX_SPEED) {
          return (v / mag) * MAX_SPEED; // Normalize and scale the velocity
        }
        return v;
      });

      setVelocity(clampedVelocity);
    }

    // Attraction force to pull the sphere back toward the center (weakened)
    const center = new THREE.Vector3(0, 0, 0); // Center of the scene (can change this to any point)
    const directionToCenter = center.sub(ref.current.position).normalize();
    const attractionForce = directionToCenter.multiplyScalar(ATTRACTION_STRENGTH);

    // Apply attraction force to the velocity
    const finalVelocity = newVelocityWithDrift.map((v, idx) => v + attractionForce.toArray()[idx]);

    // Update position based on velocity
    const newPos = ref.current.position.toArray().map((p, idx) => p + finalVelocity[idx]);

    // Stay near the center
    if (newPos[0] > 2 || newPos[0] < -2) finalVelocity[0] *= -1;
    if (newPos[1] > 2 || newPos[1] < -2) finalVelocity[1] *= -1;
    if (newPos[2] > 2 || newPos[2] < -2) finalVelocity[2] *= -1;

    ref.current.position.set(...newPos);
  });

  return (
    <mesh position={position} ref={ref}>
      <sphereGeometry args={[0.1]} />
      <meshStandardMaterial color="skyblue" />
    </mesh>
  );
}

function Scene6() {
  const numSpheres = 500;
  const spheres = Array.from({ length: numSpheres }, (_, idx) => ({
    position: [Math.random() * 2 - 1, Math.random() * 2 - 1, Math.random() * 2 - 1],
    speed: Math.random() * 0.05-0.025 ,
  }));

  // Create an array to hold references to all the spheres
  const spheresRef = useRef([]);

  return (
    <Canvas camera={{ position: [0.3, 0.0, 10] }}>
      {spheres.map((sphere, idx) => (
        <FlockingSphere
          key={idx}
          position={sphere.position}
          speed={sphere.speed}
          spheresRef={spheresRef} // Pass the refs array to each sphere
        />
      ))}

      <Environment preset="sunset" />
    </Canvas>
  );
}

export default Scene6;
