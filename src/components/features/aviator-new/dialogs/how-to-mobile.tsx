import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";

const steps = [
  "1. Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.",
  "2. Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.",
  "3. Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.",
  "4. Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.",
  "5. Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.",
  "6. Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.",
  "7. Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.",
  "8. Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.",
];

const HowToDialogMobile = ({
  children,
  itemsPerPage = 3,
}: {
  children: React.ReactNode;
  itemsPerPage?: number;
}) => {
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
            className="flex gap-2 absolute z-20 w-full justify-center p-[5%] font-quantico"
            style={{
              height: `${imageHeight}px`,
              maxWidth: "450px",
              maxHeight: "500px",
            }}
          >
            <div className="flex flex-col gap-4 relative z-20 px-5 mt-[7%] w-full">
              <h1 className="capitalize text-xs md:text-base xl:text-[20px] text-center">
                Game rules
              </h1>
              <div className="flex flex-col text-[8px] gap-3 max-h-[200px] overflow-y-auto">
                {currentSteps.map((step, index) => (
                  <p
                    key={startIndex + index}
                    className="xl:text-[16px] md:text-sm leading-relaxed"
                  >
                    {step}
                  </p>
                ))}
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
                <ChevronLeftIcon className="w-4 h-4" />
              </button>
              <div className="text-sm text-center">{currentPage}</div>
              <button
                className={`rounded-full flex-shrink-0 w-fit border border-white p-[2px] flex items-center justify-center transition-opacity ${
                  currentPage === totalPages
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:bg-white/10"
                }`}
                onClick={goToNextPage}
                disabled={currentPage === totalPages}
              >
                <ChevronRightIcon className="w-4 h-4" />
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
              className="w-[110px] h-full"
            />
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default HowToDialogMobile;
