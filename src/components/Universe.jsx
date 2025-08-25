import React, { useState, Suspense, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Stars } from "@react-three/drei";
import * as THREE from "three";
import { motion, AnimatePresence } from "framer-motion";

function CelestialObject({ object, onClick }) {
  const meshRef = useRef();
  const [hovered, setHovered] = useState(false);

  const generateTexture = (type, color) => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    canvas.width = 512;
    canvas.height = 512;

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
      // Create planet surface with continents and oceans
      ctx.fillStyle = "#1a4d6b"; // Ocean base
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

      for (let i = 0; i < 5000; i++) {
        const x = Math.random() * 512;
        const y = Math.random() * 512;
        ctx.fillStyle = `rgba(${Math.random() * 255}, ${Math.random() * 255}, ${
          Math.random() * 255
        }, 0.3)`;
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

  const texture = generateTexture(object.type, object.color);
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

  return (
    <group position={object.position}>
      <mesh
        ref={meshRef}
        onClick={handleClick}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
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
            color="#4da6ff"
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
    </group>
  );
}

// Enhanced InfoPanel component
const typeColors = {
  star: "border-yellow-400 bg-yellow-900/20",
  planet: "border-green-400 bg-green-900/20",
  nebula: "border-purple-400 bg-purple-900/20",
  black_hole: "border-gray-400 bg-gray-900/20",
};

const typeEmojis = {
  star: "⭐",
  planet: "🪐",
  nebula: "🌌",
  black_hole: "🕳️",
};

function InfoPanel({ object, onClose }) {
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.8, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.8, y: 20 }}
        transition={{ duration: 0.3 }}
        className="fixed bottom-6 left-6 right-6 md:left-6 md:right-auto md:max-w-md z-20"
      >
        <div
          className={`bg-black/80 backdrop-blur-sm rounded-lg border-2 ${
            typeColors[object.type]
          } p-6 text-white shadow-2xl`}
        >
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <span className="text-2xl">{typeEmojis[object.type]}</span>
              <div>
                <h3 className="text-xl font-bold text-white">{object.name}</h3>
                <p className="text-sm text-gray-300 capitalize">
                  {object.type.replace("_", " ")}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors p-1 rounded-full hover:bg-white/10"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div
                className="w-4 h-4 rounded-full border border-white/30"
                style={{ backgroundColor: object.color }}
              ></div>
              <span className="text-sm text-gray-300">
                Color: {object.color}
              </span>
            </div>

            <div className="text-sm text-gray-300">
              <span>Size: {object.size} units</span>
            </div>

            <div className="text-sm text-gray-300">
              <span>
                Position: ({object.position.map((p) => p.toFixed(1)).join(", ")}
                )
              </span>
            </div>

            <div className="mt-4 p-3 bg-white/5 rounded border-l-4 border-blue-400">
              <p className="text-sm text-blue-100 font-medium">💡 Fun Fact:</p>
              <p className="text-sm text-gray-200 mt-1">{object.fun_fact}</p>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

const celestialObjects = [
  {
    id: 1,
    type: "star",
    name: "Proxima Centauri",
    position: [-45, 20, -30],
    color: "#ff6b6b",
    size: 8,
    fun_fact:
      "The closest star to our solar system, only 4.24 light-years away!",
  },
  {
    id: 2,
    type: "planet",
    name: "Kepler-442b",
    position: [60, -15, 40],
    color: "#4ecdc4",
    size: 5,
    fun_fact: "This super-Earth is located in the habitable zone of its star.",
  },
  {
    id: 3,
    type: "star",
    name: "Sol (Our Sun)",
    position: [0, 0, 0],
    color: "#ffd700",
    size: 14,
    fun_fact:
      "Our home star! It contains 99.86% of all the mass in our solar system.",
  },
  {
    id: 4,
    type: "nebula",
    name: "Orion Nebula",
    position: [-80, 30, 20],
    color: "#fd79a8",
    size: 15,
    fun_fact:
      "A stellar nursery where new stars are born from cosmic dust and gas.",
  },
  {
    id: 5,
    type: "star",
    name: "Betelgeuse",
    position: [35, 50, -60],
    color: "#e17055",
    size: 10,
    fun_fact: "A red supergiant that could explode as a supernova any time!",
  },
  {
    id: 6,
    type: "planet",
    name: "HD 209458 b",
    position: [-20, -40, 70],
    color: "#fdcb6e",
    size: 6,
    fun_fact:
      "The first exoplanet discovered to have water vapor in its atmosphere.",
  },
  {
    id: 7,
    type: "star",
    name: "Vega",
    position: [75, -25, -10],
    color: "#74b9ff",
    size: 7,
    fun_fact: "Once the northern pole star and will be again around 13,727 CE.",
  },
  {
    id: 8,
    type: "nebula",
    name: "Crab Nebula",
    position: [40, 15, 85],
    color: "#a29bfe",
    size: 12,
    fun_fact:
      "The remnant of a supernova observed by Chinese astronomers in 1054 CE.",
  },
  {
    id: 9,
    type: "planet",
    name: "TRAPPIST-1e",
    position: [-60, 45, -45],
    color: "#00b894",
    size: 4,
    fun_fact: "One of seven Earth-sized planets in the TRAPPIST-1 system.",
  },
  {
    id: 10,
    type: "star",
    name: "Rigel",
    position: [25, -55, 30],
    color: "#0984e3",
    size: 9,
    fun_fact:
      "A blue supergiant star that is 40,000 times more luminous than our Sun.",
  },
  {
    id: 11,
    type: "black_hole",
    name: "Cygnus X-1",
    position: [-35, 10, -80],
    color: "#2d3436",
    size: 8,
    fun_fact: "The first black hole ever discovered, confirmed in 1971.",
  },
  {
    id: 12,
    type: "nebula",
    name: "Eagle Nebula",
    position: [55, -10, 15],
    color: "#e84393",
    size: 18,
    fun_fact: 'Home to the famous "Pillars of Creation" stellar formation.',
  },
  {
    id: 13,
    type: "planet",
    name: "Gliese 581g",
    position: [10, 35, -90],
    color: "#00cec9",
    size: 5,
    fun_fact:
      "Potentially the first discovered Earth-like planet in a habitable zone.",
  },
  {
    id: 14,
    type: "star",
    name: "Polaris",
    position: [-75, -30, 55],
    color: "#ffeaa7",
    size: 6,
    fun_fact: "The current North Star, used for navigation for centuries.",
  },
  {
    id: 15,
    type: "nebula",
    name: "Horsehead Nebula",
    position: [85, 25, -25],
    color: "#6c5ce7",
    size: 14,
    fun_fact:
      "A dark nebula silhouetted against the bright Orion constellation.",
  },
];

function Universe() {
  const [selectedObject, setSelectedObject] = useState(null);

  const handleObjectClick = (object) => {
    setSelectedObject(object);
  };

  const handleClosePanel = () => {
    setSelectedObject(null);
  };

  return (
    <div className="w-full h-screen bg-space-dark">
      <Canvas
        camera={{ position: [0, 0, 100], fov: 60 }}
        className="w-full h-full"
        shadows
        gl={{
          antialias: true,
          alpha: false,
          powerPreference: "high-performance",
        }}
      >
        <Suspense fallback={null}>
          <ambientLight intensity={0.15} />
          <pointLight position={[10, 10, 10]} intensity={0.8} castShadow />
          <pointLight position={[-10, -10, -10]} intensity={0.3} />

          <directionalLight
            position={[50, 50, 50]}
            intensity={0.5}
            castShadow
            shadow-mapSize-width={2048}
            shadow-mapSize-height={2048}
          />

          <Stars
            radius={300}
            depth={50}
            count={8000}
            factor={6}
            saturation={0}
            fade
            speed={0.5}
          />

          {/* Celestial objects */}
          {celestialObjects.map((object) => (
            <CelestialObject
              key={object.id}
              object={object}
              onClick={handleObjectClick}
            />
          ))}

          {/* Camera controls */}
          <OrbitControls
            enableZoom={true}
            enablePan={true}
            enableRotate={true}
            zoomSpeed={0.8}
            panSpeed={0.8}
            rotateSpeed={0.4}
            minDistance={20}
            maxDistance={200}
          />
        </Suspense>
      </Canvas>

      {selectedObject && (
        <InfoPanel object={selectedObject} onClose={handleClosePanel} />
      )}

      {/* Enhanced UI Instructions */}
      <div className="absolute top-4 left-4 text-white/70 text-sm z-10">
        <div className="bg-black/40 backdrop-blur-sm rounded-lg p-3 border border-white/20">
          <p className="mb-2 text-yellow-300">
            🌌 Enhanced 3D Interactive Universe
          </p>
          <p className="text-xs mb-1">
            ✨ Realistic textures and lighting effects
          </p>
          <p className="text-xs mb-1">
            🖱️ Click on celestial objects to learn more!
          </p>
          <p className="text-xs">
            🎮 Drag to rotate • Scroll to zoom • Right-click + drag to pan
          </p>
        </div>
      </div>

      {/* Performance info */}
      <div className="absolute top-4 right-4 text-white/50 text-xs z-10">
        <div className="bg-black/40 backdrop-blur-sm rounded-lg p-2 border border-white/10">
          <p>Enhanced Visuals Active</p>
          <p>Procedural Textures • Glow Effects</p>
        </div>
      </div>
    </div>
  );
}

export default Universe;
