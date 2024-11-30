import React, { useMemo, useRef, useState, useCallback, useEffect } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import {
    PerspectiveCamera,
    Stats,
    Sky,
    OrbitControls,
} from "@react-three/drei";
import HorseModel from "./horse-model";
import { Ground } from "./Ground";
import { Physics } from "@react-three/rapier";
import * as THREE from "three";
import FenceRow from "./fence-row";
import { RoundRecord } from "@/models/round-record";
import { useLeaderboard } from "@/hooks/use-leadboard";


const horseColors = [
    "#FF6B6B",
    "#4ECDC4",
    "#45B7D1",
    "#FFA07A",
    "#98D8C8",
    "#F7DC6F",
    "#B19CD9",
    "#FF9FF3",
    "#7FB3D5",
    "#F1948A",
    "#82E0AA",
    "#FAD7A0",
    "#D7BDE2",
    "#85C1E9",
    "#F8C471",
    "#73C6B6",
    "#E59866",
];

type Props = {
    roundRecord: RoundRecord;
};
const HorseAnimation = ({ roundRecord }: Props) => {
    const numberOfHorses = roundRecord.market.length;
    const animationProgressRef = useRef(0);
    const horsesRef = useRef<(THREE.Object3D | null)[]>([]);

    // New state for tracking position changes
    const [currentPositions, setCurrentPositions] = useState<{ x: number, z: number }[]>([]);
    const [targetPositions, setTargetPositions] = useState<{ x: number, z: number }[]>([]);
    const [isTransitioning, setIsTransitioning] = useState(false);

    const { stocks } = useLeaderboard(roundRecord);

    // Initial positions setup
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


    // Function to generate new random positions
    const generateNewPositions = useCallback(() => {
        return horses.map((horse) => {
            const currentHorse = stocks.find((stock) => {
                return stock.horse === horse.horseNumber;
            });

            const horseRank = currentHorse?.rank ? currentHorse.rank : 0;
            console.log(currentHorse?.rank, currentHorse?.horse);

            const zBasedOnRank = horseRank ? -horseRank * 12 : 0;

            return {
                x: Math.random() * 50,
                z: zBasedOnRank || 0,
            };
        })
    }, [numberOfHorses, stocks]);

    // Periodic position change effect
    useEffect(() => {
        const positionChangeInterval = setInterval(() => {
            const newPositions = generateNewPositions();
            console.log(currentPositions.length);
            setCurrentPositions(prev => prev.length ? prev : initialPositions);
            setTargetPositions(newPositions);
            setIsTransitioning(true);
            animationProgressRef.current = 0;
        }, 4000);

        return () => clearInterval(positionChangeInterval);
    }, [generateNewPositions, initialPositions]);

    // Smooth position interpolation
    const updateHorsePositions = useCallback(
        (progress: number) => {
            horsesRef.current.forEach((horse, index) => {
                if (horse && currentPositions[index] && targetPositions[index]) {
                    const currentPos = currentPositions[index];
                    const targetPos = targetPositions[index];
                    horse.position.x = currentPos.x + (targetPos.x - currentPos.x) * progress;
                    horse.position.z = currentPos.z + (targetPos.z - currentPos.z) * progress;
                }
            });
        },
        [currentPositions, targetPositions]
    );

    useFrame((_, delta) => {
        if (isTransitioning && animationProgressRef.current < 1) {
            animationProgressRef.current = Math.min(
                animationProgressRef.current + delta / 2, // Slower transition (2 seconds)
                1
            );
            updateHorsePositions(animationProgressRef.current);

            // End transition when progress reaches 1
            if (animationProgressRef.current >= 1) {
                console.log("Transition ended");
                setCurrentPositions(targetPositions);
                setIsTransitioning(false);
            }
        }
    });

    const horses = useMemo(() => {
        return roundRecord.market.map((stock, index) => {
            const initialPos = currentPositions[index] || initialPositions[index];
            return {
                position: [initialPos.x, 0, initialPos.z],
                scale: [0.05, 0.05, 0.05],
                speed: 1 + Math.random() * 0.2,
                horseNumber: stock.horse,
            };
        });
    }, [numberOfHorses, currentPositions, initialPositions]);

    // Rest of the component remains the same as in the original code
    return (
        <>

            {horses.map((horse, index) => (
                <HorseModel
                    key={index}
                    ref={(el) => {
                        horsesRef.current[index] = el as unknown as THREE.Object3D | null;
                    }}
                    number={horse.horseNumber!}
                    color={horseColors[index]}
                    position={horse.position as any}
                    scale={horse.scale as any}
                    speed={horse.speed}
                />
            ))}

        </>
    );
};



HorseAnimation.displayName = "HorseAnimation";
export default HorseAnimation;