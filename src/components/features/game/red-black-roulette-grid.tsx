import { RoundRecord } from "@/models/round-record";
import { Bet, Chip, CurrentGameState } from "./contants";
import { useGetRoundRecordById } from "@/react-query/round-record-queries";
import { useEffect, useRef, useState } from "react";
import { RED_BLACK_ROULETTE_NUMBERS } from "@/lib/utils";
import FancyButton from "@/components/ui/fancy-btn";
import FancyTimer from "@/components/ui/fancyTimer";
import gsap from "gsap";
import { Flip } from "gsap/Flip";


if (typeof window !== "undefined") {
  gsap.registerPlugin(Flip);
}

interface RouletteBettingGridProps {
  hoveredCell: Bet | null;
  chips: Chip[];
  roundRecord: RoundRecord;
  previousRoundId?: string;
  gridToggleInterval?: number; // Time between layout toggles in ms
  gridAnimationDuration?: number; // Animation duration in seconds
  gameState: CurrentGameState;
}

export const RedBlackRouletteBettingGrid = ({
  roundRecord,
  gridAnimationDuration = 2,
  gameState,
}: RouletteBettingGridProps) => {
  const { refetch } = useGetRoundRecordById(roundRecord.id);
  const gridRef = useRef<HTMLDivElement>(null);
  const gridContainerRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<HTMLDivElement>(null);
  const [currentLayout, setCurrentLayout] = useState<"2-columns" | "4-columns">(
    "2-columns"
  );
  useEffect(() => {
    const resultFetchTime =
      new Date(roundRecord.endTime).getTime() - new Date().getTime() + 4000;

    const timer = setTimeout(() => {
      console.log("refetching");
      refetch();
    }, resultFetchTime);

    return () => clearTimeout(timer);
  }, [roundRecord, refetch]);

  // Grid layout toggle animation
  useEffect(() => {
    if (!gridRef.current || typeof window === "undefined") return;

    const targetLayout = gameState.isPlaceOver ? "2-columns" : "4-columns";

    // If the current layout is already the target, no transition needed
    if (currentLayout === targetLayout) return;

    const performGridTransition = (newLayout: "2-columns" | "4-columns") => {
      if (!gridRef.current) return;

      // Capture the current state
      const state = Flip.getState(gridRef.current.children);

      // Update the layout
      setCurrentLayout(newLayout);

      // Apply the new class
      gridRef.current.classList.remove(`shuffle-grid-${currentLayout}`);
      gridRef.current.classList.add(`shuffle-grid-${newLayout}`);

      Flip.from(state, {
        duration: gridAnimationDuration,
        ease: "power2.inOut",
        absolute: true,
        onComplete: () => {
          console.log(`Switched to ${newLayout} layout`);
          
          if (!gameState.isPlaceOver) {
            gsap.to(timerRef.current, {
              duration: 1,
              y: -50,
              x: -15, // Move the timer up
            });
          } else {
            gsap.to(timerRef.current, {
              x: -335,
              y: 80, // Or a specific value to reset the position
              duration: 1,
            });
          }
        },
      });
    };

    performGridTransition(targetLayout);
    // }

    // Set initial layout class
    gridRef.current.classList.add(`shuffle-grid-${targetLayout}`);
  }, [currentLayout, gridAnimationDuration, gameState.isPlaceOver]);

  const getCodeByIndex = (index: number) => {
    return `${roundRecord.market[index - 1]?.codeName}`;
  };

  return (
    <div
      ref={gridContainerRef}
      className="relative min-h-[300px] flex items-center justify-center"
    >
      <div ref={gridRef} className="shuffle-grid-container">
        {RED_BLACK_ROULETTE_NUMBERS.map(({ number, color }) => (
          <div key={number}>
            <FancyButton
              key={number}
              code={getCodeByIndex(number)}
              color={color}
              number={number.toString()}
            />
          </div>
        ))}
      </div>

      <div className="flex justify-center items-center absolute inset-0 z-100 ">
        <div ref={timerRef} className="watch-timer">
          <FancyTimer
            gameStateTime={
              gameState.isPlaceOver
                ? gameState.gameTimeLeft
                : gameState.placeTimeLeft
            }
          />
        </div>
      </div>
    </div>
  );
};


