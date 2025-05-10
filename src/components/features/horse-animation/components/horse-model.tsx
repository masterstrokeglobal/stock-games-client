import { useAnimations, useGLTF, useTexture } from "@react-three/drei";
import { forwardRef, useEffect, useRef, useMemo } from "react";
import * as THREE from "three";
import { clone } from "three/examples/jsm/utils/SkeletonUtils.js";
import HorseNumber from "./horse-number";

type BullModelProps = {
  position: [number, number, number];
  scale: [number, number, number];
  speed: number;
  color: string;
  number: number;
};

const BullModel = forwardRef<THREE.Group, BullModelProps>(
  ({ position, scale, color, number }, ref) => {
    const group = useRef<THREE.Group>(null);
    const { scene, animations } = useGLTF("./bull-anim.glb");

    const texture = useTexture(
      color === "red"
        ? "./texture-red.jpg"
        : color === "green"
          ? "./texture-golden.jpg"
          : "./texture-black.png"
    );

    const clonedScene = useMemo(() => clone(scene), [scene]);
    const { actions } = useAnimations(animations, clonedScene);

    // Assign ref
    useEffect(() => {
      if (ref && group.current) {
        if (typeof ref === "function") ref(group.current);
        else ref.current = group.current;
      }
    }, [ref]);

    // Apply texture and material updates
    useEffect(() => {
      if (!texture) return;

      texture.flipY = false;
      texture.colorSpace = THREE.SRGBColorSpace;
      texture.needsUpdate = true;

      clonedScene.traverse((child) => {
        if ((child as THREE.Mesh).isMesh) {
          const mesh = child as THREE.Mesh;
          mesh.castShadow = true;
          mesh.receiveShadow = true;

          const originalMaterial = mesh.material as THREE.MeshStandardMaterial;
          const newMaterial = originalMaterial.clone();

          newMaterial.map = texture;
          newMaterial.map.colorSpace = THREE.SRGBColorSpace;
          newMaterial.roughness = 1;
          newMaterial.metalness = 0;
          newMaterial.needsUpdate = true;

          mesh.material = newMaterial;
        }
      });
    }, [texture, clonedScene]);

    // Play animation
    useEffect(() => {
      if (actions) {
        Object.values(actions).forEach((action) => {
          // add a delay based on the number of the horse
          action?.setDuration(2.5);
          setTimeout(() => {
            action?.reset().play();
          }, number * 200);
        });
      }
    }, [actions]);

    return (
      <group ref={group} position={position} scale={scale}>
        <primitive object={clonedScene} />
        <HorseNumber
          number={number}
          color={color}
          position={[0, 60,0]}
        />
      </group>
    );
  }
);

BullModel.displayName = "BullModel";


export default BullModel;
