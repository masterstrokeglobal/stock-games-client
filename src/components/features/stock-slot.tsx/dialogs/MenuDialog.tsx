import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import React, { useRef, useState } from "react";
import BettingHistory from "./BettingHistory";
import HowToPlay from "./HowToPlay";
import DemoVideo from "./demo-video";
import Image from "next/image";
import useWindowSize from "@/hooks/use-window-size";
import QuitDialog from "./QuitDialog";

const MenuDialog = ({ children }: { children: React.ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);
  const { isMobile } = useWindowSize();

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger className="w-full">{children}</DialogTrigger>
      <DialogContent
        showButton={false}
        className="bg-transparent border-none w-full max-w-xl lg:max-w-3xl text-xl font-blood-melt p-0"
      >
        <div className="flex flex-col justify-start items-start relative">
          <div className="flex flex-col gap-2 w-full justify-center items-center p-12 min-h-[400px] relative">
            <img
              ref={imgRef}
              src={
                isMobile
                  ? "https://res.cloudinary.com/dt8iv1hds/image/upload/v1758179644/dialog-mb_gdbbq4.png"
                  : "https://res.cloudinary.com/dt8iv1hds/image/upload/v1758179644/dialog-bg_bylyqs.png"
              }
              alt="dialog bg"
              className="w-full h-full object-contain absolute z-10"
            />
            <button
              onClick={() => setIsOpen(false)}
              className="absolute -top-3 right-2 z-30"
            >
              <Image
                src="https://res.cloudinary.com/dt8iv1hds/image/upload/v1758179642/cancel-btn_ebj094.png"
                alt="cancel"
                width={50}
                height={50}
              />
            </button>
            <div className="flex flex-col gap-2 w-full justify-center items-center max-w-xs z-20 p-2 lg:p-5">
              <BettingHistory>
                <div  
                  style={{
                    backgroundImage:
                      "url('https://res.cloudinary.com/dt8iv1hds/image/upload/v1758179645/menu-item-bg-1_q3b5zd.png')",
                    backgroundSize: "contain",
                    backgroundPosition: "center center",
                    backgroundRepeat: "no-repeat",
                  }}
                  className="text-left w-full px-5 pb-9 pt-3 flex gap-4 lg:gap-8 items-center"
                >
                  <div className="relative flex justify-center items-center ps-2 lg:ps-5">
                    <Image
                      src="https://res.cloudinary.com/dt8iv1hds/image/upload/v1758179643/history-btn_yyokbt.png"
                      alt="Betting History"
                      width={50}
                      height={50}
                      className="z-20"
                    />
                    <div
                      style={{ boxShadow: "0 0 15px 15px #00FFEC" }}
                      className="absolute h-5 w-5 rounded-full bg-[#00FFEC] z-10"
                    ></div>
                  </div>

                  <div className="relative">
                    <p
                      style={{
                        textShadow: "0 0 7px black",
                      }}
                      className="absolute top-0 left-0 z-10 text-white truncate"
                    >
                      Game History
                    </p>
                    <p className="slot-gradient-text z-20 relative truncate">
                      Game History
                    </p>
                  </div>
                </div>
              </BettingHistory>
              <HowToPlay>
                <div
                  style={{
                    backgroundImage:
                      "url('https://res.cloudinary.com/dt8iv1hds/image/upload/v1758179646/menu-item-bg-2_g0npcp.png')",
                    backgroundSize: "contain",
                    backgroundPosition: "center center",
                    backgroundRepeat: "no-repeat",
                  }}
                  className="text-left px-5 pb-9 pt-3 flex gap-4 lg:gap-8 items-center"
                >
                  <div className="relative flex justify-center items-center ps-2 lg:ps-5">
                    <Image
                      src="https://res.cloudinary.com/dt8iv1hds/image/upload/v1758179644/how-btn_nzn9h6.png"
                      alt="how to play"
                      width={50}
                      height={50}
                      className="z-20"
                    />
                    <div
                      style={{ boxShadow: "0 0 15px 15px #00FFEC" }}
                      className="absolute h-5 w-5 rounded-full bg-[#00FFEC] z-10"
                    ></div>
                  </div>

                  <div className="relative">
                    <p
                      style={{
                        textShadow: "0 0 7px black",
                      }}
                      className="absolute top-0 left-0 z-10 text-white truncate"
                    >
                      How to play
                    </p>
                    <p className="slot-gradient-text z-20 relative truncate">
                      How to play
                    </p>
                  </div>
                </div>
              </HowToPlay>
              <DemoVideo>
                <div
                  style={{
                    backgroundImage:
                      "url('https://res.cloudinary.com/dt8iv1hds/image/upload/v1758179645/menu-item-bg-1_q3b5zd.png')",
                    backgroundSize: "contain",
                    backgroundPosition: "center center",
                    backgroundRepeat: "no-repeat",
                  }}
                  className="text-center px-5 pb-9 pt-3 flex gap-4 lg:gap-8 items-center"
                >
                  <div className="relative flex justify-center items-center ps-2 lg:ps-5">
                    <Image
                      src="https://res.cloudinary.com/dt8iv1hds/image/upload/v1758179651/support-btn_fzgpnr.png"
                      alt="Support"
                      width={50}
                      height={50}
                      className="z-20"
                    />
                    <div
                      style={{ boxShadow: "0 0 15px 15px #00FFEC" }}
                      className="absolute h-5 w-5 rounded-full bg-[#00FFEC] z-10"
                    ></div>
                  </div>
                  <div className="relative">
                    <p
                      style={{
                        textShadow: "0 0 7px black",
                      }}
                      className="absolute top-0 left-0 z-10 text-white truncate"
                    >
                      Demo Video
                    </p>
                    <p className="slot-gradient-text z-20 relative truncate">
                      Demo Video
                    </p>
                  </div>
                </div>
              </DemoVideo>
              <QuitDialog setParentDialogOpen={setIsOpen}>
                <div
                  style={{
                    backgroundImage:
                      "url('https://res.cloudinary.com/dt8iv1hds/image/upload/v1758179646/menu-item-bg-2_g0npcp.png')",
                    backgroundSize: "contain",
                    backgroundPosition: "center center",
                    backgroundRepeat: "no-repeat",
                  }}
                  className="text-center px-5 pb-9 pt-3 flex gap-4 lg:gap-8 items-center"
                >
                  <div className="relative flex justify-center items-center ps-2 lg:ps-5">
                    <Image
                      src="https://res.cloudinary.com/dt8iv1hds/image/upload/v1758179644/home-btn_eh6ytm.png"
                      alt="Home"
                      width={50}
                      height={50}
                      className="z-20"
                    />
                    <div
                      style={{ boxShadow: "0 0 15px 15px #00FFEC" }}
                      className="absolute h-5 w-5 rounded-full bg-[#00FFEC] z-10"
                    ></div>
                  </div>
                  <div className="relative">
                    <p
                      style={{
                        textShadow: "0 0 7px black",
                      }}
                      className="absolute top-0 left-0 z-10 text-white truncate"
                    >
                      Home
                    </p>
                    <p className="slot-gradient-text z-20 relative truncate">
                      Home
                    </p>
                  </div>
                </div>
              </QuitDialog>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MenuDialog;
