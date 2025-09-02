import React, { useEffect } from "react";

function SpaceMusic() {
  useEffect(() => {
    // Just ensure the audio element persists and is configured correctly
    let audio = document.getElementById("space-music-global");

    if (!audio) {
      audio = document.createElement("audio");
      audio.id = "space-music-global";
      audio.src = "/music/space.mp3";
      audio.loop = true;
      audio.volume = 0.3;
      audio.preload = "auto";
      audio.style.display = "none";
      document.body.appendChild(audio);
    }

    // Cleanup function
    return () => {
      // Keep the audio element for the session
    };
  }, []);

  // Return null - no visible component needed
  return null;
}

export default SpaceMusic;
