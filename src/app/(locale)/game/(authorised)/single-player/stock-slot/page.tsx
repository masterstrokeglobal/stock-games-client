"use client";
import Navbar from "@/components/features/game/navbar";
// import GameLoadingScreen from "@/components/common/game-loading-screen";
import StockSlotLoading from "@/components/features/stock-slot.tsx/StockSlotLoading";
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
  
  // Add component loading state
  const [isComponentLoaded, setIsComponentLoaded] = useState(false);
  const [assetsLoaded, setAssetsLoaded] = useState(false);
  const [percentageLoaded, setPercentageLoaded] = useState(20);

  const winningIdRoundRecord = useWinningId(roundRecord);
  const { gameTimeLeft, isPlaceOver } = useGameState(roundRecord);
  const { stocks } = useLeaderboard(roundRecord || null);

  // Determine if game is active (during betting or game phase)
  const isGameActive = useMemo(() => {
    return !isPlaceOver || gameTimeLeft.raw > 0;
  }, [isPlaceOver, gameTimeLeft]);

  const { currentStocks, stockPrice } = useMemo(() => {
    if (!roundRecord) return { currentStocks: [], stockPrice: {} };

    const currentStocks = roundRecord.market.sort(
      (a, b) => a.name?.localeCompare(b.name ?? "") ?? 0
    );
    let stockPrice: Record<string, number> = roundRecord.initialValues ?? {};

    if (
      roundRecord.initialValues &&
      Object.keys(roundRecord.initialValues).length > 0
    ) {
      stockPrice = roundRecord.initialValues;
    }

    if (stocks.length > 0 && !winningIdRoundRecord?.finalPricesPresent) {
      stocks.forEach((stock) => {
        if (stock.price) {
          stockPrice[stock.code ?? ""] = stock.price;
        }
      });
    } else if (
      winningIdRoundRecord?.finalPricesPresent &&
      winningIdRoundRecord?.finalDifferences
    ) {
      stockPrice = winningIdRoundRecord.finalDifferences;
    }

    return { currentStocks, stockPrice };
  }, [roundRecord, stocks, winningIdRoundRecord]);

  // Preload critical assets
  useEffect(() => {
    const imagesToPreload = [
      '/images/slot-machine/stock-slot-bg.png',
      '/images/slot-machine/menu-bg.png',
      '/images/slot-machine/menu-btn.png',
      '/images/slot-machine/btn-audio.png',
      '/images/slot-machine/i-btn.png',
      '/images/slot-machine/btn-pause.png',
      '/images/slot-machine/menu-item-bg-1.png',
      '/images/slot-machine/menu-item-bg-2.png',
    ];

    let loadedCount = 0;
    const totalImages = imagesToPreload.length;

    const imagePromises = imagesToPreload.map((src) => {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => {
          loadedCount++;
          setPercentageLoaded((loadedCount / totalImages) * 100);
          resolve(src);
        };
        img.onerror = reject;
        img.src = src;
      });
    });

    Promise.allSettled(imagePromises).then(() => {
      setAssetsLoaded(true);
    });
  }, []);

  // Component initialization delay 
  useEffect(() => {
    if (roundRecord && !isLoading) {
      const timer = setTimeout(() => {
        setIsComponentLoaded(true);
      }, 200); 

      return () => clearTimeout(timer);
    }
  }, [roundRecord, isLoading]);


  const isFullyLoaded = !isLoading && roundRecord && isComponentLoaded && assetsLoaded;

  if (!marketSelected)
    return (
      <MarketSelector
        className="min-h-[calc(100svh)]mx-auto"
        title="Stock Slot Market"
      />
    );


  if (!isFullyLoaded)
    return <StockSlotLoading percentageLoaded={percentageLoaded} />;

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
        isGameActive={isGameActive}
        currentStocks={currentStocks}
        stockPrice={stockPrice}
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
