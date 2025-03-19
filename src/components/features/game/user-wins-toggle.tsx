import { useGameType } from '@/hooks/use-game-type';
import { cn, indianNames } from '@/lib/utils';
import { SchedulerType } from '@/models/market-item';
import { useCallback, useEffect, useRef, useState } from 'react';

// Define types for our data structures
type WinnerData = {
    id: number;
    username: string;
    amount: number;
};

const UserWins = ({ className }: { className?: string }) => {
    const [displayWinnings, setDisplayWinnings] = useState<WinnerData[]>([]);
    const allWinningsRef = useRef<WinnerData[]>([]);
    const [type] = useGameType();

    // Generate usernames and amounts
    const generateLeaderboardData = useCallback((count = 100): WinnerData[] => {
        const isCrypto = type === SchedulerType.CRYPTO;
        
        const generateUsername = (): string => {
            const firstName = indianNames[Math.floor(Math.random() * indianNames.length)];
            const suffix = Math.floor(Math.random() * 1000);
            return `${firstName}${suffix}`;
        };

        const generateAmount = (): number => {
            if (isCrypto) {
                // More even distribution for crypto
                const rand = Math.random();
                
                if (rand < 0.2) {
                    // 0-20k (20%)
                    return Math.floor(Math.random() * 20000);
                } else if (rand < 0.4) {
                    // 20k-40k (20%)
                    return Math.floor(Math.random() * 20000) + 20000;
                } else if (rand < 0.6) {
                    // 40k-60k (20%)
                    return Math.floor(Math.random() * 20000) + 40000;
                } else if (rand < 0.8) {
                    // 60k-80k (20%)
                    return Math.floor(Math.random() * 20000) + 60000;
                } else {
                    // 80k-100k (20%)
                    return Math.floor(Math.random() * 20000) + 80000;
                }
            } else {
                // For NSE, completely revamped distribution
                const rand = Math.random();
                
                if (rand < 0.5) {
                    // 50% chance to be between 100 and 5000
                    return Math.floor(Math.random() * 4900) + 100;
                } else if (rand < 0.8) {
                    // 30% chance to be between 5000 and 20000
                    return Math.floor(Math.random() * 15000) + 5000;
                } else if (rand < 0.95) {
                    // 15% chance to be between 20000 and 50000
                    return Math.floor(Math.random() * 30000) + 20000;
                } else {
                    // 5% chance to be between 50000 and 90000
                    return Math.floor(Math.random() * 40000) + 50000;
                }
            }
        };

        const data: WinnerData[] = [];
        for (let i = 0; i < count; i++) {
            const amount = generateAmount();
            data.push({
                id: i + 1,
                username: generateUsername(),
                amount: amount
            });
        }

        return data;
    }, [type]);

    // Initialize data on first render or when type changes
    useEffect(() => {
        const data = generateLeaderboardData(100);
        setDisplayWinnings(data);
        allWinningsRef.current = data;
    }, [generateLeaderboardData, type]);

    const updateWinnings = useCallback(() => {
        const isCrypto = type === SchedulerType.CRYPTO;
        const isNSE = type === SchedulerType.NSE;
        
        // Get current time in Indian Standard Time (IST)
        const now = new Date();
        // Create a formatter that will output time in IST
        const formatter = new Intl.DateTimeFormat('en-US', {
            timeZone: 'Asia/Kolkata',
            hour: 'numeric',
            minute: 'numeric',
            hour12: false
        });
        
        // Get time as HH:MM format in IST
        const istTimeStr = formatter.format(now);
        const [hoursStr, minutesStr] = istTimeStr.split(':');
        const hours = parseInt(hoursStr, 10);
        const minutes = parseInt(minutesStr, 10);
        const currentTime = hours * 60 + minutes;

        // Stock market timing checks (in IST)
        const marketCloseTime = 15 * 60 + 30; // 3:30 PM IST
        const marketOpenTime = 9 * 60 + 15;   // 9:15 AM IST

        const updatedWinnings = allWinningsRef.current.map(winner => {
            // NSE market closes at 3:30 PM - reset to 0-1000 range
            if (isNSE && currentTime >= marketCloseTime) {
                // Generate a completely new amount between 0 and 1000
                return { ...winner, amount: Math.floor(Math.random() * 1001) };
            }

            // For normal market hours operations
            else if (currentTime >= marketOpenTime) {
                // Different volatility approaches for different game types
                if (isCrypto) {
                    // Crypto: 60% chance to increase, 40% chance to decrease
                    const changeDirection = Math.random() < 0.6 ? 1 : -1;
                    const changePercent = Math.random() * 0.15; // 0-15% change
                    const newAmount = Math.floor(winner.amount * (1 + changeDirection * changePercent));
                    return { ...winner, amount: Math.max(100, newAmount) }; // Minimum 100
                } else {
                    // NSE: More conservative changes
                    const changeDirection = Math.random() < 0.55 ? 1 : -1; // Slightly bullish
                    const changePercent = Math.random() * 0.08; // 0-8% change
                    const newAmount = Math.floor(winner.amount * (1 + changeDirection * changePercent));
                    return { ...winner, amount: Math.max(100, newAmount) }; // Minimum 100
                }
            }
            
            // Default case - keep same amount
            return winner;
        });

        
        
        // Update both state and ref
        allWinningsRef.current = updatedWinnings;
        setDisplayWinnings(updatedWinnings);
    }, [type]); // Type dependency to reflect changes

    // Setup interval for updates
    useEffect(() => {
        // Initial update
        updateWinnings();

        // Set up interval to update every 10 seconds
        const interval = setInterval(updateWinnings, 10000);

        // Cleanup interval on component unmount
        return () => clearInterval(interval);
    }, [updateWinnings]);

    return (
        <div className={cn("w-full overflow-hidden bg-black/80 text-white p-2 text-xs h-6", className)}>
            <div className="flex animate-marquee space-x-8">
                {[...displayWinnings, ...displayWinnings].map((winner, index) => (
                    <div 
                        key={`${winner.id}-${index}`} 
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