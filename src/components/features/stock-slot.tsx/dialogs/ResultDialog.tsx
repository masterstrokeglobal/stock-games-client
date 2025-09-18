import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useStockGameRoundResult } from "@/react-query/slot-game-queries";
import React, { useMemo } from "react";
import Image from "next/image";
import useWindowSize from "@/hooks/use-window-size";

interface ResultDialogProps {
  open: boolean;
  roundRecordId: number;
  placeTimeLeft: any;
}

const ResultDialog: React.FC<ResultDialogProps> = ({
  open,
  roundRecordId,
  placeTimeLeft,
}) => {
  const { data: resultData } = useStockGameRoundResult(roundRecordId, open);
  const { isMobile } = useWindowSize();

  const isWin = useMemo(() => {
    if (!resultData) return null;
    return (resultData?.netProfitLoss ?? 0) > 0;
  }, [resultData]);

  return (
    <Dialog defaultOpen={open}>
      <DialogContent
        showButton={false}
        className=" bg-transparent border-none w-full max-h-none max-w-2xl focus:outline-none p-0"
      >
        <div
          style={{
            backgroundImage: `url('${
              isMobile
                ? "https://res.cloudinary.com/dt8iv1hds/image/upload/v1758179649/result-bg-mb_ehmf6c.png"
                : "https://res.cloudinary.com/dt8iv1hds/image/upload/v1758179649/result-bg_r2yb8v.png"
            }')`,
            backgroundSize: "contain",
            backgroundPosition: "center center",
            backgroundRepeat: "no-repeat",
          }}
          className=" min-h-[400px] min-w-[325px] lg:min-w-[524px] lg:min-h-[581px] w-full h-full lg:p-[5%] flex flex-col items-center justify-center lg:justify-around font-blood-melt text-[#FFFFFFB2] relative"
        >
          <DialogHeader className="p-4">
            <DialogTitle className="text-3xl lg:text-[40px] slot-gradient-text leading-normal">
              Game Over
            </DialogTitle>
            <DialogClose asChild>
              <button className="absolute top-0 right-8">
                <Image
                  src="https://res.cloudinary.com/dt8iv1hds/image/upload/v1758179642/cancel-btn_ebj094.png"
                  alt="cancel"
                  width={isMobile ? 30 : 40}
                  height={isMobile ? 30 : 40}
                />
              </button>
            </DialogClose>
          </DialogHeader>

          <DialogDescription className="text-center flex flex-col justify-between items-center text-xs lg:text-base xl:text-2xl leading-normal overflow-y-auto ">
            <Image
              src={`${
                isWin
                  ? "https://res.cloudinary.com/dt8iv1hds/image/upload/v1758179645/lady_ufh5ck.png"
                  : "https://res.cloudinary.com/dt8iv1hds/image/upload/v1758179645/loss-img_h1glol.png"
              }`}
              alt="Win"
              width={isMobile ? 100 : 150}
              height={isMobile ? 100 : 150}
            />
            <div
              className={`uppercase text-xl lg:text-3xl bg-gradient-to-b ${
                isWin ? "from-white to-[#0CC915]" : "from-white to-[#FF3E3E]"
              } bg-clip-text text-transparent slot-text-shadow mt-1`}
            >
              {isWin ? (
                <p>You won {resultData?.amountWon?.toFixed(2)} INR</p>
              ) : (
                <p>You lost {resultData?.totalPlaced?.toFixed(2)} INR</p>
              )}
            </div>
            <p className="text-lg uppercase lg:text-2xl slot-gradient-text my-4">
              next round in{placeTimeLeft.formatted} <br />
              seconds
            </p>
            <DialogClose asChild>
              <button
                className="w-full py-2 text-white text-2xl lg:text-[40px] lg:max-w-[200px] max-w-[120px] leading-normal"
                style={{
                  backgroundImage: `url('https://res.cloudinary.com/dt8iv1hds/image/upload/v1758179642/btn-bg_dp0aeb.png')`,
                  backgroundSize: "100% 100%",
                  backgroundPosition: "center center",
                  backgroundRepeat: "no-repeat",
                }}
              >
                OK
              </button>
            </DialogClose>
          </DialogDescription>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ResultDialog;
