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
            src="/images/slot-machine/loading-screen.png"
            alt="stock-slot-bg"
            width={ isMobile ? 100 : 150}
            height={ isMobile ? 100 : 150}
          />
          <div className="md:w-1/2 max-w-sm">
            <div className="w-full h-3 bg-[#934B0180] rounded-full overflow-hidden border border-[#592800]">
              <div
                className="h-full bg-gradient-to-r from-[#883C06] rounded-full to-[#381904] transition-all duration-300"
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
