import { useFrame } from '@react-three/fiber'
import { useRef, useState } from 'react'

function Cube(prop){
    const id = prop.id
    const ref = useRef()
  
    const [isHoverd, setIsHoverd]= useState(false);
    const [isClicked,setIsClicked] = useState(false);
  
    useFrame((state,delta)=>{
      ref.current.rotation.x += delta;
      //ref.current.position.y = Math.sin(state.clock.elapsedTime)+id
    })
  
    const handleIsHovered = (event)=>{
  (event.stopPropagation), setIsHoverd(true)
    }
    return(
      <mesh 
        position={prop.position} 
        ref = {ref} 
        onPointerEnter={handleIsHovered}
        onPointerLeave={()=> setIsHoverd(false)}
        onClick={()=>{setIsClicked(!isClicked)}}
        scale ={isClicked? 0.5 : 1}
        >
          <boxGeometry args={[1,1,1]}/>
          <meshStandardMaterial emissive="white" emissiveIntensity={2} toneMapped={false} color = {isHoverd? "orange":"blue"}/>
        </mesh>
    )
  }

  export default Cube