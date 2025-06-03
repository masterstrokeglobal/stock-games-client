import { useMemo, useState } from "react";
import BetControl from "./BetControl"
import { RoundRecord } from "@/models/round-record";
import { usePlacementOver } from "@/hooks/use-current-game";
import useAviator, { AviatorHookReturn } from "@/hooks/use-aviator";
import { SchedulerType } from "@/models/market-item";
import { useAviatorMyPlacement } from "@/react-query/aviator-queries";
import { AviatorPlacement } from "@/models/aviator-placement";
// Game phases enum (matching the one in aviator.tsx)
enum GamePhase {
  BETTING_OPEN = "BETTING_OPEN",
  BETTING_CLOSED = "BETTING_CLOSED",
  GAME_RUNNING = "GAME_RUNNING",
  GAME_ENDED = "GAME_ENDED",
  WAITING = "WAITING"
}

interface BettingPanelProps {
  roundRecord: RoundRecord
  aviator: AviatorHookReturn
}

export default function BettingPanel({
  roundRecord,
  aviator
}: BettingPanelProps) {

  const isPlaceOver = usePlacementOver(roundRecord);
  const [betAmount, setBetAmount] = useState(0);
  const { data: myPlacement } = useAviatorMyPlacement(roundRecord.id);

  const onPlaceBet = (amount: number) => {
    aviator.placeBet(amount);
  }
  const isPlaced = useMemo(() => {
    return myPlacement ? myPlacement.length > 0 : false;
  }, [myPlacement]);


  console.log(isPlaceOver, isPlaced)

  return (
    <div className="bottom-0 left-0 right-0 p-4">
      <div className="bg-gray-800 bg-opacity-80 backdrop-blur-sm rounded-lg p-4">
        <div className="w-full">
          <BetControl
            onCashOut={aviator.cashOut}
            betAmount={betAmount}
            setBetAmount={setBetAmount}
            onPlaceBet={onPlaceBet}
            isPlaced={isPlaced}
            cashOutDisabled={!(isPlaceOver && isPlaced)}
            disabled={isPlaceOver || isPlaced}
          />
        </div>
      </div>
    </div>
  )
} 