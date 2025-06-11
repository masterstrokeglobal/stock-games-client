import { useTexture } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { CuboidCollider, RigidBody, RigidBodyProps } from "@react-three/rapier";
import { useMemo, useRef } from "react";
import * as THREE from "three";

export function RaceTrack(props: RigidBodyProps) {
  const [asphaltTexture, stripeTexture, patchTexture] = useTexture([
    "/texture/asphalt.jpg",
    "/patch.jpg",
    "/patch.jpg"
  ]);

  useMemo(() => {
    [asphaltTexture, stripeTexture, patchTexture].forEach(texture => {
      texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
      texture.needsUpdate = true;
    });
  }, [asphaltTexture, stripeTexture, patchTexture]);

  const materialRef = useRef<THREE.ShaderMaterial | null>(null);
  const timeRef = useRef(0);

  useFrame((state, delta) => {
    if (materialRef.current) {
      timeRef.current += delta;
      materialRef.current.uniforms.time.value = timeRef.current;
    }
  });

  const uniforms = useMemo(() => ({
    asphaltTexture: { value: asphaltTexture },
    stripeTexture: { value: stripeTexture },
    patchTexture: { value: patchTexture },
    repeat: { value: new THREE.Vector2(240, 240) },
    time: { value: 0 },
    scrollSpeed: { value: 30.0 }, // Increased speed
    trackWidth: { value: 0.4 }, // Width of the race track
    stripeWidth: { value: 0.01 }, // Thinner stripe
    stripeGap: { value: 0.1 }, // Gap between stripes
    stripeCount: { value: 20.0 }, // Number of stripes
    trackEdgeSharpness: { value: 0.04 }, // Sharpness of track edges
  }), [asphaltTexture, stripeTexture, patchTexture]);

  return (
    <RigidBody {...props} type="fixed" colliders={false}>
      <mesh
        receiveShadow={false} // No shadow overlays on patch
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
uniform sampler2D asphaltTexture;
uniform sampler2D stripeTexture;
uniform sampler2D patchTexture;
uniform vec2 repeat;
uniform float time;
uniform float scrollSpeed;
uniform float trackWidth;
uniform float stripeWidth;
uniform float stripeGap;
uniform float stripeCount;
uniform float trackEdgeSharpness;

varying vec2 vUv;

void main() {
  // Calculate repeating UVs
  vec2 uv = vUv * repeat;
  
  // Infinite scrolling for the track
  float scrollOffset = mod(time * scrollSpeed, repeat.y);
  vec2 trackUv = vec2(uv.x, uv.y - scrollOffset);
  
  // Sample textures
  vec4 asphaltColor = texture2D(asphaltTexture, trackUv);
  vec4 patchColor = texture2D(patchTexture, uv);
  
  // Calculate track boundaries
  float trackStart = 0.5 - (trackWidth / 2.0);
  float trackEnd = 0.5 + (trackWidth / 2.0);
  
  // Smooth the edges of the track
  float trackEdge = smoothstep(trackStart - trackEdgeSharpness, trackStart + trackEdgeSharpness, vUv.x) * 
                    (1.0 - smoothstep(trackEnd - trackEdgeSharpness, trackEnd + trackEdgeSharpness, vUv.x));
  
  // Create the animated stripes in the center
  float stripeY = mod(vUv.y * stripeCount - time * scrollSpeed * 0.1, 1.0);
  float stripeFactor = step(stripeGap, stripeY);
  
  // Center stripe position
  float centerLine = 0.5;
  float stripeStart = centerLine - (stripeWidth / 2.0);
  float stripeEnd = centerLine + (stripeWidth / 2.0);
  
  // Determine if we're in the center stripe area
  float isCenterStripe = smoothstep(stripeStart - 0.001, stripeStart + 0.001, vUv.x) * 
                         (1.0 - smoothstep(stripeEnd - 0.001, stripeEnd + 0.001, vUv.x));
  
  // Combine stripe animation with center line position
  float isStripe = isCenterStripe * stripeFactor;
  
  // Create side lines
  float leftLineStart = trackStart + 0.02;
  float leftLineEnd = leftLineStart + 0.01;
  float rightLineStart = trackEnd - 0.03;
  float rightLineEnd = rightLineStart + 0.01;
  
  float isLeftLine = smoothstep(leftLineStart - 0.001, leftLineStart + 0.001, vUv.x) * 
                     (1.0 - smoothstep(leftLineEnd - 0.001, leftLineEnd + 0.001, vUv.x));
  float isRightLine = smoothstep(rightLineStart - 0.001, rightLineStart + 0.001, vUv.x) * 
                      (1.0 - smoothstep(rightLineEnd - 0.001, rightLineEnd + 0.001, vUv.x));
  
  // Combined white lines (center stripe + side lines)
  float isAnyLine = max(isStripe, max(isLeftLine, isRightLine));
  
  // Final color mixing
  vec4 finalColor = mix(patchColor, asphaltColor, trackEdge);
  finalColor = mix(finalColor, vec4(1.0, 1.0, 1.0, 1.0), isAnyLine);
  
  gl_FragColor = finalColor;
}
`;