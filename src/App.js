import { Stars } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import {
  Bloom,
  DepthOfField,
  EffectComposer,
  GodRays,
  Noise,
  Vignette,
} from '@react-three/postprocessing';
import React, { Suspense, useRef } from 'react';
import { Vector3 } from 'three';
import Camera from './components/Camera';
import Earth from './components/Earth';
import Lights from './components/Lights';
import Sun from './components/Sun';
import { useActivePlanet } from './store';

export default function App() {
  const { activePlanet } = useActivePlanet();
  return (
    <div className="app">
      <Canvas
        shadows
        camera={{ position: [20, 0, 0], fov: 45 }}
        gl={{ antialias: false }}
      >
        <Stars
          radius={100}
          depth={50}
          count={5000}
          factor={4}
          saturation={0}
          fade
        />
        <Lights />
        <Suspense fallback={null}>
          <Sun />
          <Earth planetRadius={3} offsetRadius={30} angle={180} />
        </Suspense>
        <Camera lookAt={activePlanet?.position} />
      </Canvas>
    </div>
  );
}
