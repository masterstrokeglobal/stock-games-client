import React from "react";
import InfoDialog from "./dialogs/InfoDialog";

// Helper function to highlight the first decimal digit with yellow color
const formatPriceWithHighlightedDecimal = (price: string) => {
  const decimalIndex = price.indexOf(".");
  if (decimalIndex === -1 || decimalIndex === price.length - 1) return price;

  const beforeDecimal = price.substring(0, decimalIndex + 1); // includes the decimal point
  const firstDecimalDigit = price.charAt(decimalIndex + 1);

  return (
    <>
      {beforeDecimal}
      <span style={{ color: "yellow" }}>{firstDecimalDigit}</span>
    </>
  );
};

interface StockListProps {
  currentStocks: any[];
  stockPrice: any;
}

export const StockListMobile: React.FC<StockListProps> = ({
  currentStocks,
  stockPrice,
}) => {
  return (
    <div className="lg:hidden flex justify-center items-start relative z-[80] mb-4 w-full text-xs">
      <div
        style={{
          backgroundImage: "url('/images/slot-machine/pole-mobile.png')",
          backgroundSize: "100% 100%",
          backgroundPosition: "center center",
          backgroundRepeat: "no-repeat",
        }}
        className="w-full h-10 absolute top-0 left-0 -translate-y-1/2"
      ></div>
      <div className=" grid grid-cols-5 items-center justify-center gap-2 w-full z-40">
        {currentStocks?.slice(0, 5).map((stock, index) => {
          const price = parseFloat(
            stockPrice[stock.code ?? ""]?.toString() || "0"
          ).toFixed(2);
          const stockName = stock.name || `Stock ${index + 1}`;

          return (
            <div
              key={stock.code || index}
              style={{
                backgroundImage: "url('/images/slot-machine/stock-list.png')",
                backgroundSize: "100% 100%",
                backgroundPosition: "center center",
                backgroundRepeat: "no-repeat",
              }}
              className="text-center w-full px-3 py-5 flex flex-col justify-center items-center"
            >
              <div className="truncate w-full">{stockName}</div>
              <div>{formatPriceWithHighlightedDecimal(price)}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export const StockListDesktop: React.FC<StockListProps> = ({
  currentStocks,
  stockPrice,
}) => {
  return (
    <div className="hidden lg:flex lg:col-span-2 justify-center items-start relative text-xl">
      <div className="flex justify-center items-center absolute right-0">
        <InfoDialog>
          <button className="w-10 h-10">
            <img
              className="w-full h-full "
              src="/images/slot-machine/i-btn.png"
              alt=""
            />
          </button>
        </InfoDialog>
      </div>

      <div className="mt-[70px] flex flex-col items-center justify-center gap-3 w-full z-40">
        {currentStocks?.slice(0, 5).map((stock, index) => {
          const price = parseFloat(
            stockPrice[stock.code ?? ""]?.toString() || "0"
          ).toFixed(2);

          const stockName = stock.name || `Stock ${index + 1}`;

          return (
            <div
              key={stock.code || index}
              style={{
                backgroundImage: "url('/images/slot-machine/stock-list.png')",
                backgroundSize: "100% 100%",
                backgroundPosition: "center center",
                backgroundRepeat: "no-repeat",
              }}
              className="text-center w-full px-5 py-3 truncate"
            >
              {stockName} <br /> {formatPriceWithHighlightedDecimal(price)}
            </div>
          );
        })}

        {/* Fill remaining slots if less than 5 stocks */}
        {[...Array(Math.max(0, 5 - currentStocks?.length))].map((_, index) => (
          <div
            key={`placeholder-${index}`}
            style={{
              backgroundImage: "url('/images/slot-machine/stock-list.png')",
              backgroundSize: "100% 100%",
              backgroundPosition: "center center",
              backgroundRepeat: "no-repeat",
            }}
            className="text-center w-full px-5 py-3"
          >
            Loading...
          </div>
        ))}
      </div>
      <div
        style={{
          backgroundImage: "url('/images/slot-machine/stock-list-pole.png')",
          backgroundSize: "100% 100%",
          backgroundPosition: "center center",
          backgroundRepeat: "no-repeat",
        }}
        className="absolute h-full w-8 bottom-0 z-30"
      ></div>
    </div>
  );
};
