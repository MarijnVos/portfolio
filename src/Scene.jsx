import {Environment, OrbitControls, useHelper} from "@react-three/drei"
import { useRef, Suspense } from 'react'
import Person from './Person.jsx'


function Scene(){
    const direcionalLightRef = useRef()
    return(
        <>
            <directionalLight intensity={0} position={[1,1,2]} ref={direcionalLightRef}/>
            <ambientLight intensity={10}/>
            <Suspense>
                <Person position = {[0,-1,0]} rotation = {[0,3.14,0]}/>
            </Suspense>
            <OrbitControls enableZoom={true} autoRotate = {true} />
            <Environment preset='sunset'/>
        </>

    )

}

export default Scene