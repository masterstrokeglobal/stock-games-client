"use client"
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowUpIcon } from "@radix-ui/react-icons";
import { useEffect, useState } from "react";
const Die = ({ value }: { value: number }) => {
  // Function to determine dot positions based on dice value
  const renderDots = () => {
    // Create an array to hold the dots
    const dots = [];

    // Common dot styles
    const dotClass = "absolute w-2 h-2 bg-white rounded-full";

    // Define dot positions based on die value
    switch (value) {
      case 1:
        dots.push(<div key="center" className={`${dotClass} top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2`}></div>);
        break;
      case 2:
        dots.push(<div key="top-right" className={`${dotClass} top-1/4 right-1/4`}></div>);
        dots.push(<div key="bottom-left" className={`${dotClass} bottom-1/4 left-1/4`}></div>);
        break;
      case 3:
        dots.push(<div key="top-right" className={`${dotClass} top-1/4 right-1/4`}></div>);
        dots.push(<div key="center" className={`${dotClass} top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2`}></div>);
        dots.push(<div key="bottom-left" className={`${dotClass} bottom-1/4 left-1/4`}></div>);
        break;
      case 4:
        dots.push(<div key="top-left" className={`${dotClass} top-1/4 left-1/4`}></div>);
        dots.push(<div key="top-right" className={`${dotClass} top-1/4 right-1/4`}></div>);
        dots.push(<div key="bottom-left" className={`${dotClass} bottom-1/4 left-1/4`}></div>);
        dots.push(<div key="bottom-right" className={`${dotClass} bottom-1/4 right-1/4`}></div>);
        break;
      case 5:
        dots.push(<div key="top-left" className={`${dotClass} top-1/4 left-1/4`}></div>);
        dots.push(<div key="top-right" className={`${dotClass} top-1/4 right-1/4`}></div>);
        dots.push(<div key="center" className={`${dotClass} top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2`}></div>);
        dots.push(<div key="bottom-left" className={`${dotClass} bottom-1/4 left-1/4`}></div>);
        dots.push(<div key="bottom-right" className={`${dotClass} bottom-1/4 right-1/4`}></div>);
        break;
      case 6:
        dots.push(<div key="top-left" className={`${dotClass} top-1/4 left-1/4`}></div>);
        dots.push(<div key="mid-left" className={`${dotClass} top-1/2 left-1/4 transform -translate-y-1/2`}></div>);
        dots.push(<div key="bottom-left" className={`${dotClass} bottom-1/4 left-1/4`}></div>);
        dots.push(<div key="top-right" className={`${dotClass} top-1/4 right-1/4`}></div>);
        dots.push(<div key="mid-right" className={`${dotClass} top-1/2 right-1/4 transform -translate-y-1/2`}></div>);
        dots.push(<div key="bottom-right" className={`${dotClass} bottom-1/4 right-1/4`}></div>);
        break;
      default:
        break;
    }

    return dots;
  };

  return (
    <div className="w-16 h-16 bg-red-600 rounded-md shadow-md relative flex items-center justify-center">
      {/* Render the dots */}
      {renderDots()}
    </div>
  );
};

const DiceSet = ({ values }: { values: number[] }) => {
  return (
    <div className="flex gap-2">
      <Die value={values[0]} />
      <Die value={values[1]} />
    </div>
  );
};

const DiceSelectionGrid = () => {
  // Define all possible combinations for two dice
  const diceCombinations = [
    [1, 1], [1, 2], [1, 3], [1, 4], [1, 5], [1, 6],
    [2, 1], [2, 2], [2, 3], [2, 4], [2, 5], [2, 6]
  ];

  // Special indices that should have a red dot (corresponding to the original indices 8, 11, 14, 17)
  const specialIndices = [8, 11, 14, 17];

  return (
    <div className="bg-gray-100 p-1 grid grid-cols-6 gap-1">
      {diceCombinations.map((combo, index) => (
        <div
          key={index}
          className="w-full aspect-square bg-white border border-gray-300 rounded-sm flex items-center justify-center relative p-1"
        >
          <div className="transform scale-50">
            <DiceSet values={combo} />
          </div>

          {/* Red dot on certain dice combinations */}
          {specialIndices.includes(index) && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-2 h-2 bg-red-500 rounded-full"></div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

const SevenUpSevenDown = () => {
  const diceHistory = [8, 11, 14, 17];

  return (
    <section className="flex flex-col items-center justify-center min-h-[calc(100svh-100px)]">
      <div className="flex flex-col min-h-screen max-w-2xl w-full mx-auto bg-gray-900 text-white overflow-hidden">
        <div className="flex flex-col justify-between   h-64 items-start  bg-gray-200">
          <div className="grid grid-cols-6 w-full">
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className=" bg-black flex text-xs flex-row items-center gap-2 p-2">
                <div className="flex flex-col gap-2">
                  <span>Zomato</span>
                  <span> Price: 100</span>
                </div>
                <div className="flex flex-col gap-2">
                  <ArrowUpIcon className="w-4 h-4 text-green-500" />
                </div>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-6 w-full">
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className=" bg-black flex text-xs flex-row items-center gap-2 p-2">
                <div className="flex flex-col gap-2">
                  <span>Zomato</span>
                  <span> Price: 100</span>
                </div>
                <div className="flex flex-col gap-2">
                  <ArrowUpIcon className="w-4 h-4 text-green-500" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Betting areas */}
        <div style={{ backgroundImage: 'url(/images/7-up.png)', backgroundSize: 'cover', backgroundPosition: 'center' }} className="relative md:px-12 px-4 pt-20 pb-4 bg-opacity-10 bg-brown-900">
          {/* 8-12 Area */}
          {/* Bet locked indicator */}
          <BetLockedBanner />
          <div className="relative h-64 w-full">
            <div className="absolute inset-x-0 top-0 h-32 hover:scale-[1.02] cursor-pointer transition-all duration-300 bg-yellow-500 bg-opacity-20  rounded-t-3xl border-yellow-500 border-2 flex flex-col items-center justify-start pt-4">
              <div className="text-2xl font-bold text-yellow-400">8~12</div>
              <div className="text-sm text-yellow-400">1:2</div>
              <div className="w-fit h-12 text-[10px] bg-green-500 font-semibold rounded-xl p-2 text-center flex items-center justify-center absolute top-1 left-1">TATA</div>
      <div className="w-fit h-12 text-[10px] bg-red-500 font-semibold rounded-xl p-2 text-center flex items-center justify-center absolute top-12 left-4">RELIANCE</div>
      <div className="w-fit h-12 text-[10px] bg-blue-500 font-semibold rounded-xl p-2 text-center flex items-center justify-center absolute top-2 right-2">INFOSYS</div>
      <div className="w-fit h-12 text-[10px] bg-yellow-500 font-semibold rounded-xl p-2 text-center flex items-center justify-center absolute top-16 right-4">WIPRO</div>
      <div className="w-fit h-12 text-[10px] bg-purple-500 font-semibold rounded-xl p-2 text-center flex items-center justify-center absolute top-8 left-20">TCS</div>
      <div className="w-fit h-12 text-[10px] bg-orange-500 font-semibold rounded-xl p-2 text-center flex items-center justify-center absolute top-4 right-16">HDFC</div>
      <div className="w-fit h-12 text-[10px] bg-pink-500 font-semibold rounded-xl p-2 text-center flex items-center justify-center absolute top-20 left-32">ICICI</div>
      <div className="w-fit h-12 text-[10px] bg-indigo-500 font-semibold rounded-xl p-2 text-center flex items-center justify-center absolute top-6 right-28">AXIS</div>
      <div className="w-fit h-12 text-[10px] bg-teal-500 font-semibold rounded-xl p-2 text-center flex items-center justify-center absolute top-14 left-48">SBI</div>
      <div className="w-fit h-12 text-[10px] bg-gray-500 font-semibold rounded-xl p-2 text-center flex items-center justify-center absolute top-8 right-40">BAJAJ</div>
      <div className="w-fit h-12 text-[10px] bg-cyan-500 font-semibold rounded-xl p-2 text-center flex items-center justify-center absolute top-10 right-52">ADANI</div>
 
            </div>

            {/* Center 7 Area */}
            <div className="absolute left-1/2 top-1/2 hover:scale-[1.02] transition-all duration-300 transform -translate-x-1/2 -translate-y-1/2 w-24 h-24 bg-red-900 rounded-full border-2 border-yellow-500 flex flex-col items-center justify-center z-10">
              <div className="text-4xl font-bold text-yellow-400">7</div>
              <div className="text-sm text-yellow-400">1:4</div>
            </div>
            {/* 2-6 Area */}
            <div className="absolute inset-x-0 bottom-0 cursor-pointer hover:scale-[1.02] transition-all duration-300 h-32  bg-yellow-500 bg-opacity-20   rounded-b-3xl border-2 border-yellow-500 flex flex-col items-center justify-end py-4">
              <div className="text-2xl font-bold text-yellow-400">1~6</div>
              <div className="text-sm text-yellow-400">1:2</div>
            </div>
          </div>

          <div className="flex flex-row w-full mt-8  flex-wrap md:gap-4 gap-2">
            <Button className="active-menu-button font-semibold text-base rounded-full flex-1">
              50
            </Button>
            <Button className="play-button  font-semibold rounded-full flex-1">
              100
            </Button>
            <Button className="gold-button  font-semibold rounded-full flex-1">
              500
            </Button>
            <Button className="options-button  font-semibold  text-base rounded-full flex-1">
              1000
            </Button>
          </div>
          <Input placeholder="Enter your bet amount" className="w-full mt-2" />
        </div>

        {/* Betting statistics */}
        <div className="bg-gray-100 text-black px-2 py-1 flex text-xs">
          <div className="flex-2 text-sm text-gray-600 ml-1">
            calculated from last 10 rounds
          </div>
        </div>

        {/* Dice history */}
        <div className="bg-gray-200 flex p-1 overflow-x-auto">
          {diceHistory.map((diceSum, index) => {
            // Map the dice sums to specific dice combinations
            let diceValues;
            switch (diceSum) {
              case 8: diceValues = [6, 2]; break;
              case 11: diceValues = [5, 6]; break;
              case 14: diceValues = [6, 5]; break;
              case 17: diceValues = [6, 6]; break;
              default: diceValues = [1, 1];
            }

            return (
              <div
                key={index}
                className={`w-8 h-8 flex items-center justify-center mx-0.5 text-sm font-bold 
                                ${diceSum === 8 ? 'bg-green-500' : 'bg-gray-300'} relative`}
              >
                <div className="absolute inset-0 flex items-center justify-center">
                  {diceSum}
                </div>
                <div className="transform scale-25 opacity-0">
                  <DiceSet values={diceValues} />
                </div>
              </div>
            );
          })}
        </div>

        {/* Dice selection with realistic dice */}
        <DiceSelectionGrid />
      </div>
    </section>
  );
};

export default SevenUpSevenDown;


const BetLockedBanner = () => {
  const [isLocked, setIsLocked] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);

  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (!isLocked && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    }

    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isLocked, timeLeft]);

  return (
    <div className="absolute top-0 left-1/2 -translate-x-1/2 min-w-1/2 w-full mx-auto max-w-md">
      <div className="bg-gradient-to-r from-pink-900 px-4 via-pink-800 to-pink-900 h-14 rounded-b-full shadow-lg flex items-center justify-center relative overflow-hidden">
        {/* Inner content with highlight effect */}
        <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-pink-500 to-pink-400 opacity-50"></div>
        <div className="absolute inset-x-8 bottom-0 h-1/2 rounded-b-full bg-gradient-to-r from-pink-900 via-pink-700 to-pink-900"></div>

        <div className="flex flex-col items-center justify-center">
          {/* Text content */}
          <span className="text-white font-bold tracking-wider relative z-10 mr-2">
            {isLocked ? "BET LOCKED!" : "BET UNLOCKED!"}
          </span>

          {/* Timer with fade animation */}
          {!isLocked && timeLeft > 0 && (
            <span
              className="text-white font-bold tracking-wider relative z-10 transition-opacity duration-500"
              style={{
                opacity: timeLeft % 2 === 0 ? 1 : 0.5
              }}
            >
              {timeLeft}s
            </span>
          )}
        </div>
      </div>
    </div>
  );
};


const AnimatedStockPrice = () => {
  return (
    <>
   </>
  );
};
