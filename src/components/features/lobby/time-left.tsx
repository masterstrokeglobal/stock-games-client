import React, { useState, useEffect } from 'react';
import { Timer } from 'lucide-react';

const TimeLeft = ({ endTime }: { endTime: Date }) => {
  const [timeLeft, setTimeLeft] = useState<number>(0);

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date();
      const diff = Math.max(0, Math.floor((endTime.getTime() - now.getTime()) / 1000));
      setTimeLeft(diff);
    };

    // Calculate initial time left
    calculateTimeLeft();

    // Only set up interval if there's still time left
    if (timeLeft > 0) {
      const interval = setInterval(calculateTimeLeft, 1000);
      return () => clearInterval(interval);
    }
  }, [endTime, timeLeft]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
    <div className="flex items-center gap-2">
      <Timer className={`w-5 h-5 ${timeLeft === 0 ? 'text-white' : 'text-white'}`} />
      <span className={timeLeft === 0 ? 'text-white' : 'text-white'}>
        {minutes}m {seconds.toString().padStart(2, '0')}s
      </span>
    </div>
  );
};

export default TimeLeft;