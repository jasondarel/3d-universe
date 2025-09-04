import React from "react";
import { motion, AnimatePresence } from "framer-motion";

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

export default InfoPanel;
