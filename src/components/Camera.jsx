import { OrbitControls } from '@react-three/drei';
import { useThree } from '@react-three/fiber';
import React, { useEffect, useRef } from 'react';
import { Vector3 } from 'three';

export default function Camera({ lookAt }) {
  const { camera } = useThree();
  const ref = useRef();
  useEffect(() => {
    if (lookAt) {
      ref.current.target = lookAt || new Vector3(0, 0, 0);
    }
  }, [lookAt]);
  return <OrbitControls ref={ref} camera={camera} />;
}
