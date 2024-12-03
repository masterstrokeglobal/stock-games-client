import { useLeaderboard } from "@/hooks/use-leadboard";
import { RoundRecord } from "@/models/round-record";
import { useFrame } from "@react-three/fiber";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import HorseModel from "./horse-model";

// Memoize color array to prevent recreation
const HORSE_COLORS = [
    "#FF6B6B", "#4ECDC4", "#45B7D1", "#FFA07A", "#98D8C8",
    "#F7DC6F", "#B19CD9", "#FF9FF3", "#7FB3D5", "#F1948A",
    "#82E0AA", "#FAD7A0", "#D7BDE2", "#85C1E9", "#F8C471",
    "#73C6B6", "#E59866"
] as const;

type Props = {
    roundRecord: RoundRecord;
};

const HorseAnimation = React.memo(({ roundRecord }: Props) => {
    const numberOfHorses = roundRecord.market.length;
    const animationProgressRef = useRef(0);
    const horsesRef = useRef<(THREE.Object3D | null)[]>([]);

    const [currentPositions, setCurrentPositions] = useState<{ x: number, z: number }[]>([]);
    const [targetPositions, setTargetPositions] = useState<{ x: number, z: number }[]>([]);
    const [isTransitioning, setIsTransitioning] = useState(false);

    const { stocks } = useLeaderboard(roundRecord);

    // Memoize initial positions to prevent unnecessary recalculations
    const initialPositions = useMemo(() => 
        [...Array(numberOfHorses)].map((_, index) => ({
            x: -15 + index * 4 + (Math.random() * 2 - 1),
            z: 0,
        })),
    [numberOfHorses]);

    // Optimize position generation with memoization
    const generateNewPositions = useMemo(() => {
        return roundRecord.market.map((horse, index) => {
            const currentHorse = stocks.find(stock => stock.horse === horse.horse);
            const zBasedOnRank = currentHorse?.rank ? -(currentHorse.rank * 12)+30 : 0;

            return {
                x: -15 + (index) * 4 + (Math.random() * 20),
                z: zBasedOnRank,
            };
        });
    }, [stocks, roundRecord.market]);

    // Reduce effect dependencies and optimize transition logic
    useEffect(() => {
        const newPositions = generateNewPositions;
        setCurrentPositions(prev => prev.length ? prev : initialPositions);
        setTargetPositions(newPositions);
        setIsTransitioning(true);
        animationProgressRef.current = 0;
    }, [generateNewPositions, initialPositions]);

    // Optimize position interpolation
    const updateHorsePositions = useCallback(
        (progress: number) => {
            horsesRef.current.forEach((horse, index) => {
                if (horse && currentPositions[index] && targetPositions[index]) {
                    const currentPos = currentPositions[index];
                    const targetPos = targetPositions[index];
                    
                    // Use lerp for smoother interpolation
                    horse.position.x = THREE.MathUtils.lerp(currentPos.x, targetPos.x, progress);
                    horse.position.z = THREE.MathUtils.lerp(currentPos.z, targetPos.z, progress);
                }
            });
        },
        [currentPositions, targetPositions]
    );

    // Optimize frame updates
    useFrame(() => {
        if (isTransitioning && animationProgressRef.current < 1) {
            // Use a constant transition time instead of delta-based
            animationProgressRef.current = Math.min(
                animationProgressRef.current + 0.016 * .5, // Fixed timestep
                1
            );
            updateHorsePositions(animationProgressRef.current);

            if (animationProgressRef.current >= 1) {
                setCurrentPositions(targetPositions);
                setIsTransitioning(false);
            }
        }
    });

    // Memoize horses rendering data
    const horses = useMemo(() => 
        roundRecord.market.map((stock, index) => {
            const initialPos = currentPositions[index] || initialPositions[index];
            return {
                position: [initialPos.x, 0, initialPos.z],
                scale: [0.05, 0.05, 0.05],
                speed: 1 + Math.random() * 0.2,
                horseNumber: stock.horse,
            };
        }),
    [numberOfHorses, currentPositions, initialPositions]);

    return (
        <>
            {horses.map((horse, index) => (
                <HorseModel
                    key={index}
                    ref={(el) => {
                        horsesRef.current[index] = el as unknown as THREE.Object3D | null;
                    }}
                    number={horse.horseNumber!}
                    color={HORSE_COLORS[index % HORSE_COLORS.length]}
                    position={horse.position as any}
                    scale={horse.scale as any}
                    speed={horse.speed}
                />
            ))}
        </>
    );
});

HorseAnimation.displayName = "HorseAnimation";
export default HorseAnimation;