import { AviatorHookReturn } from "@/hooks/use-aviator";
import { usePlacementOver } from "@/hooks/use-current-game";
import { RoundRecord } from "@/models/round-record";
import { useAviatorMyPlacement } from "@/react-query/aviator-queries";
import { useMemo, useState, useEffect } from "react";
import { useStockSelectorAviator } from "@/hooks/use-market-selector";
import { SchedulerType, MarketItem } from "@/models/market-item";
import BetControl from "./BetControl";
import { useGameType } from "@/hooks/use-market-selector";


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
    <div className="bottom-0 bg-gradient-to-r from-blue-900/90 via-purple-900/90 to-blue-900/90 backdrop-blur-md border border-blue-400/50 shadow-xl left-0 right-0 p-4">
      <div className="bg-gray-800 bg-opacity-80 backdrop-blur-sm rounded-lg p-4">
        <div className="w-full flex flex-col">
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

          <OtherPlanes aviator={aviator} roundRecord={roundRecord}/>
        </div>
      </div>
    </div>
  )
} 


function OtherPlanes({aviator, roundRecord}: {aviator: AviatorHookReturn, roundRecord: RoundRecord}) {

  const [filteredPlanes, setFilteredPlanes] = useState<MarketItem[]>([]);

  const {stockSelectedAviator, setStockSelectedAviator} = useStockSelectorAviator();
  const {gameType} = useGameType();
  const {planeStatus} = aviator;


  useEffect(() => {
    console.log("stockSelectedAviator", stockSelectedAviator);
    const stock = roundRecord.market.find((stock) => stock.id === Number(stockSelectedAviator));
    console.log("stockSelectedAviator stock", stock);
    const name = SchedulerType.CRYPTO ? stock?.code : stock?.codeName;
    console.log("stockSelectedAviator name", name);

    //i only need to filter the planes that are not selected and i also need their ids 
    const filteredPlanes = roundRecord.market.filter((stock) => stock.id !== Number(stockSelectedAviator));
    setFilteredPlanes(filteredPlanes);

  }, [planeStatus, stockSelectedAviator]);


  return (
    <div className="flex mt-4 flex-col gap-2 ml-4 min-w-6xl overflow-hidden">
      <div className="flex flex-wrap gap-2 max-h-64 overflow-hidden scrollbar-hide">
        {filteredPlanes.map((stock) => {
          const codeToCheck = gameType === SchedulerType.CRYPTO ? stock.code : stock.codeName;
          const statusData = planeStatus?.get(codeToCheck ?? "");
          const status = statusData?.status || "Unknown";
          const multiplier = statusData?.multiplier || 1;
          const isActive = status === "active";
          
          return (
            <div 
              key={stock.id} 
              onClick={() => isActive && setStockSelectedAviator(stock.id?.toString() ?? "")}
              className={`
                relative overflow-hidden rounded-xl p-4 border-2 transition-all duration-200 cursor-pointer
                w-[calc(50%-4px)] min-h-[90px] flex flex-col justify-between
                backdrop-blur-sm shadow-lg
                ${isActive 
                  ? 'bg-gradient-to-br from-blue-600/30 to-blue-500/20 border-blue-300/60 hover:from-blue-600/40 hover:to-blue-500/30 hover:border-blue-300/80 hover:shadow-blue-500/20' 
                  : 'bg-gray-800/40 border-gray-500/50 opacity-70 cursor-not-allowed'
                }
                ${isActive ? 'hover:scale-[1.03] hover:shadow-xl' : ''}
              `}
            >
              <div className={`absolute inset-0 ${
                isActive 
                  ? 'bg-gradient-to-br from-black/20 to-black/10' 
                  : 'bg-black/30'
              }`}></div>
              
              <div className="flex items-start justify-between mb-3 relative z-10">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <img 
                    src="/images/aviator/planes/plane_1.png" 
                    alt="plane" 
                    className={`w-auto h-8 flex-shrink-0 drop-shadow-md ${isActive ? '' : 'grayscale'}`}
                  />
                  <div className="min-w-0 flex-1">
                    <div className={`text-sm font-semibold truncate drop-shadow-sm ${
                      isActive ? 'text-white' : 'text-gray-300'
                    }`}>
                      {stock.name}
                    </div>
                    <div className={`text-xs truncate drop-shadow-sm ${
                      isActive ? 'text-blue-100' : 'text-gray-400'
                    }`}>
                      {codeToCheck}
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center justify-between relative z-10">
                <div className={`text-base font-bold drop-shadow-sm ${
                  isActive ? 'text-green-300' : 'text-gray-400'
                }`}>
                  {multiplier.toFixed(2)}x
                </div>
                <div className={`text-xs font-medium px-3 py-1.5 rounded-full border backdrop-blur-sm ${
                  status === "active" ? 'bg-green-500/30 text-green-200 border-green-400/50' :
                  status === "crashed" ? 'bg-red-500/30 text-red-200 border-red-400/50' :
                  status === "flew_away" ? 'bg-yellow-500/30 text-yellow-200 border-yellow-400/50' :
                  'bg-gray-500/30 text-gray-300 border-gray-400/50'
                }`}>
                  {status === "active" ? "Flying" :
                   status === "crashed" ? "Crashed" :
                   status === "flew_away" ? "Flew Away" :
                   "Waiting"
                  }
                </div>
              </div>
              
              {isActive && (
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
              )}
            </div>
          );
        })}
      </div>
      
      {filteredPlanes.length === 0 && (
        <div className="text-center py-6 text-gray-300 text-sm font-medium drop-shadow-md">
          No other planes available
        </div>
      )}
    </div>
  );
}