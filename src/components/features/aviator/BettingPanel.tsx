import { AviatorHookReturn } from "@/hooks/use-aviator";
import { usePlacementOver } from "@/hooks/use-current-game";
import { RoundRecord } from "@/models/round-record";
import { useAviatorMyPlacement } from "@/react-query/aviator-queries";
import { useMemo, useState } from "react";
import BetControl from "./BetControl";


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

  const isCashoutdone = useMemo(() => {
    return myPlacement ? myPlacement.findIndex((placement) => placement.isWinner) !== -1 : false;
  }, [myPlacement]);

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
            cashOutDisabled={!(isPlaceOver && isPlaced) || isCashoutdone}
            disabled={isPlaceOver || isPlaced}
          />
        </div>
      </div>
    </div>
  )
} 