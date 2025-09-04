import React, { useState, useMemo } from "react";
import { celestialObjects } from "../data/celestialObjects";

function ObjectNavigator({ onObjectSelect, selectedObject }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [expandedGroups, setExpandedGroups] = useState({
    star: true,
    planet: true,
    nebula: true,
    black_hole: true,
    deathstar: true,
  });

  // Group objects by type
  const groupedObjects = useMemo(() => {
    const groups = {};
    celestialObjects.forEach((object) => {
      if (!groups[object.type]) {
        groups[object.type] = [];
      }
      groups[object.type].push(object);
    });
    return groups;
  }, []);

  // Get type display names
  const typeDisplayNames = {
    star: "Stars",
    planet: "Planets",
    nebula: "Nebulae",
    black_hole: "Black Holes",
    deathstar: "Space Stations",
  };

  const toggleGroup = (type) => {
    setExpandedGroups((prev) => ({
      ...prev,
      [type]: !prev[type],
    }));
  };

  const handleObjectClick = (object) => {
    onObjectSelect(object);
    setIsMenuOpen(false); // Close menu after selection
  };

  return (
    <>
      {/* Toggle Button */}
      <button
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        className={`fixed top-4 right-4 z-50 bg-gray-900/80 hover:bg-gray-800/90 text-white p-3 rounded-full backdrop-blur-sm border border-gray-600/50 transition-all duration-300 ${
          isMenuOpen ? "rotate-45" : ""
        }`}
        title="Object Navigator"
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <line x1="3" y1="6" x2="21" y2="6"></line>
          <line x1="3" y1="12" x2="21" y2="12"></line>
          <line x1="3" y1="18" x2="21" y2="18"></line>
        </svg>
      </button>

      {/* Navigation Menu */}
      {isMenuOpen && (
        <div className="fixed top-20 right-4 z-40 bg-gray-900/95 backdrop-blur-md text-white rounded-lg border border-gray-600/50 shadow-2xl max-h-[70vh] overflow-y-auto w-80">
          <div className="p-4 border-b border-gray-700">
            <h2 className="text-xl font-bold text-blue-300">
              Object Navigator
            </h2>
            <p className="text-sm text-gray-400 mt-1">
              Navigate through the universe
            </p>
          </div>

          <div className="p-2">
            {Object.entries(groupedObjects).map(([type, objects]) => (
              <div key={type} className="mb-3">
                {/* Group Header */}
                <button
                  onClick={() => toggleGroup(type)}
                  className="w-full flex items-center justify-between p-2 rounded hover:bg-gray-800/50 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-blue-200">
                      {typeDisplayNames[type]}
                    </span>
                    <span className="text-sm text-gray-400">
                      ({objects.length})
                    </span>
                  </div>
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className={`transition-transform duration-200 ${
                      expandedGroups[type] ? "rotate-180" : ""
                    }`}
                  >
                    <polyline points="6,9 12,15 18,9"></polyline>
                  </svg>
                </button>

                {/* Group Objects */}
                {expandedGroups[type] && (
                  <div className="ml-4 mt-1 space-y-1">
                    {objects.map((object) => (
                      <button
                        key={object.id}
                        onClick={() => handleObjectClick(object)}
                        className={`w-full text-left p-2 rounded text-sm hover:bg-gray-700/50 transition-colors flex items-center gap-2 ${
                          selectedObject?.id === object.id
                            ? "bg-blue-600/30 border-l-2 border-blue-400"
                            : ""
                        }`}
                      >
                        <span className="flex-1">{object.name}</span>
                        {selectedObject?.id === object.id && (
                          <span className="text-blue-400 text-xs">●</span>
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Footer */}
          <div className="p-3 border-t border-gray-700 text-xs text-gray-500">
            Click any object to navigate there
          </div>
        </div>
      )}

      {/* Backdrop */}
      {isMenuOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/20"
          onClick={() => setIsMenuOpen(false)}
        ></div>
      )}
    </>
  );
}

export default ObjectNavigator;
