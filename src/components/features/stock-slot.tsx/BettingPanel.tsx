import React, { useCallback, useMemo } from "react";
import { useIsPlaceOver } from "@/hooks/use-current-game";
import { RoundRecord } from "@/models/round-record";
import {
  useCreateStockGamePlacement,
  useGetMySlotGamePlacement,
} from "@/react-query/slot-game-queries";
import { toast } from "sonner";
import useMaxPlacement from "@/hooks/use-max-placement";
import { useAuthStore } from "@/context/auth-context";
// import { getCachedImage } from "@/hooks/image-preloader";
import Image from "next/image";

interface BettingPanelProps {
  betAmount: number;
  roundRecord: RoundRecord;
  setBetAmount: (amount: number) => void;
  // getBackgroundStyle: (src: string) => React.CSSProperties;
}

const BettingPanel: React.FC<BettingPanelProps> = ({
  betAmount,
  roundRecord,
  setBetAmount,
  // getBackgroundStyle,
}) => {
  const { data: myPlacementData } = useGetMySlotGamePlacement(roundRecord.id);
  const { mutate: createStockGamePlacement, isPending: isPlacingBet } =
    useCreateStockGamePlacement();

  const isPlaceOver = useIsPlaceOver(roundRecord);
  const { maxPlacement, minPlacement = 100 } = useMaxPlacement(
    roundRecord.gameType
  );
  const { userDetails } = useAuthStore();
  const coinValues = userDetails?.company?.coinValues || [100, 200, 500, 1000];

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

  const handleQuickBet = useCallback(
    (amount: number) => {
      if (remainingAllowed <= 0) {
        toast.error(
          `You have reached the total bet limit of ₹${maxPlacement}.`
        );
        return;
      }
      const clamped = Math.min(amount, remainingAllowed);
      if (clamped < amount) {
        toast.error(
          `Only ₹${remainingAllowed} remaining before reaching the ₹${maxPlacement} limit.`
        );
      }
      setBetAmount(clamped);
    },
    [remainingAllowed, maxPlacement, setBetAmount]
  );

  const canPlaceBet = useMemo(() => {
    return (
      !isPlacingBet &&
      !isPlaceOver &&
      betAmount > 0 &&
      totalBetAmount + betAmount <= maxPlacement
    );
  }, [isPlacingBet, isPlaceOver, betAmount, totalBetAmount, maxPlacement]);

  return (
    <>
      <div className=" text-xs min-h-24 md:text-base flex justify-center w-full flex-shrink-0 z-20 max-w-xl">
        <div className="grid grid-cols-12 h-full w-full gap-1 sm:gap-2 lg:w-10/12">
          {/* //? bet amount  */}
          <div className="col-span-5 flex items-center justify-center h-full overflow-hidden relative">
            <div
              style={{
                backgroundImage: "url('/images/slot-machine/quick-bet-bg.png')",
                backgroundSize: "100% 100%",
                backgroundPosition: "center center",
                backgroundRepeat: "no-repeat",
              }}
              className="flex flex-col items-center justify-center w-[85%] h-[65%] top-2 absolute z-10"
            ></div>
            <div
              style={{
                backgroundImage:
                  "url('/images/slot-machine/quick-bet-border.png')",
                backgroundSize: "100% 100%",
                backgroundPosition: "center center",
                backgroundRepeat: "no-repeat",
              }}
              className="flex flex-col items-center h-full w-full relative z-20"
            >
              <div
                className="flex flex-col items-center justify-center w-[85%] h-[65%] pt-4"
              >
                {/* //? bet amount and wallet  */}
                <div className="grid items-center justify-center w-full text-center h-full">
                  <div className="leading-none col-span-1 flex gap-1 bg-gradient-to-b from-white to-[#0285F5] bg-clip-text text-transparent">
                    ₹{betAmount}
                  </div>
                </div>

                <div
                  style={{
                    backgroundImage:
                      "url('/images/slot-machine/separator.png')",
                    backgroundSize: "100% 100%",
                    backgroundPosition: "center center",
                    backgroundRepeat: "no-repeat",
                  }}
                  className="w-full h-5"
                ></div>

                {/* //? quick bet options  */}
                <div className="grid grid-cols-2 items-center justify-center w-full text-center h-full gap-3">
                  {coinValues.slice(0, 2).map((amount) => (
                    <button
                      key={amount}
                      className="leading-none bg-gradient-to-b from-white to-[#0285F5] bg-clip-text text-transparent"
                      onClick={() => handleQuickBet(amount)}
                    >
                      {amount}
                    </button>
                  ))}
                </div>

                <div
                  style={{
                    // ...getBackgroundStyle("/images/slot-machine/menu-bg.png"),
                    backgroundImage:
                      "url('/images/slot-machine/separator.png')",
                    backgroundSize: "100% 100%",
                    backgroundPosition: "center center",
                    backgroundRepeat: "no-repeat",
                  }}
                  className="w-full h-5"
                ></div>

                <div className="grid grid-cols-2 items-center justify-center w-full text-center h-full gap-3 ">
                  {coinValues.slice(2, 4).map((amount) => (
                    <button
                      key={amount}
                      className="leading-none bg-gradient-to-b from-white to-[#0285F5] bg-clip-text text-transparent"
                      onClick={() => handleQuickBet(amount)}
                    >
                      {amount}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="col-span-7 h-[80%] grid grid-cols-7 overflow-hidden sm:gap-2 gap-1">
            {/* //? add and sub button  */}
            <div className="col-span-1 grid grid-cols-1 items-center justify-center gap-1 lg:gap-3 h-full">
              <button
                className="w-full h-full"
                style={{
                  // backgroundImage: getBackgroundStyle("/images/slot-machine/add-btn.png").backgroundImage,
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
                  const next = Math.min(
                    betAmount + increment,
                    remainingAllowed
                  );
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
                  // backgroundImage: getBackgroundStyle("/images/slot-machine/sub-btn.png").backgroundImage,
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
                // ...getBackgroundStyle("/images/slot-machine/green-btn.png"),
                backgroundImage: "url('/images/slot-machine/total-btn.png')",
                backgroundSize: "100% 100%",
                backgroundPosition: "center center",
                backgroundRepeat: "no-repeat",
              }}
              className={`lg:col-span-4 col-span-3 w-full h-full flex justify-center items-center text-center`}
            >
              <div className=" slot-gradient-text text-transparent text-base lg:text-2xl">
                <div className="">Bet</div>
                <div className="truncate ">₹{totalBetAmount || 0}</div>
              </div>
            </div>

            {/* //? bet button  */}
            <div className="sm:col-span-2 col-span-3 relative w-full h-full flex items-center">
              <button
                onClick={() => placeBetHandler()}
                disabled={!canPlaceBet}
                className={`rounded-full z-10 cursor-pointer h-full w-full flex items-center justify-start
              ${!canPlaceBet ? "opacity-50" : "hover:brightness-110"}`}
              >
                <Image
                  src="/images/slot-machine/bet-btn.png"
                  alt="refresh-btn"
                  fill
                  className="w-full h-full object-contain"
                />
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default BettingPanel;
