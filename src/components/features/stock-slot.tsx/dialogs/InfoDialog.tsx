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
        className="[&>button]:text-white [&>button]:focus:ring-0 bg-transparent border-none w-full max-w-xl md:max-w-2xl lg:max-w-3xl xl:max-w-4xl"
      >
        <div
          style={{
            backgroundImage: "url('/images/slot-machine/dialog-bg.png')",
            backgroundSize: "100% 100%",
            backgroundPosition: "center center",
            backgroundRepeat: "no-repeat",
          }}
          className="md:max-h-[70vh] w-full h-full relative flex flex-col items-center justify-center md:justify-between p-[10%] pt-[15%] font-wendy-one text-[#FFFFFFB2]"
        >
          <img
            src="/images/slot-machine/happy-bull.png"
            alt=""
            className="absolute w-[100px] lg:w-[160px] top-0 translate-y-[-50%]"
          />
          <DialogHeader className="p-1">
            <DialogTitle className="text-lg lg:text-2xl xl:text-4xl font-semibold">
              Multipliers
            </DialogTitle>
          </DialogHeader>
          <DialogDescription className="text-center text-white mb-5 p-2 flex flex-col gap-1 md:gap-2 w-full overflow-y-auto max-h-[40vh]">
            <p className="text-base lg:text-xl xl:text-3xl">2 matches - 1.5x</p>
            <p className="text-base lg:text-xl xl:text-3xl">3 matches - 3x</p>
            <p className="text-base lg:text-xl xl:text-3xl">4 matches - 10x</p>
            <p className="text-base lg:text-xl xl:text-3xl">5 matches - 100x</p>
          </DialogDescription>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default InfoDialog;
