"use client";
import {
  RoundRecord,
  WHEEL_COLOR_CONFIG,
  WHEEL_COLOR_SEQUENCE,
} from "@/models/round-record";
import { MarketItem } from "@/models/market-item";
import { useRef, useState, useCallback, useEffect, useMemo } from "react";
import { gsap } from "gsap";
import { WheelColor } from "@/models/wheel-of-fortune-placement";
import { getStockName } from "@/components/common/StockName";

interface WheelProps {
  isSpinning: boolean;
  roundRecord?: RoundRecord;
  winningMarketId: number[] | null;
  onSpinComplete?: () => void;
}

export const Wheel: React.FC<WheelProps> = ({
  isSpinning,
  roundRecord,
  winningMarketId,
  onSpinComplete,
}) => {
  const wheelRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<number | null>(null);

  // GSAP animation state
  const currentSpeedRef = useRef<number>(0);
  const spinTweenRef = useRef<gsap.core.Tween | null>(null);
  const isAnimatingRef = useRef<boolean>(false);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // State to track wheel rotation in degrees (0-359)
  const [wheelRotationDegrees, setWheelRotationDegrees] = useState<number>(
    () => {
      if (typeof window !== "undefined") {
        const saved = localStorage.getItem("wheelRotationDegrees");
        return saved ? parseFloat(saved) : 0;
      }
      return 0;
    }
  );

  // Keep track of raw rotation (not normalized) for accurate target calculation
  const rawRotationRef = useRef<number>(
    typeof window !== "undefined" 
      ? (localStorage.getItem("wheelRotationDegrees") ? parseFloat(localStorage.getItem("wheelRotationDegrees")!) : 0)
      : 0
  );

  // State to track target rotation for stopping
  const targetRotationRef = useRef<number | null>(null);

  const stocks: MarketItem[] = useMemo(() => {
    const originalMarkets = roundRecord?.market || [];
    const marketColors = roundRecord?.marketColors || [];
    if (originalMarkets.length === 0 || marketColors.length === 0) return [];

    // Reorder according to WHEEL_COLOR_SEQUENCE
    // Each index in marketColors corresponds to a segment position in the wheel
    const reorderedStocks = WHEEL_COLOR_SEQUENCE.map((_, segmentIndex) => {
      // Get the market for this specific segment index
      const marketColorEntry = marketColors[segmentIndex];

      if (!marketColorEntry) return null;

      // Find the corresponding market item
      const marketItem = originalMarkets.find(
        (market: MarketItem) => market.id === marketColorEntry.marketId
      );

      return marketItem || null;
    }).filter((stock) => stock !== null);

    return reorderedStocks;
  }, [roundRecord]);

  // GSAP Animation constants
  const MAX_SPIN_SPEED = 8; // Maximum rotation speed (degrees per frame)
  const ACCELERATION_TIME = 3.0; // Time to reach max speed (seconds)
  const DECELERATION_TIME = 1.0; // Time to stop from max speed (seconds)

  // Animation loop with frame rate limiting
  const animate = useCallback(() => {
    if (!wheelRef.current) return;

    // Apply rotation to wheel using current speed
    if (Math.abs(currentSpeedRef.current) > 0) {
      const rotationIncrement = currentSpeedRef.current;

      // Update rotation state
      setWheelRotationDegrees((prevDegrees) => {
        const rawDegrees = prevDegrees + rotationIncrement;
        const newDegrees = Math.abs(rawDegrees % 360);

        // Update raw rotation reference for accurate target calculation
        rawRotationRef.current = rawDegrees;

        if (typeof window !== "undefined") {
          localStorage.setItem("wheelRotationDegrees", newDegrees.toString());
        }

        // Apply the rotation to the wheel element
        if (wheelRef.current) {
          wheelRef.current.style.transform = `rotate(${rawDegrees}deg)`;
        }

        // Check if we've reached the target rotation (within tolerance)
        if (targetRotationRef.current !== null) {
          const tolerance = 2; // tight tolerance for accurate stopping

          const currentRawRotation = rawRotationRef.current;
          const targetRawRotation = targetRotationRef.current;
          
          // Check if we've reached or passed the target rotation
          const hasReachedTarget = currentRawRotation >= targetRawRotation;
          
          // Calculate how close we are to the target
          const distanceToTarget = Math.abs(targetRawRotation - currentRawRotation);

          console.log("loki Stopping check:", {
            currentRawRotation: currentRawRotation.toFixed(2),
            targetRawRotation: targetRawRotation.toFixed(2),
            distanceToTarget: distanceToTarget.toFixed(2),
          });

          // Stop if we've reached the target or are very close
          if (hasReachedTarget || distanceToTarget <= tolerance) {
            const finalPosition = currentRawRotation % 360;
            console.log("loki Target reached! Stopping wheel at position:", currentRawRotation.toFixed(2), "Final normalized position:", finalPosition.toFixed(2));
            
            // Clear the target and stop spinning immediately
            targetRotationRef.current = null;
            // Stop immediately by setting speed to 0
            currentSpeedRef.current = 0;
            isAnimatingRef.current = false;
            
            // Kill any active tween
            if (spinTweenRef.current) {
              spinTweenRef.current.kill();
              spinTweenRef.current = null;
            }
            
            // Call completion callback
            if (onSpinComplete) {
              onSpinComplete();
            }
          }
        }

        if (!isSpinning && currentSpeedRef.current !== 0) {
          currentSpeedRef.current = 0;
          isAnimatingRef.current = false;
          if (spinTweenRef.current) {
            spinTweenRef.current.kill();
            spinTweenRef.current = null;
          }
          if (onSpinComplete) {
            onSpinComplete();
          }
        }

        return newDegrees;
      });
    }

    frameRef.current = requestAnimationFrame(animate);
  }, [onSpinComplete, isSpinning]);

  // GSAP-powered spin control
  const startSpinning = useCallback(() => {
    // Kill any existing tween
    if (spinTweenRef.current) {
      spinTweenRef.current.kill();
    }

    // Animate to full speed
    spinTweenRef.current = gsap.to(currentSpeedRef, {
      current: MAX_SPIN_SPEED,
      duration: ACCELERATION_TIME,
      ease: "power2.out",
      onComplete: () => {
        isAnimatingRef.current = true;
      },
    });
  }, [MAX_SPIN_SPEED, ACCELERATION_TIME]);

  const stopSpinning = useCallback(() => {
    // Kill any existing tween
    if (spinTweenRef.current) {
      spinTweenRef.current.kill();
    }

    // Animate to stop
    spinTweenRef.current = gsap.to(currentSpeedRef, {
      current: 0,
      duration: DECELERATION_TIME,
      ease: "power2.in",
      onComplete: () => {
        isAnimatingRef.current = false;
        if (onSpinComplete) {
          onSpinComplete();
        }
      },
    });
  }, [DECELERATION_TIME, onSpinComplete]);

  // Handle spin state changes
  useEffect(() => {
    // Additional safety checks before allowing spin
    if (roundRecord) {
      const currentTime = new Date().getTime();
      const placementEndTime = new Date(roundRecord.placementEndTime).getTime();
      const gameEndTime = new Date(roundRecord.endTime).getTime();

      // Ensure we're in the correct time window for spinning
      const isBettingClosed = currentTime >= placementEndTime;
      const isGameStillActive = currentTime < gameEndTime;

      // Only start spinning if all conditions are met
      if (
        isSpinning &&
        isBettingClosed &&
        isGameStillActive &&
        !winningMarketId
      ) {
        startSpinning();
        // Clear any existing target when starting new spin
        targetRotationRef.current = null;
      } else if (isSpinning && (!isBettingClosed || !isGameStillActive)) {
        // Don't spin if betting is still open or game is over
        return;
      }
    } else if (isSpinning) {
      // Fallback to original logic if no roundRecord
      startSpinning();
      targetRotationRef.current = null;
    }

    // Handle stopping logic
    if (!isSpinning && winningMarketId) {
      // Find the actual index in the markets array
      if (winningMarketId && winningMarketId) {
        const marketIndex =
          stocks?.findIndex((market) => market.id === winningMarketId[0]) || 0;

        console.log("loki stopindex", marketIndex);

        // Calculate the target rotation where winning market should be at top (0 degrees)
        if (
          marketIndex !== undefined &&
          marketIndex >= 0
        ) {
          const totalMarkets = stocks.length;
          const segmentAngle = 360 / totalMarkets; // degrees per segment
          console.log("loki calculating stop rotation",);

          // Calculate the current wheel's rotation offset (where wheel currently is)
          const currentRotationOffset = rawRotationRef.current % 360;
          const winningSegmentBasePosition = segmentAngle * marketIndex;
          const centeringOffset = segmentAngle / 2;
          const winningSegmentCenterPosition = (winningSegmentBasePosition + centeringOffset) % 360;
          
          // Pin is at 0 degrees (top of wheel). Calculate how much we need to rotate 
          // to bring the winning segment to the pin position
          const pinPosition = 0;
          const targetOffset = (pinPosition - winningSegmentCenterPosition + 360) % 360;
          
          // Calculate how much rotation is needed from current position to target position
          let rotationNeeded = (targetOffset - currentRotationOffset + 360) % 360;
          
          // If rotation needed is very small, add a full rotation for dramatic effect
          if (rotationNeeded < 90) {
            rotationNeeded += 360;
          }
          
          
          // Calculate final target rotation (raw rotation + additional rotation needed)
          const targetRotation = 0;

          // Set the target rotation - the animation loop will handle stopping
          targetRotationRef.current = targetRotation;
          console.log("loki targetRotation", targetRotation);
        } else {
          // Fallback to normal stop if we can't calculate target
          stopSpinning();
        }
      } else {
        stopSpinning();
      }
    } else if (!isSpinning && !winningMarketId) {
      // Stop spinning if isSpinning is false and no winner yet
      stopSpinning();
    }
  }, [isSpinning, startSpinning, stopSpinning, winningMarketId, roundRecord]);

  // Cleanup function
  const cleanup = useCallback(() => {
    // Kill any active GSAP tweens
    if (spinTweenRef.current) {
      spinTweenRef.current.kill();
      spinTweenRef.current = null;
    }

    if (frameRef.current) {
      cancelAnimationFrame(frameRef.current);
      frameRef.current = null;
    }

    // Reset animation state
    currentSpeedRef.current = 0;
    isAnimatingRef.current = false;
  }, []);

  // Animation effect
  useEffect(() => {
    if (!isLoading && !error) {
      animate();
    }

    return () => {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }
    };
  }, [animate, isLoading, error]);

  // Cleanup effect
  useEffect(() => {
    return () => {
      cleanup();
    };
  }, [cleanup]);

  return (
    <div className="relative flex items-center justify-center md:min-h-[450px] xs:min-h-[300px] min-h-[280px] md:min-w-[450px] xs:min-w-[300px] min-w-[280px]">
      {/* Wheel Shadow */}
      {!isLoading && (
        <img
          className="absolute z-10 bottom-[-22%] left-[53%] -translate-x-1/2 h-auto w-[190%] max-w-none"
          src="/images/wheel-of-fortune/wheel_shadow.png"
          alt=""
        />
      )}

      {/* Main Wheel Container */}
      <div className="relative z-20 w-[90%] h-[90%] aspect-square rounded-full overflow-hidden flex justify-center items-center">
        {/* Render wheel segments */}
        <div
          ref={wheelRef}
          className="absolute h-[80%] w-[80%] rounded-full flex items-center justify-center"
          style={{ transform: `rotate(${wheelRotationDegrees}deg)` }}
        >
          {stocks.map((stock, index) => {
            const assignedColor =
              stock.id &&
              roundRecord?.marketColors.find(
                (item: any) => item.marketId === stock.id
              )?.color;
            const colorConfig =
              WHEEL_COLOR_CONFIG[assignedColor || WheelColor.COLOR1];
            const segmentAngle = 360 / stocks.length;

            return (
              <>
                <div
                  key={stock.id}
                  style={{
                    height: "50%",
                    width: `${segmentAngle * 0.9}%`,
                    transform: `rotateZ(${segmentAngle * index}deg)`,
                    backgroundColor: colorConfig.actualColor,
                    boxShadow: `
                    inset 0 0px -20px -20px ${colorConfig.shadow},   /* top inner shadow */
                    inset 0 -0px -20px -20px ${colorConfig.shadow}  /* bottom inner shadow */
                  `,
                    clipPath: "polygon(0 0, 50% 100%, 100% 0)",
                    transformOrigin: "center bottom",
                  }}
                  className="absolute top-0 flex justify-center items-center overflow-hidden"
                >
                  <p className="stock-name absolute text-white text-xs font-medium tracking-wider -rotate-90 top-[30%] z-10 outline-none whitespace-nowrap">
                    {getStockName(stock.name ?? "", stock.codeName ?? "")}
                    {/* {index} */}
                  </p>
                </div>
                <div
                  style={{
                    height: "50%",
                    width: `${segmentAngle * 0.9}%`,
                    transform: `rotateZ(${segmentAngle * index}deg)`,
                    transformOrigin: "center bottom",
                  }}
                  className="absolute top-0 z-20 flex justify-center items-center"
                >
                  <div
                    style={{
                      transformOrigin: "center bottom",
                    }}
                    className="top-0 bg-black rotate-[43deg] h-full w-[2px]"
                  ></div>
                </div>
              </>
            );
          })}
        </div>

        {/* Wheel Border with decorative dots */}
        <div className="absolute h-[85%] w-[85%] rounded-full flex items-center justify-center border-[10px] border-yellow-500">
          {Array.from({ length: 8 }, (_, index) => {
            const angle = (index * 360) / 8;
            const radian = (angle * Math.PI) / 180;
            const radius = 50; // 50% of the container (since it's positioned from center)
            const x = Math.cos(radian) * radius;
            const y = Math.sin(radian) * radius;

            return (
              <div
                key={index}
                className="absolute w-4 h-4 bg-white rounded-full transform -translate-x-1/2 -translate-y-1/2"
                style={{
                  left: `calc(50% + ${x}%)`,
                  top: `calc(50% + ${y}%)`,
                }}
              />
            );
          })}
        </div>
      </div>

      {/* Center Button */}
      {!isLoading && (
        <img
          className="absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-[23%] aspect-square z-30"
          src="/images/wheel-of-fortune/bet.png"
          alt=""
        />
      )}

      {/* Top Pin */}
      {!isLoading && (
        <img
          className="absolute top-[8%] left-[50%] -translate-x-1/2 w-[9%] h-auto z-30"
          src="/images/wheel-of-fortune/pin.png"
          alt=""
        />
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="flex flex-col items-center space-y-2">
            <div className="text-white">Loading Wheel...</div>
          </div>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="text-red-400 text-center p-4">
            <div>Error: {error}</div>
            <button
              onClick={() => {
                setError(null);
                setIsLoading(true);
                // Force re-initialization by updating a dependency
                window.location.reload();
              }}
              className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            >
              Retry
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Wheel;
