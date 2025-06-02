import BetControl from "./BetControl"

// Game phases enum (matching the one in aviator.tsx)
enum GamePhase {
  BETTING_OPEN = "BETTING_OPEN",
  BETTING_CLOSED = "BETTING_CLOSED", 
  GAME_RUNNING = "GAME_RUNNING",
  GAME_ENDED = "GAME_ENDED",
  WAITING = "WAITING"
}

interface BettingPanelProps {
  betAmount1: string
  setBetAmount1: (amount: string) => void
  betAmount2: string
  setBetAmount2: (amount: string) => void
  autoPlay1: boolean
  setAutoPlay1: (enabled: boolean) => void
  autoPlay2: boolean
  setAutoPlay2: (enabled: boolean) => void
  onPlaceBet: (amount: string) => void
  gamePhase?: GamePhase
}

export default function BettingPanel({
  betAmount1,
  setBetAmount1,
  betAmount2,
  setBetAmount2,
  autoPlay1,
  setAutoPlay1,
  autoPlay2,
  setAutoPlay2,
  onPlaceBet,
  gamePhase = GamePhase.BETTING_OPEN,
}: BettingPanelProps) {
  const isBettingAllowed = gamePhase === GamePhase.BETTING_OPEN

  return (
    <div className="bottom-0 left-0 right-0 p-4">
      <div className="bg-gray-800 bg-opacity-80 backdrop-blur-sm rounded-lg p-4">
        <div className="grid grid-cols-2 gap-4">
          {/* Left Bet Panel */}
          <BetControl
            betAmount={betAmount1}
            setBetAmount={setBetAmount1}
            autoPlay={autoPlay1}
            setAutoPlay={setAutoPlay1}
            onPlaceBet={onPlaceBet}
            disabled={!isBettingAllowed}
          />

          {/* Right Bet Panel */}
          <BetControl
            betAmount={betAmount2}
            setBetAmount={setBetAmount2}
            autoPlay={autoPlay2}
            setAutoPlay={setAutoPlay2}
            onPlaceBet={onPlaceBet}
            disabled={!isBettingAllowed}
          />
        </div>
      </div>
    </div>
  )
} 