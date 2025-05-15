import { UserRound } from "lucide-react";

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
    <div className="w-10 h-10 bg-red-600 rounded-md shadow-md relative flex items-center justify-center">
      {/* Add subtle lighting gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-red-500 to-red-700 opacity-50 rounded-md"></div>
      
      {/* Add slightly beveled edge effect */}
      <div className="absolute inset-0.5 bg-red-600 rounded-sm"></div>
      
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
    const currentDiceSum = 8;
    const currentDiceValues = [6, 2]; // The dice values that make up the sum of 8
    
    return (
        <section className="flex flex-col items-center justify-center min-h-[calc(100svh-100px)]">
            <div className="flex flex-col h-screen max-w-2xl w-full mx-auto bg-gray-900 text-white overflow-hidden">
                <div className="flex justify-center py-4">
                    <div className="relative">
                        <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center">
                            <span className="text-4xl font-bold text-white z-10">{currentDiceSum}</span>
                        </div>
                        <div className="bg-black rounded-full w-24 h-24 flex items-center justify-center">
                            <div className="bg-green-500 rounded-full w-20 h-20 flex items-center justify-center">
                                <DiceSet values={currentDiceValues} />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bet locked indicator */}
                <div className="relative mx-4 mb-2">
                    <div className="bg-pink-800 text-center py-1 rounded-full">
                        <div className="font-bold text-pink-300">BET LOCKED!</div>
                    </div>

                    <div className="absolute right-2 bottom-0 flex items-center text-xs">
                        <div className="mr-2">
                            <div className="text-gray-300">Min</div>
                            <div className="font-bold">20</div>
                        </div>
                        <div className="mr-2">
                            <div className="text-gray-300">Max</div>
                            <div className="font-bold">416</div>
                        </div>
                        <div className="text-xl">▼</div>
                    </div>
                </div>

                {/* Betting areas */}
                <div className="relative h-64 mx-4 mb-4">
                    {/* 8-12 Area */}
                    <div className="absolute inset-x-0 top-0 h-32  rounded-t-3xl border-yellow-500 border flex flex-col items-center justify-start pt-4">
                        <div className="text-2xl font-bold text-yellow-400">8~12</div>
                        <div className="text-sm text-yellow-400">1:1</div>
                    </div>

                    {/* Center 7 Area */}
                    <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-24 h-24 bg-red-900 rounded-full border-2 border-yellow-500 flex flex-col items-center justify-center z-10">
                        <div className="text-4xl font-bold text-yellow-400">7</div>
                        <div className="text-sm text-yellow-400">1:4</div>
                    </div>
                    {/* 2-6 Area */}
                    <div className="absolute inset-x-0 bottom-0 h-32 bg-red-900 bg-opacity-70 rounded-b-3xl border-2 border-green-500 flex flex-col items-center justify-end py-4">
                        <div className="text-2xl font-bold text-yellow-400">2~6</div>
                        <div className="text-sm text-yellow-400">1:1</div>
                    </div>
                </div>

                {/* Player info */}
                <div className="bg-purple-950 border-t border-purple-800 px-4 py-2 flex items-center gap-2">
                    <img
                        src="/api/placeholder/36/36"
                        className="w-6 h-6 rounded-full border border-yellow-500"
                        alt="Player"
                    />
                    <div className="text-xs truncate text-gray-300">zzzzsydemop...</div>
                    <div className="flex items-center">
                        <div className="bg-yellow-400 rounded-full w-4 h-4 flex items-center justify-center">
                            <span className="text-xs"></span>
                        </div>
                        <span className="ml-1 text-yellow-400 text-xs">0</span>
                    </div>
                </div>

                {/* Betting statistics */}
                <div className="bg-gray-100 text-black px-2 py-1 flex text-xs">
                    <div className="flex-1 flex items-center">
                        <div className="font-bold">2~6</div>
                        <div className="ml-1 px-1 bg-gray-200 rounded">35%</div>
                    </div>
                    <div className="flex-1 flex items-center">
                        <div className="font-bold">8~12</div>
                        <div className="ml-1 px-1 bg-gray-200 rounded">52%</div>
                    </div>
                    <div className="flex-1 flex items-center">
                        <div className="font-bold">7</div>
                        <div className="ml-1 px-1 bg-gray-200 rounded">13%</div>
                    </div>
                    <div className="flex-2 text-[10px] text-gray-600 ml-1">
                        calculated from<br />
                        last 50 rounds
                    </div>
                </div>

                {/* Dice history */}
                <div className="bg-gray-200 flex p-1 overflow-x-auto">
                    {diceHistory.map((diceSum, index) => {
                        // Map the dice sums to specific dice combinations
                        let diceValues;
                        switch(diceSum) {
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
