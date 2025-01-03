import React, { useRef, useEffect, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { useGLTF, Line } from '@react-three/drei'
import * as THREE from 'three'
import { OrbitControls } from "@react-three/drei";

export default function Model() {
  const { nodes } = useGLTF('./src/assets/person.gltf')
   const [linePositions, setLinePositions] = useState([])

   useEffect(() => {
     if (nodes['Man_03_-_Renderpeople']) {
       // Extract vertex positions from geometry
       const geometry = nodes['Man_03_-_Renderpeople'].geometry
       const positions = geometry.attributes.position.array

       // Convert the positions array into a format suitable for line geometry
       const lineVertices = []
      for (let i = 0; i < positions.length; i += 8) {
         lineVertices.push(new THREE.Vector3(positions[i], positions[i + 1], positions[i + 2]))
      }

      setLinePositions(lineVertices)
    }
   }, [nodes])

   const lineGeometry = new THREE.BufferGeometry().setFromPoints(linePositions)
   return (
     <>
       {console.log(linePositions)}
       <Canvas camera={{ position: [1, 0, 1] }}>
       <group position={[0, -1, 0]}>
       {linePositions.length > 0 && (
           <line geometry={lineGeometry}>
            <lineBasicMaterial color="red" />
           </line>
           )}
       </group>
       <OrbitControls
        enableZoom={false}
         enablePan={false}
         autoRotateSpeed={1}
         minPolarAngle={0}
         maxPolarAngle={Math.PI * 0.4}
      />
       </Canvas>
     </>

  )
}

useGLTF.preload('./src/assets/person.gltf')
