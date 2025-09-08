## 3D Interactive Universe Explorer

### Project Overview

An interactive, exploratory 3D universe built with React and Three.js (via react-three-fiber). Users can freely navigate space, select celestial objects (stars, planets, nebulae, a black hole, and a sci‑fi space station), and view contextual information through animated UI panels. The experience blends procedural visual touches, post‑processing effects, subtle audio ambience, and smooth camera fly‑to animations to create an engaging mini cosmos.

### Technologies Used

- React 18 + Vite (fast dev + HMR bundling)
- @react-three/fiber (Three.js renderer for React)
- @react-three/drei (helpers: Stars, OrbitControls, etc.)
- @react-three/postprocessing + postprocessing (Bloom, Noise effects)
- Three.js core (geometry, materials, vectors, custom animation logic)
- Framer Motion (animated Info Panel & UI transitions)
- Tailwind CSS (utility-first responsive UI styling)
- Custom hooks (texture loading abstraction)
- HTML5 Audio API (ambient music + interaction SFX)
- ESLint (project linting) & modern ES module setup

### Features

- Real-time 3D rendering of a curated mini universe with multiple object types.
- Click-to-focus with smooth eased camera fly‑to animations (including dynamic tracking for moving nebulae).
- Dual navigation: OrbitControls (rotate / zoom / pan) + WASD translational movement with shift speed boost and spherical boundary clamp.
- Object Navigator panel grouped by type (stars, planets, nebulae, black holes, space stations) with collapsible sections.
- Rich Info Panel: animated entry/exit, contextual styling & emojis per object type, fun facts, positional & size metadata.
- Procedural & visual polish: starfield, bloom glow, screen-space noise, atmospheric shells, multi-layer ring systems, pseudo normal maps for surface detail.
- Distinct special objects: animated nebulae, a black hole representation, and a Death Star easter‑egg style space station.
- Persistent ambient space music with graceful autoplay fallback (starts on first user interaction if blocked).
- Interaction sound effects (whoosh on zoom-in / zoom-out) with timing adjustments.
- Responsive overlay UI with translucent, blurred panels using Tailwind utilities.
- Clean modular component architecture (Universe orchestrator + focused subcomponents per object type).

#### Setup

#### Prerequisites

- Node.js 18+
- npm

#### 1. Install dependencies

npm install

#### 2. Start the development server

npm run dev

#### AI Support

Model Creation
Helped in creation of simple models (Sun, Planets).

Debugging
Helped fix issues with code.

Resource Finding for 3D models
Help search for websites to use free 3D models.

Model Implementation
Assisted in applying models inside the project.
