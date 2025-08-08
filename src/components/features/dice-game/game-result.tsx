import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent } from "@/components/ui/dialog";
import { useGetDiceGameRoundResult } from "@/react-query/dice-game-queries";
import clsx from "clsx";
import { XCircleIcon } from "lucide-react";
import { useEffect, useMemo } from "react";

interface GameResultDialogProps {
  open: boolean;
  roundRecordId: number;
}

const DiceGameResultDialog = ({
  open,
  roundRecordId,
}: GameResultDialogProps) => {
  const { data, isLoading, isError } = useGetDiceGameRoundResult(
    roundRecordId,
    open
  );

  const finalResult = useMemo(() => {
    if (!data || !Array.isArray(data)) return [];

    const grouped = data.reduce((acc, curr) => {
      const type = curr.placementType;

      if (!acc[type]) {
        acc[type] = {
          placementType: type,
          netProfitLoss: 0,
          netWinning: 0,
          platformFeeAmount: 0,
          amountWon: 0,
          grossWinning: 0,
          totalPlaced: 0,
        };
      }

      acc[type].netProfitLoss += curr.netProfitLoss;
      acc[type].netWinning += curr.netWinning;
      acc[type].platformFeeAmount += curr.platformFeeAmount;
      acc[type].amountWon += curr.amountWon;
      acc[type].grossWinning += curr.grossWinning;
      acc[type].totalPlaced += curr.totalPlaced;

      return acc;
    }, {} as Record<string, any>);

    return Object.values(grouped);
  }, [data]);

  useEffect(() => {
    console.log("dice bet", finalResult);
  }, [finalResult]);

  // Check if data is loaded and determine win/loss
  // const isWin = finalResult && Number(finalResult.netProfitLoss) > 0;
  // const isLoss = finalResult && Number(finalResult.netProfitLoss) <= 0;

  // If still loading/error or no result, don't show the dialog
  if (isLoading || isError) return null;

  return (
    <Dialog defaultOpen={open}>
      <DialogContent
        showButton={false}
        className={clsx(
          "max-w-xs lg:max-w-lg w-full p-0 border-none rounded-xl overflow-show bg-transparent shadow-none",
          "backdrop-blur-md"
        )}
        style={{ background: "none" }}
      >
        <div
          className="relative w-full rounded-xl "
          style={{
            background:
              "linear-gradient(171.89deg, #8EB0FF 5.45%, #9895FF 49.61%, #0A3EB6 93.76%)",
            boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.37)",
            minHeight: 220,
            minWidth: 320,
            padding: 0,
          }}
        >
          {/* Close Button */}
          <DialogClose asChild>
            <Button
              variant="ghost"
              className="absolute top-3 right-3 w-7 h-7 p-0 flex z-50 bg-transparent border-none items-center justify-center rounded-full"
            >
              <XCircleIcon className="text-[#013FCF] size-6" />
            </Button>
          </DialogClose>
          {/* Text Content */}
          <div className="relative z-10 flex flex-col justify-center items-center h-full pl-6 pr-6 pt-10 pb-4">
            {/* <div className="flex-shrink-0">
              <img
                src={
                  isWin
                    ? "/images/dice-game/result-win.png"
                    : "/images/dice-game/result-lost.png"
                }
                alt="lady"
                className="h-64 absolute bottom-0 right-0"
              />
            </div> */}
            <div
              className="text-white font-bold text-2xl leading-tight drop-shadow text-center mb-4"
              style={{
                textShadow:
                  "1px 1px 0px #003682, -1px -1px 0px #003682, 1px -1px 0px #003682, -1px 1px 0px #003682",
              }}
            >
              {/* {isWin ? "Boom!" : "Oops!"} */}
              Game Over!
            </div>
            {/* <div
              className="text-white font-bold text-xl mt-1"
              style={{
                textShadow:
                  "1px 1px 0px #003682, -1px -1px 0px #003682, 1px -1px 0px #003682, -1px 1px 0px #003682",
              }}
            >
              {isWin
                ? `You just won ₹${Number(
                    finalResult.netProfitLoss
                  ).toLocaleString()}!`
                : `Better Luck Next Time!`}
              <br />
              Bet Amount : ${finalResult.totalPlaced}
            </div> */}
            <div className="flex flex-col gap-2 justify-center items-center text-sm lg:text-base text-white">
              <div className="grid grid-cols-3 w-full font-bold">
                <p className="text-left truncate">Type</p>
                <p className="text-center truncate">Bet Amount</p>
                <p className="text-center truncate">Net P/L</p>
              </div>
              <div className="flex flex-col gap-1 w-full">
                {finalResult.map((bet: any, i: number) => (
                  <div key={i} className="grid grid-cols-3 ">
                    <p className="text-left truncate">{bet.placementType}</p>
                    <p className="text-center truncate">{bet.totalPlaced}</p>
                    <p
                      className={`text-center truncate ${
                        bet.netProfitLoss >= 0
                          ? "text-green-600"
                          : "text-red-500"
                      }`}
                    >
                      {bet.netProfitLoss > 0 && "+"} {bet.netProfitLoss}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DiceGameResultDialog;
