import React, { useRef, useEffect, forwardRef, useMemo } from "react";
import { useFrame, useLoader } from "@react-three/fiber";
import * as THREE from "three";
import { GLTFLoader } from "./GLTFLoader";
import HorseNumber from "./horse-number";

type HorseModelProps = {
  position: [number, number, number];
  scale: [number, number, number];
  speed: number;
  color: string;
  number: number;
};

const HorseModel = forwardRef<THREE.Group, HorseModelProps>(
  ({ position, scale, speed, color, number }, ref) => {
    const group = useRef<THREE.Group | null>(null);
    const { scene, animations } = useLoader(GLTFLoader, "/horse.glb");
    const mixer = useRef<THREE.AnimationMixer | null>(null);
    const horseNumberRef = useRef<any>(null);

    // Memoize the cloned and colored scene
    const coloredScene = useMemo(() => {
      const model = scene.clone();
      model.traverse(
        (object: {
          castShadow: boolean;
          receiveShadow: boolean;
          material: THREE.MeshStandardMaterial;
        }) => {
          if (object instanceof THREE.Mesh) {
            object.castShadow = true;
            object.receiveShadow = true;

            // Apply color to the mesh
            if (object.material instanceof THREE.MeshStandardMaterial) {
              const clonedMaterial = object.material.clone();
              clonedMaterial.color.set(new THREE.Color(color));
              object.material = clonedMaterial;
            }
          }
        }
      );
      return model;
    }, [scene, color]);

    useEffect(() => {
      if (!group.current) return;

      // Clear any existing children
      while (group.current.children.length > 0) {
        group.current.remove(group.current.children[0]);
      }

      // Add the colored scene to the group
      group.current.add(coloredScene);

      // Setup animation mixer
      mixer.current = new THREE.AnimationMixer(coloredScene);

      if (animations.length) {
        const action = mixer.current.clipAction(animations[0]);
        action.setDuration(1 / speed);
        action.play();
      }

      // Set initial position and scale
      group.current.position.set(...position);
      group.current.scale.set(...scale);

      return () => {
        if (mixer.current) {
          mixer.current.stopAllAction();
        }
      };
    }, [coloredScene, animations, position, scale, speed]);

    useFrame((_, delta) => {
      if (mixer.current) {
        mixer.current.update(delta);
      }

      if (group.current) {
        // Move the horse forward along the positive z-axis
        group.current.position.z += speed * delta * 0.5;

        // Update HorseNumber's position to follow the horse
        if (horseNumberRef.current) {
          horseNumberRef.current.position.set(
            group.current.position.x,
            group.current.position.y + 3,
            group.current.position.z
          );
        }
      }
    });

    return (
      <>
        <group
          ref={(el: any) => {
            group.current = el;
            if (typeof ref === "function") ref(el);
            else if (ref) ref.current = el;
          }}
        />
        <HorseNumber
          ref={horseNumberRef}
          position={position}
          color={color}
          number={number}
        />
      </>
    );
  }
);

HorseModel.displayName = "HorseModel";

export default HorseModel;