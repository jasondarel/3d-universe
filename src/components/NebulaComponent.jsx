import React, { useState, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { useTextureLoader } from "../hooks/useTextureLoader";

function NebulaComponent({ object, onClick }) {
  const { gl } = useThree();
  const meshRef = useRef();
  const [hovered, setHovered] = useState(false);
  const texture = useTextureLoader(object, gl);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += 0.005;
      meshRef.current.rotation.y += 0.005;
      meshRef.current.position.y =
        object.position[1] + Math.sin(state.clock.elapsedTime) * 0.5;
      // Update userData for scene traversal
      meshRef.current.userData = { objectId: object.id };
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
        scale={hovered ? 1.1 : 1}
        castShadow
        receiveShadow
      >
        <sphereGeometry args={[object.size, 16, 16]} />
        <meshStandardMaterial
          map={texture}
          transparent
          opacity={0.6}
          emissive={object.color}
          emissiveIntensity={0.3}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  );
}

export default NebulaComponent;
