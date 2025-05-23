// import React from 'react';
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { BetLockedBanner } from './components/BetLockedBanner';
// import { DiceSelectionGrid } from './components/DiceSelectionGrid';
// import { AnimatedStockPrice } from './components/AnimatedStockPrice';

// const SevenUpSevenDown: React.FC = () => {
//   const diceHistory = [8, 11, 14, 17];

//   return (
//     <section className="flex flex-col items-center justify-center min-h-[calc(100svh-100px)]">
//       <div className="flex flex-col min-h-screen max-w-2xl w-full mx-auto bg-gray-900 text-white overflow-hidden">
//         <AnimatedStockPrice />

//         {/* Betting areas */}
//         <div 
//           style={{ 
//             backgroundImage: 'url(/images/7-up.png)', 
//             backgroundSize: 'cover', 
//             backgroundPosition: 'center' 
//           }} 
//           className="relative md:px-12 px-4 pt-20 pb-4 bg-opacity-10 bg-brown-900"
//         >
//           <BetLockedBanner />
          
//           <div className="relative h-64 w-full">
//             {/* 8-12 Area */}
//             <div className="absolute inset-x-0 top-0 h-32 hover:scale-[1.02] cursor-pointer transition-all duration-300 bg-yellow-500 bg-opacity-20 rounded-t-3xl border-yellow-500 border-2 flex flex-col items-center justify-start pt-4">
//               <div className="text-2xl font-bold text-yellow-400">8~12</div>
//               <div className="text-sm text-yellow-400">1:2</div>
//             </div>

//             {/* Center 7 Area */}
//             <div className="absolute left-1/2 top-1/2 hover:scale-[1.02] transition-all duration-300 transform -translate-x-1/2 -translate-y-1/2 w-24 h-24 bg-red-900 rounded-full border-2 border-yellow-500 flex flex-col items-center justify-center z-10">
//               <div className="text-4xl font-bold text-yellow-400">7</div>
//               <div className="text-sm text-yellow-400">1:4</div>
//             </div>

//             {/* 2-6 Area */}
//             <div className="absolute inset-x-0 bottom-0 cursor-pointer hover:scale-[1.02] transition-all duration-300 h-32 bg-yellow-500 bg-opacity-20 rounded-b-3xl border-2 border-yellow-500 flex flex-col items-center justify-end py-4">
//               <div className="text-2xl font-bold text-yellow-400">1~6</div>
//               <div className="text-sm text-yellow-400">1:2</div>
//             </div>
//           </div>

//           <div className="flex flex-row w-full mt-8 flex-wrap md:gap-4 gap-2">
//             <Button className="active-menu-button font-semibold text-base rounded-full flex-1">
//               50
//             </Button>
//             <Button className="play-button font-semibold rounded-full flex-1">
//               100
//             </Button>
//             <Button className="gold-button font-semibold rounded-full flex-1">
//               500
//             </Button>
//             <Button className="options-button font-semibold text-base rounded-full flex-1">
//               1000
//             </Button>
//           </div>
//           <Input placeholder="Enter your bet amount" className="w-full mt-2" />
//         </div>

//         {/* Betting statistics */}
//         <div className="bg-gray-100 text-black px-2 py-1 flex text-xs">
//           <div className="flex-2 text-sm text-gray-600 ml-1">
//             calculated from last 10 rounds
//           </div>
//         </div>

//         {/* Dice history */}
//         <div className="bg-gray-200 flex p-1 overflow-x-auto">
//           {diceHistory.map((diceSum, index) => (
//             <div
//               key={index}
//               className={`w-8 h-8 flex items-center justify-center mx-0.5 text-sm font-bold 
//                           ${diceSum === 8 ? 'bg-green-500' : 'bg-gray-300'} relative`}
//             >
//               <div className="absolute inset-0 flex items-center justify-center">
//                 {diceSum}
//               </div>
//             </div>
//           ))}
//         </div>

//         {/* Dice selection grid */}
//         <DiceSelectionGrid />
//       </div>
//     </section>
//   );
// };

// export default SevenUpSevenDown; 