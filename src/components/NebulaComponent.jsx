import React, { useState, useRef, useMemo, useEffect } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";
import { useTextureLoader } from "../hooks/useTextureLoader";

function NebulaComponent({ object, onClick }) {
  const { gl } = useThree();
  const meshRef = useRef();
  const groupRef = useRef();
  const [hovered, setHovered] = useState(false);
  const texture = useTextureLoader(object, gl);
  // Nebulas that should use GLB models instead of procedural spheres
  const usesNebula1GLB =
    object.name === "Crab Nebula" || object.name === "Eagle Nebula";
  const usesNebula2GLB =
    object.name === "Horsehead Nebula" || object.name === "Orion Nebula";
  const usesNebulaGLB = usesNebula1GLB || usesNebula2GLB;

  // Load BOTH GLBs unconditionally to satisfy Rules of Hooks; cache prevents duplicate network hits
  const nebula1Model = useGLTF("/models/glb/nebula1.glb");
  const nebula2Model = useGLTF("/models/glb/nebula2.glb");
  const nebulaModel = usesNebula1GLB ? nebula1Model : usesNebula2GLB ? nebula2Model : null;
  // Strong downscale for GLB nebulas ("much much smaller")
  // Further reduced scale (second shrink request)
  const glbScale = usesNebula1GLB ? 0.18 : usesNebula2GLB ? 0.14 : 1;

  // Clone the scene so multiple nebulas using the same GLB don't mutate each other
  const clonedScene = useMemo(() => {
    if (!usesNebulaGLB || !nebulaModel) return null;
    const scene = nebulaModel.scene.clone(true);
    // Ensure materials are unique & tinted
    scene.traverse((child) => {
      if (!child.isMesh) return;
      child.userData = { objectId: object.id };
      if (!child.material) return;

      const originalMat = child.material;
      const mat = (child.material = originalMat.clone());

      const targetColor = object.color || "#ffffff";
      // Color
      if (mat.color && typeof mat.color.set === "function") {
        mat.color.set(targetColor);
      }
      // Emissive (only if material supports it)
      if (mat.emissive && typeof mat.emissive.set === "function") {
        mat.emissive.set(targetColor);
        if ("emissiveIntensity" in mat) {
          mat.emissiveIntensity = 0.8;
        }
      }

      // Transparency / glow styling
      if ("transparent" in mat) mat.transparent = true;
      if ("opacity" in mat) mat.opacity = 0.9;
      mat.depthWrite = false;
      mat.blending = THREE.AdditiveBlending;
      mat.side = THREE.DoubleSide;
    });
    return scene;
  }, [usesNebulaGLB, nebulaModel, object.id, object.color]);

  // No side-effect traversal now; handled inside clonedScene memo
  useEffect(() => {}, [clonedScene]);

  // Generate advanced nebula texture with multiple gas clouds and filaments
  const advancedNebulaTexture = useMemo(() => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    canvas.width = 1024;
    canvas.height = 1024;

    // Clear with transparent background
    ctx.clearRect(0, 0, 1024, 1024);

    // Parse the object color
    const color = object.color || "#ff6b9d";

    // Create multiple gas clouds with different densities
    for (let cloud = 0; cloud < 8; cloud++) {
      const centerX = 200 + Math.random() * 624;
      const centerY = 200 + Math.random() * 624;
      const maxRadius = 100 + Math.random() * 200;

      // Create radial gradient for each cloud
      const gradient = ctx.createRadialGradient(
        centerX,
        centerY,
        0,
        centerX,
        centerY,
        maxRadius
      );

      // Vary colors slightly for each cloud
      const hue =
        (parseInt(color.slice(1, 3), 16) + Math.random() * 60 - 30) % 360;
      const sat = Math.max(0.4, Math.random() * 0.8);
      const light = 0.3 + Math.random() * 0.4;

      gradient.addColorStop(
        0,
        `hsla(${hue}, ${sat * 100}%, ${light * 100}%, 0.8)`
      );
      gradient.addColorStop(
        0.3,
        `hsla(${hue}, ${sat * 100}%, ${light * 100}%, 0.4)`
      );
      gradient.addColorStop(
        0.7,
        `hsla(${hue}, ${sat * 100}%, ${light * 100}%, 0.1)`
      );
      gradient.addColorStop(
        1,
        `hsla(${hue}, ${sat * 100}%, ${light * 100}%, 0)`
      );

      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 1024, 1024);
    }

    // Add wispy filaments connecting gas clouds
    ctx.globalCompositeOperation = "screen";
    for (let i = 0; i < 150; i++) {
      const startX = Math.random() * 1024;
      const startY = Math.random() * 1024;
      const endX = startX + (Math.random() - 0.5) * 400;
      const endY = startY + (Math.random() - 0.5) * 400;

      const gradient = ctx.createLinearGradient(startX, startY, endX, endY);
      const opacity = Math.random() * 0.3;
      gradient.addColorStop(0, `rgba(255, 255, 255, 0)`);
      gradient.addColorStop(
        0.5,
        `${object.color}${Math.floor(opacity * 255)
          .toString(16)
          .padStart(2, "0")}`
      );
      gradient.addColorStop(1, `rgba(255, 255, 255, 0)`);

      ctx.strokeStyle = gradient;
      ctx.lineWidth = Math.random() * 3 + 1;
      ctx.beginPath();
      ctx.moveTo(startX, startY);

      // Create curved filaments
      const controlX = (startX + endX) / 2 + (Math.random() - 0.5) * 100;
      const controlY = (startY + endY) / 2 + (Math.random() - 0.5) * 100;
      ctx.quadraticCurveTo(controlX, controlY, endX, endY);
      ctx.stroke();
    }

    // Add embedded stars
    ctx.globalCompositeOperation = "screen";
    for (let i = 0; i < 30; i++) {
      const x = Math.random() * 1024;
      const y = Math.random() * 1024;
      const size = Math.random() * 4 + 1;

      const starGradient = ctx.createRadialGradient(x, y, 0, x, y, size * 3);
      starGradient.addColorStop(0, "#ffffff");
      starGradient.addColorStop(0.5, object.color);
      starGradient.addColorStop(1, "transparent");

      ctx.fillStyle = starGradient;
      ctx.beginPath();
      ctx.arc(x, y, size * 3, 0, Math.PI * 2);
      ctx.fill();

      // Add star core
      ctx.fillStyle = "#ffffff";
      ctx.beginPath();
      ctx.arc(x, y, size * 0.5, 0, Math.PI * 2);
      ctx.fill();
    }

    const nebulaTexture = new THREE.CanvasTexture(canvas);
    nebulaTexture.wrapS = THREE.RepeatWrapping;
    nebulaTexture.wrapT = THREE.RepeatWrapping;
    return nebulaTexture;
  }, [object.color]);

  useFrame((state) => {
    if (meshRef.current) {
      if (!usesNebulaGLB) {
        // Slow, organic rotation (disabled for Crab Nebula GLB)
        meshRef.current.rotation.x += 0.002;
        meshRef.current.rotation.y += 0.001;
        meshRef.current.rotation.z += 0.0005;
      }
      meshRef.current.userData = { objectId: object.id };
    }
    if (groupRef.current) {
      groupRef.current.position.y =
        object.position[1] + Math.sin(state.clock.elapsedTime * 0.5) * 0.3;
    }
  });

  const handleClick = (e) => {
    e.stopPropagation();
    onClick(object);
  };

  // If GLB is used, render that instead of procedural layers
  if (usesNebulaGLB) {
    if (!clonedScene) return null; // Wait for clone
    return (
      <group
        ref={groupRef}
        position={[object.position[0], object.position[1], object.position[2]]}
      >
        <primitive
          ref={meshRef}
          object={clonedScene}
          scale={[object.size * glbScale, object.size * glbScale, object.size * glbScale]}
          onClick={(e) => {
            e.stopPropagation();
            onClick(object);
          }}
          onPointerOver={() => {
            setHovered(true);
            document.body.style.cursor = "pointer";
          }}
          onPointerOut={() => {
            setHovered(false);
            document.body.style.cursor = "default";
          }}
        />
      </group>
    );
  }

  // Don't render until texture is ready for procedural nebulas
  if (!texture && !advancedNebulaTexture) return null;

  // Use advanced texture if available, fallback to basic texture
  const activeTexture = advancedNebulaTexture || texture;

  return (
    <group
      ref={groupRef}
      position={[object.position[0], object.position[1], object.position[2]]}
    >
      {/* Core nebula cloud */}
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
        <sphereGeometry args={[object.size * 0.8, 24, 24]} />
        <meshStandardMaterial
          map={activeTexture}
          transparent
          opacity={0.7}
          emissive={object.color}
          emissiveIntensity={0.4}
          side={THREE.DoubleSide}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Outer wispy layer */}
      <mesh scale={1.6} rotation={[0.5, 0.3, 0.2]}>
        <sphereGeometry args={[object.size * 0.9, 16, 16]} />
        <meshStandardMaterial
          map={activeTexture}
          transparent
          opacity={0.3}
          emissive={object.color}
          emissiveIntensity={0.2}
          side={THREE.DoubleSide}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Diffuse outer glow */}
      <mesh scale={2.2} rotation={[-0.3, 0.7, -0.1]}>
        <sphereGeometry args={[object.size * 1.1, 12, 12]} />
        <meshStandardMaterial
          transparent
          opacity={0.15}
          emissive={object.color}
          emissiveIntensity={0.1}
          side={THREE.DoubleSide}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Volumetric inner core */}
      <mesh scale={0.4} rotation={[0.8, -0.4, 0.6]}>
        <sphereGeometry args={[object.size * 0.6, 20, 20]} />
        <meshStandardMaterial
          map={activeTexture}
          transparent
          opacity={0.9}
          emissive={object.color}
          emissiveIntensity={0.8}
          side={THREE.DoubleSide}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
    </group>
  );
}

export default NebulaComponent;

// Preload both nebula models so they're ready when needed
useGLTF.preload("/models/glb/nebula1.glb");
useGLTF.preload("/models/glb/nebula2.glb");
