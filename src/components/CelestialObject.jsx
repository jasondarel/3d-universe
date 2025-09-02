import React, { useState, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

function CelestialObject({ object, onClick }) {
  const { gl } = useThree();
  const meshRef = useRef();
  const ringRef1 = useRef();
  const ringRef2 = useRef();
  const ringRef3 = useRef();
  const [hovered, setHovered] = useState(false);
  const [texture, setTexture] = useState(null);
  const [useGeneratedTexture, setUseGeneratedTexture] = useState(false);

  // Helper function to get potential texture filename based on object name
  const getTextureFilename = (object) => {
    // Convert object name to filename-friendly format
    const filename = object.name
      .toLowerCase()
      .replace(/\s+/g, "_")
      .replace(/[^\w\-_]/g, "")
      .replace(/_+/g, "_");

    return filename;
  };

  const generateTexture = (type, color) => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    canvas.width = 512;
    canvas.height = 512;

    const getPlanetType = (color) => {
      if (color.includes("#4ecdc4") || color.includes("#00cec9"))
        return "ocean";
      if (color.includes("#fdcb6e")) return "desert";
      if (color.includes("#74b9ff")) return "ice";
      if (color.includes("#e17055") || color.includes("#fd79a8"))
        return "volcanic";
      if (color.includes("#00b894")) return "forest";
      return "ocean";
    };

    if (type === "star") {
      const gradient = ctx.createRadialGradient(256, 256, 0, 256, 256, 256);
      gradient.addColorStop(0, color);
      gradient.addColorStop(0.7, "#ff4444");
      gradient.addColorStop(1, "#331100");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 512, 512);

      for (let i = 0; i < 2000; i++) {
        const x = Math.random() * 512;
        const y = Math.random() * 512;
        const size = Math.random() * 3;
        ctx.fillStyle = `rgba(255, 255, 100, ${Math.random() * 0.5})`;
        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fill();
      }
    } else if (type === "planet") {
      // Create diverse planet surfaces based on color
      const planetType = getPlanetType(color);

      if (planetType === "ocean") {
        // Ocean world with continents
        ctx.fillStyle = "#1a4d6b";
        ctx.fillRect(0, 0, 512, 512);

        // Add landmasses
        for (let i = 0; i < 20; i++) {
          const x = Math.random() * 512;
          const y = Math.random() * 512;
          const radius = 20 + Math.random() * 80;
          ctx.fillStyle = "#4a7c59";
          ctx.beginPath();
          ctx.arc(x, y, radius, 0, Math.PI * 2);
          ctx.fill();
        }
      } else if (planetType === "desert") {
        // Desert world with sand dunes
        ctx.fillStyle = "#d4a574";
        ctx.fillRect(0, 0, 512, 512);

        // Add darker sandy regions
        for (let i = 0; i < 30; i++) {
          const x = Math.random() * 512;
          const y = Math.random() * 512;
          const radius = 30 + Math.random() * 60;
          ctx.fillStyle = "#b8956a";
          ctx.beginPath();
          ctx.arc(x, y, radius, 0, Math.PI * 2);
          ctx.fill();
        }

        // Add oasis spots
        for (let i = 0; i < 5; i++) {
          const x = Math.random() * 512;
          const y = Math.random() * 512;
          const radius = 8 + Math.random() * 15;
          ctx.fillStyle = "#2d8a47";
          ctx.beginPath();
          ctx.arc(x, y, radius, 0, Math.PI * 2);
          ctx.fill();
        }
      } else if (planetType === "ice") {
        // Ice world
        ctx.fillStyle = "#e8f4f8";
        ctx.fillRect(0, 0, 512, 512);

        // Add ice formations
        for (let i = 0; i < 40; i++) {
          const x = Math.random() * 512;
          const y = Math.random() * 512;
          const radius = 15 + Math.random() * 40;
          ctx.fillStyle = "#b8d4e3";
          ctx.beginPath();
          ctx.arc(x, y, radius, 0, Math.PI * 2);
          ctx.fill();
        }

        // Add darker ice patches
        for (let i = 0; i < 20; i++) {
          const x = Math.random() * 512;
          const y = Math.random() * 512;
          const radius = 10 + Math.random() * 25;
          ctx.fillStyle = "#9bc2d1";
          ctx.beginPath();
          ctx.arc(x, y, radius, 0, Math.PI * 2);
          ctx.fill();
        }
      } else if (planetType === "volcanic") {
        // Volcanic world
        ctx.fillStyle = "#2d1810";
        ctx.fillRect(0, 0, 512, 512);

        // Add lava flows
        for (let i = 0; i < 25; i++) {
          const x = Math.random() * 512;
          const y = Math.random() * 512;
          const radius = 20 + Math.random() * 50;
          ctx.fillStyle = "#ff4500";
          ctx.beginPath();
          ctx.arc(x, y, radius, 0, Math.PI * 2);
          ctx.fill();
        }

        // Add darker volcanic rock
        for (let i = 0; i < 35; i++) {
          const x = Math.random() * 512;
          const y = Math.random() * 512;
          const radius = 15 + Math.random() * 30;
          ctx.fillStyle = "#1a0f08";
          ctx.beginPath();
          ctx.arc(x, y, radius, 0, Math.PI * 2);
          ctx.fill();
        }
      } else if (planetType === "forest") {
        // Forest world
        ctx.fillStyle = "#2d5a3d";
        ctx.fillRect(0, 0, 512, 512);

        // Add forest patches
        for (let i = 0; i < 50; i++) {
          const x = Math.random() * 512;
          const y = Math.random() * 512;
          const radius = 10 + Math.random() * 30;
          ctx.fillStyle = "#1e4a2b";
          ctx.beginPath();
          ctx.arc(x, y, radius, 0, Math.PI * 2);
          ctx.fill();
        }

        // Add clearings
        for (let i = 0; i < 10; i++) {
          const x = Math.random() * 512;
          const y = Math.random() * 512;
          const radius = 8 + Math.random() * 20;
          ctx.fillStyle = "#4a7c59";
          ctx.beginPath();
          ctx.arc(x, y, radius, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // Add atmospheric noise for all planet types
      for (let i = 0; i < 3000; i++) {
        const x = Math.random() * 512;
        const y = Math.random() * 512;
        ctx.fillStyle = `rgba(${Math.random() * 255}, ${Math.random() * 255}, ${
          Math.random() * 255
        }, 0.1)`;
        ctx.fillRect(x, y, 1, 1);
      }
    } else if (type === "nebula") {
      const gradient = ctx.createRadialGradient(256, 256, 0, 256, 256, 300);
      gradient.addColorStop(0, color);
      gradient.addColorStop(0.5, color + "80");
      gradient.addColorStop(1, "transparent");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 512, 512);
    } else if (type === "black_hole") {
      // Create event horizon effect
      const gradient = ctx.createRadialGradient(256, 256, 0, 256, 256, 256);
      gradient.addColorStop(0, "#000000");
      gradient.addColorStop(0.8, "#1a1a1a");
      gradient.addColorStop(1, "#ff6600");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 512, 512);
    }

    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    return texture;
  };

  // Generate normal map for surface detail
  const generateNormalMap = (type) => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    canvas.width = 256;
    canvas.height = 256;

    const imageData = ctx.createImageData(256, 256);
    for (let i = 0; i < imageData.data.length; i += 4) {
      const height = Math.random();
      imageData.data[i] = height * 128 + 127;
      imageData.data[i + 1] = height * 128 + 127;
      imageData.data[i + 2] = 255;
      imageData.data[i + 3] = 255;
    }
    ctx.putImageData(imageData, 0, 0);

    const texture = new THREE.CanvasTexture(canvas);
    return texture;
  };

  // Try to load texture from public/textures, fallback to generated
  React.useEffect(() => {
    let cancelled = false;
    const loader = new THREE.TextureLoader();

    const useGenerated = () => {
      if (cancelled) return;
      const generatedTexture = generateTexture(object.type, object.color);
      setTexture(generatedTexture);
      setUseGeneratedTexture(true);
    };

    const onLoad = (tex) => {
      if (cancelled) return;
      tex.wrapS = THREE.RepeatWrapping;
      tex.wrapT = THREE.RepeatWrapping;
      // Better quality when zoomed
      try {
        tex.anisotropy = gl.capabilities.getMaxAnisotropy?.() || 1;
      } catch {}
      // Correct color space (newer three.js)
      if (THREE.SRGBColorSpace) tex.colorSpace = THREE.SRGBColorSpace;
      setTexture(tex);
      setUseGeneratedTexture(false);
    };

    // 1) If an explicit texture is provided, try that first
    if (object.texture) {
      loader.load(`/textures/${object.texture}`, onLoad, undefined, () => {
        console.warn(`Failed to load ${object.texture}, falling back…`);
        // 2) Fallback to name-based guesses
        const base = getTextureFilename(object);
        const exts = [".jpg", ".png", ".jpeg"];
        let i = 0;
        const tryNext = () => {
          if (i >= exts.length) return useGenerated();
          const fname = `${base}${exts[i++]}`;
          loader.load(`/textures/${fname}`, onLoad, undefined, tryNext);
        };
        tryNext();
      });
    } else {
      // No explicit texture—use name-based guesses, then procedural
      const base = getTextureFilename(object);
      const exts = [".jpg", ".png", ".jpeg"];
      let i = 0;
      const tryNext = () => {
        if (i >= exts.length) return useGenerated();
        const fname = `${base}${exts[i++]}`;
        loader.load(`/textures/${fname}`, onLoad, undefined, tryNext);
      };
      tryNext();
    }

    return () => {
      cancelled = true;
    };
  }, [object, gl]);

  // Helper function to get atmosphere color based on planet color
  const getPlanetAtmosphereColor = (planetColor) => {
    if (planetColor.includes("#4ecdc4") || planetColor.includes("#00cec9"))
      return "#4da6ff"; // Blue for ocean worlds
    if (planetColor.includes("#fdcb6e")) return "#ffcc80"; // Orange for desert worlds
    if (planetColor.includes("#74b9ff")) return "#b3e5fc"; // Light blue for ice worlds
    if (planetColor.includes("#e17055") || planetColor.includes("#fd79a8"))
      return "#ff6666"; // Red for volcanic worlds
    if (planetColor.includes("#00b894")) return "#66bb6a"; // Green for forest worlds
    return "#4da6ff"; // Default blue
  };

  const normalMap = generateNormalMap(object.type);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += 0.005;
      meshRef.current.rotation.y += 0.005;

      if (object.type === "black_hole") {
        meshRef.current.rotation.z += 0.02;
      } else if (object.type === "nebula") {
        meshRef.current.position.y =
          object.position[1] + Math.sin(state.clock.elapsedTime) * 0.5;
        // Update userData for scene traversal
        meshRef.current.userData = { objectId: object.id };
      }
    }

    // Animate planetary rings
    if (object.hasRings) {
      if (ringRef1.current) {
        ringRef1.current.rotation.z += 0.002;
      }
      if (ringRef2.current) {
        ringRef2.current.rotation.z += 0.001;
      }
      if (ringRef3.current) {
        ringRef3.current.rotation.z += 0.0015;
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
        return <sphereGeometry args={[object.size, 32, 32]} />;
    }
  };

  const getMaterial = () => {
    switch (object.type) {
      case "black_hole":
        return (
          <meshStandardMaterial
            map={texture}
            color="#1a1a1a"
            emissive="#ff3300"
            emissiveIntensity={0.2}
            roughness={0.1}
            metalness={0.9}
          />
        );
      case "nebula":
        return (
          <meshStandardMaterial
            map={texture}
            transparent
            opacity={0.6}
            emissive={object.color}
            emissiveIntensity={0.3}
            side={THREE.DoubleSide}
          />
        );
      case "star":
        return (
          <meshStandardMaterial
            map={texture}
            emissive={object.color}
            emissiveIntensity={hovered ? 0.8 : 0.6}
            roughness={1.0}
            metalness={0.0}
          />
        );
      case "planet":
        return (
          <meshStandardMaterial
            map={texture}
            normalMap={normalMap}
            normalScale={[0.3, 0.3]}
            roughness={0.8}
            metalness={0.1}
          />
        );
      default:
        return <meshStandardMaterial map={texture} />;
    }
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
        {getGeometry()}
        {getMaterial()}
      </mesh>

      {object.type === "star" && (
        <>
          <mesh scale={hovered ? 1.8 : 1.6}>
            <sphereGeometry args={[object.size, 16, 16]} />
            <meshBasicMaterial
              color={object.color}
              transparent
              opacity={0.3}
              side={THREE.BackSide}
            />
          </mesh>
          <mesh scale={hovered ? 2.5 : 2.2}>
            <sphereGeometry args={[object.size, 12, 12]} />
            <meshBasicMaterial
              color={object.color}
              transparent
              opacity={0.15}
              side={THREE.BackSide}
            />
          </mesh>
          <mesh scale={hovered ? 3.2 : 3.0}>
            <sphereGeometry args={[object.size, 8, 8]} />
            <meshBasicMaterial
              color={object.color}
              transparent
              opacity={0.05}
              side={THREE.BackSide}
            />
          </mesh>
        </>
      )}

      {object.type === "planet" && (
        <mesh scale={1.05}>
          <sphereGeometry args={[object.size, 16, 16]} />
          <meshBasicMaterial
            color={getPlanetAtmosphereColor(object.color)}
            transparent
            opacity={0.2}
            side={THREE.BackSide}
          />
        </mesh>
      )}

      {/* Accretion disk for black holes */}
      {object.type === "black_hole" && (
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <ringGeometry args={[object.size * 1.5, object.size * 3, 32]} />
          <meshBasicMaterial
            color="#ff6600"
            transparent
            opacity={0.6}
            side={THREE.DoubleSide}
          />
        </mesh>
      )}

      {/* Planetary rings for planets with hasRings property */}
      {object.type === "planet" && object.hasRings && (
        <>
          {/* Main ring system with multiple layers */}
          <mesh ref={ringRef1} rotation={[Math.PI / 2, 0, 0]}>
            <ringGeometry args={[object.size * 1.3, object.size * 2.5, 64]} />
            <meshBasicMaterial
              color="#e6d7c1"
              transparent
              opacity={0.7}
              side={THREE.DoubleSide}
            />
          </mesh>

          {/* Secondary ring layer */}
          <mesh ref={ringRef2} rotation={[Math.PI / 2, 0, 0]}>
            <ringGeometry args={[object.size * 1.4, object.size * 2.2, 64]} />
            <meshBasicMaterial
              color="#d4c5a8"
              transparent
              opacity={0.5}
              side={THREE.DoubleSide}
            />
          </mesh>

          {/* Outer ring layer */}
          <mesh ref={ringRef3} rotation={[Math.PI / 2, 0, 0]}>
            <ringGeometry args={[object.size * 2.6, object.size * 3.2, 64]} />
            <meshBasicMaterial
              color="#f0e6d2"
              transparent
              opacity={0.4}
              side={THREE.DoubleSide}
            />
          </mesh>
        </>
      )}
    </group>
  );
}

export default CelestialObject;
