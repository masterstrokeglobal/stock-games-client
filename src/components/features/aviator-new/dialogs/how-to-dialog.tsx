import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import React, { useState } from "react";

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

interface HowToDialogProps {
  itemsPerPage?: number;
}

const HowToDialog = ({ itemsPerPage = 3 }: HowToDialogProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

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
      <DialogTrigger className="">
        <button className="p-[10px] bg-[#99B2FF33] rounded-full flex-shrink-0 w-fit xl:text-base text-sm">
          How to play
        </button>
      </DialogTrigger>
      <DialogContent
        showButton={false}
        className="bg-transparent border-none w-full max-w-2xl"
      >
        <div className="flex flex-col gap-4 relative z-10 items-center justify-center w-full">
          <img
            src="/images/aviator/dialogs/desktop-dialog-2.svg"
            alt="menu"
            className="w-full h-full min-w-[400px] relative z-10"
          />
          <div className="flex gap-[10px] absolute -translate-y-[18%] z-20 w-full justify-end p-5 font-quantico h-[400px]">
            <div className="flex flex-col gap-4 relative z-20 w-[85%] px-5 mt-[10%]">
              <h1 className="capitalize md:text-base xl:text-[20px] text-center">
                Game rules
              </h1>
              <div className="flex flex-col gap-3 max-h-[200px] overflow-y-auto">
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
            <div className="flex gap-2 items-center justify-center bottom-0 right-10 absolute">
              <button
                className={`rounded-full flex-shrink-0 w-fit border border-white p-1 flex items-center justify-center transition-opacity ${
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
                className={`rounded-full flex-shrink-0 w-fit border border-white p-1 flex items-center justify-center transition-opacity ${
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

export default HowToDialog;
