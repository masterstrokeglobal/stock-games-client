"use client";
import GameLoadingScreen from "@/components/common/game-loading-screen";
import MarketSelector from "@/components/common/market-selector";
import Aviator from "@/components/features/aviator-new/aviator";
import Navbar from "@/components/features/game/navbar";
import { useCurrentGame } from "@/hooks/use-current-game";
import {
  useMarketSelector,
  useStockSelectorAviator,
} from "@/hooks/use-market-selector";
import { MarketItem } from "@/models/market-item";
import { RoundRecordGameType } from "@/models/round-record";
import { useAviatorToken } from "@/react-query/aviator-queries";
import { useEffect, useMemo } from "react";

const AviatorPage = () => {
  const { marketSelected } = useMarketSelector();
  const { stockSelectedAviator, setStockSelectedAviator } =
    useStockSelectorAviator();
  const { roundRecord, isLoading } = useCurrentGame(
    RoundRecordGameType.AVIATOR
  );
  const { isLoading: isTokenLoading, data: token } = useAviatorToken();

  const isStockPresent = useMemo(() => {
    const isStockPresent =
      roundRecord?.market.some(
        (item: MarketItem) => item.id == Number(stockSelectedAviator)
      ) ?? false;
    return isStockPresent;
  }, [roundRecord, stockSelectedAviator]);

  // Automatically select the first stock when market is available and ensure current selection is valid
  useEffect(() => {
    if (marketSelected && roundRecord && roundRecord.market.length > 0) {
      const currentStockId = Number(stockSelectedAviator);
      const isCurrentStockValid = roundRecord.market.some(
        (item: MarketItem) => item.id === currentStockId
      );

      // If no stock is selected or current selection is invalid, select the first available stock
      if (!stockSelectedAviator || !isCurrentStockValid) {
        const firstStock = roundRecord.market[0];
        if (firstStock.id) {
          setStockSelectedAviator(firstStock.id.toString());
        }
      }
    } else if (
      marketSelected &&
      roundRecord &&
      roundRecord.market.length === 0
    ) {
      // Clear selection if market becomes empty
      setStockSelectedAviator(null);
    }
  }, [
    marketSelected,
    roundRecord,
    stockSelectedAviator,
    setStockSelectedAviator,
  ]);

  if (!marketSelected)
    return (
      <section className=" space-y-4 pt-14 min-h-screen ">
        <Navbar />
        <MarketSelector
          variant="aviator"
          className="min-h-[calc(100svh-100px)] max-w-2xl mx-auto"
          title="Avaiator"
        />
      </section>
    );

  if (isLoading || !roundRecord || isTokenLoading || token == null)
    return <GameLoadingScreen className="min-h-[calc(100svh-100px)]" />;

  if (stockSelectedAviator !== null || isStockPresent)
    return (
      <section className="flex flex-col h-screen w-full pt-14">
        <Navbar />
        <Aviator
          className=""
          roundRecord={roundRecord}
          token={token}
        />
      </section>
    );

  return <></>;
};

export default AviatorPage;
