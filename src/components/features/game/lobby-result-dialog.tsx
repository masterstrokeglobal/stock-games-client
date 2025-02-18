import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { useAuthStore } from '@/context/auth-context';
import { cn } from '@/lib/utils';
import Lobby from '@/models/lobby';
import MarketItem from '@/models/market-item';
import { Loader2 } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';



// Interface for price difference data
interface PriceDifference {
  code: string;
  initialPrice: number;
  currentPrice: number;
  difference: number;
}

// Interface for winner data
interface Winner {
  id: number;
  firstname: string;
  lastname: string;
  email: string;
  username: string;
  winningAmount: number;
}

// Main interface for the entire data structure
interface Result {
  priceDifferences: PriceDifference[];
  winners: Winner[];
  count: number;
}


interface GameResultDialogProps {
  open: boolean;
  result: Result;
  lobby: Lobby;
  filteredMarket?: MarketItem[];
  
}

const LobbyGameResultDialog = ({ open, result, lobby }: GameResultDialogProps) => {
  const [showDialog, setShowDialog] = useState(open);
  const router   = useRouter();
  const { userDetails } = useAuthStore();

  const resultData = useMemo(() => {
    if (result) {
      const winner = result.winners.find(winner => winner.id === userDetails?.id);

      const totalWinnings = winner ? winner.winningAmount : 0;
      return {
        totalBetAmount: lobby.amount.toFixed(2),
        totalWinnings: totalWinnings.toFixed(2),
        profit: (totalWinnings - lobby.amount).toFixed(2)
      };
    }
    return null;
  }, [result, userDetails]);

  useEffect(() => {
    if (open) {
      setShowDialog(open);
    }
  }, [open]);

  const playAgain = () => { 
    setShowDialog(false);
    router.push(`/game/lobby/${lobby.joiningCode}`);
  };


  // Check if the result is a win or loss
  const isWin = resultData && Number(resultData.profit) >= 0;

  return (
    <Dialog open={showDialog}>
      <DialogContent className="sm:max-w-md bg-primary-game text-white [&>.close-button]:hidden" data-hide-children="true">
        <DialogHeader>
          <DialogTitle>Round Results</DialogTitle>
        </DialogHeader>

        <div className="py-4">
          {resultData == null ? (
            <div className="flex flex-col items-center justify-center p-8 space-y-4">
              <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
              <p className="text-gray-600">Loading results...</p>
              <button className="bet-button w-full" onClick={playAgain}>
                Play Again
              </button>
            </div>
          ) : (
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

              {/* Display result data */}
              <div className="space-y-4">
                <div className="text-center  flex justify-between  rounded-lg">
                  <p className="">Total Bet Amount</p>
                  <p className="text-xl ">₹{resultData.totalBetAmount}</p>
                </div>
                <div className="text-center  flex justify-between rounded-lg">
                  <p className="">Total Winnings</p>
                  <p className="text-xl ">₹{resultData.totalWinnings}</p>
                </div>
                <div className="text-center flex justify-between  rounded-lg">
                  <p className="">Profit/Loss</p>
                  <p className={`text-xl  ${isWin ? 'text-green-600' : 'text-red-600'}`}>
                    ₹{resultData.profit}
                  </p>
                </div>
              </div>

              <button className="bet-button w-full" onClick={playAgain}>
                Play Again
              </button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default LobbyGameResultDialog;
