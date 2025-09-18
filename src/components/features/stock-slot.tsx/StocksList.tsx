import { getStockName } from "@/components/common/StockName";
import React from "react";

// Helper function to highlight the first decimal digit with yellow color
const formatPriceWithHighlightedDecimal = (price: string) => {
  const decimalIndex = price.indexOf(".");
  if (decimalIndex === -1 || decimalIndex === price.length - 1) return price;

  const beforeDecimal = price.substring(0, decimalIndex + 1); // includes the decimal point
  const firstDecimalDigit = price.charAt(decimalIndex + 1);

  return (
    <>
      {beforeDecimal}
      <span className="text-white z-20 relative">{firstDecimalDigit}</span>
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
    <div className="lg:hidden flex justify-center items-start relative w-full text-xs">
      <div className=" grid grid-cols-5 items-center justify-center w-full z-40">
        {currentStocks?.slice(0, 5).map((stock, index) => {
          const price = parseFloat(
            stockPrice[stock.code ?? ""]?.toString() || "0"
          ).toFixed(2);
          const stockName = getStockName(
            stock.name ?? "",
            stock.codeName ?? ""
          );

          return (
            <div
              key={stock.code || index}
              style={{
                backgroundImage: "url('https://res.cloudinary.com/dt8iv1hds/image/upload/v1758179649/stock-list_n70yra.png')",
                backgroundSize: "contain",
                backgroundPosition: "center center",
                backgroundRepeat: "no-repeat",
              }}
              className="text-center w-full h-full p-[20%] flex justify-center items-center"
            >
              <div className="flex flex-col justify-center items-center w-full h-fit -translate-y-[10%]">
              <div className="relative">
                <p
                  style={{
                    textShadow: "0 0 7px black",
                  }}
                  className="absolute top-0 left-0 z-10 text-white text-xs"
                >
                  {stockName}
                </p>{" "}
                <p className="slot-gradient-text z-20 relative text-xs">
                  {stockName}
                </p>{" "}
              </div>
              <div className="relative">
                <p
                  style={{
                    textShadow: "0 0 7px black",
                  }}
                  className="absolute top-0 left-0 z-10 text-white text-[8px]"
                >
                  {formatPriceWithHighlightedDecimal(price)}
                </p>
                <p className="slot-gradient-text z-20 relative text-[8px]">
                  {formatPriceWithHighlightedDecimal(price)}
                </p>
              </div>
              </div>
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
    <div className="hidden lg:flex flex-col items-center text-xl h-full w-fit">
      {currentStocks?.slice(0, 5).map((stock, index) => {
        const price = parseFloat(
          stockPrice[stock.code ?? ""]?.toString() || "0"
        ).toFixed(2);

        return (
          <div
            key={stock.code || index}
            style={{
              backgroundImage: "url('https://res.cloudinary.com/dt8iv1hds/image/upload/v1758179649/stock-list_n70yra.png')",
              backgroundSize: "contain",
              backgroundPosition: "center center",
              backgroundRepeat: "no-repeat",
            }}
            className="text-center px-5 h-full truncate flex justify-center items-center w-full"
          >
            <div className="flex flex-col justify-center items-center w-full h-fit -translate-y-[10%] text-xl">
              <div className="relative">
                <p
                  style={{
                    textShadow: "0 0 7px black",
                  }}
                  className="absolute top-0 left-0 z-10 text-white truncate"
                >
                  {getStockName(stock.name ?? "", stock.codeName ?? "")}
                </p>{" "}
                <p className="slot-gradient-text z-20 relative truncate">
                  {getStockName(stock.name ?? "", stock.codeName ?? "")}
                </p>{" "}
              </div>
              <div className="relative">
                <p
                  style={{
                    textShadow: "0 0 7px black",
                  }}
                  className="absolute top-0 left-0 z-10 text-white"
                >
                  {formatPriceWithHighlightedDecimal(price)}
                </p>
                <p className="slot-gradient-text z-20 relative">
                  {formatPriceWithHighlightedDecimal(price)}
                </p>
              </div>
            </div>
          </div>
        );
      })}

      {/* Fill remaining slots if less than 5 stocks */}
      {[...Array(Math.max(0, 5 - currentStocks?.length))].map((_, index) => (
        <div
          key={`placeholder-${index}`}
          style={{
            backgroundImage: "url('https://res.cloudinary.com/dt8iv1hds/image/upload/v1758179649/stock-list_n70yra.png')",
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
  );
};
