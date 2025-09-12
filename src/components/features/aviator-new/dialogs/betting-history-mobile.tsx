import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import React, { useState, useRef, useEffect } from "react";

const steps = [
  {
    date: "2025-01-01",
    time: "12:00",
    selectedPlane: "Plane 1",
    cashoutAt: "12:00",
    profitLoss: "100",
  },
  {
    date: "2025-01-01",
    time: "12:00",
    selectedPlane: "Plane 1",
    cashoutAt: "12:00",
    profitLoss: "100",
  },
  {
    date: "2025-01-01",
    time: "12:00",
    selectedPlane: "Plane 1",
    cashoutAt: "12:00",
    profitLoss: "100",
  },
  {
    date: "2025-01-01",
    time: "12:00",
    selectedPlane: "Plane 1",
    cashoutAt: "12:00",
    profitLoss: "100",
  },
  {
    date: "2025-01-01",
    time: "12:00",
    selectedPlane: "Plane 1",
    cashoutAt: "12:00",
    profitLoss: "100",
  },
  {
    date: "2025-01-01",
    time: "12:00",
    selectedPlane: "Plane 1",
    cashoutAt: "12:00",
    profitLoss: "100",
  },
];

interface BettingHistoryDialogMobileProps {
  itemsPerPage?: number;
  children: React.ReactNode;
}

const BettingHistoryDialogMobile = ({
  itemsPerPage = 3,
  children,
}: BettingHistoryDialogMobileProps) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [imageHeight, setImageHeight] = useState(400);
  const dialogRef = useRef<HTMLImageElement>(null);
  const [isOpen, setIsOpen] = useState(false);

  // Update div height to match image height
  useEffect(() => {
    const updateHeight = () => {
      if (dialogRef.current) {
        const height = dialogRef.current.offsetHeight;
        setImageHeight(height);
      }
    };

    if (isOpen) {
      // Small delay to ensure image is loaded
      const timer = setTimeout(updateHeight, 100);

      // Add resize event listener
      window.addEventListener("resize", updateHeight);

      return () => {
        clearTimeout(timer);
        window.removeEventListener("resize", updateHeight);
      };
    }
  }, [isOpen]);

  // Calculate pagination
  const totalPages = Math.ceil(steps.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentSteps = steps.slice(startIndex, endIndex);

  // Navigation handlers
  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger>{children}</DialogTrigger>
      <DialogContent
        showButton={false}
        className="bg-transparent border-none w-full max-w-2xl p-3"
      >
        <div className="flex flex-col gap-4 relative z-10 items-center justify-center w-full">
          <img
            ref={dialogRef}
            src="/images/aviator/dialogs/bettingHistoryMobile.png"
            alt="menu"
            className="w-full h-full min-w-[320px] min-h-[400px] max-w-[450px] max-h-[500px] relative z-10"
          />
          <div
            className="flex gap-[10px] absolute z-20 w-full justify-center p-[5%] font-quantico"
            style={{
              height: `${imageHeight}px`,
              maxWidth: "450px",
              maxHeight: "500px",
            }}
          >
            <div className="flex flex-col gap-4 relative z-20 px-5 mt-[7%] w-full">
              <h1 className="capitalize text-xs md:text-base xl:text-[20px] text-center">
                Betting history
              </h1>
              <div className="flex flex-col gap-3 max-h-[200px] overflow-y-auto ">
                <div className="grid grid-cols-6 gap-1 bg-[#99B2FF33] rounded-[15px] px-2 py-1 text-xs md:text-sm xl:text-[20px]">
                  <h5 className="truncate text-left">Date</h5>
                  <h5 className="truncate text-center">Time</h5>
                  <h5 className="truncate col-span-2 text-center">
                    Selected Plane
                  </h5>
                  <h5 className="truncate text-center">Cashout At</h5>
                  <h5 className="truncate text-right">Profit/Loss</h5>
                </div>
                <div className="flex flex-col gap-1 text-[8px] md:text-xs xl:text-base">
                  {currentSteps.map((step, index) => (
                    <div
                      key={index}
                      className="grid grid-cols-6 gap-1 px-2 py-1"
                    >
                      <h5 className="truncate text-left">{step.date}</h5>
                      <h5 className="truncate text-center">{step.time}</h5>
                      <h5 className="truncate col-span-2 text-center">
                        {step.selectedPlane}
                      </h5>
                      <h5 className="truncate text-center">{step.cashoutAt}</h5>
                      <div className="flex gap-1 items-center justify-end">
                        <span className="text-white">{step.profitLoss}</span>
                        <img
                          src={`/images/aviator/planes/${
                            true ? "plane-flew-away.png" : "plane-crashed.png"
                          }`}
                          alt="profit-loss"
                          className="w-4 h-4 md:w-5 md:h-5"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex gap-2 items-center justify-center bottom-[25%] right-8 absolute z-20">
              <button
                className={`rounded-full flex-shrink-0 w-fit border border-white p-[2px] flex items-center justify-center transition-opacity ${
                  currentPage === 1
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:bg-white/10"
                }`}
                onClick={goToPreviousPage}
                disabled={currentPage === 1}
              >
                <ChevronLeftIcon className="w-3 h-3" />
              </button>
              <div className="text-[8px] text-center">{currentPage}</div>
              <button
                className={`rounded-full flex-shrink-0 w-fit border border-white p-[2px] flex items-center justify-center transition-opacity ${
                  currentPage === totalPages
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:bg-white/10"
                }`}
                onClick={goToNextPage}
                disabled={currentPage === totalPages}
              >
                <ChevronRightIcon className="w-3 h-3" />
              </button>
            </div>
          </div>

          <button
            className="absolute bottom-[10%] flex items-center justify-center w-full z-20"
            onClick={() => setIsOpen(false)}
          >
            <img
              src="/images/aviator/dialogs/cancel-btn.svg"
              alt="cancel"
              className=" w-[25%] max-w-[110px] h-full"
            />
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BettingHistoryDialogMobile;
