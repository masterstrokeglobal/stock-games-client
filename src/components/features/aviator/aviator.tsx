"use client"

import TimeDisplay from "@/components/common/bet-locked-banner"
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet"
import useAviator from "@/hooks/use-aviator"
import { useGameType } from "@/hooks/use-market-selector"
import useWindowSize from "@/hooks/use-window-size"
import { cn } from "@/lib/utils"
import { RoundRecord } from "@/models/round-record"
import { useEffect, useRef, useState } from "react"
import BettingPanel from "./BettingPanel"
import GameDisplay from "./GameDisplay"
import LastRoundsPanel from "./LastRoundsPanel"
import { AviatorCanvasRef } from "./aviator-canvas"
// Game phases enum
enum GamePhase {
  BETTING_OPEN = "BETTING_OPEN",
  BETTING_CLOSED = "BETTING_CLOSED",
  GAME_RUNNING = "GAME_RUNNING",
  GAME_ENDED = "GAME_ENDED",
  WAITING = "WAITING"
}


type AviatorProps = {
  className?: string,
  roundRecord: RoundRecord,
  token: string
}

export default function Aviator({ className, roundRecord, token }: AviatorProps) {
  const aviatorRef = useRef<AviatorCanvasRef>(null)
  const { gameType } = useGameType();
  const aviator = useAviator({
    type: gameType,
    token: token,
    roundRecord: roundRecord
  });

  console.log(aviator.data)

  const { isMobile } = useWindowSize();

  const [, setMultiplier] = useState(1.0)
  const [, setGamePhase] = useState<GamePhase>(GamePhase.WAITING)

  const [shouldShowBlast, setShouldShowBlast] = useState(false)

  // Mobile responsiveness state
  const [showLastRounds, setShowLastRounds] = useState(false)


  // Generate random crash multiplier (weighted towards lower values)
  const generateCrashMultiplier = (): number => {
    const random = Math.random()

    // Heavily weighted probability distribution to keep average under 2.5x
    if (random < 0.7) {
      // 70% chance: 1.00x - 2.00x (average ~1.5x)
      return 1.0 + Math.random() * 1.0
    } else if (random < 0.9) {
      // 20% chance: 2.00x - 4.00x (average ~3.0x)
      return 2.0 + Math.random() * 2.0
    } else if (random < 0.98) {
      // 8% chance: 4.00x - 7.00x (average ~5.5x)
      return 4.0 + Math.random() * 3.0
    } else {
      // 2% chance: 7.00x - 10.00x (average ~8.5x)
      return 7.0 + Math.random() * 3.0
    }
  }



  // Main game simulation logic
  useEffect(() => {
    let phaseTimer: NodeJS.Timeout
    let multiplierInterval: NodeJS.Timeout
    let countdownInterval: NodeJS.Timeout

    const startBettingPhase = () => {
      console.log("🎯 Starting betting phase")

      // Ensure clean state for new round
      clearInterval(multiplierInterval)
      clearInterval(countdownInterval)
      clearTimeout(phaseTimer)

      setGamePhase(GamePhase.BETTING_OPEN)
      setMultiplier(1.0)
      setShouldShowBlast(false) // Ensure blast is off for new round

      // Start 15-second countdown
      let timeRemaining = 15000

      countdownInterval = setInterval(() => {
        timeRemaining -= 1000

        if (timeRemaining <= 0) {
          clearInterval(countdownInterval)
          setGamePhase(GamePhase.BETTING_CLOSED)
        }
      }, 1000)

      phaseTimer = setTimeout(() => {
        setGamePhase(GamePhase.BETTING_CLOSED)
        startGamePhase()
      }, 15000)
    }

    const startGamePhase = () => {
      console.log("🚀 Starting game phase")
      setGamePhase(GamePhase.GAME_RUNNING)

      // Generate target crash multiplier
      const targetMultiplier = generateCrashMultiplier()

      // Determine if plane will crash or fly away
      // 10% chance to fly away, but only if target multiplier is >= 3.0x
      const willFlyAway = Math.random() < 0.10 && targetMultiplier >= 3.0

      console.log(`🎲 Target multiplier: ${targetMultiplier.toFixed(2)}x, Will fly away: ${willFlyAway}`)

      const gameStartTime = Date.now()

      // Start multiplier growth
      multiplierInterval = setInterval(() => {
        setMultiplier(prev => {
          const newValue = Number.parseFloat((prev + 0.01).toFixed(2))

          // Check if we should end the game
          if (!willFlyAway && newValue >= targetMultiplier) {
            // Normal crash
            clearInterval(multiplierInterval)
            endGame(targetMultiplier, Date.now() - gameStartTime, "crashed")
            return targetMultiplier
          } else if (willFlyAway && newValue >= targetMultiplier + 1.0) {
            // Plane flies away at target + 1x (making it more achievable)
            clearInterval(multiplierInterval)
            endGame(newValue, Date.now() - gameStartTime, "flew_away")
            return newValue
          }

          return newValue
        })
      }, 100) // Update every 100ms for smooth animation
    }

    const endGame = (finalMultiplier: number, duration: number, status: "crashed" | "flew_away") => {
      console.log(`🏁 Game ended: ${finalMultiplier.toFixed(2)}x - ${status}`)

      // Clear any remaining intervals immediately
      clearInterval(multiplierInterval)
      clearInterval(countdownInterval)

      setGamePhase(GamePhase.GAME_ENDED)

      // Add to history

      // Show blast animation if crashed
      if (status === "crashed") {
        setShouldShowBlast(true)
      }

      // Wait 10 seconds before starting next round
      phaseTimer = setTimeout(() => {
        setGamePhase(GamePhase.WAITING)

        // Only reset shouldShowBlast if the blast video has finished
        // (the GameDisplay component will handle setting it to false when done)
        if (status === "flew_away") {
          setShouldShowBlast(false)
        }

        // Reset other game states for the new round
        setMultiplier(1.0)

        // Brief waiting period before next betting phase
        setTimeout(() => {
          startBettingPhase()
        }, 1000)
      }, 10000)
    }

    // Start the first betting phase
    startBettingPhase()

    return () => {
      clearTimeout(phaseTimer)
      clearInterval(multiplierInterval)
      clearInterval(countdownInterval)
    }
  }, []) // Empty dependency array - only run once on mount



  const toggleLastRounds = () => {
    setShowLastRounds(!showLastRounds)
  }

  return (
    <div className={cn("min-h-[calc(100svh-70px)] bg-gradient-to-b from-purple-600 to-pink-500  overflow-hidden", className)}>
      <div className="flex relative flex-col h-[calc(100svh-70px)]">

        <TimeDisplay roundRecord={roundRecord} className="fixed top-14 left-1/2 -translate-x-1/2 z-50  w-full max-w-md" />
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
              ref={aviatorRef}
              multiplier={aviator.data[aviator.data.length - 1]?.multiplier ?? 1}
              shouldShowBlast={shouldShowBlast}
              setShouldShowBlast={setShouldShowBlast}
            />

            <BettingPanel roundRecord={roundRecord} aviator={aviator} />
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