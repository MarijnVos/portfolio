import * as THREE from 'three'
import React, { useRef} from 'react'
import { useFrame, Canvas} from '@react-three/fiber'
import { OrbitControls } from "@react-three/drei";
import { clamp } from "three/src/math/MathUtils";

function sidecheck(id, neighbour, rows){
  if(neighbour>0 && neighbour<(rows*rows) && step(neighbour,rows) == step(id,rows)){
    if(data[neighbour].scale >1.85 && data[neighbour].scale <1.95){
      return true
    }
    else
      return false
  }
  else
    return false
}
function step(value,step)
{
  return Math.floor(value/step)
}

function distanceVector( v1, v2 )
{
  var dx = v1.x - v2.x;
  var dy = v1.y - v2.y;
  var dz = v1.z - v2.z;
  return Math.sqrt( dx * dx + dy * dy + dz * dz );
}

function depthValue(distance, min, max){
  var d = distance-min;
  d = d/(max-min);
  d = 1-d;
  d = clamp(d,0,1);
  return d;
}

const tempObject = new THREE.Object3D()
const tempColor = new THREE.Color()
const rows =31
const data = Array.from({ length: (rows*rows) }, () => ({scale: 1 }))


function Boxes() {
  const meshRef = useRef()

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
        const r = depthValue(dist, 0, 23);
        const g = depthValue(dist, 0, 24.7);
        const b = depthValue(dist, 0, 25);
  
        meshRef.current.setColorAt(
          id,
          tempColor.set(r, Math.min(g, 0.55), Math.min(b, 0.55))
        );
      }
    }
  
    meshRef.current.instanceMatrix.needsUpdate = true;
    meshRef.current.instanceColor.needsUpdate = true;
  });
  return (
    <instancedMesh
      ref={meshRef}
      args={[null, null, rows*rows]}
      onClick={(e) => {
        data[e.instanceId].scale = 2
      }}
      >
      <boxGeometry args={[1, 1, 1]}>
      </boxGeometry>
      <meshBasicMaterial/>
    </instancedMesh>
  )
}


function Scene4() { 
    return (
      <>
         <Canvas 
        linear
        gl={{ antialias: false, alpha: false }}
        camera={{ position: [4, 3, 5] }}
        onCreated={({ gl }) => gl.setClearColor('#000000')}>
            <Boxes />
            <OrbitControls 
                enableZoom={false} 
                enenablePan={false} 
                autoRotateSpeed={1}
                minPolarAngle={0} // Allow the camera to look directly up
                maxPolarAngle={Math.PI*0.4} // Allow the camera to look directly down
                />
         </Canvas>
            
        
      </>
    )
  }
  
  export default Scene4