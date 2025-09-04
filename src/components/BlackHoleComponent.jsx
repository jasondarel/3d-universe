import React, { useState, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { useTextureLoader } from "../hooks/useTextureLoader";

function BlackHoleComponent({ object, onClick }) {
  const { gl } = useThree();
  const meshRef = useRef();
  const ringRef1 = useRef();
  const [hovered, setHovered] = useState(false);
  const texture = useTextureLoader(object, gl);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += 0.005;
      meshRef.current.rotation.y += 0.005;
    }

    if (ringRef1.current) {
      ringRef1.current.rotation.z += 0.01; // disk spin
      ringRef1.current.rotation.x =
        Math.sin(state.clock.elapsedTime * 0.2) * 0.05; // wobble
    }
  });

  const handleClick = (e) => {
    e.stopPropagation();
    onClick(object);
  };

  // Don't render until texture is loaded
  if (!texture) {
    return null;
  }

  return (
    <group position={object.position}>
      <mesh
        ref={meshRef}
        onClick={handleClick}
        onPointerOver={() => {
          setHovered(true);
          document.body.style.cursor = "pointer";
        }}
        onPointerOut={() => {
          setHovered(false);
          document.body.style.cursor = "default";
        }}
        castShadow
        receiveShadow
      >
        <sphereGeometry args={[object.size * 1.6, 64, 64]} />
        <meshStandardMaterial
          color="black"
          emissive="black"
          emissiveIntensity={0}
          roughness={1}
          metalness={0}
        />
      </mesh>

      {/* Accretion disk */}
      <mesh ref={ringRef1} position={[0, 0, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[object.size * 2, object.size * 0.4, 64, 256]} />
        <meshStandardMaterial
          emissive="#ff6600"
          emissiveIntensity={1.5}
          transparent
          opacity={0.8}
          side={THREE.DoubleSide}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
    </group>
  );
}

export default BlackHoleComponent;
