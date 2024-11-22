import React, { useMemo, useRef, useState, useCallback } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import HorseModel from "./horse-model";
import { RoundRecord } from "@/models/round-record";
import { useLeaderboard } from "@/hooks/use-leadboard";
import CameraController from "./camera-controller";

const horseColors = [
  "#FF6B6B", "#4ECDC4", "#45B7D1", "#FFA07A", "#98D8C8", "#F7DC6F", "#B19CD9",
  "#FF9FF3", "#7FB3D5", "#F1948A", "#82E0AA", "#FAD7A0", "#D7BDE2", "#85C1E9",
  "#F8C471", "#73C6B6", "#E59866",
];

type HorseRaceSimulationProps = {
  roundRecord: RoundRecord;
};

const HorseRaceSimulation: React.FC<HorseRaceSimulationProps> = ({ roundRecord }) => {
  const { stocks } = useLeaderboard(roundRecord);
  const numberOfHorses = stocks.length;
  const animationProgressRef = useRef(0);
  const [leadingHorseIndex] = useState(0);
  const focusedHorseRef = useRef<THREE.Object3D | null>(null);
  const horsesRef = useRef<(THREE.Object3D | null)[]>([]);
  const animationDuration = 10;

  const initialPositions = useMemo(() => {
    return [...Array(numberOfHorses)].map((_, index) => {
      const baseX = -15;
      const gap = 4 + index * (Math.random() * 0.1);
      return {
        x: baseX + gap * index,
        z: 0,
      };
    });
  }, [numberOfHorses]);

  const finalPositions = useMemo(() => {
    return [...Array(numberOfHorses)].map((_, index) => ({
      x: (Math.random() - 0.5) * 60,
      z: index * 5 + (Math.random() - 0.5) * 5,
    }));
  }, [numberOfHorses]);

  const updateHorsePositions = useCallback(
    (progress: number) => {
      horsesRef.current.forEach((horse, index) => {
        if (horse) {
          const initialPos = initialPositions[index];
          const finalPos = finalPositions[index];
          horse.position.x = initialPos.x + (finalPos.x - initialPos.x) * progress;
          horse.position.z = initialPos.z + (finalPos.z - initialPos.z) * progress;
        }
      });
    },
    [initialPositions, finalPositions]
  );

  useFrame((_, delta) => {
    if (animationProgressRef.current < 1) {
      animationProgressRef.current = Math.min(
        animationProgressRef.current + delta / animationDuration,
        1
      );
      updateHorsePositions(animationProgressRef.current);
    }
  });

  const horses = useMemo(() => {
    return stocks.map((stock, index) => {
      const isLeading = index === leadingHorseIndex;
      return {
        position: [initialPositions[index].x, 0, initialPositions[index].z],
        scale: [0.05, 0.05, 0.05],
        speed: isLeading ? 1.2 : 1 + Math.random() * 0.2,
        isLeading,
      };
    });
  }, [stocks, leadingHorseIndex, initialPositions]);

  return (
    <>
      <CameraController target={focusedHorseRef} />
      
      {horses.map((horse, index) => (
        <HorseModel
          key={stocks[index].id}
          ref={(el) => {
            horsesRef.current[index] = el as unknown as THREE.Object3D;
            if (horse.isLeading) focusedHorseRef.current = el as unknown as THREE.Object3D;
          }}
          number={index + 1}
          color={horseColors[index % horseColors.length]}
          position={horse.position as any}
          scale={horse.scale as any}
          speed={horse.speed}
        />
      ))}
    </>
  );
};

export default HorseRaceSimulation;