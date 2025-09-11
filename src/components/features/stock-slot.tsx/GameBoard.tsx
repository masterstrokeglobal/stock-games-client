import React, { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import useWindowSize from "@/hooks/use-window-size";

interface Wheel {
  id: number;
  currentValue: number;
  targetValue: number;
  isSpinning: boolean;
}

interface StockSlot2DWheelProps {
  isGameActive?: boolean;
  winningIdRoundRecord?: any;
  isPlaceOver?: boolean;
  isGameOver: boolean;
  roundRecord: any;
  imgRef: React.RefObject<HTMLImageElement>;
  // getBackgroundStyle: (src: string) => React.CSSProperties;
}

const defaultGlowState = [false, false, false, false, false];
const EXCLUDED_NUMBERS = [0];

const StockSlot2DWheel: React.FC<StockSlot2DWheelProps> = ({
  isGameActive = false,
  winningIdRoundRecord,
  isGameOver,
  isPlaceOver = false,
  roundRecord,
  imgRef,
  // getBackgroundStyle,
}) => {
  const wheelRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [wheels, setWheels] = useState<Wheel[]>([
    { id: 0, currentValue: 0, targetValue: 0, isSpinning: false },
    { id: 1, currentValue: 0, targetValue: 0, isSpinning: false },
    { id: 2, currentValue: 0, targetValue: 0, isSpinning: false },
    { id: 3, currentValue: 0, targetValue: 0, isSpinning: false },
    { id: 4, currentValue: 0, targetValue: 0, isSpinning: false },
  ]);
  const [numberHeight, setNumberHeight] = useState(100);
  const wheelContainerRef = useRef<HTMLDivElement>(null);
  const hasInitializedRef = useRef(false);
  const [glowSate, setGlowState] = useState<boolean[]>(defaultGlowState);
  const { isMobile } = useWindowSize();

  // Regular: 3 sequences of 0-9 (indices 0-9, 10-19, 20-29) - target middle at 10-19
  const regularNumbers = [
    0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0, 1, 2, 3, 4,
    5, 6, 7, 8, 9,
  ];

  //? Start continuous spinning when game phase begins (betting is over)
  useEffect(() => {
    if (isPlaceOver && isGameActive) {
      setWheels((prev) =>
        prev.map((wheel) => ({ ...wheel, isSpinning: true }))
      );

      const timeoutId = setTimeout(() => {
        wheelRefs.current.forEach((wheelRef, index) => {
          if (wheelRef) {
            gsap.killTweensOf(wheelRef);
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
                duration: 1.2,
                ease: "none",
                repeat: -1,
              });
            }
          }
        });
      }, 50);

      return () => {
        clearTimeout(timeoutId);
      };
    }
  }, [isPlaceOver, isGameActive, numberHeight]);

  // Stop spinning and animate to final positions only when final results are available
  useEffect(() => {
    if (
      !isGameActive &&
      winningIdRoundRecord &&
      winningIdRoundRecord.finalPricesPresent
    ) {
      let wheelValues: number[] = [0, 0, 0, 0, 0];

      if (
        winningIdRoundRecord?.finalPricesPresent &&
        winningIdRoundRecord?.finalDifferences &&
        roundRecord?.market
      ) {
        const finalDifferencesArray: number[] = [];

        const sortedMarketItems = roundRecord.market.sort(
          (a: any, b: any) => a.name?.localeCompare(b.name ?? "") ?? 0
        );

        // Get first 5 stocks (sorted alphabetically like in other components)
        sortedMarketItems.slice(0, 5).forEach((stock: any, index: number) => {
          const stockCode = stock.code || stock.bitcode;
          if (stockCode && winningIdRoundRecord.finalDifferences[stockCode]) {
            // Use same precision as StocksList (.toFixed(2)) for consistency
            const price = parseFloat(
              winningIdRoundRecord.finalDifferences[stockCode]
            ).toFixed(2);
            const lastDigit = Number(price.split(".")[1]?.[0]) || 0;
            finalDifferencesArray[index] = lastDigit;
          } else {
            finalDifferencesArray[index] = 0;
            console.log(`Fallback for index ${index}: ${0}`);
          }
        });

        wheelValues = finalDifferencesArray;
        console.log("Final wheel values:", wheelValues);
      } else {
        console.log("Using fallback stockStates:", wheelValues);
      }

      // Reset glow state first
      setGlowState(defaultGlowState);

      // Only proceed if we have valid wheel values
      if (wheelValues && wheelValues.length === 5) {
        // Step 1: Count occurrences of each number (excluding some numbers)
        const countMap = new Map<number, number>();
        wheelValues.forEach((num) => {
          if (
            typeof num === "number" &&
            !isNaN(num) &&
            !EXCLUDED_NUMBERS.includes(num)
          ) {
            countMap.set(num, (countMap.get(num) || 0) + 1);
          }
        });

        // Step 2: Find numbers that appear 2 or more times
        const repeatedNumbers = Array.from(countMap.entries()).filter(
          ([, count]) => count >= 2
        );

        if (repeatedNumbers.length > 0) {
          // Step 3: Find the highest count among repeated numbers
          const maxCount = Math.max(
            ...repeatedNumbers.map(([, count]) => count)
          );

          // Step 4: Get all numbers with the highest count
          const mostRepeatedNumbers = repeatedNumbers
            .filter(([, count]) => count === maxCount)
            .map(([num]) => num);

          // Step 5: Pick the first number (if multiple have same highest count)
          const chosenNumber = mostRepeatedNumbers[0];

          // Step 6: Create glow state - true only for positions with the chosen number
          const newGlowState = wheelValues.map((num) => num === chosenNumber);
          setGlowState(newGlowState);
        }
      }

      // Update target values and stop spinning state
      setWheels((prev) =>
        prev.map((wheel, index) => ({
          ...wheel,
          targetValue: wheelValues[index] || 0,
          isSpinning: false,
        }))
      );

      // Animate each wheel to its final position with staggered timin
      wheelValues.forEach((targetValue, index) => {
        const wheelRef = wheelRefs.current[index];
        if (wheelRef && targetValue !== undefined) {
          const finalValue = targetValue;

          // Regular numbers (0-9): 3 sequences, middle starts at index 10
          const targetIndex = 10 + finalValue;

          // Calculate final position to show the middle occurrence of the number
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
            if (finalPosition > currentY) {
              shortestPath = finalPosition - cycleHeight;
            } else {
              shortestPath = finalPosition + cycleHeight;
            }
          }

          gsap.to(wheelRef, {
            y: shortestPath,
            duration: 1.5,
            ease: "elastic.out(1, 0.5)",
            onComplete: () => {
              gsap.set(wheelRef, { y: finalPosition });
            },
          });
        }
      });
    }
  }, [isGameActive, winningIdRoundRecord, numberHeight]);

  //? This effect is no longer needed as we're handling all sizing in the image effect
  // The image dimensions are the source of truth for the slot machine sizing

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
      const finalValue = value ?? 0;
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

      wheelRefs.current.forEach((wheelRef) => {
        if (wheelRef) {
          gsap.killTweensOf(wheelRef);

          const randomValue = Math.floor(Math.random() * 10);

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

  // Update number height when image loads or changes
  useEffect(() => {
    // Function to update height based on image dimensions
    function updateNumberHeight() {
      if (imgRef.current && imgRef.current.complete) {
        // Get the actual visible height of the slot area (2/3 of the image height)
        const slotAreaHeight = imgRef.current.clientHeight * (2/3);
        // We want to show 3 numbers in the visible area
        const calculatedHeight = slotAreaHeight / 3;
        
        if (calculatedHeight > 0) {
          setNumberHeight(calculatedHeight);
          console.log("Updated numberHeight:", calculatedHeight);
        }
      }
    }

    // Run immediately if image is already loaded
    updateNumberHeight();
    
    // Also listen for image load event
    const imageElement = imgRef.current;
    if (imageElement) {
      imageElement.addEventListener('load', updateNumberHeight);
    }
    
    // Create ResizeObserver to detect size changes
    const resizeObserver = new ResizeObserver(() => {
      updateNumberHeight();
    });
    
    if (imageElement) {
      resizeObserver.observe(imageElement);
    }
    
    return () => {
      if (imageElement) {
        imageElement.removeEventListener('load', updateNumberHeight);
        resizeObserver.unobserve(imageElement);
      }
      resizeObserver.disconnect();
    };
  }, []);

  return (
    <>
      
        {/* Explicit height container */}
        <img
          ref={imgRef}
          src="/images/slot-machine/game-board.png"
          alt="game board"
          className="h-full w-auto max-h-[50vh] object-contain z-20" // h-full forces it to container height
        />
      <div
        style={{
          width: imgRef.current?.clientWidth,
          height: imgRef.current?.clientHeight,
        }}
        className=" h-full flex justify-center items-center absolute z-10"
      >
        <img
          className="absolute top-0 left-0 -translate-y-[80%] h-auto"
          src="/images/slot-machine/lady.png"
          alt="game board"
          width={isMobile ? 95 : (imgRef.current?.clientWidth || 150) / 4}
        />
      </div>
      <div
        style={{
          width: imgRef.current?.clientWidth,
          height: imgRef.current?.clientHeight,
        }}
        className="flex justify-center items-center absolute z-30"
      >
        <div
          ref={wheelContainerRef}
          className="w-[87%] max-w-4xl mx-auto h-2/3 relative z-20"
        >
          <div className="grid grid-cols-5 h-full relative justify-center items-center ">
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
                  {regularNumbers.map((number, numberIndex) => (
                    <div
                      key={`${wheelIndex}-${numberIndex}`}
                      className="flex items-center justify-center relative"
                    >
                      <img
                        style={{ height: numberHeight }}
                        src={
                          EXCLUDED_NUMBERS.includes(number)
                            ? `/images/slot-machine/loss.png`
                            : `/images/slot-machine/${"number"}-${number}.png`
                        }
                        alt={`${number}`}
                        className="w-auto object-contain"
                        draggable={false}
                      />
                    </div>
                  ))}
                </div>
              </div>
            ))}
            {/* //? glow effect for winning numbers */}
            <div
              style={{ height: numberHeight }}
              className="grid grid-cols-5 justify-center items-center w-full z-20 absolute"
            >
              {glowSate.slice(0, 5).map((glow, i) => (
                <div
                  key={i}
                  style={{
                    height: numberHeight,
                    opacity: glow ? 1 : 0,
                    animation: "slotWinPulse 0.8s ease-in-out infinite",
                  }}
                  className="w-full flex justify-center items-center"
                ></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

const GameBoard: React.FC<StockSlot2DWheelProps> = (props) => {
  return <StockSlot2DWheel {...props} />;
};

export default GameBoard;
