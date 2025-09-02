import React, { useState, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";

function CameraController({ target, onComplete }) {
  const { camera, scene } = useThree();
  const controlsRef = useRef();
  const [isAnimating, setIsAnimating] = useState(false);

  React.useEffect(() => {
    if (target && controlsRef.current) {
      setIsAnimating(true);

      const distance = 50;
      const targetPos = new THREE.Vector3(...target.position);
      let actualTargetPos = new THREE.Vector3(...target.position);
      const currentPos = camera.position.clone();

      if (target.type === "nebula") {
        scene.traverse((child) => {
          if (child.userData && child.userData.objectId === target.id) {
            child.getWorldPosition(actualTargetPos);
          }
        });
      }

      const offset = new THREE.Vector3(20, 15, distance);
      const newCameraPos = actualTargetPos.clone().add(offset);

      const startPos = currentPos.clone();
      const startTarget = controlsRef.current.target.clone();

      let progress = 0;
      const duration = 2000; // 2 seconds
      const startTime = Date.now();

      const animate = () => {
        const elapsed = Date.now() - startTime;
        progress = Math.min(elapsed / duration, 1);

        // Use easing function for smooth animation
        const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic

        // For nebulas, update target position during animation to follow the floating motion
        let currentTargetPos = actualTargetPos;
        if (target.type === "nebula") {
          scene.traverse((child) => {
            if (child.userData && child.userData.objectId === target.id) {
              currentTargetPos = new THREE.Vector3();
              child.getWorldPosition(currentTargetPos);
            }
          });
        }

        // Interpolate camera position
        const dynamicCameraPos = currentTargetPos.clone().add(offset);
        camera.position.lerpVectors(startPos, dynamicCameraPos, eased);

        // Interpolate camera target (what it's looking at)
        if (controlsRef.current) {
          controlsRef.current.target.lerpVectors(
            startTarget,
            currentTargetPos,
            eased
          );
          controlsRef.current.update();
        }

        if (progress < 1) {
          requestAnimationFrame(animate);
        } else {
          setIsAnimating(false);
          if (onComplete) onComplete();
        }
      };

      animate();
    }
  }, [target, camera]);

  return (
    <OrbitControls
      ref={controlsRef}
      enabled={!isAnimating}
      enableZoom={true}
      enablePan={true}
      enableRotate={true}
      zoomSpeed={0.8}
      panSpeed={0.8}
      rotateSpeed={0.4}
      minDistance={20}
      maxDistance={400}
    />
  );
}

export default CameraController;
