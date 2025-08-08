import React, { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";

interface Wheel {
  id: number;
  currentValue: number;
  targetValue: number;
  isSpinning: boolean;
}

interface StockSlot2DWheelProps {
  stockStates: number[];
  isGameActive?: boolean;
  winningIdRoundRecord?: any;
  isPlaceOver?: boolean;
  isGameOver: boolean;
}

const defaultGlowState = [false, false, false, false, false];

const StockSlot2DWheel: React.FC<StockSlot2DWheelProps> = ({
  stockStates = [0, 0, 0, 0, 0, 0],
  isGameActive = false,
  winningIdRoundRecord,
  isGameOver,
  isPlaceOver = false,
}) => {
  const wheelRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [wheels, setWheels] = useState<Wheel[]>([
    { id: 0, currentValue: 0, targetValue: 0, isSpinning: false },
    { id: 1, currentValue: 0, targetValue: 0, isSpinning: false },
    { id: 2, currentValue: 0, targetValue: 0, isSpinning: false },
    { id: 3, currentValue: 0, targetValue: 0, isSpinning: false },
    { id: 4, currentValue: 0, targetValue: 0, isSpinning: false },
    // { id: 5, currentValue: 0, targetValue: 0, isSpinning: false },
  ]);
  const [numberHeight, setNumberHeight] = useState(100);
  const wheelContainerRef = useRef<HTMLDivElement>(null);
  const hasInitializedRef = useRef(false);
  const [glowSate, setGlowState] = useState<boolean[]>(defaultGlowState);

  // Numbers for regular columns (0-9) and multiplier column (0-4)
  // Regular: 3 sequences of 0-9 (indices 0-9, 10-19, 20-29) - target middle at 10-19
  const regularNumbers = [
    0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0, 1, 2, 3, 4,
    5, 6, 7, 8, 9,
  ];
  // Multiplier: 6 sequences of 0-4 (indices 0-4, 5-9, 10-14, 15-19, 20-24, 25-29) - target middle at 10-14
  const multiplierNumbers = [
    0, 1, 2, 3, 4, 0, 1, 2, 3, 4, 0, 1, 2, 3, 4, 0, 1, 2, 3, 4, 0, 1, 2, 3, 4,
    0, 1, 2, 3, 4,
  ];

  //? Start continuous spinning when game phase begins (betting is over)
  useEffect(() => {
    if (isPlaceOver && isGameActive) {
      setWheels((prev) =>
        prev.map((wheel) => ({ ...wheel, isSpinning: true }))
      );

      // Small delay to ensure any previous animations are cleared
      const timeoutId = setTimeout(() => {
        // Start continuous rotation for all wheels with alternating directions
        wheelRefs.current.forEach((wheelRef, index) => {
          if (wheelRef) {
            // Ensure no previous animations are running
            gsap.killTweensOf(wheelRef);

            // Determine spin direction based on wheel index
            // Odd wheels (1, 3, 5): clockwise (negative Y / upward)
            // Even wheels (0, 2, 4): anticlockwise (positive Y / downward)
            const isOddWheel = index % 2 === 1;

            if (isOddWheel) {
              // Clockwise: upward movement (negative Y direction)
              gsap.set(wheelRef, { y: -numberHeight }); // Start from offset position
              gsap.to(wheelRef, {
                y: -numberHeight * 21, // Move through multiple cycles with offset (21 = 20 numbers + 1 for offset)
                duration: 1.5,
                ease: "none",
                repeat: -1,
              });
            } else {
              // Anticlockwise: downward movement (positive Y direction)
              gsap.set(wheelRef, { y: -numberHeight * 20 }); // Start from higher position
              gsap.to(wheelRef, {
                y: numberHeight, // Move downward through cycles
                duration: 1.5,
                ease: "none",
                repeat: -1,
              });
            }
          }
        });
      }, 50); // 50ms delay to ensure clean start

      // Cleanup function to clear timeout if effect runs again
      return () => {
        clearTimeout(timeoutId);
      };
    }
  }, [isPlaceOver, isGameActive, winningIdRoundRecord, numberHeight]);

  // Stop spinning and animate to final positions only when final results are available
  useEffect(() => {
    if (
      !isGameActive &&
      winningIdRoundRecord &&
      stockStates.some((state) => state !== 0)
    ) {
      console.log("Stopping wheels with stockStates:", stockStates);

      // Step 1: Count occurrences
      const countMap = new Map<number, number>();
      stockStates.slice(0, 5).forEach((num) => {
        countMap.set(num, (countMap.get(num) || 0) + 1);
      });

      // Step 2: Find the max count
      const maxCount = Math.max(...Array.from(countMap.values()));

      if (maxCount > 1) {
        // Step 3: Find all numbers with the max count
        const mostRepeatedNumbers = Array.from(countMap.entries())
          .filter(([, count]) => count === maxCount)
          .map(([num]) => num);

        // Step 4: Pick any one of the most repeated numbers (if tie, pick the first)
        const chosenNumber = mostRepeatedNumbers[0];

        // Step 5: Create the boolean array
        const newglowState = stockStates.map((num) => num === chosenNumber);
        setGlowState(newglowState);
      }

      // Update target values and stop spinning state
      setWheels((prev) =>
        prev.map((wheel, index) => ({
          ...wheel,
          targetValue: stockStates[index] || 0,
          isSpinning: false,
        }))
      );

      // Animate each wheel to its final position with staggered timin
      stockStates.forEach((targetValue, index) => {
        const wheelRef = wheelRefs.current[index];
        if (wheelRef && targetValue !== undefined) {
          // For multiplier wheel (index 5), ensure value is between 0-4
          const finalValue =
            index === 5 ? Math.min(targetValue, 4) : targetValue;

          // Calculate target index in the middle sequence
          // Regular numbers (0-9): 3 sequences, middle starts at index 10
          // Multiplier numbers (0-4): 6 sequences, middle starts at index 10
          const targetIndex = 10 + finalValue;

          // Calculate final position to show the middle occurrence of the number
          // Adjust to center the target value in the middle visible row
          const finalPosition =
            -(targetIndex * numberHeight) + numberHeight * 2;

          // Kill any existing animations for this wheel first
          gsap.killTweensOf(wheelRef);

          // Get current position to calculate smooth transition
          const currentY = gsap.getProperty(wheelRef, "y") as number;

          // Calculate the shortest path to target considering the cyclic nature
          // Since numbers repeat every 10 positions (numberHeight * 10), we can optimize the path
          const cycleHeight = numberHeight * 10;
          let shortestPath = finalPosition;

          // Check if going in the opposite direction would be shorter
          const directDistance = Math.abs(finalPosition - currentY);
          const wrapAroundDistance = cycleHeight - directDistance;

          if (wrapAroundDistance < directDistance) {
            // Use wrap-around path
            if (finalPosition > currentY) {
              shortestPath = finalPosition - cycleHeight;
            } else {
              shortestPath = finalPosition + cycleHeight;
            }
          }

          // Animate to final position with optimized path and smooth easing
          gsap.to(wheelRef, {
            y: shortestPath,
            duration: 1.5, // Slightly longer duration for smoother feel
            // delay: delay,
            ease: "elastic.out(1, 0.5)", // Smooth easing that works well from any position
            onComplete: () => {
              // Ensure final position is exactly correct (handle any floating point errors)
              gsap.set(wheelRef, { y: finalPosition });
              console.log(
                `Wheel ${index} stopped at value ${finalValue} (middle sequence)`
              );
            },
          });
        }
      });
    }
  }, [isGameActive, winningIdRoundRecord, stockStates, numberHeight]);

  //? adjusting wheel height
  useEffect(() => {
    function handleResize() {
      if (wheelContainerRef.current) {
        const wheelContainerHeight = wheelContainerRef.current.clientHeight;
        setNumberHeight(wheelContainerHeight / 3);
      }
    }

    handleResize();

    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  //? reseeting wheel position during responsivenss
  useEffect(() => {
    if (!numberHeight || !wheelRefs.current.length) return;

    wheels.forEach((wheel, index) => {
      const wheelRef = wheelRefs.current[index];
      if (!wheelRef) return;

      const value =
        isGameActive && isPlaceOver
          ? null // spinning, don't reset
          : wheel.targetValue ?? 0;

      // Pick a safe default in case targetValue is null
      const finalValue = index === 5 ? Math.min(value ?? 0, 4) : value ?? 0;
      const targetIndex = 10 + finalValue;
      const finalPosition = -(targetIndex * numberHeight) + numberHeight * 2;

      gsap.set(wheelRef, { y: finalPosition });
    });
  }, [numberHeight]);

  //? Initialize random positions only once when component mounts and game hasnt statrted yet
  useEffect(() => {
    if (isPlaceOver) {
      hasInitializedRef.current = true;
    }
    if (
      !isPlaceOver &&
      !hasInitializedRef.current &&
      wheelRefs?.current &&
      numberHeight > 0
    ) {
      hasInitializedRef.current = true;

      wheelRefs.current.forEach((wheelRef, index) => {
        if (wheelRef) {
          gsap.killTweensOf(wheelRef);

          const randomValue =
            index === 5
              ? Math.floor(Math.random() * 5)
              : Math.floor(Math.random() * 10);

          const targetIndex = 10 + randomValue;
          const randomPosition =
            -(targetIndex * numberHeight) + numberHeight * 2;

          gsap.set(wheelRef, { y: randomPosition });
        }
      });
    }
  }, [numberHeight, isPlaceOver]);

  useEffect(() => {
    if (!isGameOver) {
      setGlowState(defaultGlowState);
    }
  }, [isGameOver]);

  return (
    <div
      style={{
        backgroundImage: "url('/images/slot-machine/game-board.png')",
        backgroundSize: "100% 100%",
        backgroundPosition: "center center",
        backgroundRepeat: "no-repeat",
      }}
      className="w-full h-full flex justify-center items-center relative"
    >
      <div
        ref={wheelContainerRef}
        className="w-[60%] max-w-4xl mx-auto h-[50%] relative"
      >
        <div className="grid grid-cols-5 px-4 h-full relative justify-center items-center">
          {wheels.map((wheel, wheelIndex) => (
            <div
              key={wheel.id}
              className="relative h-full overflow-hidden z-30"
            >
              {/* Wheel content */}
              <div
                ref={(el) => {
                  wheelRefs.current[wheelIndex] = el;
                }}
                className="absolute inset-x-0 flex flex-col"
                style={{ top: -numberHeight }} // Start with first row hidden to center the view
              >
                {(wheelIndex === 5 ? multiplierNumbers : regularNumbers).map(
                  (number, numberIndex) => (
                    <div
                      key={`${wheelIndex}-${numberIndex}`}
                      className="flex items-center justify-center relative"
                    >
                      <img
                        style={{ height: numberHeight }}
                        src={`/images/slot-machine/${
                          wheelIndex === 5 ? "mul" : "number"
                        }-${number}.png`}
                        alt={`${number}`}
                        className="w-auto object-contain"
                        draggable={false}
                      />
                    </div>
                  )
                )}
              </div>
            </div>
          ))}
          {/* //? border for center lane */}
          <div
            style={{
              height: isGameOver ? numberHeight :0 ,
              backgroundImage: "url('/images/slot-machine/menu-bg.png')",
              // backgroundImage: "url('/images/slot-machine/stock-list.png')",
              backgroundSize: "100% 100%",
              backgroundPosition: "center center",
              backgroundRepeat: "no-repeat",
            }}
            className={`absolute ${
              isGameOver ? "opacity-1" : "opacity-0"
            } z-10 pointer-events-none w-full rounded-lg transition-all duration-300`}
          ></div>
          {/* //? glow effect for winning numbers */}
          <div
            style={{ height: numberHeight }}
            className="grid grid-cols-5 justify-center items-center w-full z-20 absolute px-4"
          >
            {glowSate.map((glow, i) => (
              <div
                key={i}
                style={{ height: numberHeight }}
                className="w-full flex justify-center items-center"
              >
                <div
                  key={i}
                  style={{
                    animation: "slotWinPulse 0.8s ease-in-out infinite",
                    boxShadow: `0px 0px ${numberHeight / 3}px ${
                      numberHeight / 3
                    }px #D3AF37`,
                    opacity: glow ? 1 : 0,
                  }}
                  className="pointer-events-none w-[1px] h-[1px] rounded-full z-10 transition-all duration-300"
                ></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const GameBoard: React.FC<StockSlot2DWheelProps> = (props) => {
  return <StockSlot2DWheel {...props} />;
};

export default GameBoard;
