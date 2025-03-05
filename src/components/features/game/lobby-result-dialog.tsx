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
  amount: number;
}

// Main interface for the entire data structure
export interface LobbyResult {
  priceDifferences: PriceDifference[];
  winners: Winner[];
  count: number;
  winningItems?: PriceDifference[];
}

interface GameResultDialogProps {
  open: boolean;
  result: LobbyResult;
  lobby: Lobby;
  filteredMarket?: MarketItem[];
}

const LobbyGameResultDialog = ({ open, result, lobby }: GameResultDialogProps) => {
  const [showDialog, setShowDialog] = useState(open);
  const router = useRouter();
  const { userDetails } = useAuthStore();

  console.log(result);
  const resultData = useMemo(() => {
    if (result) {
      const winner = result.winners.find(winner => winner.id === userDetails?.id);
      const totalWinnings = winner ? winner.amount : 0;
      return {
        totalBetAmount: lobby.amount.toFixed(2),
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
            </div>
          ) : (
            <div className="space-y-4">
              <div className="space-y-4 mb-4">
                <Image
                  src={isWin ? '/won.png' : '/lost.png'}
                  alt={isWin ? 'You Won!' : 'Better Luck Next Time'}
                  width={100}
                  height={100}
                  className="rounded-full w-32 mx-auto"
                />
                <p className={cn("text-2xl font-bold text-center",
                  isWin ? 'text-yellow-600' : 'text-gray-100'
                )}>
                  {isWin ? 'Congratulations! You won!' : 'Better luck next time!'}
                </p>
              </div>

            

              {/* All Players Results */}
              <div className="space-y-2">
                <h3 className="text-lg font-semibold text-left mb-2">All Players</h3>
                <div className="max-h-40 overflow-y-auto">
                  {result.winners.map((winner) => (
                    <div 
                      key={winner.id}
                      className={cn(
                        "p-2 rounded-lg mb-2",
                        winner.id === userDetails?.id ? "bg-blue-900/30 border-yellow-400 border" : "bg-gray-800/30"
                      )}
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="font-medium text-sm">{winner.username}</p>
                          <p className="text-sm text-gray-400">{winner.firstname} {winner.lastname}</p>
                        </div>
                        <p className={cn(
                          "font-semibold",
                          winner.amount > 0 ? "text-green-500" : "text-red-500"
                        )}>
                          ₹{winner.amount.toFixed(2)}
                        </p>
                      </div>
                    </div>
                  ))}
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