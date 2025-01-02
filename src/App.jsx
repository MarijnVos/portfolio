import { Canvas } from '@react-three/fiber'
import './App.css'
import Scene3 from './Scene3.jsx'
import Scene4 from './Scene4.jsx'
import {useState } from 'react'


function App() {
  const [sceneIndex, setSceneIndex] = useState(0);

  const scenes = [<Scene4 />,<Scene3 /> ]; // Add scenes here

  const handleToggle = () => {
    setSceneIndex((prev) => (prev + 1) % scenes.length); // Cycle through scenes
  };
  
  return (
    <>
        <div className='menu-container'>
            <h2 className='menu-title'>MARIJN VOS</h2>
            <h3 className='menu-subtitle'>PLayground</h3>
            <button  className='menu-button' onClick={() => setSceneIndex(0)} >#01 the Wave</button>
            <button  className='menu-button' onClick={() => setSceneIndex(1)}> #02 Speedline</button>
            <button className='menu-next'onClick={handleToggle }>+</button>
        </div>
        {scenes[sceneIndex]}
    </>

      
  )
}

export default App
