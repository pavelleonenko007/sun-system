import { useLoader } from '@react-three/fiber';
import React, { useMemo, useRef } from 'react';
import { TextureLoader } from 'three/src/loaders/TextureLoader';
import { useActivePlanet } from '../store';
import CloudsMap from '../textures/8k_earth_clouds_alpha.png';
import DayMap from '../textures/8k_earth_daymap.jpg';
import NightMap from '../textures/8k_earth_nightmap.jpg';

export default function Earth({ planetRadius, offsetRadius, angle }) {
  const earthRef = useRef();
  const { setActivePlanet } = useActivePlanet();
  const [dayMap, nightMap, cloudsMap] = useLoader(TextureLoader, [
    DayMap,
    NightMap,
    CloudsMap,
  ]);

  const pos = [
    offsetRadius * Math.sin(angle * (Math.PI / 180)),
    0,
    offsetRadius * Math.cos(angle * (Math.PI / 180)),
  ];

  const uniforms = useMemo(() => {
    return {
      dayTexture: {
        value: dayMap,
      },
      nightTexture: {
        value: nightMap,
      },
    };
  }, []);

  const handleEarthClick = (event) => {
    event.stopPropagation();
    setActivePlanet(earthRef.current);
  };

  return (
    <group>
      <mesh ref={earthRef} position={pos} onClick={handleEarthClick}>
        <sphereGeometry args={[planetRadius, 32, 32]} />
        <shaderMaterial
          args={[
            {
              uniforms: uniforms,
              vertexShader: `
                varying vec2 vUv;
                varying vec3 vNormal;
                varying vec3 vPos;
                varying vec3 vNm;

                void main() {
                  vUv = uv;
                  vNormal = normal;
                  vNm = normalMatrix * normal;
                  vPos = (modelMatrix * vec4(position, 1.0 )).xyz;
                  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                }
              `,
              fragmentShader: `
                varying vec2 vUv;
                varying vec3 vNormal;
                varying vec3 vPos;
                varying vec3 vNm;

                uniform sampler2D dayTexture;
                uniform sampler2D nightTexture;

                void main() {
                  float ambient = 0.02;

                  vec3 dayColor = texture2D(dayTexture, vUv).rgb;
                  vec3 nightColor = texture2D(nightTexture, vUv).rgb;

                  vec3 lightDirection = normalize(vec3(0., 0., 0.) - vPos);
                  float diffuse = dot(lightDirection, vNormal);

                  float specularIntensity = 0.5;
                  vec3 viewDirection = normalize(cameraPosition - vPos);
                  vec3 reflectionDirection = reflect(-lightDirection, vNm);
                  float specular = pow(max(0., dot(viewDirection, reflectionDirection)), 8.) * specularIntensity;

                  vec3 resultColor = mix(nightColor, dayColor, diffuse + ambient + specular);
                  gl_FragColor = vec4(resultColor, 1.);
                }
              `,
            },
          ]}
        />
      </mesh>
      <mesh position={pos}>
        <sphereGeometry args={[planetRadius + 0.07, 32, 32]} />
        <meshPhongMaterial map={cloudsMap} transparent />
      </mesh>
    </group>
  );
}
