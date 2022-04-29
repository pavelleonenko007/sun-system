import { extend, useFrame, useLoader, useThree } from '@react-three/fiber';
import React, { useEffect, useRef } from 'react';
import { TextureLoader } from 'three/src/loaders/TextureLoader';
import Texture from '../textures/8k_sun.jpg';
import { FXAAShader } from 'three-stdlib';
import { useActivePlanet } from '../store';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass';
// import { GammaCorrectionShader } from 'three/examples/jsm/shaders/GammaCorrectionShader';
import { Effects } from '@react-three/drei';
import {
  ColorAverage,
  ColorDepth,
  EffectComposer,
  GodRays,
  SSAO,
} from '@react-three/postprocessing';

extend({ EffectComposer, ShaderPass, RenderPass });

export default function Sun() {
  const sunTexture = useLoader(TextureLoader, Texture);
  const { setActivePlanet } = useActivePlanet();
  const { gl, camera, size, scene } = useThree();
  const sunRef = useRef();
  const composer = useRef();

  // useEffect(() => composer.current.setSize(size.width, size.height), [size]);
  useFrame(() => {
    sunRef.current.rotation.y += 0.001;
    composer.current.render();
  }, 1);

  const handleSunClick = (event) => {
    event.stopPropagation();
    setActivePlanet(sunRef.current);
  };

  return (
    <>
      <mesh ref={sunRef} position={[0, 0, 0]} onClick={handleSunClick}>
        <sphereGeometry args={[5, 64, 65]} />
        <meshBasicMaterial map={sunTexture} />
      </mesh>
      {sunRef.current && (
        <EffectComposer ref={composer} multisampling={0}>
          <GodRays
            sun={sunRef.current}
            samples={30}
            density={0.97}
            decay={0.75}
            weight={0.6}
            exposure={0.9}
          />
          {/* <ColorDepth /> */}
          {/* <ColorAverage /> */}
        </EffectComposer>
      )}
      {/* <Effects ref={composer} disableRender disableGamma>
        <shaderPass
          args={[FXAAShader]}
          material-uniforms-resolution-value={[1 / size.width, 1 / size.height]}
          renderToScreen
        />
      </Effects> */}
      {/* <Effects
        ref={occlusionComposer}
        disableGamma
        disableRender
        args={[gl, occlusionRenderTarget]}
        renderToScreen={false}
      >
        <shaderPass args={[VolumetricLightShader]} needsSwap={false} />
      </Effects>
      <Effects ref={composer} disableRender>
        <shaderPass
          args={[AdditiveBlendingShader]}
          uniforms-tAdd-value={occlusionRenderTarget.texture}
        />
        <shaderPass
          args={[FXAAShader]}
          uniforms-resolution-value={[1 / size.width, 1 / size.height]}
          renderToScreen
        />
      </Effects> */}
    </>
  );
}
