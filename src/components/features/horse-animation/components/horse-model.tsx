import { useAnimations, useGLTF, useTexture } from "@react-three/drei";
import { forwardRef, useEffect, useRef, useMemo } from "react";
import * as THREE from "three";
import { clone } from "three/examples/jsm/utils/SkeletonUtils.js";
import HorseNumber from "./horse-number";
import useWindowSize from "@/hooks/use-window-size";

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
    const { isMobile } = useWindowSize();

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

    // Apply texture/material
    useEffect(() => {
      clonedScene.traverse((child) => {
        if ((child as THREE.Mesh).isMesh) {
          const mesh = child as THREE.Mesh;
          mesh.castShadow = !isMobile;
          mesh.receiveShadow = !isMobile;

          const basicMaterial = new THREE.MeshBasicMaterial();
            texture.flipY = false;
            texture.colorSpace = THREE.SRGBColorSpace;
            texture.needsUpdate = true;

            basicMaterial.map = texture;
            basicMaterial.map.colorSpace = THREE.SRGBColorSpace;

          mesh.material = basicMaterial;
        }
      });
    }, [texture, clonedScene, isMobile]);

    // Play animation
    useEffect(() => {
      if (actions) {
        Object.values(actions).forEach((action) => {
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
          <HorseNumber number={number} color={color} position={[0, 60, 0]} />
      </group>
    );
  }
);

BullModel.displayName = "BullModel";

export default BullModel;
