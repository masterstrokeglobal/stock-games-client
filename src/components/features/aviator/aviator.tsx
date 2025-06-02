"use client"

import { useState, useEffect, useRef } from "react"
import Header from "./Header"
import GameDisplay from "./GameDisplay"
import BettingPanel from "./BettingPanel"
import LastRoundsPanel from "./LastRoundsPanel"
import { AviatorCanvasRef } from "./aviator-canvas"

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

export default function Aviator() {
  const aviatorRef = useRef<AviatorCanvasRef>(null)
  const nextRoundIdRef = useRef(13) // Start from 13 since dummy data goes 1-12
  
  const [multiplier, setMultiplier] = useState(1.0)
  const [gamePhase, setGamePhase] = useState<GamePhase>(GamePhase.WAITING)
  const [timeLeft, setTimeLeft] = useState<FormattedTime>(formatTime(0))
  const [gameStarted, setGameStarted] = useState(false)
  const [crashMultiplier, setCrashMultiplier] = useState(0)
  const [shouldShowBlast, setShouldShowBlast] = useState(false)
  
  // Betting state
  const [betAmount1, setBetAmount1] = useState("10")
  const [betAmount2, setBetAmount2] = useState("5000")
  const [autoPlay1, setAutoPlay1] = useState(false)
  const [autoPlay2, setAutoPlay2] = useState(false)

  // Game history
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
      setGameStarted(false)
      setShouldShowBlast(false) // Ensure blast is off for new round
      setCrashMultiplier(0)
      
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
      setGameStarted(true)
      setTimeLeft(formatTime(0))
      
      // Generate target crash multiplier
      const targetMultiplier = generateCrashMultiplier()
      setCrashMultiplier(targetMultiplier)
      
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
      setGameStarted(false)
      
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
        setCrashMultiplier(0)
        setGameStarted(false)
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

  const placeBet = (amount: string) => {
    console.log('Bet placed:', amount)
    // Only allow betting during betting open phase
    if (gamePhase !== GamePhase.BETTING_OPEN) {
      console.log('Betting not allowed in current phase')
      return
    }
  }

  return (
    <div className="min-h-[calc(100svh-70px)] bg-gradient-to-b from-purple-600 to-pink-500 rounded-lg overflow-hidden">
      <div className="flex relative flex-col h-[calc(100svh-70px)]">
        <Header />

        {/* Timer Display */}
        <div className="text-center w-full absolute top-0 left-[50%] translate-x-[-50%] z-10">
          <div className="bg-gradient-to-r from-blue-900 via-blue-800 to-blue-900 h-16 rounded-full shadow-lg flex items-center justify-center mx-auto max-w-md relative overflow-hidden">
            <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-blue-500 to-blue-400 opacity-50"></div>
            
            <div className="flex flex-col items-center justify-center">
              <span className="text-white font-bold tracking-wider text-sm">
                {getStatusText()}
              </span>
              
              {gamePhase === GamePhase.BETTING_OPEN && (
                <span
                  className="text-white font-bold text-xl tracking-wider transition-opacity duration-500"
                  style={{
                    opacity: timeLeft.raw % 2000 < 1000 ? 1 : 0.5
                  }}
                >
                  {timeLeft.formatted}
                </span>
              )}
              
              {gamePhase === GamePhase.GAME_RUNNING && (
                <span className="text-white font-bold text-xl tracking-wider">
                  {multiplier.toFixed(2)}x
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Main Game Area */}
        <div className="flex flex-1 overflow-hidden">
          <div className="flex-1 relative flex flex-col">
            <GameDisplay 
              ref={aviatorRef} 
              multiplier={multiplier}
              shouldShowBlast={shouldShowBlast}
              setShouldShowBlast={setShouldShowBlast}
            />
            
            <BettingPanel
              betAmount1={betAmount1}
              setBetAmount1={setBetAmount1}
              betAmount2={betAmount2}
              setBetAmount2={setBetAmount2}
              autoPlay1={autoPlay1}
              setAutoPlay1={setAutoPlay1}
              autoPlay2={autoPlay2}
              setAutoPlay2={setAutoPlay2}
              onPlaceBet={placeBet}
              gamePhase={gamePhase}
            />
          </div>

          <LastRoundsPanel lastRounds={lastRounds} />
        </div>
      </div>
    </div>
  )
}
