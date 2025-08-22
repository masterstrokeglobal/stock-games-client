import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import React, { useState } from "react";
import BettingHistory from "./BettingHistory";
import HowToPlay from "./HowToPlay";
import DemoVideo from "./demo-video";

const MenuDialog = ({ children }: { children: React.ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger className="w-full">{children}</DialogTrigger>
      <DialogContent
        showButton={false}
        className="bg-transparent border-none w-full max-w-xl lg:max-w-3xl font-wendy-one text-xl lg:max-h-[70vh]"
      >
        <div className="flex flex-col justify-start items-start relative">
          <div
            style={{
              backgroundImage: "url('/images/slot-machine/menu-bg.png')",
              backgroundSize: "100% 100%",
              backgroundPosition: "center center",
              backgroundRepeat: "no-repeat",
            }}
            className="flex flex-col gap-2 w-full justify-center items-center px-5 py-3"
          >
            <BettingHistory>
              <div
                style={{
                  backgroundImage:
                    "url('/images/slot-machine/menu-item-bg-1.png')",
                  backgroundSize: "100% 100%",
                  backgroundPosition: "center center",
                  backgroundRepeat: "no-repeat",
                }}
                className="text-center w-full px-3 py-2"
              >
                Betting History
              </div>
            </BettingHistory>
            <HowToPlay>
              <div
                style={{
                  backgroundImage:
                    "url('/images/slot-machine/menu-item-bg-2.png')",
                  backgroundSize: "100% 100%",
                  backgroundPosition: "center center",
                  backgroundRepeat: "no-repeat",
                }}
                className="text-center px-3 py-2"
              >
                How to play
              </div>
            </HowToPlay>
            <DemoVideo>
              <div
                style={{
                  backgroundImage:
                    "url('/images/slot-machine/menu-item-bg-2.png')",
                  backgroundSize: "100% 100%",
                  backgroundPosition: "center center",
                  backgroundRepeat: "no-repeat",
                }}
                className="text-center px-3 py-2"
              >
                Demo Video
              </div>
            </DemoVideo>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MenuDialog;
