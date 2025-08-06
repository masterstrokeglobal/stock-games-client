"use client";

import useAviator from "@/hooks/use-aviator";
import { useGameState } from "@/hooks/use-current-game";
import {
  useGameType,
  useStockSelectorAviator,
} from "@/hooks/use-market-selector";
//  import useWindowSize from "@/hooks/use-window-size";
import { cn } from "@/lib/utils";
import { SchedulerType } from "@/models/market-item";
import { RoundRecord } from "@/models/round-record";
import { useEffect, useState, useMemo } from "react";
import { useAviatorMyPlacement } from "@/react-query/aviator-queries";
import TimeDisplay from "./time-display";

// import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import BettingPanel from "./BettingPanel";
import GameDisplay from "./GameDisplay";
// import LastRoundsPanel from "./LastRoundsPanel";
import MenuDialog from "./dialogs/menu-dialog";
import GameEndDialog from "./game-end-dialog";
import RaceResultDialog from "./dialogs/race-result-dialog";

type AviatorProps = {
  className?: string;
  roundRecord: RoundRecord;
  token: string;
};  

export default function Aviator({
  className,
  roundRecord,
  token,
}: AviatorProps) {
  const { gameType } = useGameType();
  const { stockSelectedAviator } = useStockSelectorAviator();
  const { isPlaceOver, placeTimeLeft, isGameOver } = useGameState(roundRecord);
  const { data: myPlacement } = useAviatorMyPlacement(roundRecord.id);

  const [isParallaxMoving, setIsParallaxMoving] = useState(false);
  const [hasTriggeredFlying, setHasTriggeredFlying] = useState(false);
  const [canvasOpacity, setCanvasOpacity] = useState(1);
  const [isDialogVisible, setIsDialogVisible] = useState(false);

  // Callback to handle when selected plane crashes
  const handleSelectedPlaneCrash = (crashed: boolean) => {
    if (crashed) {
      console.log("💥 SELECTED PLANE CRASHED - Triggering blast video!");
      setCanvasOpacity(0);

      // Reset canvas opacity after blast video
      // setTimeout(() => {
      //   console.log("🎨 Resetting canvas opacity after blast");
      //   setCanvasOpacity(1);
      // }, 5000);
    }
  };

  const aviator = useAviator({
    type: gameType,
    token: token,
    roundRecord: roundRecord,
    onSelectedPlaneCrash: handleSelectedPlaneCrash,
  });

  // const { isMobile } = useWindowSize();

  // Get current stock information
  const currentStock = roundRecord.market.find(
    (stock) => stock.id === Number(stockSelectedAviator)
  );

  // Get the current multiplier for the selected plane from planeStatus
  const getCurrentMultiplier = () => {
    if (!currentStock || !aviator.planeStatus) return 0;
    const codeToCheck =
      gameType === SchedulerType.CRYPTO
        ? currentStock.code
        : currentStock.codeName;
    return aviator.planeStatus.get(codeToCheck ?? "")?.multiplier ?? 0;
  };

  const currentMultiplier = getCurrentMultiplier();

  // Get the user's single bet placement (if any)
  const userPlacement = useMemo(() => {
    if (!myPlacement || myPlacement.length === 0) return null;
    return myPlacement[0]; // Since we only allow one bet, get the first (and only) placement
  }, [myPlacement]);

  // Check if user's bet is on the currently selected plane
  const isBetOnCurrentPlane = useMemo(() => {
    if (!userPlacement || !stockSelectedAviator) return false;
    return userPlacement.marketItem.id === Number(stockSelectedAviator);
  }, [userPlacement, stockSelectedAviator]);

  // Mobile responsiveness state
  // const [showLastRounds, setShowLastRounds] = useState(false);

  // Handle game state changes based on roundRecord
  useEffect(() => {
    console.log("🎯 isPlaceOver", isPlaceOver, placeTimeLeft);
    // Trigger flying sequence when 2 seconds left in betting phase
    if (
      (!isPlaceOver &&
        placeTimeLeft.seconds <= 2 &&
        placeTimeLeft.seconds > 0 &&
        !hasTriggeredFlying) ||
      (isPlaceOver && !hasTriggeredFlying)
    ) {
      console.log("🛫 Starting flying sequence - 2 seconds before game start");
      setIsParallaxMoving(true); // Start parallax movement
      setHasTriggeredFlying(true);
      localStorage.setItem("gameEnded", "false");
      console.log("🎯 gameEnded 2", localStorage.getItem("gameEnded"));
    }

    // Stop animation immediately when game ends
    if (isGameOver && isParallaxMoving) {
      console.log("🛬 Game ended, stopping animation immediately");
      setIsParallaxMoving(false); // Stop parallax movement immediately
    }

    // Reset flying trigger when new round starts - only reset when we're clearly in a new betting phase
    // and the game is not over (to avoid resetting during state transitions)
    if (
      !isPlaceOver &&
      !isGameOver &&
      placeTimeLeft.raw > 15 &&
      hasTriggeredFlying
    ) {
      console.log("🔄 New round detected, resetting flying trigger");
      setHasTriggeredFlying(false);
    }
  }, [
    isPlaceOver,
    isGameOver,
    placeTimeLeft.raw,
    hasTriggeredFlying,
    isParallaxMoving,
  ]);

  // Handle round end - play blast video when round ends regardless of selected plane
  useEffect(() => {
    if (isGameOver) {
      console.log("🎯 Round ended - Triggering blast video");
      setCanvasOpacity(0);

      // Reset canvas opacity after blast video
      setTimeout(() => {
        console.log("🎨 Resetting canvas opacity after round end blast");
        setCanvasOpacity(1);
      }, 5000);
    }
  }, [isGameOver]);

  return (
    <div
      className={cn(
        "h-screen overflow-hidden relative w-full flex flex-1",
        className
      )}
    >
      {/* main game animations  */}
      <GameDisplay
        multiplier={currentMultiplier}
        isParallaxMoving={isParallaxMoving}
        setIsParallaxMoving={setIsParallaxMoving}
        canvasOpacity={canvasOpacity}
        planeStatus={
          currentStock
            ? aviator.planeStatus?.get(
                gameType === SchedulerType.CRYPTO
                  ? currentStock.code ?? ""
                  : currentStock.codeName ?? ""
              )?.status
            : undefined
        }
        isGameOver={isGameOver}
      />

      <div className="w-full flex flex-col-reverse lg:flex-row justify-between lg:p-5 p-2 z-40 relative h-full overflow-y-auto">

        <BettingPanel
          roundRecord={roundRecord}
          aviator={aviator}
          multiplier={currentMultiplier}
        />

        {/* time display center */}
        <div className="flex justify-between items-start lg:justify-center flex-1 relative">
          {/* race result dialog at top left - mobile only */}
          <RaceResultDialog>
            <div className="race-result-btn lg:hidden rounded-full bg-[#FFFFFF33] border border-[#FFFFFF33] py-[5px] px-[10px] text-white text-[12px] font-medium">
              Race Result
            </div>
          </RaceResultDialog>

          {/* time display at center */}
          <TimeDisplay
            roundRecord={roundRecord}
            multiplier={currentMultiplier}
            hasBet={isBetOnCurrentPlane}
            hasCashedOut={isBetOnCurrentPlane ? userPlacement?.isWinner : false}
            betAmount={isBetOnCurrentPlane ? userPlacement?.amount : undefined}
            planeStatus={
              currentStock
                ? aviator.planeStatus?.get(
                    gameType === SchedulerType.CRYPTO
                      ? currentStock.code ?? ""
                      : currentStock.codeName ?? ""
                  )?.status
                : undefined
            }
          />

          {/* menu dialog at top right for mobile */}
          <MenuDialog />

          {/* game end dialog at center */}
          <GameEndDialog
            roundRecord={roundRecord}
            multiplier={currentMultiplier}
            hasBet={isBetOnCurrentPlane}
            betAmount={isBetOnCurrentPlane ? userPlacement?.amount : undefined}
            hasCashedOut={isBetOnCurrentPlane ? userPlacement?.isWinner : false}
            planeStatus={
              currentStock
                ? aviator.planeStatus?.get(
                    gameType === SchedulerType.CRYPTO
                      ? currentStock.code ?? ""
                      : currentStock.codeName ?? ""
                  )?.status
                : undefined
            }
            setIsDialogVisible={setIsDialogVisible}
            isDialogVisible={isDialogVisible}
          />
        </div>
        {/* {isMobile ? (
          <Sheet open={showLastRounds} onOpenChange={setShowLastRounds}>
            <SheetContent
              side="right"
              className="w-full max-w-sm p-0 bg-primary-game  border-gray-600"
            >
              <div className="h-full flex flex-col">
                <div className="flex items-center justify-between p-4 ">
                  <SheetTitle className="text-white">Round History</SheetTitle>
                </div>
                <div className="flex-1 overflow-hidden">
                  <LastRoundsPanel />
                </div>
              </div>
            </SheetContent>
          </Sheet>
        ) : (
          <LastRoundsPanel />
        )} */}
      </div>
    </div>
  );
}
