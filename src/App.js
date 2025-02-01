

import React, { useState, useRef, Suspense, lazy, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import Footer from './Footer';
import './styles/App.css';
import Checkpoints from './Checkpoints';
import EmailPopup from './EmailPopup';
import { Environment,Sky} from '@react-three/drei';

const CollegeModel = lazy(() => import('./CollegeModel'));


// Loader Component
const Loader = () => (
  <Html center>
    <div className="loader">Loading 3D Model...</div>
  </Html>
);

// Custom hook to clean up memory when component unmounts
const useMemoryCleanup = (ref) => {
  useEffect(() => {
    return () => {
      if (ref.current) {
        ref.current.traverse((child) => {
          if (child.isMesh) {
            child.geometry.dispose();
            if (Array.isArray(child.material)) {
              child.material.forEach((mat) => mat.dispose());
            } else {
              child.material.dispose();
            }
          }
        });
      }
      THREE.Cache.clear();
    };
  }, [ref]);
};

const App = () => {
  const [showModel, setShowModel] = useState(false);
  const [cameraReady, setCameraReady] = useState(false);
  const cameraRef = useRef();
  const modelRef = useRef(); // Reference for memory cleanup
  const [popupVisible, setPopupVisible] = useState(false);
  const [startAnimation, setStartAnimation] = useState(false); // Control animation start
  const [lookAtTarget, setLookAtTarget] = useState({ x: 0, y: 0, z: 0 }); // State to store lookAt values
  const handleCheckpointSelect = (position, lookAt) => {
    // Convert the lookAt array into an object with x, y, z properties
    const lookAtObject = {
      x: lookAt[0],
      y: lookAt[1],
      z: lookAt[2],
    };
  
    // Log the lookAt object to the console
    console.log('Converted lookAt object:', lookAtObject);
  
    // Update the lookAt target (or any other state you want to update)
    setLookAtTarget(lookAtObject); // Update lookAt target when a checkpoint is selected
  };
  console.log("d ascsdc",lookAtTarget.x, lookAtTarget.y, lookAtTarget.z);
  // Use memory cleanup hook on modelRef
  useMemoryCleanup(modelRef);

  // Check localStorage on mount to determine popup visibility
  useEffect(() => {
    const hasVisited = localStorage.getItem('hasVisited');
    if (!hasVisited) {
      setPopupVisible(true); // Show popup if not visited
    }
  }, []);

  const handleCollegeWebsite = () => {
    window.location.href = 'https://grdedu.in';
  };

  const handle3DModel = () => {
    setShowModel(true);
  };

  const handleBack = () => {
    setShowModel(false);
  };

  const handleEmailSubmit = (email) => {
    console.log('Email submitted:', email); // Use this to handle email logic (e.g., API call)
    setPopupVisible(false); // Close the popup
    localStorage.setItem('hasVisited', 'true'); // Mark popup as shown
  };

  // Trigger animations when the main screen is rendered
  useEffect(() => {
    if (!showModel) {
      setStartAnimation(true);
    }
  }, [showModel]);

  return (
    <div className="app-container">
      {popupVisible && <EmailPopup onEmailSubmit={handleEmailSubmit} />}
      {!showModel && (
        <div className="main-screen">
          <div className="main-screen-content">
            <div className={`line ${startAnimation ? 'animate-line' : ''}`} />
            <div className="text">
              <h1 className={`welcome ${startAnimation ? 'animate-welcome' : ''}`}>Welcome</h1>
              <h2 className={`world ${startAnimation ? 'animate-world' : ''}`}>to the World of GRD</h2>
            </div>
            <div className="button-container">
              <button className="button-40" role="button" onClick={handleCollegeWebsite}>
                <span className="text">Website of clg</span>
              </button>
              <button className="button-40" role="button" onClick={handle3DModel}>
                <span className="text">3D Model</span>
              </button>
            </div>
          </div>
          <Footer />
        </div>
      )}

      {showModel && (
        <div className="canvas-container">
          <button className="button-24" onClick={handleBack} role="button">
            <span className="text">Back</span>
          </button>

          <Canvas
            shadows
            camera={{ position: [3, 2, 1], fov: 60, near: 0.1, far: 50 }}
            style={{ background: '#e0e0e0' }}
            onCreated={({ camera }) => {
              cameraRef.current = camera;
              setCameraReady(true);
            }}
         
          >
             <Sky
              sunPosition={[10, 10, 10]} // Position of the sun
              turbidity={10} // Atmospheric thickness
              rayleigh={2} // Sky's light scattering
              mieCoefficient={0.005} // Strength of forward scattering
              mieDirectionalG={0.8} // Asymmetry of forward scattering
            />

            {/* Lighting Setup */}
            <ambientLight intensity={0.2} />
            <directionalLight position={[10, 10, 10]} intensity={2} castShadow={false}  shadow-bias={-0.001} />

            <Suspense fallback={<Loader />}>
              <group position={[0, 0, 0]} rotation={[0, 0, 0]} scale={[1, 1, 1]}>
                
              <CollegeModel lookAtTarget={lookAtTarget} />
              </group>
            </Suspense>
          </Canvas>

          {cameraReady && <Checkpoints camera={cameraRef.current} onCheckpointSelect={handleCheckpointSelect} />}
        </div>
      )}
    </div>
  );
};

export default App; 