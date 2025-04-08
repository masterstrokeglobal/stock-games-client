import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";

const MAX_Z_POSITION = 60;
const MIN_Z_POSITION = -60;

// Controls the Z position to keep within boundaries
const controlZPosition = (z: number): number => {
    if (z > MAX_Z_POSITION) return MAX_Z_POSITION;
    if (z < MIN_Z_POSITION) return MIN_Z_POSITION;
    return z;
};

// Animation speed constants
const ANIMATION_SPEED = 0.5;
const FRAME_DELTA = 0.016;

/**
 * Custom hook for car animation logic
 * @param userPlacements Array of user placement data
 * @returns Animation state and control methods
 */
export const useCarAnimation = (userPlacements: any[]) => {
    const animationProgressRef = useRef(0);
    const carsRef = useRef<(THREE.Object3D | null)[]>([]);

    const [currentPositions, setCurrentPositions] = useState<Array<{ x: number, z: number }>>([]);
    const [targetPositions, setTargetPositions] = useState<Array<{ x: number, z: number }>>([]);
    const [isTransitioning, setIsTransitioning] = useState(false);

    // Create memoized initial positions
    const initialPositions = useMemo(() =>
        [...Array(userPlacements.length)].map((_, index) => ({
            x: -15 + index * 4 + (Math.random() * 2 - 1),
            z: 0,
        })),
        [userPlacements.length]);

    // Generate new target positions based on rankings
    const generateNewPositions = useCallback(() => {
        return userPlacements.map((user, index) => {
            // Calculate Z position based on rank (higher rank = further ahead)
            const zBasedOnRank = user.currentRank ? -(user.currentRank * 20) + 60 : 0;

            // Calculate lane position (3 lanes side by side)
            const lane = index % 3;
            const laneWidth = 10;
            const laneOffset = lane * laneWidth - laneWidth;

            // Calculate row position for visual separation
            const row = Math.floor(index / 3);
            const rowOffset = row * 5;

            return {
                // Position cars in lanes
                x: -10 + laneOffset + (Math.random() * 1.5 - 0.75),
                // Position based on rank with row offset
                z: controlZPosition(zBasedOnRank + rowOffset),
            };
        });
    }, [userPlacements]);

    // Set up positions when user data changes
    useEffect(() => {
        if (userPlacements.length === 0) return;

        const newPositions = generateNewPositions();
        setCurrentPositions(prev => prev.length ? prev : initialPositions);
        setTargetPositions(newPositions);
        setIsTransitioning(true);
        animationProgressRef.current = 0;
    }, [generateNewPositions, initialPositions, userPlacements]);

    // Update car positions during animation
    const updateCarPositions = useCallback(
        (progress: number) => {
            carsRef.current.forEach((car, index) => {
                if (car && currentPositions[index] && targetPositions[index]) {
                    const currentPos = currentPositions[index];
                    const targetPos = targetPositions[index];

                    // Apply position updates with smooth interpolation
                    car.position.x = THREE.MathUtils.lerp(currentPos.x, targetPos.x, progress);
                    car.position.z = THREE.MathUtils.lerp(currentPos.z, targetPos.z, progress);

                    // Optional: Add slight rotation based on movement for visual interest
                    if (Math.abs(targetPos.x - currentPos.x) > 0.1) {
                        const rotationDirection = targetPos.x > currentPos.x ? 1 : -1;
                        car.rotation.y = (1 - progress) * rotationDirection * 0.1;
                    } else {
                        car.rotation.y = 0;
                    }
                }
            });
        },
        [currentPositions, targetPositions]
    );

    // Cubic easing function for smoother motion
    const easeInOutCubic = (t: number): number => {
        return t < 0.5
            ? 4 * t * t * t
            : 1 - Math.pow(-2 * t + 2, 3) / 2;
    };

    // Frame update function for the animation
    const frameUpdate = useCallback(() => {
        if (isTransitioning && animationProgressRef.current < 1) {
            // Update progress
            animationProgressRef.current = Math.min(
                animationProgressRef.current + FRAME_DELTA * ANIMATION_SPEED,
                1
            );

            // Apply easing for smoother movement
            const easedProgress = easeInOutCubic(animationProgressRef.current);
            updateCarPositions(easedProgress);

            // Animation complete check
            if (animationProgressRef.current >= 0.99) {
                setCurrentPositions(targetPositions);
                setIsTransitioning(false);
            }

            return true; // Animation is still running
        }
        return false; // Animation complete
    }, [isTransitioning, updateCarPositions, targetPositions]);

    // Force animation reset (can be called externally if needed)
    const resetAnimation = useCallback(() => {
        if (userPlacements.length === 0) return;

        const newPositions = generateNewPositions();
        setCurrentPositions(initialPositions);
        setTargetPositions(newPositions);
        setIsTransitioning(true);
        animationProgressRef.current = 0;
    }, [generateNewPositions, initialPositions, userPlacements]);

    return {
        carsRef,
        currentPositions,
        initialPositions,
        frameUpdate,
        resetAnimation,
        isAnimating: isTransitioning
    };
};