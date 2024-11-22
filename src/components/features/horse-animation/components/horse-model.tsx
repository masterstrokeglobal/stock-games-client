import React, { useRef, useEffect, forwardRef } from "react";
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
    const group = useRef<THREE.Group | any>(null);
    const { scene, animations } = useLoader(GLTFLoader, "./horse.glb");
    const mixer = useRef<THREE.AnimationMixer | null>(null);
    const horseNumberRef = useRef<any>(null); // Reference for HorseNumber

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
          ref={(el: any) => {
            group.current = el;
            if (typeof ref === "function") ref(el);
            else if (ref) ref.current = el;
          }}
        />
        <HorseNumber
          ref={horseNumberRef} // Pass the ref to HorseNumber
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
