import React from 'react';

export default function Lights() {
  return (
    <>
      <ambientLight intensity={0.02} />
      <pointLight
        color={'#ffffff'}
        intensity={1}
        position={[3, 3, 3]}
        castShadow
        decay={2}
        shadow-bias={-0.0014}
        shadow-mapSize-height={512}
        shadow-mapSize-width={512}
      />
    </>
  );
}
