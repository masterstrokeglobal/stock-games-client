import {
  RoundRecord,
  WHEEL_COLOR_SEQUENCE,
  WHEEL_COLOR_CONFIG,
} from "@/models/round-record";
import { MarketItem } from "@/models/market-item";
import { useRef, useState, useCallback, useEffect } from "react";
import { gsap } from "gsap";

interface WheelProps {
  isSpinning: boolean;
  isPlaceOver?: boolean; // Flag to indicate if placement phase is over
  roundRecord?: RoundRecord;
  winningMarketId: number[] | null;
  onSpinComplete?: () => void;
}

export const Wheel: React.FC<WheelProps> = ({
  isSpinning,
  isPlaceOver = false,
  roundRecord,
  winningMarketId,
  onSpinComplete,
}) => {
  const wheelRef = useRef<HTMLDivElement>(null);
  const isAnimatingRef = useRef<boolean>(false);
  const spinTweenRef = useRef<gsap.core.Tween | null>(null);
  const currentRotationRef = useRef<number>(0);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [wheelRotationDegrees, setWheelRotationDegrees] = useState<number>(
    () => {
      if (typeof window !== "undefined") {
        const saved = localStorage.getItem("wheelRotationDegrees");
        return saved ? parseFloat(saved) : 0;
      }
      return 0;
    }
  );

  console.log("sarthak sharma wheelRotationDegrees", wheelRotationDegrees)

  // State to track target rotation for stopping
  const targetRotationRef = useRef<number | null>(null);

  const stocks: MarketItem[] = roundRecord?.market || [];

  // GSAP Animation constants - match the 3D wheel values
  // const ACCELERATION_TIME = 3.0; // Time to reach max speed (seconds)
  const DECELERATION_TIME = 1.0; // Time to stop from max speed (seconds)
  // const MAX_ROTATION = 1440; // 4 full rotations (360 * 4)

  // GSAP-powered spin control
  const startSpinning = useCallback(() => {
    // Kill any existing tween
    if (spinTweenRef.current) {
      spinTweenRef.current.kill();
    }

    // Store the current rotation as the starting point
    const startRotation = currentRotationRef.current;

    // For continuous spinning, we'll use a repeating animation
    spinTweenRef.current = gsap.to(currentRotationRef, {
      current: startRotation + 360, // Rotate one full circle
      duration: 3, // Time for one rotation
      ease: "none", // Linear rotation for smooth continuous effect
      repeat: -1, // Infinite repetition
      onUpdate: () => {
        if (wheelRef.current) {
          wheelRef.current.style.transform = `rotate(${currentRotationRef.current}deg)`;

          // Update rotation state
          setWheelRotationDegrees(currentRotationRef.current % 360);
          if (typeof window !== "undefined") {
            localStorage.setItem(
              "wheelRotationDegrees",
              (currentRotationRef.current % 360).toString()
            );
          }
        }
      },
      onComplete: () => {
        isAnimatingRef.current = true;
      },
    });
  }, []);

  const stopSpinningAtPosition = useCallback(
    (targetDegrees: number) => {
      // Kill any existing tween
      if (spinTweenRef.current) {
        spinTweenRef.current.kill();
      }

      // Calculate the current rotation in the same 0-360 space
      const currentDegrees = currentRotationRef.current % 360;

      // Calculate how much more we need to rotate to reach the target
      // We need to rotate at least one full circle plus the remaining degrees to target
      let degreesToRotate = 360 - currentDegrees + targetDegrees;

      // Ensure we rotate at least one full circle for a nice effect
      if (degreesToRotate < 360) {
        degreesToRotate += 360;
      }

      // Animate to the final position
      spinTweenRef.current = gsap.to(currentRotationRef, {
        current: currentRotationRef.current + degreesToRotate,
        duration: DECELERATION_TIME,
        ease: "power2.inOut",
        onUpdate: () => {
          if (wheelRef.current) {
            wheelRef.current.style.transform = `rotate(${currentRotationRef.current}deg)`;

            // Update rotation state
            setWheelRotationDegrees(currentRotationRef.current % 360);
            if (typeof window !== "undefined") {
              localStorage.setItem(
                "wheelRotationDegrees",
                (currentRotationRef.current % 360).toString()
              );
            }
          }
        },
        onComplete: () => {
          isAnimatingRef.current = false;
          if (onSpinComplete) {
            onSpinComplete();
          }
        },
      });
    },
    [DECELERATION_TIME, onSpinComplete]
  );

  const stopSpinning = useCallback(() => {
    // Kill any existing tween
    if (spinTweenRef.current) {
      spinTweenRef.current.kill();
    }

    // Animate to stop (one more full rotation)
    const currentDegrees = currentRotationRef.current;
    spinTweenRef.current = gsap.to(currentRotationRef, {
      current: currentDegrees + 360,
      duration: DECELERATION_TIME,
      ease: "power2.in",
      onUpdate: () => {
        if (wheelRef.current) {
          wheelRef.current.style.transform = `rotate(${currentRotationRef.current}deg)`;

          // Update rotation state
          setWheelRotationDegrees(currentRotationRef.current % 360);
          if (typeof window !== "undefined") {
            localStorage.setItem(
              "wheelRotationDegrees",
              (currentRotationRef.current % 360).toString()
            );
          }
        }
      },
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
    // Check if the round is active and placement phase is over
    if (roundRecord) {
      const currentTime = new Date().getTime();
      const placementEndTime = new Date(roundRecord.placementEndTime).getTime();
      const gameEndTime = new Date(roundRecord.endTime).getTime();

      const isBettingClosed = currentTime >= placementEndTime || isPlaceOver;
      const isGameStillActive = currentTime < gameEndTime;

      // Start spinning when placement is over and game is still active
      if (isBettingClosed && isGameStillActive && !winningMarketId) {
        startSpinning();
        // Clear any existing target when starting new spin
        targetRotationRef.current = null;
      }
      // If game has ended and we have a winner, stop at the winning position
      else if (
        (!isGameStillActive || !isBettingClosed) &&
        winningMarketId &&
        winningMarketId.length > 0
      ) {
        // Stop at the winning position
        const marketIndex = roundRecord.market.findIndex(
          (market) => market.id === winningMarketId[0]
        );

        if (marketIndex !== -1) {
          const totalMarkets = roundRecord.market.length;
          const segmentAngle = 360 / totalMarkets;
          const offset = segmentAngle / 2;
          const winningMarketAngle =
            (marketIndex / totalMarkets) * 360 + offset - 5;
          const targetRotation = (360 - winningMarketAngle) % 360;

          stopSpinningAtPosition(targetRotation);
        }
      }
    } else if (isSpinning) {
      // Fallback to original logic if using isSpinning prop directly
      startSpinning();
      targetRotationRef.current = null;
    }

    // Handle stopping logic
    if (!isSpinning && winningMarketId) {
      // Find the actual index in the markets array
      if (winningMarketId && winningMarketId.length > 0) {
        const marketIndex = roundRecord?.market?.findIndex(
          (market) => market.id === winningMarketId[0]
        );

        // Calculate the target rotation where winning market should be at top (0 degrees)
        if (
          marketIndex !== undefined &&
          marketIndex >= 0 &&
          roundRecord?.market
        ) {
          const totalMarkets = roundRecord.market.length;
          const segmentAngle = 360 / totalMarkets; // degrees per segment
          const offset = segmentAngle / 2;
          // Use the same calculation as in the 3D wheel
          const winningMarketAngle =
            (marketIndex / totalMarkets) * 360 + offset - 5;
          const targetRotation = (360 - winningMarketAngle) % 360;

          // Stop at the target rotation
          stopSpinningAtPosition(targetRotation);
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
  }, [
    isSpinning,
    isPlaceOver,
    startSpinning,
    stopSpinning,
    stopSpinningAtPosition,
    winningMarketId,
    roundRecord,
  ]);

  // Create wheel segments based on stocks

  if (!roundRecord || stocks.length === 0) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <div className="text-gray-500">No market data available</div>
      </div>
    );
  }

  return (
    <div className="relative flex items-center justify-center md:min-h-[450px] xs:min-h-[360px] min-h-[300px] md:min-w-[450px] xs:min-w-[360px] min-w-[300px]">
      {/* Wheel shadow */}
      <img
        className="absolute z-10 bottom-[-22%] left-[53%] -translate-x-1/2 h-auto w-[190%] max-w-none"
        src="/images/wheel-of-fortune/wheel_shadow.png"
        alt=""
      />

      {/* Wheel container with rotation */}
      <div className="relative z-20 w-[90%] h-[90%] aspect-square rounded-full overflow-hidden flex justify-center items-center">
        {/* Render wheel segments */}
        <div
          ref={wheelRef}
          className="absolute h-[90%] w-[90%] rounded-full flex items-center justify-center"
        >
          {stocks.map((stock, index) => {
            const colorIndex = index % WHEEL_COLOR_SEQUENCE.length;
            const color = WHEEL_COLOR_SEQUENCE[colorIndex];
            const colorConfig = WHEEL_COLOR_CONFIG[color];
            const segmentAngle = 360 / stocks.length;

            return (
              <div
                key={stock.id}
                style={{
                  height: "50%",
                  width: `${360 / stocks.length}%`,
                  transform: `rotateZ(${segmentAngle * index}deg)`,
                  background: colorConfig.backgroundGradient,
                  clipPath: "polygon(0 0, 50% 100%, 100% 0)",
                  transformOrigin: "center bottom",
                }}
                className={` absolute top-0 flex justify-center items-center overflow-hidden`}
              >
                <p className="stock-name text-white text-xs font-medium tracking-wider -rotate-90 -translate-y-1/2">
                  {(stock.codeName || stock.code || stock.name || "").substring(
                    0,
                    6
                  )}
                </p>
              </div>
            );
          })}
        </div>
        <div className="absolute h-[90%] w-[90%] rounded-full flex items-center justify-center border-[10px] border-yellow-500">
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

      {/* Center button */}
      <img
        className="absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-[23%] aspect-square z-30"
        src="/images/wheel-of-fortune/bet.png"
        alt=""
      />

      {/* Wheel pin/pointer */}
      <img
        className="absolute top-[8%] left-[50%] -translate-x-1/2 w-[9%] h-auto z-30"
        src="/images/wheel-of-fortune/pin.png"
        alt=""
      />

      {/* Loading state */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="flex flex-col items-center space-y-2">
            <div className="text-white">Loading Wheel...</div>
          </div>
        </div>
      )}

      {/* Error state */}
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
