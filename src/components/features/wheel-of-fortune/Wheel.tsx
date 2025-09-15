"use client";
import {
  RoundRecord,
  WHEEL_COLOR_CONFIG,
  WHEEL_COLOR_SEQUENCE,
} from "@/models/round-record";
import { MarketItem } from "@/models/market-item";
import { useRef, useState, useCallback, useEffect, useMemo } from "react";
// import { gsap } from "gsap";
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

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Simple rotation state
  const [currentRotation, setCurrentRotation] = useState(0);
  const animationRef = useRef<number | null>(null);
  const isStoppingRef = useRef(false);
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

  // Simple animation - 360 degrees in 0.5 seconds, repeating
  const animate = useCallback(() => {
    if (!wheelRef.current) return;

    const startTime = Date.now();
    const duration = 500; // 0.5 seconds for 360 degrees

    const animateFrame = () => {
      if (!wheelRef.current) return;

      const elapsed = Date.now() - startTime;
      const progress = (elapsed % duration) / duration; // 0 to 1, repeating
      const rotation = progress * 360; // 0 to 360 degrees

      setCurrentRotation(() => {
        const totalRotation = Math.floor(elapsed / duration) * 360 + rotation;
        
        // Apply rotation to wheel
        wheelRef.current!.style.transform = `rotate(${totalRotation}deg)`;

        // Check if we should stop
        if (isStoppingRef.current && targetRotationRef.current !== null) {
          // Wait for current rotation to complete (when progress is near 0)
          if (progress < 0.1) {
            console.log("loki Completing rotation cycle, now setting target");
            const targetRotation = targetRotationRef.current;
            wheelRef.current!.style.transform = `rotate(${targetRotation}deg)`;
            
            // Stop animation
            if (animationRef.current) {
              cancelAnimationFrame(animationRef.current);
              animationRef.current = null;
            }
            
            isStoppingRef.current = false;
            targetRotationRef.current = null;
            
            if (onSpinComplete) {
              onSpinComplete();
            }
            return targetRotation;
          }
        }

        return totalRotation;
      });

      if (!isStoppingRef.current && isSpinning) {
        animationRef.current = requestAnimationFrame(animateFrame);
      }
    };

    animationRef.current = requestAnimationFrame(animateFrame);
  }, [isSpinning, onSpinComplete]);

  // Simple spin control
  const startSpinning = useCallback(() => {
    isStoppingRef.current = false;
    targetRotationRef.current = null;
    animate();
  }, [animate]);

  const stopSpinning = useCallback(() => {
    isStoppingRef.current = true;
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }
    if (onSpinComplete) {
      onSpinComplete();
    }
  }, [onSpinComplete]);

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
      console.log("loki startSpinning", currentRotation);
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

          // Calculate simple target rotation
          if (marketIndex !== undefined && marketIndex >= 0) {
            const totalMarkets = stocks.length;
            const segmentAngle = 360 / totalMarkets;
            
            // Simple target: segmentAngle * marketIndex - segmentAngle/2
            const targetRotation = segmentAngle * marketIndex - segmentAngle / 2;
            
            console.log("loki Setting target rotation:", targetRotation);
            
            // Set stopping flag and target
            isStoppingRef.current = true;
            targetRotationRef.current = targetRotation;
          } else {
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
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }
    isStoppingRef.current = false;
    targetRotationRef.current = null;
  }, []);

  // Animation effect
  useEffect(() => {
    if (!isLoading && !error && isSpinning) {
      animate();
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = null;
      }
    };
  }, [animate, isLoading, error, isSpinning]);

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
                    transform: `rotateZ(${
                      segmentAngle * index - segmentAngle / 2
                    }deg)`,
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
                    transform: `rotateZ(${
                      segmentAngle * index - segmentAngle / 2
                    }deg)`,
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
