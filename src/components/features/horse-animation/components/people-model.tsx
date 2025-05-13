import { useGLTF } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import React, { useRef, useMemo } from "react";
import useWindowSize from "@/hooks/use-window-size";

type MovingPeopleProps = {
  position?: [number, number, number];
  scale?: [number, number, number];
  rotation?: [number, number, number];
};

let cachedModel: THREE.Group | null = null;

const MovingPeople: React.FC<MovingPeopleProps> = ({
  position = [0, 0, 0],
  scale = [1, 1, 1],
  rotation = [0, 0, 0],
}) => {
  const { scene } = useGLTF("/people.glb");
  const groupRef = useRef<THREE.Group>(null);
  const { isMobile } = useWindowSize();

  const model = useMemo(() => {
    if (!cachedModel) {
      cachedModel = scene.clone();
      cachedModel.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          if (child.geometry && isMobile) {
            child.geometry = child.geometry.clone();
            if (child.geometry.attributes.position.count > 1000) {
              const oldPos = child.geometry.attributes.position.array;
              const newPos = new Float32Array(Math.floor(oldPos.length / 2));
              for (let i = 0, j = 0; i < oldPos.length; i += 6, j += 3) {
                newPos[j] = oldPos[i];
                newPos[j + 1] = oldPos[i + 1];
                newPos[j + 2] = oldPos[i + 2];
              }
              child.geometry.setAttribute("position", new THREE.BufferAttribute(newPos, 3));
            }
          }

          if (child.material) {
            const mat = child.material.clone();
            mat.fog = false;
            mat.flatShading = true;
            if (isMobile && mat instanceof THREE.MeshStandardMaterial) {
              mat.roughness = 1;
              mat.metalness = 0;
              mat.envMapIntensity = 0;
              mat.precision = "lowp";
              if (mat.map) {
                mat.map.minFilter = THREE.NearestFilter;
                mat.map.magFilter = THREE.NearestFilter;
                mat.map.anisotropy = 1;
              }
            }
            child.material = mat;
          }
        }
      });
    }

    return cachedModel.clone();
  }, [scene, isMobile]);

  const speed = .1; // Base speed
  const frequency = 50; // Increase the frequency multiplier here
  const startZ = 800;
  const endZ = -800;

  // Use delta time to make movement frame-rate independent, but now with increased frequency
  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.position.z -= speed * frequency * delta * 60; // Increased frequency multiplier
      if (groupRef.current.position.z <= endZ) {
        groupRef.current.position.z = startZ;
      }
    }
  });

  return (
    <group
      ref={groupRef}
      position={[position[0], position[1], startZ]}
      scale={scale}
      rotation={rotation}
    >
      <primitive object={model} />
    </group>
  );
};

useGLTF.preload("/people.glb");

export default MovingPeople;
