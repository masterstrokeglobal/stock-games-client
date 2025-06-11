import { AviatorHookReturn } from "@/hooks/use-aviator";
import { usePlacementOver } from "@/hooks/use-current-game";
import { RoundRecord } from "@/models/round-record";
import { useAviatorMyPlacement } from "@/react-query/aviator-queries";
import { useMemo, useState } from "react";
import BetControl from "./BetControl";


interface BettingPanelProps {
  roundRecord: RoundRecord
  aviator: AviatorHookReturn
  multiplier: number
}

export default function BettingPanel({
  roundRecord,
  multiplier,
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

  const cashOutAmount = useMemo(() => {
    const amount = myPlacement ? myPlacement.reduce((acc, placement) => acc + placement.amount, 0) : 0;
    return parseFloat((amount * multiplier).toFixed(2));
  }, [myPlacement, multiplier]);

  return (
    <div className="bottom-0 left-0 right-0 p-4">
      <div className="bg-gray-800 bg-opacity-80 backdrop-blur-sm rounded-lg p-4">
        <div className="w-full">
          <BetControl
            onCashOut={aviator.cashOut}
            betAmount={betAmount}
            setBetAmount={setBetAmount}
            onPlaceBet={onPlaceBet}
            cashOutAmount={cashOutAmount}
            isPlaced={isPlaced}
            isCashoutdone={isCashoutdone}
            cashOutDisabled={!(isPlaceOver && isPlaced) || isCashoutdone}
            disabled={isPlaceOver || isPlaced}
          />
        </div>
      </div>
    </div>
  )
} 