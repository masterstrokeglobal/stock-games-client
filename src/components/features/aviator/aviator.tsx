"use client"

import TimeDisplay from "@/components/common/bet-locked-banner"
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet"
import useAviator from "@/hooks/use-aviator"
import { useGameType, useStockSelectorAviator } from "@/hooks/use-market-selector"
import useWindowSize from "@/hooks/use-window-size"
import { useGameState } from "@/hooks/use-current-game"
import { cn } from "@/lib/utils"
import { SchedulerType } from "@/models/market-item"
import { RoundRecord } from "@/models/round-record"
import { useEffect, useState } from "react"
import BettingPanel from "./BettingPanel"
import GameDisplay from "./GameDisplay"
import LastRoundsPanel from "./LastRoundsPanel"
import gsap from "gsap"


type AviatorProps = {
  className?: string,
  roundRecord: RoundRecord,
  token: string
}

export default function   Aviator({ className, roundRecord, token }: AviatorProps) {
  const { gameType } = useGameType();
  const { stockSelectedAviator, setStockSelectedAviator } = useStockSelectorAviator();
  const { isPlaceOver, placeTimeLeft, isGameOver } = useGameState(roundRecord);
  const aviator = useAviator({
    type: gameType,
    token: token,
    roundRecord: roundRecord
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

  const [shouldShowBlast, setShouldShowBlast] = useState(false)
  const [isParallaxMoving, setIsParallaxMoving] = useState(false)
  const [hasTriggeredFlying, setHasTriggeredFlying] = useState(false)
  const [canvasOpacity, setCanvasOpacity] = useState(1)

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

  // Monitor backend events for crash/fly-away
  useEffect(() => {
    if (aviator.data.length > 0 && localStorage.getItem("gameEnded") === "false") {
      localStorage.setItem("gameEnded", "true")
      console.log("🎯 gameEnded", localStorage.getItem("gameEnded"))
      const latestItem = aviator.data[aviator.data.length - 1]

      if (latestItem.status === "crashed") {
        console.log(`💥 PLANE CRASHED at ${latestItem.multiplier.toFixed(2)}x multiplier! (Backend Event)`)
        setShouldShowBlast(true) // Trigger blast video
        setCanvasOpacity(0) // Hide canvas during blast

        // Reset canvas opacity after 5 seconds
        setTimeout(() => {
          console.log("🎨 Resetting canvas opacity after blast")
          setCanvasOpacity(1)
        }, 5000)

      } else if (latestItem.status === "flew_away") {
        console.log(`🚀 PLANE FLEW AWAY at ${latestItem.multiplier.toFixed(2)}x multiplier! (Backend Event)`)
        // Plane flew away - no blast needed
        setShouldShowBlast(false)

        // Find the canvas container element for fly-away animation
        const canvasContainer = document.querySelector('[data-canvas-container]') as HTMLElement
        if (canvasContainer) {
          console.log("✈️ Starting fly-away animation")

          // Animate canvas to scale down to 0 and move to top-right over 1 second
          gsap.to(canvasContainer, {
            scale: 0,
            x: "50%", // Move to right
            y: "-50%", // Move to top
            duration: 1,
            ease: "power2.in",
            onComplete: () => {
              console.log("✈️ Plane flew away completely")
              // Clear the aviatorStockId URL parameter to go to the stock selection screen
              setStockSelectedAviator(null);
              console.log("🔄 Cleared aviatorStockId - redirecting to stock selection")
            }
          })

          // Reset canvas after 5 seconds
          setTimeout(() => {
            console.log("🔄 Resetting canvas position after fly-away")
            gsap.to(canvasContainer, {
              scale: 1,
              x: "-30%", // Back to original position
              y: "40%", // Back to original position
              duration: 0.5,
              onComplete: () => {
                setStockSelectedAviator(null);
                console.log("🔄 Cleared aviatorStockId - redirecting to stock selection")
              }
            })
          },3000)
        }
      } else {
        localStorage.setItem("gameEnded", "false")
        console.log("🎯 gameEnded 3", localStorage.getItem("gameEnded"))
      }
    }
  }, [aviator.data]) // Monitor aviator.data changes from backend

  const toggleLastRounds = () => {
    setShowLastRounds(!showLastRounds)
  }

  return (
    <div className={cn("min-h-[calc(100svh-70px)] bg-gradient-to-b from-purple-600 to-pink-500  overflow-hidden", className)}>
      <div className="flex relative flex-col h-[calc(100svh-70px)]">

        <TimeDisplay 
          roundRecord={roundRecord} 
          className="fixed top-14 left-1/2 -translate-x-1/2 z-50  w-full max-w-md" 
          isAviator 
          currentStockName={currentStock?.name}
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