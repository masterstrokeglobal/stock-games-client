import React, { useMemo } from 'react';
import { useGameStore } from "@/store/game-store";
import { useStockBettingStore } from '@/store/betting-store';
import { useCreateMiniMutualFundPlacementBet } from '@/react-query/game-record-queries';
import { useGetMiniMutualFundCurrentUserPlacements } from '@/react-query/lobby-query';
import { useGameState, useIsPlaceOver } from '@/hooks/use-current-game';
import MiniMutualFundPlacement from '@/models/mini-mutual-fund';
import MarketItem from '@/models/market-item';
import { CurrentGameState } from './contants';
import { cn } from '@/lib/utils';

const StockSelectionGrid: React.FC = () => {
  const { lobbyRound } = useGameStore();
  const isPlaceOver = useIsPlaceOver(lobbyRound?.roundRecord ?? null);
  const gameState = useGameState(lobbyRound?.roundRecord ?? null);


  const { mutate } = useCreateMiniMutualFundPlacementBet();
  const { data, isSuccess } = useGetMiniMutualFundCurrentUserPlacements(lobbyRound?.id);

  const placements = useMemo<MiniMutualFundPlacement[]>(() => {
    return isSuccess ? data.placements : [];
  }, [isSuccess, data]);

  const moneyLeft = useMemo(() => {
    return isSuccess ? data?.totalMoneyLeft : "-";
  }, [isSuccess,data?.totalMoneyLeft,]);


  const { betAmount, setIsLoading } = useStockBettingStore();
  const marketItems = lobbyRound?.roundRecord?.market ?? [];

  // Calculate total bets for a specific market item
  const calculateTotalBetsForMarket = (marketItemId: number): number => {
    return placements
      .filter(placement => placement.marketItem?.id === marketItemId)
      .reduce((total, placement) => total + (placement.amount ?? 0), 0);
  };

  // Handle bet placement
  const handlePlaceBet = (stock: MarketItem): void => {
    if (!stock || isPlaceOver) return;

    setIsLoading(true);
    mutate(
      {
        marketItemId: stock.id,
        lobbyRoundId: lobbyRound!.id,
        amount: betAmount,
      },
      {
        onSuccess: () => {
          setIsLoading(false);
        },
        onError: () => {
          setIsLoading(false);
        }
      }
    );
  };

  // Render guard
  if (!lobbyRound?.roundRecord) return null;

  return (
    <div className="w-full mb-6">
      <GameHeader gameState={gameState} moneyLeft={moneyLeft} className='lg:flex items-center px-4 justify-between lg:flex-row' />

      <div className="grid grid-cols-4 gap-4 p-4">
        {marketItems.map((stock) => (
          <div
            key={stock.id}
            onClick={() => handlePlaceBet(stock)}
            className={`
            relative flex flex-col items-center justify-center 
            w-full h-12 bg-[#1A2D58] p-3 rounded-lg 
            cursor-pointer transition-all 
            ${isPlaceOver ? 'opacity-70 cursor-not-allowed' : ''}
          `}
          >
            <div className="text-white font-bold">{stock.name}</div>
            <div className="text-sm text-gray-300">{stock.code}</div>

            {/* Total Bets Coin */}
            <div
              className="
              absolute top-1/2 right-2  -translate-y-1/2
              w-8 h-8 rounded-full 
              bg-red-600 text-white 
              flex items-center justify-center 
              text-xs font-bold
            "
            >
              {stock.id && calculateTotalBetsForMarket(stock.id)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StockSelectionGrid;


interface GameHeaderProps {
  gameState: CurrentGameState;
  className?: string;
  moneyLeft: string;
}


export const GameHeader: React.FC<GameHeaderProps> = ({ gameState, moneyLeft, className }) => {
  const getMessage = () => {
    if (gameState.isGameOver) {
      return "Game Over";
    }
    return gameState.isPlaceOver ? "Game ends in" : "Round starts in";
  };

  const getTime = () => {
    if (gameState.isGameOver) {
      return "00:00";
    }
    return gameState.isPlaceOver
      ? gameState.gameTimeLeft.formatted
      : gameState.placeTimeLeft.formatted;
  };

  return (
    <header className={cn(' hidden lg:block my-2 text-white', className)}>
      <div>
        <h2 className="text-lg font-semibold text-gray-">
          {getMessage()}
        </h2>
        <p className="font-semibold text-gray-">
          Money Left:  Rs.{moneyLeft}
        </p>
      </div>

      <p className='text-7xl jersey leading-[5rem]'>
        {getTime()}
      </p>
    </header>
  );
};