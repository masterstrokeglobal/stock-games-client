import { useLeaderboard } from "@/hooks/use-leadboard";
import { useLeaderboardAggregation } from "@/hooks/use-mini-mutual-fund-aggrigation";
import MiniMutualFundPlacement from "@/models/mini-mutual-fund";
import { useGetMiniMutualFundCurrentRoundPlacements } from "@/react-query/lobby-query";
import { useGameStore } from "@/store/game-store";
import { useFrame } from "@react-three/fiber";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import FerrariModel from "./ferrari-model";

// Memoized horse colors
export const CAR_COLORS = [
    "#FF0000", // Classic Red           
    "#1C1C1C", // Jet Black  
    "#2E86C1", // Deep Blue  
    "#E67E22", // Sunset Orange  
    "#F1C40F", // Bright Yellow  
    "#16A085", // Teal Green  
    "#7D3C98", // Royal Purple  
    "#BDC3C7", // Silver  
    "#8E44AD", // Metallic Violet  
    "#2C3E50", // Midnight Blue  
    "#E74C3C", // Sporty Scarlet  
    "#34495E", // Graphite Gray  
    "#D35400", // Burnt Orange  
    "#95A5A6", // Light Gray  
    "#27AE60", // Racing Green  
    "#C0392B", // Ferrari Red  
    "#ECF0F1"  // Pearl White  
] as const;

const MAX_Z_POSITION = 60;
const MIN_Z_POSITION = -60;

const controlZPosition = (z: number) => {
    if (z > MAX_Z_POSITION) return MAX_Z_POSITION;
    if (z < MIN_Z_POSITION) return MIN_Z_POSITION;
    return z;
};
const HorseAnimation = React.memo(() => {
    const animationProgressRef = useRef(0);
    const horsesRef = useRef<(THREE.Object3D | null)[]>([]);
    const { userPlacements } = useCarAnimation();

    const [currentPositions, setCurrentPositions] = useState<{ x: number, z: number }[]>([]);
    const [prevPositions, setPrevPositions] = useState<{ x: number, z: number }[]>([]);
    const [targetPositions, setTargetPositions] = useState<{ x: number, z: number }[]>([]);
    const [isTransitioning, setIsTransitioning] = useState(false);

    // Generate new positions based on rank
    const generateNewPositions = useCallback(() => {
        return userPlacements.map((user, index) => ({
            x: -15 + index * 17 + (Math.random() * 10 - 1),
            z: controlZPosition(-(user.currentRank * 25
                + (Math.random() * 10 - 1)
            ) + 60),
        }));
    }, [userPlacements]);

    // Initialize positions when component mounts
    useEffect(() => {
        if (currentPositions.length === 0) {
            const initialPos = generateNewPositions();
            setCurrentPositions(initialPos);
            setPrevPositions(initialPos);
            setTargetPositions(initialPos);
        }
    }, [generateNewPositions, currentPositions.length]);

    // Trigger smooth transition when `userPlacements` change
    useEffect(() => {
        const newPositions = generateNewPositions();

        // Ensure we smoothly transition from the **last rendered positions**, not the last state update
        setPrevPositions(targetPositions);
        setTargetPositions(newPositions);
        setIsTransitioning(true);
        animationProgressRef.current = 0;
    }, [userPlacements]);

    // Interpolating positions smoothly
    const updateHorsePositions = useCallback((progress: number) => {
        horsesRef.current.forEach((horse, index) => {
            if (horse && prevPositions[index] && targetPositions[index]) {
                const prevPos = prevPositions[index];
                const targetPos = targetPositions[index];

                horse.position.x = THREE.MathUtils.lerp(prevPos.x, targetPos.x, progress);
                horse.position.z = THREE.MathUtils.lerp(prevPos.z, targetPos.z, progress);
            }
        });
    }, [prevPositions, targetPositions]);

    // Smooth transition on each frame
    useFrame(() => {
        if (isTransitioning && animationProgressRef.current < 1) {
            animationProgressRef.current = Math.min(animationProgressRef.current + 0.02, 1);
            updateHorsePositions(animationProgressRef.current);

            if (animationProgressRef.current >= 1) {
                setCurrentPositions(targetPositions);
                setIsTransitioning(false);
            }
        }
    });

    return (
        <>
            {userPlacements.map((user, index) => (
                <FerrariModel
                    key={`user-${user.userId}`}
                    ref={(el) => { horsesRef.current[index] = el as THREE.Object3D | null; }}
                    position={[currentPositions[index]?.x || 0, 0, currentPositions[index]?.z || 0]}
                    bodyColor={CAR_COLORS[user.horse]}
                    detailsColor="#000000"
                    speed={1.2}
                    glassColor="#000000"
                    scale={[5, 5, 5]}
                    showShadow={true}
                />
            ))}
        </>
    );
});

HorseAnimation.displayName = "HorseAnimation";

const useCarAnimation = () => {
    const { lobbyRound } = useGameStore();
    const roundRecord = lobbyRound!.roundRecord!;
    const { stocks } = useLeaderboard(roundRecord);

    const { data, isSuccess } = useGetMiniMutualFundCurrentRoundPlacements(lobbyRound!.id!);

    const placements = useMemo<MiniMutualFundPlacement[]>(() => {
        return isSuccess ? data.placements : [];
    }, [isSuccess, data]);

    const userPlacements = useLeaderboardAggregation(placements, stocks);

    return { userPlacements };
};
export default HorseAnimation;