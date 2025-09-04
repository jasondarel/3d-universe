import React, { useState, useRef, useMemo, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";

// Preload once
useGLTF.preload("/models/glb/black_hole.glb");

function BlackHoleComponent({ object, onClick }) {
  const groupRef = useRef();
  const modelRef = useRef();
  const [hovered, setHovered] = useState(false);
  const { scene } = useGLTF("/models/glb/black_hole.glb");

  // Clone & prepare model only once per mount
  const preparedModel = useMemo(() => {
    if (!scene) return null;
    const cloned = scene.clone(true);
    // Ensure materials are not shared & add subtle emissive so it's visible in dark scenes
    cloned.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
        if (child.material) {
          child.material = child.material.clone();
          if (!child.material.emissive)
            child.material.emissive = new THREE.Color(0x000000);
          child.material.emissiveIntensity = 0.4;
        }
      }
    });
    return cloned;
  }, [scene]);

  // Keep rotation animation
  useFrame((state) => {
    if (modelRef.current) {
      modelRef.current.rotation.y += 0.005;
      modelRef.current.rotation.x =
        Math.sin(state.clock.elapsedTime * 0.2) * 0.1;
    }
  });

  useEffect(() => {
    if (preparedModel && modelRef.current == null) {
      modelRef.current = preparedModel;
    }
  }, [preparedModel]);

  const handleClick = (e) => {
    e.stopPropagation();
    onClick(object);
  };

  if (!preparedModel) return null;

  const baseScale = object?.size || 1;
  const hoverFactor = hovered ? 1.08 : 1; // Slight pop on hover

  return (
    <group
      ref={groupRef}
      position={object.position}
      onClick={handleClick}
      onPointerOver={() => {
        setHovered(true);
        document.body.style.cursor = "pointer";
      }}
      onPointerOut={() => {
        setHovered(false);
        document.body.style.cursor = "default";
      }}
    >
      <primitive
        ref={modelRef}
        object={preparedModel}
        scale={[
          baseScale * hoverFactor,
          baseScale * hoverFactor,
          baseScale * hoverFactor,
        ]}
      />
    </group>
  );
}

export default BlackHoleComponent;
