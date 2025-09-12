import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import React, { useState } from "react";
import HowToDialogMobile from "./how-to-mobile";
import BettingHistoryDialogMobile from "./betting-history-mobile";
import ContactDialog from "../../platform/contact-dialog";

const MenuDialog = () => {
  const [isOpen, setIsOpen] = useState(false);

  const handleClick = () => {
    // setIsOpen(false);
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger className="lg:hidden z-50">
          <div className="menu-btn flex items-center gap-[10px] rounded-full bg-[#FFFFFF33] border border-[#FFFFFF33] py-[5px] px-[10px]">
            <img
              src="/images/aviator/dialogs/mebu-btn.svg"
              alt="menu"
              className="w-[12px] h-[10px]"
            />
            <span className="text-white text-[12px] font-medium">Menu</span>
          </div>
        </DialogTrigger>
        <DialogContent
          showButton={false}
          className="bg-transparent border-none w-full lg:hidden"
        >
          <div className="flex flex-col gap-4 relative z-10 items-center justify-center w-full">
            <img
              src="/images/aviator/dialogs/mobile-bg-1.png"
              alt="menu"
              className="w-full h-full min-h-[250px] relative z-10"
            />

            {/* //? options */}
            <div className="flex flex-col gap-[10px] absolute -translate-y-[20%] z-20">
              <BettingHistoryDialogMobile>
                <button
                  onClick={() => handleClick()}
                  className="text-white text-[12px] font-medium text-center px-[10px] py-[5px] rounded-full bg-[#99B2FF33]"
                >
                  Betting History
                </button>
              </BettingHistoryDialogMobile>
              <HowToDialogMobile>
                <button
                  onClick={() => handleClick()}
                  className="text-white text-[12px] font-medium text-center px-[10px] py-[5px] rounded-full bg-[#99B2FF33]"
                >
                  How to Play
                </button>
              </HowToDialogMobile>
              <ContactDialog>
                <button
                  onClick={() => handleClick()}
                  className="text-white text-[12px] font-medium text-center px-[10px] py-[5px] rounded-full bg-[#99B2FF33]"
                >
                  Support
                </button>
              </ContactDialog>
            </div>

            {/* //? cancel button */}
            <button
              className="absolute sm:bottom-[8%] bottom-[8%] flex items-center justify-center w-full z-20"
              onClick={() => setIsOpen(false)}
            >
              <img
                src="/images/aviator/dialogs/cancel-btn.svg"
                alt="cancel"
                className="w-[78px] h-[30px]"
              />
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default MenuDialog;
