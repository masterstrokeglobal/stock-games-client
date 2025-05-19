import React, { useEffect, useState } from 'react';

export const BetLockedBanner: React.FC = () => {
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
        <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-pink-500 to-pink-400 opacity-50"></div>
        <div className="absolute inset-x-8 bottom-0 h-1/2 rounded-b-full bg-gradient-to-r from-pink-900 via-pink-700 to-pink-900"></div>

        <div className="flex flex-col items-center justify-center">
          <span className="text-white font-bold tracking-wider relative z-10 mr-2">
            {isLocked ? "BET LOCKED!" : "BET UNLOCKED!"}
          </span>

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