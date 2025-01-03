import React, { useRef, useEffect, useState } from 'react'
import { useGLTF } from '@react-three/drei'
import { useFrame, Canvas } from '@react-three/fiber'
import * as THREE from 'three'

export default function Model(props) {
  const { nodes } = useGLTF('./src/assets/box.gltf')
  const [linePositions, setLinePositions] = useState([])

  const lineRef = useRef()
  const [visibleSegments, setVisibleSegments] = useState(1) // Track visible segments
  const maxSegments = 8  // Total segments (or points) in the line
  const growSpeed = 3 // Speed at which the line grows (per frame)
  const [growing, setGrowing] = useState(true) // Direction of growth

  useEffect(() => {
    if (nodes['Cube']) {
      // Extract vertex positions from geometry
      const geometry = nodes['Cube'].geometry
      const positions = geometry.attributes.position.array

      // Convert the positions array into a format suitable for line geometry
      const lineVertices = []

      for (let i = 0; i < positions.length; i += 8) {
        lineVertices.push(new THREE.Vector3(positions[i], positions[i + 1], positions[i + 2]))
      }
      setLinePositions(lineVertices)
    }
  }, [nodes])

  // Animate the line growing or shrinking
  useFrame(() => {
    if (lineRef.current) {
      if (growing) {
        // Grow the line
        if (visibleSegments < 3000) {
          setVisibleSegments(visibleSegments + growSpeed)
        } else {
          // Reverse direction when full
          setGrowing(false)
        }
      } else {
        // Shrink the line
        if (visibleSegments > 1) {
          setVisibleSegments(visibleSegments - growSpeed)
        } else {
          // Reverse direction when reaching the minimum
          setGrowing(true)
        }
      }
    }
  })

  const currentVisiblePoints = linePositions.slice(0, Math.floor(visibleSegments))

  // Update the geometry each frame when visible segments change
  useEffect(() => {
    if (lineRef.current) {
      const geometry = new THREE.BufferGeometry().setFromPoints(currentVisiblePoints)
      lineRef.current.geometry = geometry
    }
  }, [currentVisiblePoints])

  return (
    <>
      <line ref={lineRef} position={[0, -0.15, 0]}>
        <lineBasicMaterial color='rgb(135, 253, 255)' />
      </line>
    </>
  )
}

useGLTF.preload('./src/assets/box.gltf')
