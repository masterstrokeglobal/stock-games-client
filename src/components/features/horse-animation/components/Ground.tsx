import * as THREE from "three";
import { useTexture } from "@react-three/drei";
import { CuboidCollider, RigidBody, RigidBodyProps } from "@react-three/rapier";
import { useRef } from "react";
import { useFrame } from "@react-three/fiber";

interface GroundProps extends RigidBodyProps {}

export function Ground(props: GroundProps) {
  const [grassTexture, dirtTexture, patchTexture] = useTexture(["/grass.jpg", "/dirt.jpg", "/patch.jpg"]);
  const materialRef = useRef<THREE.ShaderMaterial | any>(null);
  const timeRef = useRef(0);

  grassTexture.wrapS = grassTexture.wrapT = THREE.RepeatWrapping;
  dirtTexture.wrapS = dirtTexture.wrapT = THREE.RepeatWrapping;
  patchTexture.wrapS = patchTexture.wrapT = THREE.RepeatWrapping;

  // Changed direction of texture movement
  useFrame((state, delta) => {
    if (materialRef.current) {
      timeRef.current += delta;
      materialRef.current.uniforms.time.value = timeRef.current;
    }
  });

  return (
    <RigidBody {...props} type="fixed" colliders={false}>
      <mesh receiveShadow position={[25, 0, 0]} rotation-x={-Math.PI / 2}>
        <planeGeometry args={[1000, 1000]} />
        <shaderMaterial
          ref={materialRef}
          attach="material"
          uniforms={{
            grassTexture: { value: grassTexture },
            dirtTexture: { value: dirtTexture },
            patchTexture: { value: patchTexture },
            repeat: { value: [240, 240] },
            time: { value: 0 },
            rowCount: { value: 10.0 },
            centerWidth: { value: 0.12 },
            grassPatchSize: { value: 0.08 },
            grassThreshold: { value: 0.85 },
            movementSpeed: { value:8.0 }, // Added movement speed control
          }}
          vertexShader={vertexShader}
          fragmentShader={fragmentShader}
        />
      </mesh>
      <CuboidCollider args={[1000, 2, 1000]} position={[0, -2, 0]} />
    </RigidBody>
  );
}

const vertexShader = `
  varying vec2 vUv;
  varying vec3 vPosition;
  
  void main() {
    vUv = uv;
    vPosition = position;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const fragmentShader = `
  uniform sampler2D grassTexture;
  uniform sampler2D dirtTexture;
  uniform sampler2D patchTexture;
  uniform vec2 repeat;
  uniform float time;
  uniform float rowCount;
  uniform float centerWidth;
  uniform float grassPatchSize;
  uniform float grassThreshold;
  uniform float movementSpeed;
  varying vec2 vUv;
  varying vec3 vPosition;

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
    // Modified UV calculation for backward movement
    vec2 uv = vUv * repeat;
    
    // Changed direction: positive time for backward movement
vec2 movingUV = uv - vec2(0.0, time * movementSpeed);
    
    float centerStart = 0.5 - (centerWidth / 2.0);
    float centerEnd = 0.5 + (centerWidth / 2.0);
    
    vec4 grassColor = texture2D(grassTexture, movingUV);
    vec4 dirtColor = texture2D(dirtTexture, movingUV);
    vec4 patchColor = texture2D(patchTexture, movingUV);
    
    float n = noise(movingUV * (1.0 / grassPatchSize));
    float patchFactor = smoothstep(grassThreshold - 0.1, grassThreshold + 0.1, n);
    
    if (vUv.x > centerStart && vUv.x < centerEnd) {
      float rowPosition = fract(vUv.y * rowCount);
      float mixFactor = smoothstep(grassThreshold - 0.05, grassThreshold + 0.05, n);
      
      vec4 baseColor = mix(dirtColor, grassColor, mixFactor);
      gl_FragColor = mix(baseColor, patchColor, patchFactor * 0.5);
    } else {
      gl_FragColor = mix(grassColor, patchColor, patchFactor * 0.3);
    }
  }
`;