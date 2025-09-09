import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import React, { useState } from "react";
import BettingHistory from "./BettingHistory";
import HowToPlay from "./HowToPlay";
import DemoVideo from "./demo-video";
import Image from "next/image";
import Link from "next/link";

const MenuDialog = ({ children }: { children: React.ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger className="w-full">{children}</DialogTrigger>
      <DialogContent
        showButton={false}
        className="bg-transparent border-none w-full max-w-xl lg:max-w-3xl text-xl max-h-[60vh] font-blood-melt"
      >
        <div className="flex flex-col justify-start items-start relative">
          <div
            style={{
              backgroundImage: "url('/images/slot-machine/dialog-bg.png')",
              backgroundSize: "100% 100%",
              backgroundPosition: "center center",
              backgroundRepeat: "no-repeat",
            }}
            className="flex flex-col gap-2 w-full justify-center items-center p-12 min-h-[400px] relative"
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
            <div className="flex flex-col gap-2 w-full justify-center items-center max-w-xs">
              <BettingHistory>
                <div
                  style={{
                    backgroundImage:
                      "url('/images/slot-machine/menu-item-bg-1.png')",
                    backgroundSize: "100% 100%",
                    backgroundPosition: "center center",
                    backgroundRepeat: "no-repeat",
                  }}
                  className="text-center w-full p-5 pb-10 flex gap-2 items-center justify-center "
                >
                  <Image
                    src="/images/slot-machine/history-btn.png"
                    alt="Betting History"
                    width={40}
                    height={40}
                  />
                  <div className="relative">
                    <p
                      style={{
                        textShadow: "0 0 7px black",
                      }}
                      className="absolute top-0 left-0 z-10 text-white"
                    >
                      Game History
                    </p>
                    <p className="slot-gradient-text z-20 relative">
                      Game History
                    </p>
                  </div>
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
                  className="text-left p-10 pt-5 flex gap-2 items-center justify-center"
                >
                  <Image
                    src="/images/slot-machine/how-btn.png"
                    alt="How to play"
                    width={40}
                    height={40}
                  />
                  <div className="relative">
                    <p
                      style={{
                        textShadow: "0 0 7px black",
                      }}
                      className="absolute top-0 left-0 z-10 text-white"
                    >
                      How to play
                    </p>
                    <p className="slot-gradient-text z-20 relative">How to play</p>
                  </div>
                </div>
              </HowToPlay>
              <DemoVideo>
                <div
                  style={{
                    backgroundImage:
                      "url('/images/slot-machine/menu-item-bg-1.png')",
                    backgroundSize: "100% 100%",
                    backgroundPosition: "center center",
                    backgroundRepeat: "no-repeat",
                  }}
                  className="text-center p-5 pb-10 flex gap-2 items-center justify-center"
                >
                  <Image
                    src="/images/slot-machine/support-btn.png"
                    alt="Demo Video"
                    width={40}
                    height={40}
                  />
                  <div className="relative">
                    <p
                      style={{
                        textShadow: "0 0 7px black",
                      }}
                      className="absolute top-0 left-0 z-10 text-white"
                    >
                      Demo Video
                    </p>
                    <p className="slot-gradient-text z-20 relative">Demo Video</p>
                  </div>
                </div>
              </DemoVideo>
              <Link href="/game/platform" className="w-full">
                <div
                  style={{
                    backgroundImage:
                      "url('/images/slot-machine/menu-item-bg-2.png')",
                    backgroundSize: "100% 100%",
                    backgroundPosition: "center center",
                    backgroundRepeat: "no-repeat",
                  }}
                  className="text-center p-5 pb-10 flex gap-2 items-center justify-center"
                >
                  <Image
                    src="/images/slot-machine/home-btn.png"
                    alt="Demo Video"
                    width={40}
                    height={40}
                  />
                  <div className="relative">
                    <p
                      style={{
                        textShadow: "0 0 7px black",
                      }}
                      className="absolute top-0 left-0 z-10 text-white"
                    >
                      Home
                    </p>
                    <p className="slot-gradient-text z-20 relative">Home</p>
                  </div>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MenuDialog;
