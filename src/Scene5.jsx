import { Environment, OrbitControls, useGLTF } from '@react-three/drei'
import { useFrame, Canvas } from '@react-three/fiber';
import Box from './Box.jsx'

function Scene5(){
    return(
        <Canvas camera={{ position: [0.3, 0.0, 1] }}>
            <Box/>
            
            <Environment preset="sunset" />
            <OrbitControls 
                            enableZoom={false} 
                            enenablePan={false} 
                            autoRotateSpeed={1}
                            minPolarAngle={0} // Allow the camera to look directly up
                            maxPolarAngle={Math.PI*0.75} // Allow the camera to look directly down
                            />
        </Canvas>
    )
}

export default Scene5