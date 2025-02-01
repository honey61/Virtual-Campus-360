
import React, { useEffect, useRef, useState } from 'react';
import { useGLTF, OrbitControls, Sphere } from '@react-three/drei';
import { useThree } from '@react-three/fiber';
import gsap from 'gsap';

export default function CollegeModel({ setModelLoaded, lookAtTarget, ...props }) {
  const { scene } = useGLTF('/model/untitled1.glb');
  const modelRef = useRef();
  const { camera } = useThree();
  const controlsRef = useRef();
  const [modelLoaded, setModelLoadedState] = useState(false);
  const animationTimeline = useRef(null);
  const inactivityTimeout = useRef(null);
  const [userInteracting, setUserInteracting] = useState(false);

  const pathPoints = [
    { position: { x: 4, y: 0.15, z: 2.9 }, lookAt: { x: 1.7, y: 0, z: 3.2 } },
    { position: { x: 1.5, y: 0.2, z: 2.9 }, lookAt: { x: 0.5, y: 0.4, z: 2 } },
    { position: { x: -2.8, y: 0.2, z: 2.9 }, lookAt: { x: -4, y: 0, z: 3.5 } },
    { position: { x: -3.7, y: 0.0, z: 3.5 }, lookAt: { x: -3.3, y: 0, z: 3.8 } },
    { position: { x: -3.4, y: 0.15, z: 0 }, lookAt: { x: -1, y: 0.4, z: -0.3 } },
    { position: { x: -3, y: 0.3, z: -4 }, lookAt: { x: -1.5, y: 0.4, z: -3 } },
    { position: { x: -1.5, y: 0.3, z: -2 }, lookAt: { x: -1.5, y: 0.4, z: -1 } },
    { position: { x: 0.7, y: 0.2, z: -1 }, lookAt: { x: 1, y: 0.4, z: -1.8 } },
    { position: { x: 0.8, y: 0.2, z: -0.1 }, lookAt: { x: 2, y: 0, z: 0 } },
    { position: { x: 2.7, y: 0.2, z: -0.2 }, lookAt: { x: 3, y: 0.2, z: -1.5 } },
    { position: { x: 2.7, y: 0.2, z: -2.2 }, lookAt: { x: 1, y: 0.5, z: -0 } },
  ];

  const animateCameraAlongPath = () => {
    if (animationTimeline.current) animationTimeline.current.kill();

    const timeline = gsap.timeline({ repeat: -1, ease: 'power2.inOut' });
    animationTimeline.current = timeline;

    pathPoints.forEach((point) => {
      timeline.to(camera.position, {
        x: point.position.x,
        y: point.position.y,
        z: point.position.z,
        duration: 4,
        onUpdate: () => {
          updateCameraTarget(point.lookAt);
        },
      });
    });
  };

 const updateCameraTarget = (lookAt) => {
  if (controlsRef.current) {
    controlsRef.current.target.set(lookAt.x, lookAt.y, lookAt.z);
    controlsRef.current.update();
    console.log("fdhbfgdb", lookAt.x, lookAt.y, lookAt.z);
  }
};

  const handleUserInteraction = () => {
    if (!userInteracting) {
      setUserInteracting(true);
      if (animationTimeline.current) animationTimeline.current.pause();
    }

    if (inactivityTimeout.current) clearTimeout(inactivityTimeout.current);

    inactivityTimeout.current = setTimeout(() => {
      setUserInteracting(false);
      animateCameraAlongPath();
    }, 5000000); // 5 seconds of inactivity before triggering this
  };



  useEffect(() => {
    scene.traverse((node) => {
      if (node.isMesh) {
        node.castShadow = true;
        node.receiveShadow = true;
      }
    });

    setModelLoadedState(true);
    if (setModelLoaded) {
      setModelLoaded(true);
    }
  }, [scene, setModelLoaded]);

  useEffect(() => {
    if (modelLoaded && !userInteracting) {
      animateCameraAlongPath();
    }
  }, [modelLoaded, userInteracting]);

  useEffect(() => {
    window.addEventListener('mousemove', handleUserInteraction);
    window.addEventListener('mousedown', handleUserInteraction);
    window.addEventListener('keydown', handleUserInteraction);

    return () => {
      window.removeEventListener('mousemove', handleUserInteraction);
      window.removeEventListener('mousedown', handleUserInteraction);
      window.removeEventListener('keydown', handleUserInteraction);
      if (inactivityTimeout.current) clearTimeout(inactivityTimeout.current);
      if (animationTimeline.current) animationTimeline.current.kill();
    };
  }, []);

  useEffect(() => {
    if (controlsRef.current) {
      controlsRef.current.enableZoom = true;
      controlsRef.current.enablePan = true;
      controlsRef.current.enableRotate = true;
      controlsRef.current.minDistance = 0;
      controlsRef.current.maxDistance = 8;
      controlsRef.current.maxPolarAngle = Math.PI / 2;
      controlsRef.current.minPolarAngle = Math.PI / 6;
    }
  }, [camera]);

  // Monitor changes to the `lookAtTarget` prop
  useEffect(() => {
    if (lookAtTarget) {
      updateCameraTarget(lookAtTarget);
    }
  }, [lookAtTarget]);

  return (
    <>
      <primitive ref={modelRef} object={scene} {...props} />
      <OrbitControls
        ref={controlsRef}
        enableZoom={true}
        enablePan={true}
        enableRotate={true}
        zoomSpeed={0.8}
        rotateSpeed={0.5}
        minDistance={3}
        maxDistance={8}
        dampingFactor={0.05}
        maxPolarAngle={Math.PI / 2}
        minPolarAngle={Math.PI / 6}
        screenSpacePanning={false}
      />
       {/* Render position nodes as spheres */}
      {/* {pathPoints.map((point, index) => (
        <Sphere key={`position-${index}`} args={[0.1, 32, 32]} position={[point.position.x, point.position.y, point.position.z]}>
          <meshStandardMaterial color="red" />
        </Sphere>
      ))} */}

      {/* Render lookAt nodes as spheres */}
      {/* {pathPoints.map((point, index) => (
        <Sphere key={`lookAt-${index}`} args={[0.1, 32, 32]} position={[point.lookAt.x, point.lookAt.y, point.lookAt.z]}>
          <meshStandardMaterial color="blue" />
        </Sphere>
      ))} */}
  
    </>
  );
}
