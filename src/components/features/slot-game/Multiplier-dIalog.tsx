import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogHeader,
  DialogTitle,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Eye } from "lucide-react";
import React, { useState } from "react";
import { INR } from "@/lib/utils";

const MultiplierDIalog = ({
  slotWinningMultiplier,
  totalBetAmount,
}: {
  slotWinningMultiplier: any;
  totalBetAmount: number | undefined;
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger className="md:hidden block absolute top-12 right-2">
        <Button variant="ghost" className="p-2">
          <Eye />
        </Button>
      </DialogTrigger>
      <DialogContent className="md:hidden block">
        <DialogHeader>
          <DialogTitle className="text-center">Multipliers</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col items-center justify-center md:gap-4 mb-4 w-full p-2">
          {slotWinningMultiplier.map((item: any) => (
            <div
              key={item.multiplier}
              className="flex flex-col flex-1 items-center justify-center gap-1 sm:gap-2 bg-[#1B1B1B] border-2 border-[#E3B872] px-1 sm:px-2 py-1 rounded-md w-[200px]"
            >
              <div className="flex items-center gap-1 sm:gap-2 justify-between whitespace-nowrap w-full">
                <span className="text-gray-300 text-xs">
                  {item.count} Match
                </span>
                <span className="text-yellow-400 font-bold text-xs sm:text-sm">
                  x{item.multiplier}
                </span>
              </div>
              <div className="text-gray-400 text-xs sm:text-sm">
                {totalBetAmount
                  ? `Win ${INR(item.winningAmount(totalBetAmount), true)}`
                  : " "}
              </div>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MultiplierDIalog;
