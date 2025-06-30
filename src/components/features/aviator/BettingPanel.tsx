import { AviatorHookReturn } from "@/hooks/use-aviator";
import { usePlacementOver } from "@/hooks/use-current-game";
import { RoundRecord } from "@/models/round-record";
import { useAviatorMyPlacement } from "@/react-query/aviator-queries";
import { AviatorPlacement } from "@/models/aviator-placement";
import { useMemo, useState, useEffect } from "react";
import { useStockSelectorAviator } from "@/hooks/use-market-selector";
import { SchedulerType, MarketItem } from "@/models/market-item";
import { useGameType } from "@/hooks/use-market-selector";
import { Button } from "@/components/ui/button";

interface BettingPanelProps {
  roundRecord: RoundRecord
  aviator: AviatorHookReturn
  multiplier: number
}

export default function BettingPanel({
  roundRecord,
  aviator
}: BettingPanelProps) {
  const isPlaceOver = usePlacementOver(roundRecord);
  const [betAmount, setBetAmount] = useState(500);
  const { data: myPlacement } = useAviatorMyPlacement(roundRecord.id);
  const { stockSelectedAviator } = useStockSelectorAviator();
  const { gameType } = useGameType();

  // Get current plane information
  const currentPlane = useMemo(() => {
    return roundRecord.market.find(stock => stock.id === Number(stockSelectedAviator));
  }, [roundRecord.market, stockSelectedAviator]);

  // Get current plane status
  const currentPlaneStatus = useMemo(() => {
    if (!currentPlane || !aviator.planeStatus) return "unknown";
    const codeToCheck = gameType === SchedulerType.CRYPTO ? currentPlane.code : currentPlane.codeName;
    return aviator.planeStatus.get(codeToCheck ?? "")?.status || "unknown";
  }, [currentPlane, aviator.planeStatus, gameType]);

  // Get current plane multiplier
  const currentPlaneMultiplier = useMemo(() => {
    if (!currentPlane || !aviator.planeStatus) return 1;
    const codeToCheck = gameType === SchedulerType.CRYPTO ? currentPlane.code : currentPlane.codeName;
    return aviator.planeStatus.get(codeToCheck ?? "")?.multiplier || 1;
  }, [currentPlane, aviator.planeStatus, gameType]);

  // Check if user has bet on current plane
  const currentPlanePlacements = useMemo(() => {
    if (!myPlacement || !stockSelectedAviator) return [];
    return myPlacement.filter(placement => 
      placement.marketItem.id === Number(stockSelectedAviator)
    );
  }, [myPlacement, stockSelectedAviator]);

  const hasBetOnCurrentPlane = currentPlanePlacements.length > 0;
  const totalBetOnCurrentPlane = currentPlanePlacements.reduce((sum, placement) => sum + placement.amount, 0);
  const hasWonOnCurrentPlane = currentPlanePlacements.some(placement => placement.isWinner);

  // Calculate potential cashout amount
  const cashOutAmount = useMemo(() => {
    if (!hasBetOnCurrentPlane) return 0;
    return parseFloat((totalBetOnCurrentPlane * currentPlaneMultiplier).toFixed(2));
  }, [hasBetOnCurrentPlane, totalBetOnCurrentPlane, currentPlaneMultiplier]);

  const onPlaceBet = (amount: number) => {
    aviator.placeBet(amount);
  };

  const onCashOut = () => {
    aviator.cashOut();
  };

  // Determine button state and text
  const getButtonConfig = () => {
    // If betting phase is over (planes are flying/crashed)
    if (isPlaceOver) {
      // If user has bet on current plane
      if (hasBetOnCurrentPlane) {
        if (hasWonOnCurrentPlane) {
          return {
            text: "CASHED OUT",
            variant: "success",
            disabled: true,
            onClick: () => {}
          };
        }
        
        if (currentPlaneStatus === "crashed") {
          return {
            text: "CRASHED",
            variant: "crashed",
            disabled: true,
            onClick: () => {}
          };
        }
        
        if (currentPlaneStatus === "flew_away") {
          return {
            text: "FLEW AWAY",
            variant: "flew_away",
            disabled: true,
            onClick: () => {}
          };
        }
        
        if (currentPlaneStatus === "active") {
          return {
            text: `CASH OUT ₹${cashOutAmount.toFixed(2)}`,
            variant: "cashout",
            disabled: false,
            onClick: onCashOut
          };
        }
      } else {
        // User hasn't bet on current plane
        return {
          text: "BETTING CLOSED",
          variant: "closed",
          disabled: true,
          onClick: () => {}
        };
      }
    } else {
      // Betting phase is still active
      if (hasBetOnCurrentPlane) {
        return {
          text: "BET PLACED",
          variant: "placed",
          disabled: true,
          onClick: () => {}
        };
      } else {
        return {
          text: "PLACE BET",
          variant: "bet",
          disabled: false,
          onClick: () => onPlaceBet(betAmount)
        };
      }
    }

    return {
      text: "LOADING...",
      variant: "loading",
      disabled: true,
      onClick: () => {}
    };
  };

  const buttonConfig = getButtonConfig();

  const quickBetOptions = [
    { value: 500, label: "500" },
    { value: 2000, label: "2K" },
    { value: 5000, label: "5K" },
    { value: 15000, label: "15K" },
  ];

  const getButtonStyle = (variant: string) => {
    switch (variant) {
      case "cashout":
        return "bg-green-500 hover:bg-green-600 text-white animate-pulse";
      case "crashed":
        return "bg-red-500 text-white cursor-not-allowed";
      case "flew_away":
        return "bg-yellow-500 text-white cursor-not-allowed";
      case "success":
        return "bg-green-700 text-white cursor-not-allowed";
      case "closed":
        return "bg-gray-500 text-gray-300 cursor-not-allowed";
      case "placed":
        return "bg-blue-700 text-white cursor-not-allowed";
      case "bet":
        return "bg-blue-500 hover:bg-blue-600 text-white";
      default:
        return "bg-gray-500 text-gray-300 cursor-not-allowed";
    }
  };

  return (
    <div className="bg-gradient-to-r from-blue-900/90 via-purple-900/90 to-blue-900/90 backdrop-blur-md border border-blue-400/50 shadow-xl p-4">
      <div className="bg-gray-800 bg-opacity-80 backdrop-blur-sm rounded-lg p-4">
        <div className="w-full flex flex-col space-y-4">

          {/* Betting Input - only show during betting phase and if no bet on current plane */}
          {!isPlaceOver && !hasBetOnCurrentPlane && (
            <>
              <div className="flex items-center bg-gray-900 rounded-lg">
                <div className="bg-yellow-400 rounded-full px-2 py-1 m-2">
                  <span className="text-xs font-bold">₹</span>
                </div>
                <input
                  type="number"
                  value={betAmount}
                  onChange={(e) => setBetAmount(Number(e.target.value))}
                  className="bg-transparent text-white w-full p-2 focus:outline-none"
                  placeholder="Enter bet amount"
                />
              </div>

              {/* Quick bet options */}
              <div className="flex justify-between gap-2">
                {quickBetOptions.map((option) => (
                  <Button
                    key={option.value}
                    variant="outline"
                    className="bg-gray-700 hover:bg-gray-600 text-white border-none flex-1"
                    onClick={() => setBetAmount(option.value)}
                  >
                    {option.label}
                  </Button>
                ))}
              </div>
            </>
          )}

          {/* Main Action Button */}
          <Button
            className={`w-full ${getButtonStyle(buttonConfig.variant)}`}
            onClick={buttonConfig.onClick}
            disabled={buttonConfig.disabled}
          >
            {buttonConfig.text}
          </Button>

          {/* Other Planes Section */}
          <OtherPlanes aviator={aviator} roundRecord={roundRecord} myPlacement={myPlacement || []} />
        </div>
      </div>
    </div>
  );
}

function OtherPlanes({ 
  aviator, 
  roundRecord, 
  myPlacement 
}: {
  aviator: AviatorHookReturn, 
  roundRecord: RoundRecord,
  myPlacement: AviatorPlacement[]
}) {
  const [filteredPlanes, setFilteredPlanes] = useState<MarketItem[]>([]);
  const { stockSelectedAviator, setStockSelectedAviator } = useStockSelectorAviator();
  const { gameType } = useGameType();
  const { planeStatus } = aviator;
  const isPlaceOver = usePlacementOver(roundRecord);

  useEffect(() => {
    // Filter out the currently selected plane
    const filteredPlanes = roundRecord.market.filter((stock) => stock.id !== Number(stockSelectedAviator));
    setFilteredPlanes(filteredPlanes);
  }, [planeStatus, stockSelectedAviator, roundRecord.market]);

  return (
    <div className="flex mt-4 flex-col gap-2">
      <div className="text-white text-sm font-medium mb-2">Other Planes:</div>
      <div className="flex flex-wrap gap-2 max-h-64 overflow-y-auto scrollbar-hide">
        {filteredPlanes.map((stock) => {
          const codeToCheck = gameType === SchedulerType.CRYPTO ? stock.code : stock.codeName;
          const statusData = planeStatus?.get(codeToCheck ?? "");
          const status = statusData?.status || "unknown";
          const multiplier = statusData?.multiplier || 1;
          
          // Check if user has bet on this plane
          const hasPlacementOnThisPlane = myPlacement?.some(placement => 
            placement.marketItem.id === stock.id
          ) || false;

          // Determine if plane is clickable
          const canSwitch = !isPlaceOver || status === "active";
          
          return (
            <div 
              key={stock.id} 
              onClick={() => canSwitch && setStockSelectedAviator(stock.id?.toString() ?? "")}
              className={`
                relative overflow-hidden rounded-xl p-3 border-2 transition-all duration-200
                w-[calc(50%-4px)] min-h-[80px] flex flex-col justify-between
                backdrop-blur-sm shadow-lg
                ${canSwitch 
                  ? 'cursor-pointer bg-gradient-to-br from-blue-600/30 to-blue-500/20 border-blue-300/60 hover:from-blue-600/40 hover:to-blue-500/30 hover:border-blue-300/80 hover:scale-[1.02]' 
                  : 'cursor-not-allowed bg-gray-800/40 border-gray-500/50 opacity-70'
                }
                ${hasPlacementOnThisPlane ? 'ring-2 ring-yellow-400/50' : ''}
              `}
            >
              <div className="flex items-center gap-2 mb-2">
                <img 
                  src="/images/aviator/planes/plane_1.png" 
                  alt="plane" 
                  className={`w-6 h-6 ${canSwitch ? '' : 'grayscale'}`}
                />
                <div className="min-w-0 flex-1">
                  <div className={`text-xs font-semibold truncate ${
                    canSwitch ? 'text-white' : 'text-gray-300'
                  }`}>
                    {stock.name}
                  </div>
                  <div className={`text-xs truncate ${
                    canSwitch ? 'text-blue-100' : 'text-gray-400'
                  }`}>
                    {codeToCheck}
                  </div>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className={`text-sm font-bold ${
                  canSwitch ? 'text-green-300' : 'text-gray-400'
                }`}>
                  {multiplier.toFixed(2)}x
                </div>
                <div className="flex flex-col items-end gap-1">
                  <div className={`text-xs px-2 py-1 rounded-full border ${
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
                  {hasPlacementOnThisPlane && (
                    <div className="text-xs bg-yellow-500/20 text-yellow-200 px-1 py-0.5 rounded">
                      Bet Placed
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
      
      {filteredPlanes.length === 0 && (
        <div className="text-center py-4 text-gray-300 text-sm">
          No other planes available
        </div>
      )}
    </div>
  );
}