import { useLeaderboard } from "@/hooks/use-leadboard";
import { cn } from "@/lib/utils";
import { RoundRecord } from "@/models/round-record";
import { useMemo, memo } from "react";

interface StockPriceProps {
  rankedMarketItem: any;
}

export const StockPrice: React.FC<StockPriceProps> = ({
  rankedMarketItem,
}) => {
  if (!rankedMarketItem) {
    return <div>Loading...</div>;
  }

  // Winning = green, else red
  const containerClass =
    "rounded-[6px] border border-[rgb(108,220,251)] bg-[#001A5F] shadow-[0_0_6.5px_2px_rgba(122,179,255)_inset]";

  return (
    <div
      className={cn(
        containerClass,
        "flex flex-col xl:min-w-[160px] min-w-[100px] px-4 py-2 justify-between items-start gap-1"
      )}
    >
      <div className="flex flex-row w-full justify-between items-center">
        {/* Stock Name with special style */}
        <span
          className={cn(
            "font-semibold sm:text-[12px] w-12 truncate text-[6px] leading-none font-protest-strike py-1 rounded-[2px]",
            ""
          )}
          style={{
            display: "inline-block",
            letterSpacing: "0.01em",
            // color: winning ? "#BDFFDD" : "#FFC3CC",
          }}
        >
          {rankedMarketItem.name}
        </span>
        <span className="text-white text-[6px] sm:text-[8px] font-normal leading-none">
          Current Price:
        </span>
      </div>

      <div className="flex flex-row w-full gap-2 justify-between items-center">
        <span className="text-white text-[6px] sm:text-[8px] font-normal leading-none">
          Price: <span className="ml-1">{rankedMarketItem.initialPrice}</span>
        </span>
        <span className="text-white text-[6px] sm:text-[8px] font-normal leading-none">
          {rankedMarketItem.price}
        </span>
      </div>
    </div>
  );
};

const PriceDisplay = ({
  roundRecord,
  roundRecordWithWinningSide,
}: {
  roundRecord: RoundRecord;
  roundRecordWithWinningSide: RoundRecord | null;
}) => {
  // const winningSide = roundRecordWithWinningSide?.winningSide ?? null;
  const { stocks } = useLeaderboard(roundRecord);

  console.log(stocks[0].price, stocks[0].initialPrice , stocks[1].price, stocks[1].initialPrice);

  // Memoize stock calculations to prevent unnecessary re-renders
  const headStock = useMemo(
    () =>
      roundRecordWithWinningSide?.finalPricesPresent
        ? roundRecordWithWinningSide.sortedMarketItems?.find(
            (item) => item.id === roundRecord.coinTossPair?.head?.id
          )
        : stocks.find((item) => item.id === roundRecord.coinTossPair?.head?.id),
    [stocks, roundRecord.coinTossPair?.head?.id, roundRecordWithWinningSide?.finalPricesPresent, roundRecordWithWinningSide?.sortedMarketItems]
  );
  
  const tailStock = useMemo(
    () =>
      roundRecordWithWinningSide?.finalPricesPresent
        ? roundRecordWithWinningSide.sortedMarketItems?.find(
            (item) => item.id === roundRecord.coinTossPair?.tail?.id
          )
        : stocks.find((item) => item.id === roundRecord.coinTossPair?.tail?.id),
    [stocks, roundRecord.coinTossPair?.tail?.id, roundRecordWithWinningSide?.finalPricesPresent, roundRecordWithWinningSide?.sortedMarketItems]
  );

  return (
    <div className="flex flex-row gap-4">
      <StockPrice
        rankedMarketItem={headStock}
      />
      <StockPrice
        rankedMarketItem={tailStock}
      />
    </div>
  );
};

export const LiveBadge = ({ className }: { className?: string }) => {
  return (
    <div
      className={cn(
        "flex items-center gap-1 sm:gap-2 h-fit px-2 sm:px-3 py-1 sm:py-2 rounded-lg bg-[#D32D2F] w-fit animate-fade-in",
        className
      )}
      style={{
        boxShadow: "0 2px 8px rgba(211,45,47,0.15)",
      }}
    >
      <span
        className="inline-block w-1.5 sm:w-2 h-1.5 sm:h-2 rounded-full mr-0.5 sm:mr-1 bg-white animate-blink"
        style={{
          boxShadow: "0 0 0 2px #fff, 0 0 8px 2px #fff8",
        }}
      />

      <span
        className="text-white font-bold tracking-widest text-xs sm:text-base font-sans select-none"
        style={{ letterSpacing: "0.08em" }}
      >
        LIVE
      </span>
      <style jsx>{`
        @keyframes blink {
          0%,
          100% {
            opacity: 1;
          }
          50% {
            opacity: 0.3;
          }
        }
        .animate-blink {
          animation: blink 1s infinite;
        }
      `}</style>
    </div>
  );
};

export default memo(PriceDisplay);
