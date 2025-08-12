import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import React, { useState } from "react";

const InfoDialog = ({ children }: { children: React.ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger className="w-full">{children}</DialogTrigger>
      <DialogContent
        // showButton={false}
        className="bg-transparent border-none w-full max-w-xl md:max-w-2xl lg:max-w-3xl xl:max-w-4xl"
      >
        <div
          style={{
            backgroundImage: "url('/images/slot-machine/dialog-bg.png')",
            backgroundSize: "100% 100%",
            backgroundPosition: "center center",
            backgroundRepeat: "no-repeat",
          }}
          className="w-full h-full relative flex flex-col items-center justify-center p-[10%] pt-[15%] font-wendy-one text-[#FFFFFFB2]"
        >
          <img
            src="/images/slot-machine/happy-bull.png"
            alt=""
            className="absolute w-[100px] lg:w-[150px] top-0 translate-y-[-50%]"
          />
          <DialogHeader className="p-1">
            <DialogTitle className="text-[15px] lg:text-[30px] xl:text-[40px]">
              Multipliers
            </DialogTitle>
          </DialogHeader>
          <DialogDescription className="text-center text-white mb-5 p-2 flex flex-col gap-2 w-full overflow-y-auto max-h-[40vh] min-h-[200px] text-xs lg:text-base xl:text-2xl">
            <div>2 same - 1.8x</div>
            <div>3 same - 13x</div>
            <div>4 same - 200x</div>
            <div>5 same - 9000x</div>
          </DialogDescription>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default InfoDialog;
