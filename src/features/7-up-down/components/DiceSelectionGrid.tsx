import React from 'react';
import { DiceSet } from './DiceSet';

export const DiceSelectionGrid: React.FC = () => {
  const diceCombinations = [
    [1, 1], [1, 2], [1, 3], [1, 4], [1, 5], [1, 6],
    [2, 1], [2, 2], [2, 3], [2, 4], [2, 5], [2, 6]
  ];

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