import React, { useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

interface CameraControllerProps {
  target: React.MutableRefObject<THREE.Object3D | null>;
}

const CameraController: React.FC<CameraControllerProps> = ({ target }) => {
  const { camera } = useThree();
  const targetRef = useRef(new THREE.Vector3());

  useFrame(() => {
    if (target.current) {
      const targetPosition = target.current.position;
      targetRef.current.set(
        targetPosition.x,
        targetPosition.y + 15,
        targetPosition.z + 40
      );
      camera.position.lerp(targetRef.current, 0.1);
      camera.lookAt(targetPosition as any);
    }
  });

  return null;
};

CameraController.displayName = "CameraController";

export default CameraController;