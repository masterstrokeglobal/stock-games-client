"use client";
import { useLeaderboard } from "@/hooks/use-leadboard";
import MarketItem from "@/models/market-item";
import { RoundRecord } from "@/models/round-record";
import { useMemo } from "react";

interface BettingAreaProps {
  roundRecord: RoundRecord;
  winningIdRoundRecord: RoundRecord | null;
}

export const StocksList: React.FC<BettingAreaProps> = ({
  winningIdRoundRecord,
  roundRecord,
}) => {

  const { stocks } = useLeaderboard(roundRecord);

  const { currentStocks, stockPrice } = useMemo(() => {
    const currentStocks: MarketItem[] = roundRecord.market.sort(
      (a, b) => a.name?.localeCompare(b.name ?? "") ?? 0
    );
    let stockPrice: Record<string, number> = roundRecord.initialValues ?? {};

    if (roundRecord) {
      if (
        roundRecord.initialValues &&
        Object.keys(roundRecord.initialValues).length > 0
      ) {
        stockPrice = roundRecord.initialValues;
      }
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


  return (
    <>
      <div className="flex md:hidden items-start justify-center md:gap-4 mb-4 w-full px-2">
        {currentStocks.length > 0 &&
          currentStocks.map((stock) => (
            <div
              key={stock.code}
              className="flex flex-col flex-1 items-center justify-center gap-1 sm:gap-2 bg-[#1B1B1B] border-x-2 border-b-2 border-[#E3B872] px-1 sm:px-2 py-1 rounded-b-md"
            >
              <div className="flex items-center gap-1 sm:gap-2 justify-center whitespace-nowrap w-full">
                <span className="text-gray-300 text-xs sm:text-sm uppercase">{stock.code?.slice(0, stock.code?.length - 4)}</span>
              </div>
              <div className="text-gray-400 text-xs sm:text-sm">
                {(() => {
                  const price = parseFloat(
                    stockPrice[stock.code ?? ""]?.toString() || "0"
                  ).toFixed(2);
                  const lastDigit = price.slice(-2, -1);
                  const restOfPrice = price.slice(0, -2);
                  return (
                    <>
                      {restOfPrice}
                      <span className="text-yellow-400 font-bold ml-1">
                        {lastDigit}
                      </span>
                    </>
                  );
                })()}
              </div>
            </div>
          ))}
      </div>
    </>
  );
};
