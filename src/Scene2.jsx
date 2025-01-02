import Cube from './Cube.jsx'
import {Environment, OrbitControls, useHelper} from "@react-three/drei"
import { useRef, Suspense } from 'react'
import { DirectionalLightHelper } from "three"
import { Bloom, DepthOfField, EffectComposer, Noise, Vignette } from '@react-three/postprocessing'



function Scene2(){
    const direcionalLightRef = useRef()
    return(
        <>
            <directionalLight intensity={0} position={[1,1,2]} ref={direcionalLightRef}/>
            <ambientLight intensity={10}/>
            <Cube position ={[0,0,0]} id={1}/>
            <OrbitControls enableZoom={true} />
            <Environment preset='sunset'/>
            <EffectComposer>
                <Bloom intensity ={0.2} luminanceThreshold={0} luminanceSmoothing={0.1} height={300} />
            </EffectComposer>
        </>

    )

}

export default Scene2