import React from 'react';
import { Die } from './Die';

interface DiceSetProps {
  values: number[];
}

export const DiceSet: React.FC<DiceSetProps> = ({ values }) => {
  return (
    <div className="flex gap-2">
      <Die value={values[0]} />
      <Die value={values[1]} />
    </div>
  );
}; 