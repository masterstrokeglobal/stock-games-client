import { useLeaderboard } from "@/hooks/use-leadboard";
import { useLeaderboardAggregation } from "@/hooks/use-mini-mutual-fund-aggrigation";
import MiniMutualFundPlacement from "@/models/mini-mutual-fund";
import { useGetMiniMutualFundCurrentRoundPlacements } from "@/react-query/lobby-query";
import { useGameStore } from "@/store/game-store";
import { useFrame } from "@react-three/fiber";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import HorseModel from "./horse-model";

// Memoized horse colors
const HORSE_COLORS = [
    "#D94D4D", "#3F8B83", "#3B91A5", "#D86F56", "#6F9F96",
    "#C89A3F", "#7F74B3", "#D066C6", "#59829E", "#C97A73",
    "#66B78F", "#E0B870", "#9E83B4", "#699EC7", "#D68A4A",
    "#4D8C7D", "#B7784D"
] as const;

const MAX_Z_POSITION = 60;
const MIN_Z_POSITION = -60;

const controlZPosition = (z: number) => {
    if (z > MAX_Z_POSITION) return MAX_Z_POSITION;
    if (z < MIN_Z_POSITION) return MIN_Z_POSITION;
    return z;
};

const HorseAnimation = React.memo(() => {
    const { lobbyRound } = useGameStore();
    const roundRecord = lobbyRound!.roundRecord!;
    const animationProgressRef = useRef(0);
    const horsesRef = useRef<(THREE.Object3D | null)[]>([]);

    const [currentPositions, setCurrentPositions] = useState<{ x: number, z: number }[]>([]);
    const [targetPositions, setTargetPositions] = useState<{ x: number, z: number }[]>([]);
    const [isTransitioning, setIsTransitioning] = useState(false);

    const { stocks } = useLeaderboard(roundRecord);

    const { data, isSuccess } = useGetMiniMutualFundCurrentRoundPlacements(lobbyRound!.id!);
    const placements = useMemo<MiniMutualFundPlacement[]>(() => {
        return isSuccess ? data.placements : [];
    }, [isSuccess, data]);

    const userPlacements = useLeaderboardAggregation(placements, stocks);

    // Memoize initial positions to prevent unnecessary recalculations
    const initialPositions = useMemo(() =>
        [...Array(userPlacements.length)].map((_, index) => ({
            x: -15 + index * 4 + (Math.random() * 2 - 1),
            z: 0,
        })),
        [userPlacements.length]);

    // Generate positions based on user ranks instead of market
    const generateNewPositions = useMemo(() => {
        return userPlacements.map((user, index) => {
            // Position based on user rank (higher rank = further ahead)
            const zBasedOnRank = user.currentRank ? -(user.currentRank * 8) + 60 : 0;

            return {
                x: -15 + (index) * 4 + (Math.random() * 2 - 1), // Spread horses horizontally
                z: controlZPosition(zBasedOnRank), // Position based on rank
            };
        });
    }, [userPlacements]);

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

            if (animationProgressRef.current >= .9) {
                setCurrentPositions(targetPositions);
                setIsTransitioning(false);
            }
        }
    });

    // Memoize horses rendering data based on users instead of stocks
    const horses = useMemo(() => {
        console.log("Rendering horses");
        return userPlacements.map((user, index) => {
            const initialPos = currentPositions[index] || initialPositions[index] || { x: 0, z: 0 };

            const horseNumber = user.horse;
            return {
                position: [initialPos.x, 0, initialPos.z],
                scale: [0.05, 0.05, 0.05],
                speed: 1 + Math.random() * 0.2,
                horseNumber: horseNumber,
                rank: user.currentRank,
                username: user.username
            };
        });
    }, [userPlacements, currentPositions, initialPositions]);


    return (
        <>
            {horses.map((horse, index) => (
                <HorseModel
                    key={`user-${userPlacements[index].userId}`}
                    ref={(el) => {
                        horsesRef.current[index] = el as unknown as THREE.Object3D | null;
                    }}
                    number={horse.horseNumber}
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