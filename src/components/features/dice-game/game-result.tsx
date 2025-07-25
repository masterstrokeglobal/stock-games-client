import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
} from "@/components/ui/dialog";
import { useGetDiceGameRoundResult } from "@/react-query/dice-game-queries";
import clsx from "clsx";
import { XCircleIcon } from "lucide-react";

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


  // Check if data is loaded and determine win/loss
  const isWin = data && Number(data.netProfitLoss) > 0;
  const isLoss = data && Number(data.netProfitLoss) <= 0;

  // If still loading/error or no result, don't show the dialog
  if (isLoading || isError || (!isWin && !isLoss)) return null;

  return (
    <Dialog defaultOpen={open} >
      <DialogContent
        showButton={false}
        className={clsx(
          "max-w-xs w-full p-0 border-none rounded-xl overflow-show bg-transparent shadow-none",
          "backdrop-blur-md"
        )}
        style={{ background: "none" }}
      >
        <div
          className="relative w-full rounded-xl "
          style={{
            background: "linear-gradient(171.89deg, #8EB0FF 5.45%, #9895FF 49.61%, #0A3EB6 93.76%)",
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
              className="absolute top-3 left-3 w-7 h-7 p-0 flex z-50 bg-transparent border-none items-center justify-center rounded-full"
            >
              <XCircleIcon className="text-[#013FCF] size-6" />
            </Button>
          </DialogClose>
          {/* Text Content */}
          <div className="relative z-10 flex flex-col justify-end h-full pl-6 pr-6 pt-10 pb-4">

            <div className="flex-shrink-0">
              <img src={isWin ? "/images/dice-game/result-win.png" : "/images/dice-game/result-lost.png"} alt="lady" className="h-64 absolute bottom-1/4 right-0" />
            </div>
            <div
              className="text-white font-bold text-2xl leading-tight drop-shadow"
              style={{
                textShadow:
                  "1px 1px 0px #003682, -1px -1px 0px #003682, 1px -1px 0px #003682, -1px 1px 0px #003682",
              }}
            >
              {isWin ? "Boom!" : "Oops!"}
            </div>
            <div
              className="text-white font-bold text-xl mt-1"
              style={{
                textShadow:
                  "1px 1px 0px #003682, -1px -1px 0px #003682, 1px -1px 0px #003682, -1px 1px 0px #003682",
              }}
            >
              {isWin
                ? `You just won ₹${Number(data.netProfitLoss).toLocaleString()}!`
                : `Better Luck Next Time!`
              }
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DiceGameResultDialog;