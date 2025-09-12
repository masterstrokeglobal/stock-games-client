"use client"

import TimeDisplay from "@/components/common/bet-locked-banner"
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet"
import useAviator from "@/hooks/use-aviator"
import { useGameState } from "@/hooks/use-current-game"
import { useGameType, useStockSelectorAviator } from "@/hooks/use-market-selector"
import useWindowSize from "@/hooks/use-window-size"
import { cn } from "@/lib/utils"
import { SchedulerType } from "@/models/market-item"
import { RoundRecord } from "@/models/round-record"
import { useEffect, useState, useMemo } from "react"
import BettingPanel from "./BettingPanel"
import GameDisplay from "./GameDisplay"
import LastRoundsPanel from "./LastRoundsPanel"
import { useAviatorMyPlacement } from "@/react-query/aviator-queries"


type AviatorProps = {
  className?: string,
  roundRecord: RoundRecord,
  token: string
}

export default function   Aviator({ className, roundRecord, token }: AviatorProps) {
  const { gameType } = useGameType();
  const { stockSelectedAviator } = useStockSelectorAviator();
  const { isPlaceOver, placeTimeLeft, isGameOver } = useGameState(roundRecord);
  const { data: myPlacement } = useAviatorMyPlacement(roundRecord.id);
  
  const [shouldShowBlast, setShouldShowBlast] = useState(false)
  const [isParallaxMoving, setIsParallaxMoving] = useState(false)
  const [hasTriggeredFlying, setHasTriggeredFlying] = useState(false)
  const [canvasOpacity, setCanvasOpacity] = useState(1)

  // Callback to handle when selected plane crashes
  const handleSelectedPlaneCrash = (crashed: boolean) => {
    if (crashed) {
      console.log("💥 SELECTED PLANE CRASHED - Triggering blast video!");
      setShouldShowBlast(true);
      setCanvasOpacity(0);
      
      // Reset canvas opacity after blast video
      setTimeout(() => {
        console.log("🎨 Resetting canvas opacity after blast");
        setCanvasOpacity(1);
      }, 5000);
    }
  };

  const aviator = useAviator({
    type: gameType,
    token: token,
    roundRecord: roundRecord,
    onSelectedPlaneCrash: handleSelectedPlaneCrash
  });

  const { isMobile } = useWindowSize();

  // Get current stock information
  const currentStock = roundRecord.market.find(stock => stock.id === Number(stockSelectedAviator));

  // Get the current multiplier for the selected plane from planeStatus
  const getCurrentMultiplier = () => {
    if (!currentStock || !aviator.planeStatus) return 1;
    const codeToCheck = gameType === SchedulerType.CRYPTO ? currentStock.code : currentStock.codeName;
    return aviator.planeStatus.get(codeToCheck ?? "")?.multiplier ?? 1;
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
  const [showLastRounds, setShowLastRounds] = useState(false)


  // Handle game state changes based on roundRecord
  useEffect(() => {
    console.log("🎯 isPlaceOver", isPlaceOver, placeTimeLeft)
    // Trigger flying sequence when 2 seconds left in betting phase
    if (
      (!isPlaceOver && placeTimeLeft.seconds <= 2 && placeTimeLeft.seconds > 0 && !hasTriggeredFlying)
      || (isPlaceOver && !hasTriggeredFlying)
    ) {
      console.log("🛫 Starting flying sequence - 2 seconds before game start")
      setIsParallaxMoving(true) // Start parallax movement
      setHasTriggeredFlying(true)
      localStorage.setItem("gameEnded", "false")
      console.log("🎯 gameEnded 2", localStorage.getItem("gameEnded"))
    }

    // Stop animation immediately when game ends
    if (isGameOver && isParallaxMoving) {
      console.log("🛬 Game ended, stopping animation immediately")
      setIsParallaxMoving(false) // Stop parallax movement immediately
    }

    // Reset flying trigger when new round starts
    if (!isPlaceOver && placeTimeLeft.raw > 10) {
      setHasTriggeredFlying(false)
    }
  }, [isPlaceOver, isGameOver, placeTimeLeft.raw, hasTriggeredFlying, isParallaxMoving])

  // Handle round end - play blast video when round ends regardless of selected plane
  useEffect(() => {
    if (isGameOver) {
      console.log("🎯 Round ended - Triggering blast video");
      setShouldShowBlast(true);
      setCanvasOpacity(0);
      
      // Reset canvas opacity after blast video
      setTimeout(() => {
        console.log("🎨 Resetting canvas opacity after round end blast");
        setCanvasOpacity(1);
      }, 5000);
    }
  }, [isGameOver]);

  // Reset blast video state when switching planes
  useEffect(() => {
    console.log("🔄 Selected plane changed, resetting blast video state");
    setShouldShowBlast(false);
  }, [stockSelectedAviator]);

  const toggleLastRounds = () => {
    setShowLastRounds(!showLastRounds)
  }

  return (
    <div className={cn("min-h-[calc(100svh-70px)] bg-gradient-to-b from-purple-600 to-pink-500  overflow-hidden", className)}>
      <div className="flex relative flex-col max-h-[calc(150vh)]z  min-h-[calc(150svh)] lg:min-h-[calc(120svh)] lg:max-h-[calc(120vh)]">

        <TimeDisplay 
          roundRecord={roundRecord} 
          className="fixed top-14 left-1/2 -translate-x-1/2 z-50  w-full max-w-md" 
          isAviator 
        />
        {/* Mobile Last Rounds Toggle Button */}
        {isMobile && (
          <button
            onClick={toggleLastRounds}
            className="absolute top-2 right-2 z-20 bg-black/50 text-white px-3 py-1 rounded-full text-sm font-medium backdrop-blur-sm border border-white/20 hover:bg-black/70 transition-colors"
          >
            {showLastRounds ? '✕ Close' : '📊 History'}
          </button>
        )}

        {/* Main Game Area */}
        <div className="flex flex-1 overflow-hidden flex-col lg:flex-row relative">
          {/* Game Content */}
          <div className="flex-1 relative flex flex-col min-h-[60vh] lg:min-h-0">

            <GameDisplay
              multiplier={currentMultiplier}
              shouldShowBlast={shouldShowBlast}
              setShouldShowBlast={setShouldShowBlast}
              isParallaxMoving={isParallaxMoving}
              canvasOpacity={canvasOpacity}
              stockName={currentStock?.name}
              planeStatus={currentStock ? aviator.planeStatus?.get(gameType === SchedulerType.CRYPTO ? currentStock.code ?? "" : currentStock.codeName ?? "")?.status : undefined}
              betAmount={isBetOnCurrentPlane ? userPlacement?.amount : undefined}
              hasBet={isBetOnCurrentPlane}
              hasCashedOut={isBetOnCurrentPlane ? userPlacement?.isWinner : false}
              roundRecord={roundRecord}
            />

            <BettingPanel roundRecord={roundRecord} aviator={aviator} multiplier={currentMultiplier} />
          </div>
          <div className="lg:w-96 h-[40vh] lg:h-auto">
            {isMobile ? (
              <Sheet open={showLastRounds} onOpenChange={setShowLastRounds}>
                <SheetContent side="right" className="w-full max-w-sm p-0 bg-primary-game  border-gray-600">
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
            )}
          </div>
        </div>
      </div>
    </div>
  )
}