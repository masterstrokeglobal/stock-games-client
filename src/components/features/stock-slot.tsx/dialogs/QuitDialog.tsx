import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import React, { useState } from "react";
import Image from "next/image";
import useWindowSize from "@/hooks/use-window-size";
import Link from "next/link";

const QuitDialog = ({ children, setParentDialogOpen }: { children: React.ReactNode, setParentDialogOpen: (open: boolean) => void }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { isMobile } = useWindowSize();
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger className="w-full">{children}</DialogTrigger>
      <DialogContent
        showButton={false}
        className=" bg-transparent border-none flex flex-col items-center justify-center font-blood-melt"
      >
        <div
          style={{
            backgroundImage: `url('/images/slot-machine/${
              isMobile ? "dialog-mb.png" : "dialog-bg.png"
            }')`,
            backgroundSize: "100% 100%",
            backgroundPosition: "center center",
            backgroundRepeat: "no-repeat",
          }}
          className=" relative flex flex-col px-[10%] py-10 sm:py-12 text-[#FFFFFFB2] h-[493px] w-[399px] lg:h-[505px] lg:w-[559px] slot-dialog-back"
        >
          <button
            onClick={() => setIsOpen(false)}
            className="absolute -top-3 right-0"
          >
            <Image
              src="/images/slot-machine/cancel-btn.png"
              alt="cancel"
              width={40}
              height={40}
            />
          </button>
          <DialogHeader className="p-1 relative w-full flex justify-center items-center">
            <DialogTitle className="text-3xl lg:text-[40px] text-center uppercase slot-gradient-text quit-text-2">
              QUIT
            </DialogTitle>
          </DialogHeader>
          <DialogDescription className="text-center text-white mb-5 p-2 flex flex-col gap-4 sm:gap-6 w-full justify-around items-center flex-1 text-xs lg:text-base xl:text-2xl">
            <div className="flex flex-col gap-2 sm:gap-4 items-center justify-center">
              <div className="text-xl lg:text-2xl text-center slot-gradient-text quit-text-1">
                WAIT! YOU’RE LEAVING <br /> ALREADY?
              </div>
              <div className="text-xl lg:text-2xl text-center slot-gradient-text quit-text-1">
                YOU’RE JUST ONE <br />
                SPIN AWAY FROM YOUR NEXT BIG <br /> WIN!
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 items-center justify-between w-full px-2 sm:px-8">
              <Link href="/game/platform" className="w-full">
                <div
                  style={{
                    backgroundImage: `url('/images/slot-machine/btn-bg.png')`,
                    backgroundSize: "100% 100%",
                    backgroundPosition: "center center",
                    backgroundRepeat: "no-repeat",
                  }}
                  className="text-center px-5 py-2 flex gap-4 justify-center items-center uppercase text-xl lg:text-2xl quit-text-3"
                >
                    <p className="slot-gradient-text">yes</p>
                </div>
              </Link>
              <button
                onClick={() => {
                  setIsOpen(false);
                  setParentDialogOpen(false);
                }}
                style={{
                  backgroundImage: `url('/images/slot-machine/btn-bg.png')`,
                  backgroundSize: "100% 100%",
                  backgroundPosition: "center center",
                  backgroundRepeat: "no-repeat",
                }}
                className="text-center px-5 py-2 flex gap-4 justify-center items-center uppercase text-xl lg:text-2xl quit-text-3"
              >
                <p className="slot-gradient-text">no</p>
              </button>
            </div>
          </DialogDescription>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default QuitDialog;
