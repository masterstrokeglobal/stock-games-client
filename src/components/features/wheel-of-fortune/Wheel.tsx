"use client";
import {
  RoundRecord,
  WHEEL_COLOR_CONFIG,
  WHEEL_COLOR_SEQUENCE,
} from "@/models/round-record";
import { MarketItem } from "@/models/market-item";
import { useRef, useState, useCallback, useEffect } from "react";
import { gsap } from "gsap";

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

  console.log("roundRecord", roundRecord);

  // GSAP animation state
  const currentSpeedRef = useRef<number>(0);
  const spinTweenRef = useRef<gsap.core.Tween | null>(null);
  const isAnimatingRef = useRef<boolean>(false);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [marketNames, setMarketNames] = useState<string[]>([]);

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

  // State to track target rotation for stopping
  const targetRotationRef = useRef<number | null>(null);

  const stocks: MarketItem[] = roundRecord?.market || [];

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

        if (typeof window !== "undefined") {
          localStorage.setItem("wheelRotationDegrees", newDegrees.toString());
        }

        // Apply the rotation to the wheel element
        if (wheelRef.current) {
          wheelRef.current.style.transform = `rotate(${rawDegrees}deg)`;
        }

        // Check if we've reached the target rotation (within tolerance) - using same logic as 3D version
        if (targetRotationRef.current !== null) {
          const tolerance = 10; // increased tolerance to make it easier to stop
          const angleDifference = Math.abs(
            360 - newDegrees - targetRotationRef.current
          );
          const altAngleDifference = Math.abs(
            newDegrees - targetRotationRef.current
          );
          const minAngleDifference = Math.min(
            angleDifference,
            altAngleDifference
          );

          if (minAngleDifference <= tolerance) {
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

        // Fallback: if no target but should stop (when isSpinning becomes false)
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
  // useEffect(() => {
  //   // Additional safety checks before allowing spin
  //   if (roundRecord) {
  //     const currentTime = new Date().getTime();
  //     const placementEndTime = new Date(roundRecord.placementEndTime).getTime();
  //     const gameEndTime = new Date(roundRecord.endTime).getTime();

  //     // Ensure we're in the correct time window for spinning
  //     const isBettingClosed = currentTime >= placementEndTime;
  //     const isGameStillActive = currentTime < gameEndTime;

  //     // Only start spinning if all conditions are met
  //     if (
  //       isSpinning &&
  //       isBettingClosed &&
  //       isGameStillActive &&
  //       !winningMarketId
  //     ) {
  //       startSpinning();
  //       // Clear any existing target when starting new spin
  //       targetRotationRef.current = null;
  //     } else if (isSpinning && (!isBettingClosed || !isGameStillActive)) {
  //       // Don't spin if betting is still open or game is over
  //       return;
  //     }
  //   } else if (isSpinning) {
  //     // Fallback to original logic if no roundRecord
  //     startSpinning();
  //     targetRotationRef.current = null;
  //   }

  //   // Handle stopping logic
  //   if (!isSpinning && winningMarketId) {
  //     // Find the actual index in the markets array
  //     if (winningMarketId && winningMarketId.length > 0) {
  //       const marketIndex = roundRecord?.market?.findIndex(
  //         (market) => market.id === winningMarketId[0]
  //       );

  //       // Calculate the target rotation where winning market should be at top (0 degrees)
  //       if (
  //         marketIndex !== undefined &&
  //         marketIndex >= 0 &&
  //         roundRecord?.market
  //       ) {
  //         const totalMarkets = roundRecord.market.length;
  //         const segmentAngle = 360 / totalMarkets; // degrees per segment
  //         const offset = segmentAngle / 2;
  //         const winningMarketAngle =
  //           (marketIndex / totalMarkets) * 360 + offset - 5;
  //         const targetRotation = (360 - winningMarketAngle) % 360;

  //         // Set the target rotation - the animation loop will handle stopping
  //         targetRotationRef.current = targetRotation;
  //       } else {
  //         // Fallback to normal stop if we can't calculate target
  //         stopSpinning();
  //       }
  //     } else {
  //       stopSpinning();
  //     }
  //   } else if (!isSpinning && !winningMarketId) {
  //     // Stop spinning if isSpinning is false and no winner yet
  //     stopSpinning();
  //   }
  // }, [isSpinning, startSpinning, stopSpinning, winningMarketId, roundRecord]);

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

  // Update market names when stocks change
  useEffect(() => {
    const names = stocks.map(
      (market) =>
        market.codeName || market.code || market.name || `Market ${market.id}`
    );
    // Shift the array to right - zero number becomes 5th and 20th becomes 0th
    const shiftedNames = [...names.slice(-5), ...names.slice(0, -5)];
    setMarketNames(shiftedNames);
  }, [stocks]);

  // Cleanup effect
  useEffect(() => {
    return () => {
      cleanup();
    };
  }, [cleanup]);

  if (!roundRecord || stocks.length === 0) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <div className="text-gray-500">No market data available</div>
      </div>
    );
  }

  return (
    <div className="relative flex items-center justify-center md:min-h-[450px] xs:min-h-[360px] min-h-[300px] md:min-w-[450px] xs:min-w-[360px] min-w-[300px]">
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
            // Use the actual assigned color for this market ID, fallback to position-based
            // console.log("stock", stock);
            const assignedColor = stock.id && roundRecord?.marketColors.find((item:any )=> item.marketId === stock.id)?.color;
            const colorConfig = WHEEL_COLOR_CONFIG[assignedColor];
            const segmentAngle = 360 / stocks.length;

            // Use the shifted market names (matching 3D wheel behavior)
            const displayName = marketNames[index] || `Market ${index + 1}`;
            const truncatedName =
              displayName.length > 6
                ? displayName.substring(0, 5) + "."
                : displayName;

            return (
              <>
                <div
                  key={stock.id}
                  style={{
                    height: "50%",
                    width: `${segmentAngle * 0.9}%`,
                    transform: `rotateZ(${segmentAngle * index}deg)`,
                    backgroundColor: colorConfig.bgColor,
                    clipPath: "polygon(0 0, 50% 100%, 100% 0)",
                    transformOrigin: "center bottom",
                  }}
                  className="absolute top-0 flex justify-center items-center overflow-hidden"
                >
                  <p className="stock-name absolute text-white text-xs font-medium tracking-wider -rotate-90 top-[30%] z-10 outline-none">
                    {truncatedName}
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
                  <div style={{
                    transformOrigin: "center bottom",
                  }} className="top-0 bg-black rotate-[43deg] h-full w-[2px]">

                  </div>
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
                className="absolute w-5 h-5 bg-white rounded-full transform -translate-x-1/2 -translate-y-1/2"
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
