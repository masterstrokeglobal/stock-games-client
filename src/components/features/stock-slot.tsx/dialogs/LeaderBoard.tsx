import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import React, { useState } from "react";

const LeaderBoard = ({ children }: { children: React.ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger>{children}</DialogTrigger>
      <DialogContent
        showButton={false}
        className="bg-transparent border-none w-full max-w-xl lg:max-w-3xl"
      >
        <div
          style={{
            backgroundImage: "url('/images/slot-machine/dialog-bg.png')",
            backgroundSize: "100% 100%",
            backgroundPosition: "center center",
            backgroundRepeat: "no-repeat",
          }}
          className="w-full h-full relative flex flex-col items-center justify-center p-[10%] font-wendy-one text-[#FFFFFFB2]"
        >
          <img
            src="/images/slot-machine/happy-bull.png"
            alt=""
            className="absolute w-[100px] lg:w-[130px] top-0 translate-y-[-50%]"
          />
          <DialogHeader className="p-1">
            <DialogTitle className="text-[15px] lg:text-[30px] xl:text-[40px]">
              How to play
            </DialogTitle>
          </DialogHeader>
          <DialogDescription className="text-center flex flex-col gap-1 p-5 pt-2 overflow-y-auto max-h-[40vh] min-h-[200px] text-xs lg:text-base xl:text-2xl">
            <div className="grid grid-cols-5 gap-1 py-2">
              <p>Rank</p>
              <p>Name</p>
              <p>Winning</p>
              <p>Total</p>
              <p>Winning</p>
            </div>
            <div className="flex flex-col gap-1">
              <div className="grid grid-cols-5 gap-1 py-2">
                <p>1</p>
                <p>John Doe</p>
                <p>100</p>
                <p>100</p>
                <p>100</p>
              </div>
            </div>
          </DialogDescription>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default LeaderBoard;
