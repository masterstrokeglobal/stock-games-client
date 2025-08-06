import { useEffect, useState } from "react";
import AviatorCanvas from "./aviator-canvas";
import ParallaxImage from "./parallax-image";

interface GameDisplayProps {
  multiplier: number;
  isParallaxMoving?: boolean;
  canvasOpacity?: number;
  stockName?: string;
  planeStatus?: "active" | "crashed" | "flew_away";
  setIsParallaxMoving?: (isMoving: boolean) => void;
  isGameOver?: boolean;
}

const GameDisplay = ({
  multiplier,
  isParallaxMoving = false,
  canvasOpacity = 1,
  planeStatus,
  setIsParallaxMoving,
  isGameOver,
}: GameDisplayProps) => {
  const [isCurrentPlaneCrashed, setIsCurrentPlaneCrashed] = useState(false);
  const [isParallaxVisible, setIsParallaxVisible] = useState(true);

  // Update crash state when plane status changes
  useEffect(() => {
    if (planeStatus === "crashed" || planeStatus === "flew_away") {
      setIsCurrentPlaneCrashed(true);
      setIsParallaxMoving?.(false);
    } else {
      setIsCurrentPlaneCrashed(false);
    }
  }, [planeStatus]);

  useEffect(() => {
    if (!isCurrentPlaneCrashed) {
      setIsParallaxVisible(true);
    }
  }, [isCurrentPlaneCrashed]);

  return (
    <div className="absolute w-full h-full flex-1 z-20">
      {isParallaxVisible && (
        <ParallaxImage multiplier={multiplier} isMoving={isParallaxMoving} />
      )}

      {/* {!isCurrentPlaneCrashed && ( */}
        <AviatorCanvas
          multiplier={multiplier}
          shouldStartTakeOffAnimation={isParallaxMoving}
          opacity={canvasOpacity}
          isGameOver={isGameOver}
        />
      {/* )} */}
    </div>
  );
};

GameDisplay.displayName = "GameDisplay";

export default GameDisplay;
