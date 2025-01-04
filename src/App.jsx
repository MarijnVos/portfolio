import './App.css';
import Scene3 from './Scene3.jsx';
import Scene4 from './Scene4.jsx';
import { useState } from 'react';
import Scene5 from './Scene5.jsx';
import Scene6 from './Scene6.jsx';

function App() {
  const [sceneIndex, setSceneIndex] = useState(0);
  const [isMenuVisible, setMenuVisible] = useState(true);
  const scenes = [<Scene4 />, <Scene3 />,<Scene5 />];

  const handleToggle = () => {
    setSceneIndex((prev) => (prev + 1) % scenes.length);
  };

  const handlePressStart = () => {
    setTimeout(() => setMenuVisible(false), 100); // Hide menu after 1 second
  };

  const handlePressEnd = () => {
    setTimeout(() => setMenuVisible(true), 100); // Show menu after 1 second
  };

  return (
    <div
      className="app-container"
      onMouseDown={handlePressStart}
      onMouseUp={handlePressEnd}
      onTouchStart={handlePressStart}
      onTouchEnd={handlePressEnd}
    >
      <div className={`menu-container ${isMenuVisible ? 'visible' : 'hidden'}`}>
        
        <h3 className="menu-subtitle">Playground</h3>
        <button className="menu-button" onClick={() => setSceneIndex(0)}>
          #01 the wave
        </button>
        <button className="menu-button" onClick={() => setSceneIndex(1)}>
          #02 speedlines
        </button>
        <button className="menu-button" onClick={() => setSceneIndex(2)}>
          #03 draw
        </button>
        
        <button className="menu-next" onClick={handleToggle}>
          +
        </button>
        <h2 className="menu-title">MARIJN VOS</h2>
        
      </div>
      {scenes[sceneIndex]}
    </div>
  );
}

export default App;

