import React, { useState, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { useTextureLoader } from "../hooks/useTextureLoader";

function StarComponent({ object, onClick }) {
  const { gl } = useThree();
  const meshRef = useRef();
  const [hovered, setHovered] = useState(false);
  const texture = useTextureLoader(object, gl);

  // Generate star texture
  const generateStarTexture = (color) => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    canvas.width = 512;
    canvas.height = 512;

    const gradient = ctx.createRadialGradient(256, 256, 0, 256, 256, 256);
    gradient.addColorStop(0, color);
    gradient.addColorStop(0.7, "#ff4444");
    gradient.addColorStop(1, "#331100");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 512, 512);

    // Add solar flares
    for (let i = 0; i < 2000; i++) {
      const x = Math.random() * 512;
      const y = Math.random() * 512;
      const size = Math.random() * 3;
      ctx.fillStyle = `rgba(255, 255, 100, ${Math.random() * 0.5})`;
      ctx.beginPath();
      ctx.arc(x, y, size, 0, Math.PI * 2);
      ctx.fill();
    }

    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    return texture;
  };

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.x += 0.005;
      meshRef.current.rotation.y += 0.005;
    }
  });

  const handleClick = (e) => {
    e.stopPropagation();
    onClick(object);
  };

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
        <sphereGeometry args={[object.size, 32, 32]} />
        <meshStandardMaterial
          map={texture || null}
          emissive={object.color}
          emissiveIntensity={hovered ? 1.2 : 1.0}
          roughness={0.8}
          metalness={0.0}
        />
      </mesh>
    </group>
  );
}

export default StarComponent;
