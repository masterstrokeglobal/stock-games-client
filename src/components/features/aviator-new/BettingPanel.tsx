import { Button } from "@/components/ui/button";
import { AviatorHookReturn } from "@/hooks/use-aviator";
import { usePlacementOver } from "@/hooks/use-current-game";
import {
  useGameType,
  useStockSelectorAviator,
} from "@/hooks/use-market-selector";
import { AviatorPlacement } from "@/models/aviator-placement";
import { SchedulerType } from "@/models/market-item";
import { RoundRecord } from "@/models/round-record";
import { useAviatorMyPlacement } from "@/react-query/aviator-queries";
import { useEffect, useMemo, useState } from "react";
import { NextRoundTimer } from "./time-display";

interface BettingPanelProps {
  roundRecord: RoundRecord;
  aviator: AviatorHookReturn;
  multiplier: number;
}

export default function BettingPanel({
  roundRecord,
  aviator,
}: BettingPanelProps) {
  const isPlaceOver = usePlacementOver(roundRecord);
  const [betAmount, setBetAmount] = useState(500);
  const { data: myPlacement } = useAviatorMyPlacement(roundRecord.id);
  const { stockSelectedAviator } = useStockSelectorAviator();
  const { gameType } = useGameType();

  useEffect(() => {
    console.log("loki betting panel", myPlacement);
  }, [myPlacement]);

  // Get current plane information
  const currentPlane = useMemo(() => {
    return roundRecord.market.find(
      (stock) => stock.id === Number(stockSelectedAviator)
    );
  }, [roundRecord.market, stockSelectedAviator]);

  // Get current plane status
  const currentPlaneStatus = useMemo(() => {
    if (!currentPlane || !aviator.planeStatus) return "unknown";
    const codeToCheck =
      gameType === SchedulerType.CRYPTO
        ? currentPlane.code
        : currentPlane.codeName;
    return aviator.planeStatus.get(codeToCheck ?? "")?.status || "unknown";
  }, [currentPlane, aviator.planeStatus, gameType]);

  // Get current plane multiplier
  const currentPlaneMultiplier = useMemo(() => {
    if (!currentPlane || !aviator.planeStatus) return 0;
    const codeToCheck =
      gameType === SchedulerType.CRYPTO
        ? currentPlane.code
        : currentPlane.codeName;
    return aviator.planeStatus.get(codeToCheck ?? "")?.multiplier || 0;
  }, [currentPlane, aviator.planeStatus, gameType]);

  useEffect(() => {
    console.log("loki currentPlaneMultiplier", currentPlaneMultiplier);
  }, [currentPlaneMultiplier]);

  // Check if user has ANY bet in this round (single bet restriction)
  const hasAnyBetInRound = useMemo(() => {
    return myPlacement && myPlacement.length > 0;
  }, [myPlacement]);

  // Get the user's single bet placement (if any)
  const userPlacement = useMemo(() => {
    if (!myPlacement || myPlacement.length === 0) return null;
    return myPlacement[0]; // Since we only allow one bet, get the first (and only) placement
  }, [myPlacement]);

  // Check if user's bet is on the currently selected plane
  const isBetOnCurrentPlane = useMemo(() => {
    if (!userPlacement || !stockSelectedAviator) return false;
    return userPlacement.marketItem.id === Number(stockSelectedAviator);
  }, [userPlacement, stockSelectedAviator]);

  const hasWonOnCurrentPlane = userPlacement?.isWinner || false;

  // Calculate potential cashout amount for the user's single bet
  const cashOutAmount = useMemo(() => {
    if (!userPlacement || !isBetOnCurrentPlane) return 0;
    return parseFloat(
      (userPlacement.amount * currentPlaneMultiplier).toFixed(2)
    );
  }, [userPlacement, isBetOnCurrentPlane, currentPlaneMultiplier]);

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
      // If user has a bet and it's on the current plane
      if (hasAnyBetInRound && isBetOnCurrentPlane) {
        if (hasWonOnCurrentPlane) {
          return {
            text: "CASHED OUT",
            variant: "success",
            disabled: true,
            onClick: () => {},
          };
        }

        if (currentPlaneStatus === "crashed") {
          return {
            text: "CRASHED",
            variant: "crashed",
            disabled: true,
            onClick: () => {},
          };
        }

        if (currentPlaneStatus === "flew_away") {
          return {
            text: "FLEW AWAY",
            variant: "flew_away",
            disabled: true,
            onClick: () => {},
          };
        }

        if (currentPlaneStatus === "active") {
          return {
            text: `CASH OUT ₹${cashOutAmount.toFixed(2)}`,
            variant: "cashout",
            disabled: false,
            onClick: onCashOut,
          };
        }
      } else {
        // User hasn't bet on current plane or no bet at all
        return {
          text: "BETTING CLOSED",
          variant: "closed",
          disabled: true,
          onClick: () => {},
        };
      }
    } else {
      // Betting phase is still active
      if (hasAnyBetInRound) {
        // User already has a bet placed somewhere
        if (isBetOnCurrentPlane) {
          return {
            text: "BET PLACED",
            variant: "placed",
            disabled: true,
            onClick: () => {},
          };
        } else {
          // User has bet on a different plane
          const betPlaceName = userPlacement?.marketItem?.name || "OTHER PLANE";
          return {
            text: `BET PLACED ON ${betPlaceName}`,
            variant: "placed",
            disabled: true,
            onClick: () => {},
          };
        }
      } else {
        // User hasn't placed any bet yet
        return {
          text: "PLACE BET",
          variant: "bet",
          disabled: false,
          onClick: () => onPlaceBet(betAmount),
        };
      }
    }

    return {
      text: "LOADING...",
      variant: "loading",
      disabled: true,
      onClick: () => {},
    };
  };

  const buttonConfig = getButtonConfig();

  const quickBetOptions = [
    { value: 500, label: "500" },
    { value: 2000, label: "2000" },
    { value: 5000, label: "5000" },
    { value: 15000, label: "15000" },
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
        return "bg-[#6085E380] hover:bg-[#6085E39F] border border-[#6085E31F] text-white";
      default:
        return "bg-gray-500 text-gray-300 cursor-not-allowed";
    }
  };

  return (
    <div className="betting-panel-container flex-shrink-0">
      <div className="flex flex-col-reverse lg:flex-col lg:space-y-8 space-y-5 lg:w-[324px] w-full flex-shrink-0">
        {isPlaceOver && hasAnyBetInRound && (
          <div className="flex-col gap-2 justify-start items-start hidden lg:flex">
            <NextRoundTimer isAviator={false} roundRecord={roundRecord} />
          </div>
        )}

        {/* Other Planes Section */}
        <OtherPlanes
          aviator={aviator}
          roundRecord={roundRecord}
          myPlacement={myPlacement || []}
        />

        <div className="grid grid-cols-2 lg:grid-cols-1 lg:gap-4 gap-2 betting-panel lg:pb-5">
          {/* Betting Input - only show during betting phase and if no bet placed in round */}
          <div
            className={`flex flex-col lg:gap-4 gap-3 ${
              isPlaceOver || hasAnyBetInRound
                ? "opacity-[50%] pointer-events-none"
                : ""
            }`}
          >
            <h1 className="text-white text-xs lg:text-[15px] font-quantico uppercase ">
              Bet Amount
            </h1>
            <div className="flex items-center gap-2 w-full">
              <div className="flex items-center bg-[#FFFFFF1A] w-full rounded-[5px] rounded-r-none lg:rounded-r-none lg:rounded-[10px] px-2 h-6 lg:h-10 border border-[#FFFFFF1F]">
                <div className="">
                  <img
                    src="/images/aviator/objects/coin.png"
                    alt="coin"
                    className="lg:w-7 lg:h-7 w-6 h-6"
                  />
                </div>
                <input
                  type="number"
                  value={betAmount}
                  onChange={(e) => setBetAmount(Number(e.target.value))}
                  className="bg-transparent text-white font-poppins w-full p-1 lg:px-2 lg:py-1 focus:outline-none text-[10px] lg:text-[13px]"
                  placeholder="Enter bet amount"
                />
              </div>
              <button
                onClick={() => setBetAmount(betAmount * 2)}
                className="text-white font-poppins cursor-pointer bg-[#FFFFFF1A] text-[10px] lg:text-[13px] rounded-[5px] rounded-l-none lg:rounded-l-none lg:rounded-[10px] w-11 flex-shrink-0 flex items-center justify-center py-1 h-6 lg:h-10 border border-[#FFFFFF1F] "
              >
                2x
              </button>
            </div>

            {/* Quick bet options */}
            <div className="grid grid-cols-4 gap-2 w-full font-quantico">
              {quickBetOptions.map((option) => (
                <button
                  key={option.value}
                  className="text-[#43B82980] bg-[#2FFF0026] font-poppins border border-[#2FFF0026] rounded-[5px] lg:rounded-[10px] flex-1 text-[10px] lg:text-[13px] p-1 lg:p-[10px]"
                  onClick={() => setBetAmount(option.value)}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          {/* Cashout at */}
          <div className="flex flex-col gap-3 lg:gap-4">
            <h1 className="text-white text-xs lg:text-[15px] font-quantico">CASHOUT AT</h1>
            <div className="text-white text-xs lg:text-sm font-medium flex gap-2 items-center">
              <div className="flex flex-1 h-6 lg:h-10 items-center gap-5 px-2 py-2 border border-[#FFFFFF1F] rounded-[5px] lg:rounded-[10px] rounded-r-none lg:rounded-r-none bg-[#FFFFFF1A]">
                <img
                  src="/images/aviator/objects/key.png"
                  alt="clock"
                  className="lg:w-8 w-4"
                />
                <span>
                  1.25
                </span>
              </div>
              <button className="bg-[#FFFFFF1A] h-6 lg:h-10 w-[25px] lg:w-11 flex items-center justify-center border border-[#FFFFFF1F]">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M18 15L12 9L6 15"
                    stroke="white"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
              </button>
              <button className="bg-[#FFFFFF1A] h-6 lg:h-10 rounded-[5px] lg:rounded-[10px] rounded-l-none lg:rounded-l-none w-[25px] lg:w-11 flex items-center justify-center border border-[#FFFFFF1F]">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M18 15L12 9L6 15"
                    stroke="white"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
              </button>
            </div>
            {/* Main Action Button */}
            <Button
              className={`w-full font-quantico text-xs lg:text-sm h-6 lg:h-auto rounded-[5px] lg:rounded-[10px] ${getButtonStyle(
                buttonConfig.variant
              )}`}
              onClick={buttonConfig.onClick}
              disabled={buttonConfig.disabled}
            >
              {buttonConfig.text}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

function OtherPlanes({
  aviator,
  roundRecord,
  myPlacement,
}: {
  aviator: AviatorHookReturn;
  roundRecord: RoundRecord;
  myPlacement: AviatorPlacement[];
}) {
  const { setStockSelectedAviator } = useStockSelectorAviator();
  const { gameType } = useGameType();
  const { planeStatus } = aviator;
  const isPlaceOver = usePlacementOver(roundRecord);
  const { stockSelectedAviator } = useStockSelectorAviator();

  return (
    <div className="flex mt-4 lg:mt-0 flex-col gap-2">
      <div className="text-white text-[12px] lg:text-sm font-medium mb-2">NEXT IN LINE</div>
      <div className="grid grid-cols-4 lg:grid-cols-1 gap-2 overflow-hidden scrollbar-hide font-poppins">
        {roundRecord.market.slice(0, 4).map((stock, index) => {
          const codeToCheck =
            gameType === SchedulerType.CRYPTO ? stock.code : stock.codeName;
          const statusData = planeStatus?.get(codeToCheck ?? "");
          const status = statusData?.status || "unknown";
          const multiplier = statusData?.multiplier || 0;

          // Check if user has bet on this plane
          const hasPlacementOnThisPlane =
            myPlacement?.some(
              (placement) => placement.marketItem.id === stock.id
            ) || false;

          // Determine if plane is clickable
          const canSwitch = !isPlaceOver || status === "active";

          return (
            <button
              key={stock.id}
              // disabled={isPlaceOver}
              onClick={() =>
                canSwitch && setStockSelectedAviator(stock.id?.toString() ?? "")
              }
              className={`
                relative rounded-xl p-[6px] transition-all duration-200
                max-w-[200px] min-h-[74px] flex justify-between flex-col-reverse md:flex-row
                ${
                  canSwitch
                    ? hasPlacementOnThisPlane
                      ? "cursor-pointer bg-gradient-to-br from-yellow-600/30 to-yellow-500/20 border-yellow-400/80 hover:border-yellow-400/90 hover:scale-[1.02]"
                      : "cursor-pointer bg-gradient-to-br from-blue-600/30 to-blue-500/20 border-blue-300/60 hover:from-blue-600/40 hover:to-blue-500/30 hover:border-blue-300/80 hover:scale-[1.02]"
                    : "cursor-not-allowed bg-gray-800/40 border-gray-500/50 opacity-70"
                }
                ${
                  stockSelectedAviator === stock.id?.toString()
                    ? "border-2 border-yellow-400"
                    : ""
                }
              `}
            >
              <div className="flex items-start justify-center flex-col md:hidden">
                <div
                  className={` truncate text-[10px] lg:text-[13px] ${
                    canSwitch ? "text-white" : "text-gray-300"
                  }`}
                >
                  {stock.name}
                </div>
                <div
                  className={`truncate text-[8px] lg:text-[12px] ${
                    canSwitch ? "text-green-300" : "text-gray-400"
                  }`}
                >
                  {multiplier.toFixed(2)}x
                </div>
              </div>

              <div className="flex items-center">
                <img
                  src={`/images/aviator/planes/${
                    index === 0
                      ? "plane-green"
                      : index === 1
                      ? "plane-red"
                      : index === 2
                      ? "plane-gray"
                      : "plane-red"
                  }.png`}
                  alt="plane"
                  className={`w-[50px] xl:w-[74px] flex-shrink-0 ${
                    canSwitch ? "" : "grayscale"
                  }
                  `}
                />
              </div>

              <div className="md:flex items-center justify-end flex-col hidden">
                <div
                  className={`text-[10px] lg:text-[13px] truncate ${
                    canSwitch ? "text-white" : "text-gray-300"
                  }`}
                >
                  {stock.name}
                </div>
                <div
                  className={`text-[8px] lg:text-[12px] truncate ${
                    canSwitch ? "text-green-300" : "text-gray-400"
                  }`}
                >
                  {multiplier.toFixed(2)}x
                </div>
              </div>

              {/* Bet Status Tag - Top Right */}
              <div className="w-full md:w-fit flex justify-end">
                {hasPlacementOnThisPlane ? (
                  (() => {
                    const placementOnThisPlane = myPlacement?.find(
                      (placement) => placement.marketItem.id === stock.id
                    );
                    const hasWon = placementOnThisPlane?.isWinner || false;

                    if (hasWon) {
                      return (
                        <div className="lg:text-[9px] truncate text-[6px] w-fit bg-green-500/90 text-green-900 px-[5px] py-[3px] rounded-full font-semibold h-fit">
                          Cashed Out
                        </div>
                      );
                    } else {
                      return (
                        <div className="lg:text-[9px] truncate text-[6px] w-fit bg-yellow-500/90 text-yellow-900 px-[5px] py-[3px] rounded-full font-semibold h-fit">
                          Bet Placed
                        </div>
                      );
                    }
                  })()
                ) : (
                  <div
                    className={`md:text-[9px] text-[6px] px-[5px] py-[3px] rounded-full border border-[#FFFFFF1A] h-fit w-fit ${
                      status === "active"
                        ? "bg-[#6FFF001A]"
                        : status === "crashed"
                        ? "bg-[#FF002B1A]"
                        : status === "flew_away"
                        ? "bg-[#00DDFF1A]"
                        : "bg-[#6FFF001A]"
                    }`}
                  >
                    {status === "active"
                      ? "Flying"
                      : status === "crashed"
                      ? "Crashed"
                      : status === "flew_away"
                      ? "Flew Away"
                      : "Waiting"}
                  </div>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {roundRecord.market.length === 0 && (
        <div className="text-center py-4 text-gray-300 text-sm">
          No planes available
        </div>
      )}
    </div>
  );
}
