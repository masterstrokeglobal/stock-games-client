import { useState } from "react";
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
  gamePhase?: GamePhase
}

export default function BettingPanel({
  gamePhase = GamePhase.BETTING_OPEN,
}: BettingPanelProps) {
  const isBettingAllowed = gamePhase === GamePhase.BETTING_OPEN;

  const [betAmount1, setBetAmount1] = useState("");
  const onPlaceBet = (amount: string) => {
    setBetAmount1(amount);
  }

  return (
    <div className="bottom-0 left-0 right-0 p-4">
      <div className="bg-gray-800 bg-opacity-80 backdrop-blur-sm rounded-lg p-4">
        <div className="w-full">
          <BetControl
            betAmount={betAmount1}
            setBetAmount={setBetAmount1}
            onPlaceBet={onPlaceBet}
            disabled={!isBettingAllowed}
          />
        </div>
      </div>
    </div>
  )
} 