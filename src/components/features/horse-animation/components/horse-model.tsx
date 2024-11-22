import React, { useRef, useEffect, forwardRef, useImperativeHandle } from "react";
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

export type HorseModelRef = {
  setPosition: (newPosition: [number, number, number]) => void;
};

const HorseModel = forwardRef<HorseModelRef, HorseModelProps>(
  ({ position, scale, speed, color, number }, ref) => {
    const group = useRef<THREE.Group | null>(null);
    const { scene, animations } = useLoader(GLTFLoader, "./horse.glb");
    const mixer = useRef<THREE.AnimationMixer | null>(null);
    const horseNumberRef = useRef<any>(null);
    const currentPosition = useRef<[number, number, number]>(position);

    // Expose imperative methods to parent component
    useImperativeHandle(ref, () => ({
      setPosition: (newPosition: [number, number, number]) => {
        if (group.current) {
          // Directly update the position without re-rendering
          group.current.position.set(...newPosition);
          currentPosition.current = newPosition;

          // Also update the horse number position
          if (horseNumberRef.current) {
            horseNumberRef.current.position.set(
              newPosition[0],
              newPosition[1] + 3,
              newPosition[2]
            );
          }
        }
      }
    }));

    useEffect(() => {
      if (group.current) {
        group.current.position.set(...position);
        group.current.scale.set(...scale);
      }

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
              object.material = object.material.clone();
              object.material.color.set(new THREE.Color(color));
            }
          }
        }
      );

      mixer.current = new THREE.AnimationMixer(model);
      if (animations.length) {
        const action = mixer.current.clipAction(animations[0]);
        action.setDuration(1 / speed);
        action.play();
      }

      if (group.current) {
        group.current.add(model);
      }

      return () => {
        if (mixer.current) {
          mixer.current.stopAllAction();
        }
      };
    }, [scene, animations, position, scale, speed, color]);

    useFrame((_, delta) => {
      if (mixer.current) {
        mixer.current.update(delta);
      }

      if (group.current) {
        // Move the horse forward along the positive z-axis
        group.current.position.z += speed * delta * 0.5;

        // Update current position tracking
        currentPosition.current = [
          group.current.position.x,
          group.current.position.y,
          group.current.position.z
        ];

        // Update HorseNumber's position to follow the horse
        if (horseNumberRef.current) {
          horseNumberRef.current.position.set(
            group.current.position.x,
            group.current.position.y + 3, // Adjust Y-offset if necessary
            group.current.position.z
          );
        }
      }
    });

    return (
      <>
        <group
          ref={group}
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