import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { INR } from "@/lib/utils";
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

  // Calculate totals similar to 7-up-down
  const totalPlaced = data?.reduce((total: any, bet: any) => {
    return total + bet.totalPlaced;
  }, 0);

  const totalWon = data?.reduce((total: any, bet: any) => {
    return total + bet.amountWon;
  }, 0);

  const totalNetResult = data?.reduce((total: any, bet: any) => {
    return total + bet.netProfitLoss;
  }, 0);


  // Check if data is loaded and determine win/loss
  // const isWin = finalResult && Number(finalResult.netProfitLoss) > 0;
  // const isLoss = finalResult && Number(finalResult.netProfitLoss) <= 0;

  // If still loading/error or no result, don't show the dialog
  if (isLoading || isError) return null;

  return (
    <Dialog  defaultOpen={open}>
      <DialogContent
        showButton={false}
        className={clsx(
          "max-w-xs lg:max-w-lg w-full p-0 border-none rounded-xl overflow-show bg-transparent shadow-none",
          "backdrop-blur-md"
        )}
        style={{ background: "none" }}
      >
        <div
          className="relative w-full rounded-xl"
          style={{
            background:
              "linear-gradient(171.89deg, #8EB0FF 5.45%, #9895FF 49.61%, #0A3EB6 93.76%)",
            boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.37)",
            minHeight: 400,
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
            <div
              className="text-white font-bold text-2xl leading-tight drop-shadow text-center mb-4"
              style={{
                textShadow:
                  "1px 1px 0px #003682, -1px -1px 0px #003682, 1px -1px 0px #003682, -1px 1px 0px #003682",
              }}
            >
              Game Over!
            </div>
            
            {/* Updated content structure with better styling */}
            <div className="flex flex-col gap-4 justify-center items-center text-sm lg:text-base text-white w-full">
              {/* Table with borders */}
              <div className="w-full border border-white/30 rounded-lg overflow-hidden bg-white/5 backdrop-blur-sm">
                {/* Header */}
                <div className="grid grid-cols-3 w-full font-bold text-center bg-white/10 border-b border-white/30 py-2 px-3">
                  <p className="text-left">Bet Type</p>
                  <p className="text-center">Amount Placed</p>
                  <p className="text-center">Cashout INR</p>
                </div>
                
                {/* Bet Details */}
                <ScrollArea className="h-36 w-full">
                  <div className="flex flex-col w-full">
                    {data?.map((bet: any, i: number) => (
                      <div key={i} className="grid grid-cols-3 text-center py-2 px-3 border-b border-white/20 last:border-b-0 hover:bg-white/5 transition-colors">
                        <p className="text-left truncate capitalize">{`${bet.number} (${bet.placementType})`}</p>
                        <p className="text-center truncate">{INR(Number(bet.totalPlaced))}</p>
                        <p className="text-center truncate">{INR(Number(bet.amountWon))}</p>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
                
                {/* Totals */}
                <div className="grid grid-cols-3 w-full font-bold text-center bg-white/10 border-t border-white/30 py-2 px-3">
                  <p className="text-left">Total:</p>
                  <p className="text-center">{INR(Number(totalPlaced))}</p>
                  <p className="text-center">{INR(Number(totalWon))}</p>
                </div>
              </div>
              
              {/* Net Result in styled box */}
              <div className="w-full">
                <div 
                  className="border-2 border-white/40 rounded-xl p-4 bg-gradient-to-r from-white/10 to-white/5 backdrop-blur-sm shadow-lg"
                  style={{
                    boxShadow: "0 4px 20px rgba(255, 255, 255, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.2)"
                  }}
                >
                  <div className="text-center">
                    <div
                      className="text-white font-bold text-lg"
                      style={{
                        textShadow:
                          "1px 1px 0px #003682, -1px -1px 0px #003682, 1px -1px 0px #003682, -1px 1px 0px #003682",
                      }}
                    >
                      Net Result: {INR(Number(totalNetResult))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DiceGameResultDialog;
