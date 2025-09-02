import React, { useState, Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { Stars } from "@react-three/drei";
import CameraController from "./CameraController";
import CelestialObject from "./CelestialObject";
import InfoPanel from "./InfoPanel";
import { celestialObjects } from "../data/celestialObjects";

function Universe() {
  const [selectedObject, setSelectedObject] = useState(null);
  const [cameraTarget, setCameraTarget] = useState(null);

  const handleObjectClick = (object) => {
    setSelectedObject(object);
    setCameraTarget(object);
  };

  const handleClosePanel = () => {
    setSelectedObject(null);
  };

  const handleCameraAnimationComplete = () => {
    // Animation completed - camera is now focused on the object
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

          {/* Camera controls with animation */}
          <CameraController
            target={cameraTarget}
            onComplete={handleCameraAnimationComplete}
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
            🖱️ Click on celestial objects to focus and learn more!
          </p>
          <p className="text-xs mb-1">
            🎬 Smooth camera animations to selected objects
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
