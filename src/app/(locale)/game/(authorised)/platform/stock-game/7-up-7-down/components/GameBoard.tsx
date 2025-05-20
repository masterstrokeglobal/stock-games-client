import React, { PropsWithChildren } from 'react';
import { RoundRecord } from '@/models/round-record';
import { useCreateSevenUpDownPlacement } from '@/react-query/7-up-down';
import { SevenUpDownPlacementType } from '@/models/seven-up-down';
import { useIsPlaceOver } from '@/hooks/use-current-game';

export const GameBoard: React.FC<PropsWithChildren<{ roundRecord: RoundRecord, amount: number }>> = ({ roundRecord, children, amount }) => {

  const { mutate } = useCreateSevenUpDownPlacement();
  const isPlaceOver = useIsPlaceOver(roundRecord);

  const handleBoardClick = (type: SevenUpDownPlacementType) => {
    if (isPlaceOver) return;
    mutate({
      roundId: roundRecord.id,
      placement: type,
      amount: amount,
    });
  }

  return (
    <div style={{ backgroundImage: 'url(/images/7-up.png)', backgroundSize: 'cover', backgroundPosition: 'center' }} className="relative md:px-12 px-4 pt-20 pb-4 bg-opacity-10 bg-brown-900">
      {children}
      <div className="relative h-64 w-full">
        {/* 8-12 Area */}
        <div onClick={() => handleBoardClick(SevenUpDownPlacementType.UP)} className="absolute inset-x-0 top-0 h-32 hover:scale-[1.02] cursor-pointer transition-all duration-300 bg-yellow-500 bg-opacity-20 rounded-t-3xl border-yellow-500 border-2 flex flex-col items-center justify-start pt-4">
          <div className="text-2xl font-bold text-yellow-400">8~12</div>
          <div className="text-sm text-yellow-400">1:2</div>
        </div>

        {/* Center 7 Area */}
        <div onClick={() => handleBoardClick(SevenUpDownPlacementType.SEVEN)} className="absolute cursor-pointer hover:bg-red-950 left-1/2 top-1/2 hover:scale-[1.02] transition-all duration-300 transform -translate-x-1/2 -translate-y-1/2 w-24 h-24 bg-red-900 rounded-full border-2 border-yellow-500 flex flex-col items-center justify-center z-10">
          <div className="text-4xl font-bold text-yellow-400">7</div>
          <div className="text-sm text-yellow-400">1:4</div>
        </div>

        {/* 2-6 Area */}
        <div onClick={() => handleBoardClick(SevenUpDownPlacementType.DOWN)} className="absolute inset-x-0 bottom-0 cursor-pointer hover:scale-[1.02] transition-all duration-300 h-32 bg-yellow-500 bg-opacity-20 rounded-b-3xl border-2 border-yellow-500 flex flex-col items-center justify-end py-4">
          <div className="text-2xl font-bold text-yellow-400">1~6</div>
          <div className="text-sm text-yellow-400">1:2</div>
        </div>
      </div>
    </div>
  );
};


{/* <div className="w-fit h-12 text-[10px] bg-green-500 font-semibold rounded-xl p-2 text-center flex items-center justify-center absolute top-1 left-1">TATA</div>
          <div className="w-fit h-12 text-[10px] bg-red-500 font-semibold rounded-xl p-2 text-center flex items-center justify-center absolute top-12 left-4">RELIANCE</div>
          <div className="w-fit h-12 text-[10px] bg-blue-500 font-semibold rounded-xl p-2 text-center flex items-center justify-center absolute top-2 right-2">INFOSYS</div>
          <div className="w-fit h-12 text-[10px] bg-yellow-500 font-semibold rounded-xl p-2 text-center flex items-center justify-center absolute top-16 right-4">WIPRO</div>
          <div className="w-fit h-12 text-[10px] bg-purple-500 font-semibold rounded-xl p-2 text-center flex items-center justify-center absolute top-8 left-20">TCS</div>
          <div className="w-fit h-12 text-[10px] bg-orange-500 font-semibold rounded-xl p-2 text-center flex items-center justify-center absolute top-4 right-16">HDFC</div>
          <div className="w-fit h-12 text-[10px] bg-pink-500 font-semibold rounded-xl p-2 text-center flex items-center justify-center absolute top-20 left-32">ICICI</div>
          <div className="w-fit h-12 text-[10px] bg-indigo-500 font-semibold rounded-xl p-2 text-center flex items-center justify-center absolute top-6 right-28">AXIS</div>
          <div className="w-fit h-12 text-[10px] bg-teal-500 font-semibold rounded-xl p-2 text-center flex items-center justify-center absolute top-14 left-48">SBI</div>
          <div className="w-fit h-12 text-[10px] bg-gray-500 font-semibold rounded-xl p-2 text-center flex items-center justify-center absolute top-8 right-40">BAJAJ</div>
          <div className="w-fit h-12 text-[10px] bg-cyan-500 font-semibold rounded-xl p-2 text-center flex items-center justify-center absolute top-10 right-52">ADANI</div> */}
