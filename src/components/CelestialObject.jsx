import React, { useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

function CelestialObject({ object, onClick }) {
  const meshRef = useRef();
  const [hovered, setHovered] = useState(false);

  // Gentle floating animation
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += 0.005;
      meshRef.current.rotation.y += 0.005;

      // Different animation based on type
      if (object.type === "black_hole") {
        meshRef.current.rotation.z += 0.02;
      } else if (object.type === "nebula") {
        meshRef.current.position.y =
          object.position[1] + Math.sin(state.clock.elapsedTime) * 0.5;
      }
    }
  });

  const handleClick = (e) => {
    e.stopPropagation();
    onClick(object);
  };

  const getGeometry = () => {
    switch (object.type) {
      case "black_hole":
        return <sphereGeometry args={[object.size, 32, 32]} />;
      case "nebula":
        return <sphereGeometry args={[object.size, 16, 16]} />;
      default:
        return <sphereGeometry args={[object.size, 24, 24]} />;
    }
  };

  const getMaterial = () => {
    const baseProps = {
      color: object.color,
      emissive: object.type === "star" ? object.color : "#000000",
      emissiveIntensity: object.type === "star" ? 0.3 : 0,
    };

    switch (object.type) {
      case "black_hole":
        return (
          <meshStandardMaterial
            {...baseProps}
            color="#1a1a1a"
            emissive="#000000"
            roughness={0.1}
            metalness={0.9}
          />
        );
      case "nebula":
        return (
          <meshStandardMaterial
            {...baseProps}
            transparent
            opacity={0.6}
            emissiveIntensity={0.2}
          />
        );
      case "star":
        return (
          <meshStandardMaterial
            {...baseProps}
            emissiveIntensity={hovered ? 0.5 : 0.3}
          />
        );
      default:
        return <meshStandardMaterial {...baseProps} />;
    }
  };

  return (
    <group position={object.position}>
      <mesh
        ref={meshRef}
        onClick={handleClick}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        scale={hovered ? 1.1 : 1}
      >
        {getGeometry()}
        {getMaterial()}
      </mesh>

      {/* Glow effect for stars */}
      {object.type === "star" && (
        <mesh scale={hovered ? 2.2 : 2}>
          <sphereGeometry args={[object.size, 16, 16]} />
          <meshBasicMaterial
            color={object.color}
            transparent
            opacity={0.1}
            side={THREE.BackSide}
          />
        </mesh>
      )}
    </group>
  );
}

export default CelestialObject;
