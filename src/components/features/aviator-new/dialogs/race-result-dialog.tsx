import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { useGameType } from "@/hooks/use-game-type";
import { useAviatorRoundHistory } from "@/react-query/aviator-queries";
import dayjs from "dayjs";
import React, { useState, useRef, useEffect } from "react";

const RaceResultDialog = ({ children }: { children: React.ReactNode }) => {
  const [imageHeight, setImageHeight] = useState(400);
  const dialogRef = useRef<HTMLImageElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [gameType] = useGameType();
  const { data: lastRounds } = useAviatorRoundHistory(gameType);

  // Update div height to match image height
  useEffect(() => {
    const updateHeight = () => {
      if (dialogRef.current) {
        const height = dialogRef.current.offsetHeight;
        setImageHeight(height);
      }
    };

    if (isOpen) {
      // Small delay to ensure image is loaded
      const timer = setTimeout(updateHeight, 100);

      // Add resize event listener
      window.addEventListener("resize", updateHeight);

      return () => {
        clearTimeout(timer);
        window.removeEventListener("resize", updateHeight);
      };
    }
  }, [isOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger className="z-20">{children}</DialogTrigger>
      <DialogContent
        showButton={false}
        className="bg-transparent border-none w-full max-w-2xl p-3"
      >
        <div className="flex flex-col gap-4 relative z-10 items-center justify-center w-full">
          <img
            ref={dialogRef}
            src="/images/aviator/dialogs/race-result.png"
            alt="menu"
            className="w-full h-full min-w-[320px] min-h-[400px] relative z-10 max-w-[450px]"
          />
          <div
            className="flex gap-[10px] absolute translate-y-[15%] z-20 w-full p-5 font-quantico"
            style={{ height: `${imageHeight}px`, maxWidth: "450px" }}
          >
            <div className="flex flex-col gap-2 relative z-20 h-[80%] p-3 overflow-y-auto font-quantico w-full justify-between">
              <div className="flex items-center gap-2 w-full text-xs px-2">
                <div className="grid grid-cols-4 uppercase w-full border border-transparent">
                  <div className="text-left">Time</div>
                  <div className="text-left">Name</div>
                  <div className="text-center">Multiplier</div>
                  <div className="text-right">Status</div>
                </div>
              </div>
              <div className="space-y-2 w-full overflow-y-auto flex-1 text-[8px]">
                {lastRounds?.map((round, index) => (
                  <div
                    key={`${round.roundId}-${round.code}-${index}`}
                    className={`grid grid-cols-4 px-2`}
                  >
                    <div className="">
                      <span className="whitespace-nowrap">
                        {dayjs(round.time).format("hh:mm")}
                      </span>
                    </div>
                    <div className=" text-left">
                      <span className=" whitespace-nowrap block truncate">
                        {round.name}
                      </span>
                    </div>
                    <div className=" text-center">
                      <span className="text-white">{round?.multiplier}</span>
                    </div>
                    <div className=" flex justify-end items-center capitalize">
                      <span className="text-white">
                        {round.status === "crashed" ? "Crashed" : "Flew Away"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              <button
                className=" flex items-center justify-center w-full z-20 flex-shrink-0 pb-3"
                onClick={() => setIsOpen(false)}
              >
                <img
                  src="/images/aviator/dialogs/cancel-btn-blue.svg"
                  alt="cancel"
                  className="w-[110px] h-full"
                />
              </button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default RaceResultDialog;
