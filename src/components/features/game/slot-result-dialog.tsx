import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { cn, formatRupee } from '@/lib/utils';
import { useGetStockSlotRoundResult } from '@/react-query/game-record-queries';
import { AlertCircle, Loader2 } from 'lucide-react';
import Image from 'next/image';
import { useEffect, useState } from 'react';

interface GameResultDialogProps {
  open: boolean;
  roundRecordId: number;
}

const SlotResultDialog = ({ open, roundRecordId }: GameResultDialogProps) => {
  const [showDialog, setShowDialog] = useState(open);
  const { data, isLoading, isError } = useGetStockSlotRoundResult(roundRecordId);

  useEffect(() => {
    if (open) {
      setShowDialog(open);
    }
  }, [open]);

  // Check if the result is a win or loss
  const isWin = data && Number(data.netProfitLoss) >= 0;

  return (  
    <Dialog open={showDialog}>
      <DialogContent className="sm:max-w-md bg-primary-game text-white [&>.close-button]:hidden" data-hide-children="true">
        <DialogHeader>
          <DialogTitle>Round Results</DialogTitle>
        </DialogHeader>

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
                  className="rounded-full w-32 mx-auto" // Add this to remove any white 
                />
                <p className={cn("text-2xl  font-bold text-center",
                  isWin ? 'text-yellow-600' : 'text-gray-100'
                )}>
                  {isWin ? 'Congratulations! You won!' : 'Better luck next time!'}
                </p>
              </div>

              <div className="text-center  flex justify-between  rounded-lg">
                <p className="">Total Bet Amount</p>
                <p className="text-xl ">{formatRupee(data.totalPlaced)}</p>
              </div>

              <div className="text-center  flex justify-between  rounded-lg">
                <p className="">Total Winnings</p>
                <p className="text-xl ">{formatRupee(data.amountWon)}</p>
              </div>

              <div className="text-center  flex justify-between  rounded-lg">
                <p className="">Platform Fees</p>
                <p className="text-xl ">- {formatRupee(data.platformFeeAmount)}</p>
              </div>

              <div className="text-center  flex justify-between  rounded-lg">
                <p className="">Net Winning</p>
                <p className="text-xl ">{formatRupee(data.netWinning)}</p>
              </div>

              <div className="text-center  flex justify-between  rounded-lg">
                <p className="">Profit/Loss</p>
                <p className={`text-xl  ${isWin ? 'text-green-600' : 'text-red-600'}`}>
                  {formatRupee(data.netProfitLoss)}
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
      </DialogContent>
    </Dialog>
  );
};

export default SlotResultDialog;
