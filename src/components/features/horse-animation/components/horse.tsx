import React, { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { PerspectiveCamera, Stats, Sky } from "@react-three/drei";
import { Ground } from "./Ground";
import { Physics } from "@react-three/rapier";
import * as THREE from "three";
import FenceRow from "./fence-row";
import { RoundRecord } from "@/models/round-record";
import { useLeaderboard } from "@/hooks/use-leadboard";
import Horse from "./horse-position";

const horseColors: string[] = [
  "#FF6B6B", "#4ECDC4", "#45B7D1", "#FFA07A", "#98D8C8", "#F7DC6F", "#B19CD9",
  "#FF9FF3", "#7FB3D5", "#F1948A", "#82E0AA", "#FAD7A0", "#D7BDE2", "#85C1E9",
  "#F8C471", "#73C6B6", "#E59866",
];

type Props = {
  roundRecord: RoundRecord;
};

const HorseAnimation: React.FC<Props> = ({ roundRecord }) => {
  const { stocks } = useLeaderboard(roundRecord);
  const leadingHorseRef = useRef<THREE.Object3D | null>(null);

  const numberOfHorses = stocks.length;

  // Generate initial and final positions for horses
  const positions = useMemo(() => {
    const rowSpacing = 10; // Gap between rows
    const colSpacing = 10; // Gap between columns
    const initialPositions = [...Array(numberOfHorses)].map(
      (_, index) => new THREE.Vector3(-15 + index * 5, 0, 0)
    );
    const finalPositions = [...Array(numberOfHorses)].map((_, index) => {
      const row = Math.floor(index / 5); // 5 horses per row
      const col = index % 5; // Horse's column in the row
      return new THREE.Vector3(
        col * colSpacing - (colSpacing * 5) / 2, // Center horizontally
        0,
        row * rowSpacing // Spread rows in the z-direction
      );
    });
    return { initialPositions, finalPositions };
  }, [numberOfHorses]);

  // Track leading horse for camera
  useFrame(() => {
    leadingHorseRef.current = leadingHorseRef.current || null;
  });

  return (
    <>
      <PerspectiveCamera makeDefault fov={75} position={[0, 10, 60]} />
      <color attach="background" args={[0xf0f0f0]} />
      <Sky sunPosition={[100, 20, 100]} />
      <ambientLight intensity={0.3} />
      <pointLight castShadow intensity={0.8} position={[100, 100, 100]} />
      <Physics gravity={[0, -30, 0]}>
        {stocks.map((stock, index) => (
          <Horse
            key={index}
            number={index + 1}
            color={horseColors[index]}
            targetPosition={positions.finalPositions[index]}
            initialPosition={positions.initialPositions[index]}
            ref={(el) => {
              if (index === 0) leadingHorseRef.current = el;
            }}
          />
        ))}
        <Ground />
        <FenceRow x={-35} count={1000} spacing={16} />
        <FenceRow x={85} count={1000} spacing={16} />
      </Physics>
      <Stats />
    </>
  );
};

export default HorseAnimation;
