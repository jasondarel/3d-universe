import React, { useState } from "react";
import StartScreen from "./components/StartScreen";
import Universe from "./components/Universe";

function App() {
  const [hasStarted, setHasStarted] = useState(false);

  const handleStart = () => {
    setHasStarted(true);
  };

  return (
    <div className="w-full h-screen bg-space-dark">
      {!hasStarted ? <StartScreen onStart={handleStart} /> : <Universe />}
    </div>
  );
}

export default App;
