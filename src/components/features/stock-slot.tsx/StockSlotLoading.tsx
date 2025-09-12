import useWindowSize from "@/hooks/use-window-size";
import Image from "next/image";
import React from "react";

const StockSlotLoading = ({
  percentageLoaded,
}: {
  percentageLoaded: number;
}) => {
  const {isMobile} = useWindowSize()
  return (
    <>
      <div
        style={{
          backgroundImage: "url('/images/slot-machine/stock-slot-bg.png')",
          backgroundSize: "100% 100%",
          backgroundPosition: "center center",
          backgroundRepeat: "no-repeat",
        }}
        className="flex flex-col h-screen w-full justify-center items-center"
      >
        <div className="flex flex-col items-center justify-center w-full">
          <Image
            src="/images/slot-machine/heading.png"
            alt="stock-slot-bg"
            width={ isMobile ? 233 : 388}
            height={ isMobile ? 50 : 85}
          />
          <div className="md:w-1/2 max-w-sm mt-4">
            <div className="w-full h-3 bg-transparent rounded-full overflow-hidden border-2 border-blue-400">
              <div
                className="h-full bg-gradient-to-r from-white rounded-full to-blue-300 transition-all duration-300"
                style={{ width: `${percentageLoaded}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default StockSlotLoading;
