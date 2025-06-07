import { useGetWheelOfFortuneRoundResult } from '@/react-query/wheel-of-fortune-queries';
import { useEffect, useState } from 'react';

import { Alert, AlertDescription } from "@/components/ui/alert";
interface GameResultDialogProps {
  open: boolean;
  roundRecordId: number;
}

const WheelOfFortuneResultDialog = ({ open, roundRecordId }: GameResultDialogProps) => {
  const [showDialog, setShowDialog] = useState(open);
  const { data, isLoading, isError } = useGetWheelOfFortuneRoundResult(roundRecordId, open);

  useEffect(() => {
    if (open) {
      setTimeout(()=>{
        setShowDialog(open);
      }, 2000)
    }
  }, [open]);

  return (
    <GameResult showDialog={showDialog} setShowDialog={setShowDialog} isLoading={isLoading} isError={isError} data={data} />
  );
};


import { AlertCircle, Loader2 } from "lucide-react";

import { Sheet, SheetContent } from '@/components/ui/sheet';
import { cn, INR } from "@/lib/utils";
import { Separator } from "@radix-ui/react-separator";
import Image from "next/image";

type GameResultProps = {
    showDialog: boolean;
    setShowDialog: (showDialog: boolean) => void;
    isLoading: boolean;
    isError: boolean;
    data: any;
}

const GameResult = ({ showDialog, setShowDialog, isLoading, isError, data }: GameResultProps) => {
    const isWin = data && Number(data.netProfitLoss) > 0;

    return <Sheet open={showDialog} onOpenChange={setShowDialog} >
        <SheetContent side="bottom" className=" bg-primary-game text-white border-t border-gray-600">
            <div className="py-4">
                {isLoading ? (
                    <div className="flex flex-col items-center justify-center p-8 space-y-4">
                        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
                        <p className="text-gray-600">Loading results...</p>
                        <button className="bet-button w-full" onClick={() => setShowDialog(false)}>
                            Checkout Game
                        </button>
                    </div>
                ) : isError ? (
                    <>
                        <Alert variant="destructive">
                            <AlertCircle className="h-4 w-4" />
                            <AlertDescription>
                                Failed to load round results. Please try again.
                            </AlertDescription>
                        </Alert>
                        <button className="bet-button w-full" onClick={() => setShowDialog(false)}>
                            Checkout Game
                        </button>
                    </>
                ) : data ? (
                    <div className="space-y-4">
                        {/* Display the image and message */}
                        <div className="space-y-4 mb-4">
                            <Image
                                src={isWin ? '/won.png' : '/lost.png'}
                                alt={isWin ? 'You Won!' : 'Better Luck Next Time'}
                                width={100}
                                height={100}
                                className="rounded-full md:w-32 w-24 mx-auto"
                            />
                            <p className={cn("text-2xl font-bold text-center",
                                isWin ? 'text-yellow-600' : 'text-gray-100'
                            )}>
                                {isWin ? 'Congratulations! You won!' : 'Better luck next time!'}
                            </p>
                        </div>

                        <div className="text-center flex justify-between rounded-lg">
                            <p className="">Total Bet Amount</p>
                            <p className="text-xl">{INR(data.totalPlaced)}</p>
                        </div>

                        <div className="text-center flex justify-between rounded-lg">
                            <p className="">Total Winnings</p>
                            <p className="text-xl">{INR(data.amountWon)}</p>
                        </div>

                        <div className="text-center flex justify-between rounded-lg">
                            <p className="">Platform Fees</p>
                            <p className="text-xl">- {INR(data.platformFeeAmount)}</p>
                        </div>

                        <div className="text-center flex justify-between rounded-lg">
                            <p className="">Net Winning</p>
                            <p className="text-xl">{INR(data.netWinning)}</p>
                        </div>

                        <div className="text-center flex justify-between rounded-lg">
                            <p className="">Profit/Loss</p>
                            <p className={`text-xl ${isWin ? 'text-green-600' : 'text-red-600'}`}>
                                {INR(data.netProfitLoss)}
                            </p>
                        </div>

                        <Separator />

                        <button className="bet-button w-full" onClick={() => setShowDialog(false)}>
                            Play Again
                        </button>
                    </div>
                ) : (
                    <>
                        <p className="text-gray-600 text-center">No results available.</p>
                        <button className="bet-button w-full" onClick={() => setShowDialog(false)}>
                            Play Again
                        </button>
                    </>
                )}
            </div>
        </SheetContent>
    </Sheet>

}



export default WheelOfFortuneResultDialog;