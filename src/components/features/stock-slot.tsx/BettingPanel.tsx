import React, { useMemo } from "react";
import { usePlacementOver } from "@/hooks/use-current-game";
import { RoundRecord } from "@/models/round-record";
import {
  useCreateStockGamePlacement,
  useGetMySlotGamePlacement,
} from "@/react-query/slot-game-queries";
import { toast } from "sonner";

interface BettingPanelProps {
  betAmount: number;
  roundRecord: RoundRecord;
  setBetAmount: (amount: number) => void;
}

const BettingPanel: React.FC<BettingPanelProps> = ({
  betAmount,
  roundRecord,
  setBetAmount,
}) => {
  const { data: myPlacementData } = useGetMySlotGamePlacement(roundRecord.id);
  const {
    mutate: createStockGamePlacement,
    isPending: isCreateStockGamePlacementPending,
  } = useCreateStockGamePlacement();

  const isPlaceOver = usePlacementOver(roundRecord);

  const totalBetAmount = useMemo(() => {
    return myPlacementData?.data?.reduce((acc, curr) => acc + curr.amount, 0);
  }, [myPlacementData]);

  const MAX_TOTAL_BET = 1000;
  const currentTotal = totalBetAmount || 0;
  const remainingAllowed = Math.max(0, MAX_TOTAL_BET - currentTotal);

  const placeBetHandler = async () => {
    try {
      if (betAmount <= 0) {
        toast.error("Please select a bet amount.");
        return;
      }

      if (currentTotal + betAmount > MAX_TOTAL_BET) {
        toast.error(
          `Total bets cannot exceed ₹${MAX_TOTAL_BET}. Remaining: ₹${remainingAllowed}.`
        );
        return;
      }
      createStockGamePlacement({
        roundId: roundRecord.id,
        amount: betAmount,
      });
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Something went wrong.");
    }
  };

  const handleQuickBet = (amount: number) => {
    if (remainingAllowed <= 0) {
      toast.error(`You have reached the total bet limit of ₹${MAX_TOTAL_BET}.`);
      return;
    }
    const clamped = Math.min(amount, remainingAllowed);
    if (clamped < amount) {
      toast.error(
        `Only ₹${remainingAllowed} remaining before reaching the ₹${MAX_TOTAL_BET} limit.`
      );
    }
    setBetAmount(clamped);
  };

  return (
    <>
      <div
        style={{
          backgroundImage: "url('/images/slot-machine/betting-bg.png')",
          backgroundSize: "100% 100%",
          backgroundPosition: "center center",
          backgroundRepeat: "no-repeat",
          zIndex: 100,
        }}
        className=" text-[15px] lg:text-[32px] p-3 pt-1 h-[95px] lg:h-[150px] flex justify-center items-center w-full lg:w-[120%] flex-shrink-0 z-20"
      >
        <div className="grid grid-cols-12 h-[90%] w-full items-center justify-center py-1 lg:px-5">
          {/* //? bet amount  */}
          <div className="col-span-5 pt-1 flex items-center justify-center h-full">
            <div
              style={{
                backgroundImage: "url('/images/slot-machine/menu-bg.png')",
                backgroundSize: "100% 100%",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
              }}
              className="py-[6px] lg:py-3 px-3 lg:px-5 flex flex-col items-center justify-center h-full w-full gap-2"
            >
              <div
                style={{
                  backgroundImage:
                    "url('/images/slot-machine/menu-item-bg-1.png')",
                  backgroundSize: "100% 100%",
                  backgroundPosition: "center center",
                  backgroundRepeat: "no-repeat",
                }}
                className="grid grid-cols-3 items-center justify-center gap-1 w-full px-3 lg:px-5 text-center h-full"
              >
                {/* //? bet amount and wallet  */}
                <div className="leading-none col-span-1 flex gap-1">
                  ₹
                  {betAmount}
                </div>
              </div>
              <div
                style={{
                  backgroundImage:
                    "url('/images/slot-machine/menu-item-bg-2.png')",
                  backgroundSize: "100% 100%",
                  backgroundPosition: "center center",
                  backgroundRepeat: "no-repeat",
                }}
                className="grid grid-cols-3 items-center justify-center gap-1 w-full px-3 lg:px-5 text-center h-full"
              >
                {/* //? quick bet options  */}
                <button
                  className="leading-none hover:text-yellow-400 transition-colors"
                  onClick={() => handleQuickBet(100)}
                  disabled={isPlaceOver}
                >
                  100
                </button>
                <button
                  className="leading-none hover:text-yellow-400 transition-colors"
                  onClick={() => handleQuickBet(500)}
                  disabled={isPlaceOver}
                >
                  500
                </button>
                <button
                  className="leading-none hover:text-yellow-400 transition-colors"
                  onClick={() => handleQuickBet(1000)}
                  disabled={isPlaceOver}
                >
                  1000
                </button>
              </div>
            </div>
          </div>

          {/* //? add and sub button  */}
          <div className="col-span-1 grid grid-cols-1 items-center justify-center gap-1 ps-1 pt-1 lg:gap-3 lg:p-3 h-full">
            <button
              className="w-full h-full"
              style={{
                backgroundImage: "url('/images/slot-machine/add-btn.png')",
                backgroundSize: "100% 100%",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
              }}
              onClick={() => {
                if (remainingAllowed <= 0) {
                  toast.error(`You have reached the total bet limit of ₹${MAX_TOTAL_BET}.`);
                  return;
                }
                const next = Math.min(betAmount + 100, remainingAllowed);
                if (next === betAmount) return;
                if (betAmount + 100 > remainingAllowed) {
                  toast.error(
                    `Only ₹${remainingAllowed} remaining before reaching the ₹${MAX_TOTAL_BET} limit.`
                  );
                }
                setBetAmount(next);
              }}
              disabled={isPlaceOver}
            >
              <span className="text-transparent ">+</span>
            </button>
            <button
              className="w-full h-full"
              style={{
                backgroundImage: "url('/images/slot-machine/sub-btn.png')",
                backgroundSize: "100% 100%",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
              }}
              onClick={() => setBetAmount(Math.max(100, betAmount - 100))}
              disabled={isPlaceOver}
            >
              <span className="text-transparent">-</span>
            </button>
          </div>

          {/* //? bet amount  */}
          <div
            style={{
              backgroundImage: "url('/images/slot-machine/green-btn.png')",
              backgroundSize: "100% 100%",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
            }}
            className={`col-span-3 w-full h-full flex justify-center items-center text-center mt-1`}
          >
            <div className="text-white leading-none -translate-x-[5%] -translate-y-[10%] text-xs lg:text-xl xl:text-2xl">
              <div className=" text-white font-bold">Total Bet</div>
              <div className=" text-white">₹{totalBetAmount || 0}</div>
            </div>
          </div>

          {/* //? play button  */}
          <div className="col-span-3 relative w-full h-full">
            <button
              onClick={isPlaceOver ? undefined : placeBetHandler}
              disabled={
                isPlaceOver ||
                isCreateStockGamePlacementPending ||
                remainingAllowed <= 0
              }
              className={`absolute top-0 lg:top-3 left-0 rounded-full z-10 cursor-pointer
              ${
                isPlaceOver || isCreateStockGamePlacementPending || remainingAllowed <= 0
                  ? "cursor-not-allowed opacity-50"
                  : "cursor-pointer hover:brightness-110"
              }`}
            >
              <img
                src="/images/slot-machine/refresh-btn.png"
                alt="refresh-btn"
                className="lg:h-[110px] h-[52px]"
              />
            </button>
            <button className="absolute bottom-0 lg:bottom-3 lg:left-[100px] left-[50px] rounded-full z-20">
              <img
                src="/images/slot-machine/play-btn.png"
                alt="play-btn"
                className="lg:h-10 h-6"
              />
            </button>
          </div>

          {/* //? total bet display  */}
          {/* <div className="col-span-3 relative w-full h-full flex items-center justify-center">
            <div className="text-center">
              <div className="text-xs lg:text-sm text-yellow-400 font-bold">
                Total Bet
              </div>
              <div className="text-sm lg:text-lg text-white">
                ₹{totalBetAmount || 0}
              </div>
            </div>
          </div> */}
        </div>
      </div>
    </>
  );
};

export default BettingPanel;
