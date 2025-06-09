import { useGetWheelOfFortuneRoundResult } from '@/react-query/wheel-of-fortune-queries';
import { useEffect, useState } from 'react';

import { Alert, AlertDescription } from "@/components/ui/alert";
interface GameResultDialogProps {
  open: boolean;
  roundRecordId: number;
}

import { AlertCircle, Loader2, X } from "lucide-react";

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

const WheelOfFortuneResultDialog = ({ open, roundRecordId }: GameResultDialogProps) => {
  const [showDialog, setShowDialog] = useState(false);
  const { data, isLoading, isError } = useGetWheelOfFortuneRoundResult(roundRecordId, open);

  useEffect(() => {
    if (open) {
      // Show the toast immediately when open is true
      setShowDialog(true);
      
      // Auto-dismiss after 5 seconds
      const timer = setTimeout(() => {
        setShowDialog(false);
      }, 5000);

      return () => clearTimeout(timer);
    } else {
      setShowDialog(false);
    }
  }, [open]);

  return (
    <GameResult showDialog={showDialog} setShowDialog={setShowDialog} isLoading={isLoading} isError={isError} data={data} />
  );
};

const GameResult = ({ showDialog, setShowDialog, isLoading, isError, data }: GameResultProps) => {
    const isWin = data && Number(data.netProfitLoss) > 0;

    if (!showDialog) return null;

    return (
        <div className={cn(
            "fixed top-10 right-4 z-50 w-80 max-w-[90vw] bg-primary-game text-white border border-gray-600 rounded-lg shadow-2xl transition-all duration-300 ease-in-out",
            showDialog ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"
        )}>
            {/* Close button */}
            <button
                onClick={() => setShowDialog(false)}
                className="absolute top-2 right-2 p-1 rounded-full hover:bg-gray-700 transition-colors"
            >
                <X className="h-4 w-4 text-gray-400 hover:text-white" />
            </button>

            <div className="p-4">
                {isLoading ? (
                    <div className="flex flex-col items-center justify-center space-y-4">
                        <Loader2 className="h-6 w-6 animate-spin text-blue-500" />
                        <p className="text-gray-400 text-sm">Loading results...</p>
                    </div>
                ) : isError ? (
                    <Alert variant="destructive" className="border-red-600 bg-red-900/20">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription className="text-red-400">
                            Failed to load round results.
                        </AlertDescription>
                    </Alert>
                ) : data ? (
                    <div className="space-y-3">
                        {/* Header with image and message */}
                        <div className="text-center space-y-2">
                            <Image
                                src={isWin ? '/won.png' : '/lost.png'}
                                alt={isWin ? 'You Won!' : 'Better Luck Next Time'}
                                width={60}
                                height={60}
                                className="rounded-full mx-auto"
                            />
                            <p className={cn("text-lg font-bold",
                                isWin ? 'text-yellow-400' : 'text-gray-300'
                            )}>
                                {isWin ? 'You Won!' : 'Better Luck Next Time!'}
                            </p>
                        </div>

                        {/* Results summary */}
                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                                <span className="text-gray-400">Total Bet:</span>
                                <span>{INR(data.totalPlaced)}</span>
                            </div>

                            <div className="flex justify-between">
                                <span className="text-gray-400">Winnings:</span>
                                <span>{INR(data.amountWon)}</span>
                            </div>

                            <div className="flex justify-between">
                                <span className="text-gray-400">Platform Fees:</span>
                                <span className="text-red-400">- {INR(data.platformFeeAmount)}</span>
                            </div>

                            <Separator className="my-2 bg-gray-600" />

                            <div className="flex justify-between font-bold">
                                <span>Profit/Loss:</span>
                                <span className={isWin ? 'text-green-400' : 'text-red-400'}>
                                    {INR(data.netProfitLoss)}
                                </span>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="text-center">
                        <p className="text-gray-400 text-sm">No results available</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default WheelOfFortuneResultDialog;
