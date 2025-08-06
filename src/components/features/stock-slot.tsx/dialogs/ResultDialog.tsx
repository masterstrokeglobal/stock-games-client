import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useStockGameRoundResult } from "@/react-query/slot-game-queries";
import React, { useEffect, useMemo, useState } from "react";

const WinDialog = () => {
  return (
    <div className="flex flex-col justify-center items-center font-wendy-one text-[#C8AD41] text-3xl lg:text-5xl">
      <span
        style={{
          textShadow: "10px 4px 10px black",
          WebkitTextStroke: "1px black",
        }}
        className=""
      >
        Bull Run!
      </span>
      <img
        className="lg:max-h-[40vh]"
        src="/images/slot-machine/bull.png"
        alt=""
      />
      <h2
        style={{
          textShadow: "10px 4px 10px black",
          WebkitTextStroke: "1px black",
        }}
        className="mt-2 text-center"
      >
        market boomed and so did your luck!
      </h2>
    </div>
  );
};

const LossDialog = () => {
  return (
    <div className="flex flex-col justify-center items-center font-wendy-one text-[#C8AD41] text-3xl lg:text-5xl">
      <span
        style={{
          textShadow: "10px 4px 10px black",
          WebkitTextStroke: "1px black",
        }}
        className=""
      >
        Bear’s got you!
      </span>
      <img
        className="translate-x-[-5%] lg:max-h-[50vh]"
        src="/images/slot-machine/bear.png"
        alt=""
      />
      <h2
        style={{
          textShadow: "10px 4px 10px black",
          WebkitTextStroke: "1px black",
        }}
        className="mt-2 text-center"
      >
        You lost this round
      </h2>
    </div>
  );
};

interface ResultDialogProps {
  open: boolean;
  roundRecordId: number;
}

const ResultDialog: React.FC<ResultDialogProps> = ({ open, roundRecordId }) => {
  const [showInitialAnimation, setShowInitialAnimation] =
    useState<boolean>(true);
  const { data: resultData } = useStockGameRoundResult(roundRecordId, open);

  const isWin = useMemo(() => {
    return Number(resultData?.netProfitLoss ?? 0) > 0;
  }, [resultData]);

  useEffect(() => {
    if (open) {
      setShowInitialAnimation(true);
      const timer = setTimeout(() => {
        setShowInitialAnimation(false);
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [open]);

  // Show win/loss animation for first 2 seconds, but only after data is loaded
  if (showInitialAnimation && isWin !== null) {
    return (
      <Dialog defaultOpen={open}>
        <DialogContent
          showButton={false}
          className="bg-transparent border-none w-full max-w-xl lg:max-w-3xl focus:outline-none"
        >
          <div className="w-full h-full relative flex flex-col items-center justify-center p-[10%]">
            {isWin !== null &&
              isWin !== undefined &&
              (isWin ? <WinDialog /> : <LossDialog />)}
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog defaultOpen={open}>
      <DialogContent
        showButton={false}
        className="bg-transparent border-none w-full max-w-xl lg:max-w-3xl focus:outline-none"
      >
        <div
          style={{
            backgroundImage: "url('/images/slot-machine/dialog-bg.png')",
            backgroundSize: "100% 100%",
            backgroundPosition: "center center",
            backgroundRepeat: "no-repeat",
          }}
          className="w-full h-full relative flex flex-col items-center justify-center p-[10%] font-wendy-one text-[#FFFFFFB2]"
        >
          <img
            src={"/images/slot-machine/happy-bull.png"}
            alt=""
            className="absolute w-[100px] lg:w-[130px] top-0 translate-y-[-50%]"
          />
          <DialogHeader className="p-1">
            <DialogTitle className="text-xl lg:text-[30px] xl:text-[40px]">
              Game Over
            </DialogTitle>
          </DialogHeader>
          <DialogDescription className="text-center flex flex-col justify-center items-center gap-4 p-5 pt-2 overflow-y-auto min-h-[200px] text-xs lg:text-base xl:text-2xl">
            <div className="flex flex-col gap-2">
              {isWin ? (
                <>
                  <p className="capitalize text-base lg:text-[40px]">
                    You won {resultData?.amountWon}INR
                  </p>
                  <p className="text-base lg:text-[30px]">
                    Place Bet {resultData?.totalPlaced}INR
                  </p>
                </>
              ) : (
                <>
                  <p className="capitalize text-base lg:text-[40px]">
                    You lost {Math.abs(resultData?.netProfitLoss || 0)}INR
                  </p>
                </>
              )}
            </div>

            <DialogClose asChild>
              <button
                style={{
                  backgroundImage: "url('/images/slot-machine/green-btn.png')",
                  backgroundSize: "100% 100%",
                  backgroundPosition: "center",
                  backgroundRepeat: "no-repeat",
                }}
                className="p-6 px-12 text-white font-bold hover:brightness-110 transition-all text-[15px] lg:text-[30px]"
              >
                <div className="-translate-x-[5%] -translate-y-[10%]">
                  Try again
                </div>
              </button>
            </DialogClose>
          </DialogDescription>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ResultDialog;
