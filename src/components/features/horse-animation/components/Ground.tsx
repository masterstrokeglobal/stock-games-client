import * as THREE from "three";
import { useTexture } from "@react-three/drei";
import { CuboidCollider, RigidBody, RigidBodyProps } from "@react-three/rapier";
import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";

export function Ground(props: RigidBodyProps) {
  const [grassTexture, dirtTexture, patchTexture] = useTexture([
    "/grass.jpg", 
    "/dirt.jpg", 
    "/patch.jpg"
  ]);

  useMemo(() => {
    [grassTexture, dirtTexture, patchTexture].forEach(texture => {
      texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
      texture.needsUpdate = true;
    });
  }, [grassTexture, dirtTexture, patchTexture]);

  const materialRef = useRef<THREE.ShaderMaterial | null>(null);
  const timeRef = useRef(0);

  useFrame((state, delta) => {
    if (materialRef.current) {
      timeRef.current += delta;
      materialRef.current.uniforms.time.value = timeRef.current;
    }
  });

  const uniforms = useMemo(() => ({
    grassTexture: { value: grassTexture },
    dirtTexture: { value: dirtTexture },
    patchTexture: { value: patchTexture },
    repeat: { value: new THREE.Vector2(240, 240) },
    time: { value: 0 },
    scrollSpeed: { value: 16.0 }, // Added scroll speed uniform
    rowCount: { value: 10.0 },
    centerWidth: { value: 0.12 },
    grassPatchSize: { value: 0.08 },
    grassThreshold: { value: 0.85 },
  }), [grassTexture, dirtTexture, patchTexture]);

  return (
    <RigidBody {...props} type="fixed" colliders={false}>
      <mesh 
        receiveShadow 
        position={[25, 0, 0]} 
        rotation-x={-Math.PI / 2}
      >
        <planeGeometry args={[1000, 1000]} />
        <shaderMaterial
          ref={materialRef}
          attach="material"
          uniforms={uniforms}
          vertexShader={vertexShader}
          fragmentShader={fragmentShader}
        />
      </mesh>
      <CuboidCollider 
        args={[1000, 2, 1000]} 
        position={[0, -2, 0]} 
      />
    </RigidBody>
  );
}

const vertexShader = `
varying vec2 vUv;

void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

const fragmentShader = `
uniform sampler2D grassTexture;
uniform sampler2D dirtTexture;
uniform sampler2D patchTexture;
uniform vec2 repeat;
uniform float time;
uniform float scrollSpeed;
uniform float rowCount;
uniform float centerWidth;
uniform float grassPatchSize;
uniform float grassThreshold;

varying vec2 vUv;

float random(vec2 st) {
  return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
}

float noise(vec2 st) {
  vec2 i = floor(st);
  vec2 f = fract(st);
  float a = random(i);
  float b = random(i + vec2(1.0, 0.0));
  float c = random(i + vec2(0.0, 1.0));
  float d = random(i + vec2(1.0, 1.0));
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
}

void main() {
  // Use modulo to create infinite scrolling
  vec2 uv = vUv * repeat;
  uv.y -= mod(time * scrollSpeed, repeat.y);

  float centerStart = 0.5 - (centerWidth / 2.0);
  float centerEnd = 0.5 + (centerWidth / 2.0);

  vec4 grassColor = texture2D(grassTexture, uv);
  vec4 dirtColor = texture2D(dirtTexture, uv);
  vec4 patchColor = texture2D(patchTexture, uv);

  float n = noise(uv * (1.0 / grassPatchSize));
  float patchFactor = smoothstep(grassThreshold - 0.1, grassThreshold + 0.1, n);

  if (vUv.x > centerStart && vUv.x < centerEnd) {
    float rowPosition = fract(vUv.y * rowCount);
    float mixFactor = smoothstep(grassThreshold - 0.05, grassThreshold + 0.05, n);

    gl_FragColor = mix(dirtColor, grassColor, mixFactor);
    gl_FragColor = mix(gl_FragColor, patchColor, patchFactor);
  } else {
    gl_FragColor = grassColor;
  }
}
`;