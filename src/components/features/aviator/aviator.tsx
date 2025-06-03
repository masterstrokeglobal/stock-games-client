"use client"

import { useState, useEffect, useRef } from "react"
import Header from "./Header"
import GameDisplay from "./GameDisplay"
import BettingPanel from "./BettingPanel"
import LastRoundsPanel from "./LastRoundsPanel"
import { AviatorCanvasRef } from "./aviator-canvas"
import { cn } from "@/lib/utils"
import useWindowSize from "@/hooks/use-window-size"

interface GameRound {
  id: number
  time: string
  multiplier: string
  duration: string
  status: "crashed" | "flew_away"
}

// Game phases enum
enum GamePhase {
  BETTING_OPEN = "BETTING_OPEN",
  BETTING_CLOSED = "BETTING_CLOSED", 
  GAME_RUNNING = "GAME_RUNNING",
  GAME_ENDED = "GAME_ENDED",
  WAITING = "WAITING"
}

interface FormattedTime {
  minutes: number;
  seconds: number;
  formatted: string;
  raw: number;
}

const formatTime = (ms: number): FormattedTime => {
  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  return {
    minutes,
    seconds: remainingSeconds,
    formatted: `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`,
    raw: ms
  };
};

export default function Aviator({className}: {className?: string}) {
  const aviatorRef = useRef<AviatorCanvasRef>(null)
  const nextRoundIdRef = useRef(13) 

  const {isMobile} = useWindowSize();
  
  const [multiplier, setMultiplier] = useState(1.0)
  const [gamePhase, setGamePhase] = useState<GamePhase>(GamePhase.WAITING)
  const [timeLeft, setTimeLeft] = useState<FormattedTime>(formatTime(0))

  const [shouldShowBlast, setShouldShowBlast] = useState(false)
  
  // Mobile responsiveness state
  const [showLastRounds, setShowLastRounds] = useState(false)



  const [lastRounds, setLastRounds] = useState<GameRound[]>([
    {
      id: 1,
      time: "14:32:15",
      multiplier: "5.57x",
      duration: "12.3s",
      status: "crashed",
    },
    {
      id: 2,
      time: "14:31:48",
      multiplier: "2.86x",
      duration: "8.1s",
      status: "crashed",
    },
    {
      id: 3,
      time: "14:31:22",
      multiplier: "3.21x",
      duration: "9.7s",
      status: "crashed",
    },
    {
      id: 4,
      time: "14:30:55",
      multiplier: "1.67x",
      duration: "4.2s",
      status: "crashed",
    },
    {
      id: 5,
      time: "14:30:28",
      multiplier: "8.94x",
      duration: "18.6s",
      status: "flew_away",
    },
    {
      id: 6,
      time: "14:30:01",
      multiplier: "1.23x",
      duration: "2.8s",
      status: "crashed",
    },
    {
      id: 7,
      time: "14:29:34",
      multiplier: "4.15x",
      duration: "11.2s",
      status: "crashed",
    },
    {
      id: 8,
      time: "14:29:07",
      multiplier: "2.44x",
      duration: "6.9s",
      status: "crashed",
    },
    {
      id: 9,
      time: "14:28:40",
      multiplier: "6.78x",
      duration: "15.4s",
      status: "crashed",
    },
    {
      id: 10,
      time: "14:28:13",
      multiplier: "1.89x",
      duration: "5.1s",
      status: "crashed",
    },
    {
      id: 11,
      time: "14:27:46",
      multiplier: "3.67x",
      duration: "10.3s",
      status: "flew_away",
    },
    {
      id: 12,
      time: "14:27:19",
      multiplier: "12.45x",
      duration: "24.7s",
      status: "crashed",
    },
  ])

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

  // Add round to history
  const addRoundToHistory = (finalMultiplier: number, duration: number, status: "crashed" | "flew_away") => {
    const now = new Date()
    const timeString = now.toLocaleTimeString('en-US', { 
      hour12: false, 
      hour: '2-digit', 
      minute: '2-digit', 
      second: '2-digit' 
    })
    
    // Use ref to ensure unique IDs
    const uniqueId = nextRoundIdRef.current
    nextRoundIdRef.current += 1
    
    const newRound: GameRound = {
      id: uniqueId,
      time: timeString,
      multiplier: `${finalMultiplier.toFixed(2)}x`,
      duration: `${(duration / 1000).toFixed(1)}s`,
      status
    }

    setLastRounds(prev => [newRound, ...prev.slice(0, 11)]) // Keep only last 12 rounds
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
      setTimeLeft(formatTime(timeRemaining))
      
      countdownInterval = setInterval(() => {
        timeRemaining -= 1000
        setTimeLeft(formatTime(timeRemaining))
        
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
      setTimeLeft(formatTime(0))
      
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
      addRoundToHistory(finalMultiplier, duration, status)
      
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
        setTimeLeft(formatTime(0))
        
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

  const getStatusText = () => {
    switch (gamePhase) {
      case GamePhase.BETTING_OPEN:
        return "Betting Open"
      case GamePhase.BETTING_CLOSED:
        return "Betting Closed"
      case GamePhase.GAME_RUNNING:
        return "Flying..."
      case GamePhase.GAME_ENDED:
        return lastRounds[0]?.status === "crashed" ? "Crashed!" : "Flew Away!"
      case GamePhase.WAITING:
        return "Next Round Starting..."
      default:
        return ""
    }
  }


  const toggleLastRounds = () => {
    setShowLastRounds(!showLastRounds)
  }

  return (
    <div className= {cn("min-h-[calc(100svh-70px)] bg-gradient-to-b from-purple-600 to-pink-500  overflow-hidden", className)}>
      <div className="flex relative flex-col h-[calc(100svh-70px)]">
        <Header />

        {/* Timer Display */}
        <div className="text-center w-full absolute top-0 left-[50%] translate-x-[-50%] z-10">
          <div className="bg-gradient-to-r from-blue-900 via-blue-800 to-blue-900 h-12 sm:h-16 rounded-full shadow-lg flex items-center justify-center mx-auto max-w-xs sm:max-w-md relative overflow-hidden">
            <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-blue-500 to-blue-400 opacity-50"></div>
            
            <div className="flex flex-col items-center justify-center px-4">
              <span className="text-white font-bold tracking-wider text-xs sm:text-sm">
                {getStatusText()}
              </span>
              
              {gamePhase === GamePhase.BETTING_OPEN && (
                <span
                  className="text-white font-bold text-lg sm:text-xl tracking-wider transition-opacity duration-500"
                  style={{
                    opacity: timeLeft.raw % 2000 < 1000 ? 1 : 0.5
                  }}
                >
                  {timeLeft.formatted}
                </span>
              )}
              
              {gamePhase === GamePhase.GAME_RUNNING && (
                <span className="text-white font-bold text-lg sm:text-xl tracking-wider">
                  {multiplier.toFixed(2)}x
                </span>
              )}
            </div>
          </div>
        </div>

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
              multiplier={multiplier}
              shouldShowBlast={shouldShowBlast}
              setShouldShowBlast={setShouldShowBlast}
            />
            
            <BettingPanel gamePhase={gamePhase} />
          </div>

          {/* Last Rounds Panel - Desktop always visible, Mobile toggle */}
          <div className={`
            ${isMobile 
              ? `fixed inset-0 z-30 bg-black/50 backdrop-blur-sm transition-all duration-300 ${
                  showLastRounds 
                    ? 'opacity-100 pointer-events-auto' 
                    : 'opacity-0 pointer-events-none'
                }`
              : 'lg:w-80 h-[40vh] lg:h-auto'
            }
          `}>
            {isMobile ? (
              // Mobile overlay version
              <div className={`
                absolute right-0 top-0 h-full w-full max-w-sm bg-gradient-to-b from-purple-600 to-pink-500 
                transform transition-transform duration-300 ease-out
                ${showLastRounds ? 'translate-x-0' : 'translate-x-full'}
              `}>
                <div className="h-full flex flex-col">
                  <div className="flex items-center justify-between p-4 border-b border-white/20">
                    <h3 className="text-white font-bold text-lg">Round History</h3>
                    <button
                      onClick={toggleLastRounds}
                      className="text-white hover:text-gray-300 text-2xl font-bold"
                    >
                      ✕
                    </button>
                  </div>
                  <div className="flex-1 overflow-hidden">
                    <LastRoundsPanel lastRounds={lastRounds} />
                  </div>
                </div>
              </div>
            ) : (
              // Desktop version
              <LastRoundsPanel lastRounds={lastRounds} />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}