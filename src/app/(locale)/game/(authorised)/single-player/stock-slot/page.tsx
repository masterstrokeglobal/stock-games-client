"use client";
import Navbar from "@/components/features/game/navbar";
import GameLoadingScreen from "@/components/common/game-loading-screen";
import MarketSelector from "@/components/common/market-selector";
import { useCurrentGame } from "@/hooks/use-current-game";
import { useMarketSelector } from "@/hooks/use-market-selector";
import { useGameState } from "@/hooks/use-current-game";
import { useLeaderboard } from "@/hooks/use-leadboard";
import useWinningId from "@/hooks/use-winning-id";
import { RoundRecordGameType } from "@/models/round-record";
import { useState, useEffect, useMemo } from "react";
import StockSlot from "@/components/features/stock-slot.tsx/slot";

const Page = () => {
  const { marketSelected } = useMarketSelector();
  const { roundRecord, isLoading } = useCurrentGame(
    RoundRecordGameType.STOCK_JACKPOT
  );

  const [betAmount, setBetAmount] = useState<number>(100);
  const [stockStates, setStockStates] = useState<number[]>([0, 0, 0, 0, 0, 0]);

  const winningIdRoundRecord = useWinningId(roundRecord);
  const { gameTimeLeft, isPlaceOver } = useGameState(roundRecord);
  const { stocks } = useLeaderboard(roundRecord);

  // Determine if game is active (during betting or game phase)
  const isGameActive = useMemo(() => {
    return !isPlaceOver || gameTimeLeft.raw > 0;
  }, [isPlaceOver, gameTimeLeft]);

  // Calculate stock states from stock prices (same logic as platform version)
  useEffect(() => {
    if (stocks.length > 0) {
      const newStockStates: number[] = [...stockStates];

      let localStocks: any = winningIdRoundRecord?.sortedMarketItems ? winningIdRoundRecord.sortedMarketItems : stocks;
      localStocks = localStocks.sort((a: any, b: any) => a.name.localeCompare(b.name));

      // Handle first 5 columns (stock prices)
      localStocks.slice(0, 5).forEach((stock: any, index: any) => {
        if (stock.price) {
          const price = parseFloat(stock.price).toFixed(2);
          const [, decimalPart] = price.split('.');
          const firstDecimalDigit = decimalPart ? parseInt(decimalPart[0]) : 0;
          newStockStates[index] = firstDecimalDigit;
        }
      });

      // Handle 6th column (bonus symbol logic) - multipliers only 0-4
      const num: number = Number((winningIdRoundRecord?.bonusSymbol || "0X")[0]) || 0;

      if (winningIdRoundRecord?.bonusMultiplier) {
        newStockStates[5] = Math.min(num, 4); // Ensure it's max 4
      } 
      // else {
      //   newStockStates[5] = Math.floor(Math.random() * 5); // Only 0-4 for multipliers
      // }

      setStockStates(newStockStates);
    }
  }, [stocks, winningIdRoundRecord]);

  if (!marketSelected)
    return (
      <MarketSelector
        className="min-h-[calc(100svh-100px)] max-w-2xl mx-auto"
        title="Stock Slot Market"
      />
    );

  if (isLoading || !roundRecord)
    return <GameLoadingScreen className="min-h-[calc(100svh-100px)]" />;

  return (
    <section
      style={{
        backgroundImage: "url('/images/slot-machine/stock-slot-bg.png')",
        backgroundSize: "100% 100%",
        backgroundPosition: "center center",
        backgroundRepeat: "no-repeat",
      }}
      className="flex flex-col h-screen w-full pt-14"
    >
      <Navbar />
      <StockSlot 
        stockStates={stockStates}
        isGameActive={isGameActive}
        winningIdRoundRecord={winningIdRoundRecord}
        isPlaceOver={isPlaceOver}
        betAmount={betAmount}
        setBetAmount={setBetAmount}
        roundRecord={roundRecord}
      />
    </section>
  );
};

export default Page;
