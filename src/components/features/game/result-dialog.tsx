import React, { useMemo } from 'react';
import { Loader2, AlertCircle } from 'lucide-react';
import Image from 'next/image';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useGetMyRoundResult } from '@/react-query/round-record-queries';
import { cn } from '@/lib/utils';

interface GameResultDialogProps {
  open: boolean;
  roundRecordId: number;
}

const GameResultDialog = ({ open, roundRecordId }: GameResultDialogProps) => {
  const { data, isLoading, isError } = useGetMyRoundResult(roundRecordId, open);

  const resultData = useMemo(() => {
    if (data?.data) {
      return {
        totalBetAmount: data.data.totalBetAmount.toFixed(2),
        totalWinnings: data.data.totalWinnings.toFixed(2),
        profit: (data.data.totalWinnings - data.data.totalBetAmount).toFixed(2)
      };
    }
    return null;
  }, [data]);

  // Check if the result is a win or loss
  const isWin = resultData && Number(resultData.profit) >= 0;

  return (
    <Dialog key={String(open)} defaultOpen={open}>
      <DialogContent className="sm:max-w-md bg-primary-game text-white">
        <DialogHeader>
          <DialogTitle>Round Results</DialogTitle>
        </DialogHeader>

        <div className="py-4">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center p-8 space-y-4">
              <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
              <p className="text-gray-600">Loading results...</p>
            </div>
          ) : isError ? (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Failed to load round results. Please try again.
              </AlertDescription>
            </Alert>
          ) : resultData ? (
            <div className="space-y-4">
              {/* Display the image and message */}
              <div className="space-y-4 mb-4">
                <Image
                  src={isWin ? '/won.png' : '/lost.png'}
                  alt={isWin ? 'You Won!' : 'Better Luck Next Time'}
                  width={100}
                  height={100}
                  className="rounded-full w-32 mx-auto" // Add this to remove any white background
                />
                <p className={cn("text-2xl  font-bold text-center",
                  isWin ? 'text-yellow-600' : 'text-gray-100'
                )}>
                  {isWin ? 'Congratulations! You won!' : 'Better luck next time!'}
                </p>
              </div>

              {/* Display result data */}
              <div className="space-y-4">
                <div className="text-center  flex justify-between  rounded-lg">
                  <p className="">Total Bet Amount</p>
                  <p className="text-xl ">${resultData.totalBetAmount}</p>
                </div>
                <div className="text-center  flex justify-between rounded-lg">
                  <p className="">Total Winnings</p>
                  <p className="text-xl ">${resultData.totalWinnings}</p>
                </div>
                <div className="text-center flex justify-between  rounded-lg">
                  <p className="">Profit/Loss</p>
                  <p className={`text-xl  ${isWin ? 'text-green-600' : 'text-red-600'}`}>
                    ${resultData.profit}
                  </p>
                </div>
              </div>

              <DialogClose asChild>

                <button className="bet-button w-full"   >
                  Play Again
                </button>
              </DialogClose>
            </div>
          ) : (
            <p className="text-gray-600 text-center">No results available.</p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default GameResultDialog;
