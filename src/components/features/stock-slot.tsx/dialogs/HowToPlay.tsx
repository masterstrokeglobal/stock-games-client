import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import React, { useState } from "react";

const HowToPlay = ({ children }: { children: React.ReactNode }) => {
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
              How to play
            </DialogTitle>
          </DialogHeader>
          <DialogDescription className="text-center text-white mb-5 p-2 flex flex-col gap-2 w-full overflow-y-auto max-h-[40vh] min-h-[200px] text-xs lg:text-base xl:text-2xl">
            <div className="flex flex-col gap-2 text-left text-white">
              <h3>1. Game Overview</h3>
              <div className="ps-2 lg:ps-5">
 <p>
                The Stock Slot Game combines the excitement of stock market
                numbers with slot-style gameplay.{" "}
              </p>
              <p>
                You have <b>30 seconds to place your bets</b> and{" "}
                <b>30 seconds to view the results</b> of the spin.
              </p>
              </div>
             
            </div>

            <div className="flex flex-col gap-2 text-left">
              <h3>2. Betting Rules</h3>
              <div className="ps-2 lg:ps-5">
              <p>
                You can only place bets during the <b>Betting Open</b> state
                (first 30 seconds).
              </p>
              <p>
                Once the <b>Result Spin</b> begins, no bets are allowed until
                the next round.
              </p>
              <p>
                The minimum bet amount is <b>100</b>.
              </p>
              <p>
                You can increase or decrease your bet in steps of <b>100</b>{" "}
                during the betting period.
              </p>
              </div>
            </div>

            <div className="flex flex-col gap-2 text-left">
              <h3>3. Stock Selection & Price Logic</h3>
              <div className="ps-2 lg:ps-5">
              <p>
                The game uses <b>5 randomly selected stocks</b> from the chosen
                market.
              </p>
              <p>
                Stock values are derived from their{" "}
                <b>.1 value (first decimal point)</b> to generate the slot
                numbers.
              </p>
              <p>These 5 numbers form the base result for the slot reels.</p>
              </div>
            </div>

            <div className="flex flex-col gap-2 text-left">
              <h3>5. Winning Conditions</h3>
              <div className="ps-2 lg:ps-5">
              <p>
                The slot machine result is decided by{" "}
                <b>matching numbers on the middle row</b>.
              </p>
              <p>
                <b>Multipliers based on matches</b>:
              </p>
              <p>
                <b>2 matches</b> → Small multiplier
              </p>
              <p>
                <b>3 matches</b> → Medium multiplier
              </p>
              <p>
                <b>4 matches</b> → High multiplier
              </p>
              <p>
                <b>5 matches (Full Line)</b> → Maximum multiplier
              </p>
              <p>
                <b>Bonus symbols</b>, if present, add <b>extra rewards</b> on
                top of your multiplier.
              </p>
              </div>
            </div>

            <div className="flex flex-col gap-2 text-left">
              <h3>6. Result & Payout</h3>
              <div className="ps-2 lg:ps-5">
              <p>After the 30-second spin, results are displayed showing:</p>
              <p>
                <b>Stock values</b>
              </p>
              <p>
                <b>Middle row match count</b>
              </p>
              <p>
                <b>Bonus symbols collected</b>
              </p>
              <p>
                Winnings are automatically credited based on your bet and
                multiplier.
              </p>
              </div>
            </div>
          </DialogDescription>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default HowToPlay;
