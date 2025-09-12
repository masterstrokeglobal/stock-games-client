import { useEffect, useState } from "react";
import ParallaxImage from "./parallax-image";

interface GameDisplayProps {
  multiplier: number;
  isParallaxMoving?: boolean;
  isCurrentPlaneCrashed: boolean;
  isPlaceOver:boolean
}

const GameDisplay = ({
  multiplier,
  isParallaxMoving = false,
  isCurrentPlaneCrashed,
  isPlaceOver
}: GameDisplayProps) => {
  const [isParallaxVisible, setIsParallaxVisible] = useState(true);

  // Update crash state when plane status changes

  useEffect(() => {
    if (!isCurrentPlaneCrashed) {
      setIsParallaxVisible(true);
    }
  }, [isCurrentPlaneCrashed]);

  return (
    <div className="absolute w-full h-full flex-1 z-20">
      {isParallaxVisible && (
        <ParallaxImage multiplier={multiplier} isMoving={isParallaxMoving} isPlaceOver={isPlaceOver} />
      )}
    </div>
  );
};

GameDisplay.displayName = "GameDisplay";

export default GameDisplay;
