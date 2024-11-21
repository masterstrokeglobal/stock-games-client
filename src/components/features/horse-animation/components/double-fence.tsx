import React, { useMemo } from "react";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";

type FenceSegmentProps = {
  position: [number, number, number];
  rotation: [number, number, number];
  scale: [number, number, number];
};

const FenceSegment: React.FC<FenceSegmentProps> = ({
  position,
  rotation,
  scale,
}) => {
  const { scene } = useGLTF("/fence.glb");
  const clonedScene = useMemo(() => scene.clone(), [scene]);

  const fenceMaterial = useMemo(
    () => new THREE.MeshStandardMaterial({ color: 0x8b4513 }),
    []
  ); // Brown color

  React.useEffect(() => {
    clonedScene.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.material = fenceMaterial;
      }
    });
  }, [clonedScene, fenceMaterial]);

  return (
    <primitive
      object={clonedScene}
      position={position}
      rotation={rotation}
      scale={scale}
    />
  );
};

type MultipleFenceSetupProps = {
  trackLength: number; // The length of the track along the X-axis
  fenceSegmentLength: number; // The length of each fence segment
  trackWidth: number; // The width of the track (space between two fence lines)
};

const MultipleFenceSetup: React.FC<MultipleFenceSetupProps> = ({
  trackLength,
  fenceSegmentLength,
  trackWidth,
}) => {
  const fencePositions = [];

  // Define offsets for two parallel fence lines on either side of the track
  const fenceOffset = trackWidth / 2;

  // Calculate the number of segments needed along the length of the track
  const numberOfSegments = Math.ceil(trackLength / fenceSegmentLength);

  for (let i = 0; i < numberOfSegments; i++) {
    const zPosition = i * fenceSegmentLength; // Position segments side by side along the Z-axis

    // Left side fence positions (offset to the left of the track)
    fencePositions.push({
      position: [0, 0, zPosition - fenceOffset], // Place fences horizontally along the Z-axis, offset on the left side
      rotation: [0, 0, 0], // No rotation; fence remains horizontal
      scale: [1, 1, 1],
    });

    // Right side fence positions (offset to the right of the track)
    fencePositions.push({
      position: [0, 0, zPosition + fenceOffset], // Place fences horizontally along the Z-axis, offset on the right side
      rotation: [0, 0, 0], // No rotation; fence remains horizontal
      scale: [1, 1, 1],
    });
  }

  return (
    <>
      {fencePositions.map((props, index) => (
        <FenceSegment
          key={index}
          position={props.position as any}
          rotation={props.rotation as any}
        scale={props.scale as any}
        />
      ))}
    </>
  );
};

export default MultipleFenceSetup;
