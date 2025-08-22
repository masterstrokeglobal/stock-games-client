import React, { useCallback, useMemo } from "react";
import { useIsPlaceOver } from "@/hooks/use-current-game";
import { RoundRecord } from "@/models/round-record";
import {
  useCreateStockGamePlacement,
  useGetMySlotGamePlacement,
} from "@/react-query/slot-game-queries";
import { toast } from "sonner";
import useMaxPlacement from "@/hooks/use-max-placement";

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
  const { mutate: createStockGamePlacement, isPending: isPlacingBet } =
    useCreateStockGamePlacement();

  const isPlaceOver = useIsPlaceOver(roundRecord);
  const { maxPlacement , minPlacement = 100 } = useMaxPlacement(
    roundRecord.gameType
  );

  const totalBetAmount = useMemo(() => {
    return (
      myPlacementData?.data?.reduce((acc, curr) => acc + curr.amount, 0) || 0
    );
  }, [myPlacementData]);

  const remainingAllowed = useMemo(
    () => Math.max(0, maxPlacement - totalBetAmount),
    [maxPlacement, totalBetAmount]
  );

  const placeBetHandler = useCallback(() => {
    if (isPlacingBet) return;
    console.log('totalBetAmount', totalBetAmount)
    if (!roundRecord.id || betAmount <= 0) return;

    if (totalBetAmount + betAmount > maxPlacement) {
      toast.error(
        `Total bets cannot exceed ₹${maxPlacement}. Remaining: ₹${remainingAllowed}.`
      );
      return;
    }

    createStockGamePlacement({
      roundId: roundRecord.id,
      amount: betAmount,
    });
  }, [
    roundRecord.id,
    betAmount,
    totalBetAmount,
    maxPlacement,
    remainingAllowed,
    createStockGamePlacement,
    isPlacingBet,
  ]);


  const handleQuickBet = useCallback((amount: number) => {
    if (remainingAllowed <= 0) {
      toast.error(`You have reached the total bet limit of ₹${maxPlacement}.`);
      toast.error(`You have reached the total bet limit of ₹${maxPlacement}.`);
      return;
    }
    const clamped = Math.min(amount, remainingAllowed);
    if (clamped < amount) {
      toast.error(
        `Only ₹${remainingAllowed} remaining before reaching the ₹${maxPlacement} limit.`
      );
    }
    setBetAmount(clamped);
  }, [remainingAllowed, maxPlacement, setBetAmount]);

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
        className=" -translate-y-1/4 lg:translate-y-0 text-[15px] lg:text-[32px] py-1 px-3 lg:p-3 lg:pt-1 h-[95px] lg:h-[165px] flex justify-center items-center w-full lg:w-[120%] flex-shrink-0 z-20"
      >
        <div className="grid grid-cols-12 h-[90%] w-full items-center justify-center py-1 lg:px-5">
          {/* //? bet amount  */}
          <div className="col-span-5 pt-1 flex items-center justify-center h-full overflow-hidden">
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
                className="grid items-center justify-center gap-1 w-full px-3 lg:px-5 text-center h-full"
              >
                {/* //? bet amount and wallet  */}
                <div className="leading-none col-span-1 flex gap-1">
                  ₹{betAmount}
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
                {[100, 500, 1000].map((amount) => (
                  <button
                    key={amount}
                    className="leading-none hover:text-yellow-400 transition-colors"
                    onClick={() => handleQuickBet(amount)}
                  >
                    {amount}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* //? add and sub button  */}
          <div className="col-span-1 grid grid-cols-1 items-center justify-center gap-1 ps-1 pt-1 lg:gap-3 lg:p-3 h-full">
            <button
              className="w-full h-full"
              style={{
                backgroundImage: "url('/images/slot-machine/add-btn.png')",
                backgroundSize: "contain",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
              }}
              onClick={() => {
                if (remainingAllowed <= 0) {
                  toast.error(
                    `You have reached the total bet limit of ₹${maxPlacement}.`
                  );
                  return;
                }
                const increment = 100;
                const next = Math.min(betAmount + increment, remainingAllowed);
                if (next === betAmount) {
                  toast.error(
                    `Cannot increase bet amount. Limit reached: ₹${maxPlacement}.`
                  );
                  return;
                }
                if (betAmount + increment > remainingAllowed) {
                  toast.error(
                    `Only ₹${remainingAllowed} remaining before reaching the ₹${maxPlacement} limit.`
                  );
                }
                setBetAmount(next);
              }}
            >
              <span className="text-transparent ">+</span>
            </button>
            <button
              className="w-full h-full "
              style={{
                backgroundImage: "url('/images/slot-machine/sub-btn.png')",
                backgroundSize: "contain",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
              }}
              onClick={() =>
                setBetAmount(Math.max(minPlacement, betAmount - 100))
              }
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
              <div className=" text-white truncate">₹{totalBetAmount || 0}</div>
            </div>
          </div>

          {/* //? bet button  */}
          <div className="col-span-3 relative w-full h-full flex items-center">
            <button
              onClick={isPlaceOver ? undefined : placeBetHandler}
              disabled={isPlacingBet || isPlaceOver || betAmount <= 0 || totalBetAmount + betAmount > maxPlacement || totalBetAmount >= maxPlacement}
              className={`absolute rounded-full z-10 cursor-pointer h-full
              ${
                isPlacingBet || isPlaceOver || betAmount <= 0 || totalBetAmount + betAmount > maxPlacement || totalBetAmount >= maxPlacement
                  ? "cursor-not-allowed opacity-50"
                  : "cursor-pointer hover:brightness-110"
              }`}
            >
              <img
                src="/images/slot-machine/refresh-btn.png"
                alt="refresh-btn"
                className="lg:h-[90%] h-[100%]"
              />
            </button>
            {/* <button className="absolute bottom-0 lg:bottom-3 lg:left-[100px] left-[50px] rounded-full z-20">
              <img
                src="/images/slot-machine/play-btn.png"
                alt="play-btn"
                className="lg:h-10 h-6"
              />
            </button> */}
          </div>
        </div>
      </div>
    </>
  );
};

export default BettingPanel;
