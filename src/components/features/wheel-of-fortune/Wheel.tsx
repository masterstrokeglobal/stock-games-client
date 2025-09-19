"use client";
import {
  RoundRecord,
  WHEEL_COLOR_CONFIG,
  WHEEL_COLOR_SEQUENCE,
} from "@/models/round-record";
import { MarketItem } from "@/models/market-item";
import { useRef, useState, useCallback, useEffect, useMemo } from "react";
import { WheelColor } from "@/models/wheel-of-fortune-placement";
import { getStockName } from "@/components/common/StockName";
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
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [wheelState, setWheelState] = useState<'idle' | 'spinning' | 'stopped'>('idle');
  const spinTweenRef = useRef<any>(null);

  const stocks: MarketItem[] = useMemo(() => {
    const originalMarkets = roundRecord?.market || [];
    const marketColors = roundRecord?.marketColors || [];
    if (originalMarkets.length === 0 || marketColors.length === 0) return [];

    const reorderedStocks = WHEEL_COLOR_SEQUENCE.map((_, segmentIndex) => {
      const marketColorEntry = marketColors[segmentIndex];
      if (!marketColorEntry) return null;

      const marketItem = originalMarkets.find(
        (market: MarketItem) => market.id === marketColorEntry.marketId
      );
      return marketItem || null;
    }).filter((stock) => stock !== null);

    return reorderedStocks;
  }, [roundRecord]);

  const calculateTargetRotation = useCallback((winningId: number): number => {
    const marketIndex = stocks.findIndex((market) => market.id === winningId);
    if (marketIndex === -1) return 0;

    const totalMarkets = stocks.length;
    const segmentAngle = 360 / totalMarkets;
    
    // Calculate the angle where the winning segment should be positioned
    const segmentCenter = segmentAngle * marketIndex - (segmentAngle / 2);
    
    // Calculate target angle to position winning segment at top
    const targetAngle = 360 - segmentCenter;
    
    
    return targetAngle;
  }, [stocks]);

  const startSpinning = useCallback(() => {
    if (!wheelRef.current) return;
    
    console.log("Starting GSAP spin");
    setWheelState('spinning');
    
    // Kill any existing animation
    if (spinTweenRef.current) {
      spinTweenRef.current.kill();
    }
    
    // Start infinite spinning
    spinTweenRef.current = gsap.to(wheelRef.current, {
      rotation: "+=360",
      duration: 1,
      ease: "none",
      repeat: -1,
    });
  }, []);

  const stopWheel = useCallback((targetRotation: number) => {
    if (!wheelRef.current) return;
    
    console.log("Stopping wheel at rotation:", targetRotation);
    setWheelState('stopped');
    
    // Kill the spinning animation
    if (spinTweenRef.current) {
      spinTweenRef.current.kill();
      spinTweenRef.current = null;
    }
    
    // Set the target rotation immediately
    gsap.set(wheelRef.current, {
      rotation: targetRotation
    });
    
    console.log("Applied GSAP rotation:", targetRotation);
    
    // Call completion callback
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
      const isBettingClosed = currentTime >= placementEndTime;
      const isGameStillActive = currentTime < gameEndTime;

      if (isSpinning && isBettingClosed && isGameStillActive && !winningMarketId && wheelState === 'idle') {
        startSpinning();
      }
    } else if (isSpinning && !winningMarketId && wheelState === 'idle') {
      startSpinning();
    }

    // Handle stopping when winning ID is available
    if (winningMarketId && winningMarketId.length > 0 && wheelState === 'spinning') {
      const targetRotation = calculateTargetRotation(winningMarketId[0]);
      stopWheel(targetRotation);
    }

    // Handle case where spinning stops without winner
    if (!isSpinning && wheelState === 'spinning') {
      if (spinTweenRef.current) {
        spinTweenRef.current.kill();
        spinTweenRef.current = null;
      }
      setWheelState('idle');
      if (onSpinComplete) {
        onSpinComplete();
      }
    }
  }, [isSpinning, winningMarketId, wheelState, roundRecord, calculateTargetRotation, stopWheel, startSpinning, onSpinComplete]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (spinTweenRef.current) {
        spinTweenRef.current.kill();
      }
    };
  }, []);

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
            const radius = 50;
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
