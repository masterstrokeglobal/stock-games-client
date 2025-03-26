import { useGameType } from '@/hooks/use-game-type';
import { cn, indianNames, secondNames } from '@/lib/utils';
import { SchedulerType } from '@/models/market-item';
import { useEffect, useState } from 'react';

type WinnerData = {
  id: number;
  username: string;
  amount: number;
};

// Generate a unique username with randomness and suffixes
const generateUniqueUsername = (used: Set<string>): string => {
  let attempt = 0;
  let username = '';

  while (attempt < 20) {
    const baseName = indianNames[Math.floor(Math.random() * indianNames.length)];
    const secondName = secondNames[Math.floor(Math.random() * secondNames.length)];
    const suffixes = ['win', 'pro', 'king', 'zone', 'guru', 'champ', 'x'];
    const suffix = suffixes[Math.floor(Math.random() * suffixes.length)];
    const variation = Math.floor(Math.random());
    username = `${baseName}_${secondName}_${suffix}${variation}`;

    //make it random  add seconda name suffix variation at random

    if (variation === 1) {
      username = `${baseName}_${secondName}_${suffix}${Math.floor(Math.random() * 10)}`;
    } else {
      username = `${baseName}_${secondName}_${suffix}`; 
    }
    


    if (!used.has(username)) {
      used.add(username);
      return username;
    }

    attempt++;
  }

  // Fallback if all attempts failed
  const fallback = `User_${Date.now().toString(36)}_${Math.floor(Math.random() * 9999)}`;
  used.add(fallback);
  return fallback;
};

// Generate amount based on game type
const generateAmount = (isCrypto: boolean): number => {
  const rand = Math.random();

  if (isCrypto) {
    return Math.floor(Math.random() * 20000) + Math.floor(rand * 5) * 20000;
  } else {
    if (rand < 0.5) return Math.floor(Math.random() * 4900) + 100;
    if (rand < 0.8) return Math.floor(Math.random() * 15000) + 5000;
    if (rand < 0.95) return Math.floor(Math.random() * 30000) + 20000;
    return Math.floor(Math.random() * 40000) + 50000;
  }
};

// Main function to create fake leaderboard
const generateLeaderboardData = (count: number, isCrypto: boolean): WinnerData[] => {
  const data: WinnerData[] = [];
  const usedUsernames = new Set<string>();

  while (data.length < count) {
    const username = generateUniqueUsername(usedUsernames);
    data.push({
      id: data.length + 1,
      username,
      amount: generateAmount(isCrypto),
    });
  }

  return data;
};

const UserWins = ({ className }: { className?: string }) => {
  const [type] = useGameType();
  const [displayWinnings, setDisplayWinnings] = useState<WinnerData[]>([]);

  useEffect(() => {
    
    const refreshData = () => {
      const isCrypto = type === SchedulerType.CRYPTO;
      const data = generateLeaderboardData(20, isCrypto);
      console.log('Generated new leaderboard data:', data);

      setDisplayWinnings(data);
    };

    refreshData(); // Initial load

    const interval = setInterval(refreshData, 20000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, [type]);


  return (
    <div className={cn("w-full overflow-hidden bg-black/80 text-white p-2 text-xs h-6", className)}>
      <div className="flex animate-marquee space-x-8">
        {[...displayWinnings, ...displayWinnings].map((winner, index) => (
          <div
            key={`${winner.username}-${index}`}
            className="flex items-center space-x-4 whitespace-nowrap"
          >
            <span className="text-green-400 font-medium">
              ₹{winner.amount.toLocaleString('en-IN')}
            </span>
            <span className="text-white opacity-90">{winner.username}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserWins;
