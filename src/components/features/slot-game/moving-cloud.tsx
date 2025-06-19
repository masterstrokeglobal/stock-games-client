import { useGLTF } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import React, { useMemo, useRef } from "react";
import * as THREE from "three";

type MovingPeopleProps = {
  position?: [number, number, number];
  scale?: [number, number, number];
  rotation?: [number, number, number];
};

const MovingPeople: React.FC<MovingPeopleProps> = ({
  position = [0, 0, 0],
  scale = [0.4, 0.4, 0.4],
  rotation = [0, 0, 0],
}) => {
  const { scene } = useGLTF("/models/roulette/clouds.glb");
  const groupRef = useRef<THREE.Group>(null);

  // Create multiple instances with random scales and positions
  const instances = useMemo(() => {
    const instanceCount = 3; // Number of instances
    const gap = 700; // Gap between instances
    const startZ = 800;
    
    return Array.from({ length: instanceCount }, (_, index) => {
      const model = scene.clone();
      
      // Apply white material to all meshes
      model.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          const whiteMaterial = new THREE.MeshStandardMaterial({
            color: 0xffffff,
            fog: false,
            flatShading: true,
            emissive: 0x444444,
            emissiveIntensity: 0.2,
            side: THREE.DoubleSide
          });
          child.material = whiteMaterial;
        }
      });

      return {
        model,
        initialZ: startZ - (index * gap),
        randomScale: [
            Math.random() * 0.4  + 0.2, // Random scale between 0.2 and 0.6
            Math.random() * 0.4  + 0.2,
            Math.random() * 0.4  + 0.2,
        ] as [number, number, number],
        randomRotation: [
          Math.random() * Math.PI * 2,
          Math.random() * Math.PI * 2,
          Math.random() * Math.PI * 2,
        ] as [number, number, number],
      };
    });
  }, [scene]);

  const speed = 0.1;
  const frequency = 10;
  const startZ = 1000;
  const endZ = -1000;

  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.children.forEach((child) => {
        child.position.z -= speed * frequency * delta * 60;
        
        // Reset position when it goes past the end
        if (child.position.z <= endZ) {
          child.position.z = startZ;
          
          // Randomize scale and rotation when resetting
          const randomScale = [
            Math.random() * 0.6 + 0.2,
            Math.random() * 0.6 + 0.2,
            Math.random() * 0.6 + 0.2,
          ];
          const randomRotation = [
            Math.random() * Math.PI * 2,
            Math.random() * Math.PI * 2,
            Math.random() * Math.PI * 2,
          ];
          
          child.scale.set(randomScale[0], randomScale[1], randomScale[2]);
          child.rotation.set(randomRotation[0], randomRotation[1], randomRotation[2]);
        }
      });
    }
  });

  return (
    <group ref={groupRef} position={position} scale={scale} rotation={rotation}>
      {instances.map((instance, index) => (
        <primitive
          key={index}
          object={instance.model}
          position={[0, 0, instance.initialZ]}
          scale={instance.randomScale}
          rotation={instance.randomRotation}
        />
      ))}
    </group>
  );
};

useGLTF.preload("/models/roulette/clouds.glb");

export default MovingPeople;