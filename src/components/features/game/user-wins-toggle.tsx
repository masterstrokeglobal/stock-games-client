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
    const generateLeaderboardData = useCallback((count = 5): WinnerData[] => {
        const isCrypto = type === SchedulerType.CRYPTO;

        const generateUsername = (): string => {
            // Create a more random selection of names and suffixes
            const firstName = indianNames[Math.floor(Math.random() * indianNames.length)];
            const suffixTypes = [
                () => Math.floor(Math.random() * 1000).toString().padStart(3, '0'), // Numeric suffix
                () => String.fromCharCode(65 + Math.floor(Math.random() * 26)), // Random uppercase letter
                () => `_${Math.random().toString(36).substring(2, 7)}` // Random alphanumeric string
            ];
            const suffixGenerator = suffixTypes[Math.floor(Math.random() * suffixTypes.length)];
            return `${firstName}${suffixGenerator()}`;
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
        const usedUsernames = new Set<string>();

        while (data.length < count) {
            const username = generateUsername();
            
            // Ensure unique usernames
            if (!usedUsernames.has(username)) {
                const amount = generateAmount();
                data.push({
                    id: data.length + 1,
                    username,
                    amount: amount
                });
                usedUsernames.add(username);
            }
        }

        return data;
    }, [type]);

    // Rest of the component remains the same as in the original code...
    
    // Initialize data on first render or when type changes
    useEffect(() => {
        const data = generateLeaderboardData(100);
        setDisplayWinnings(data);
        allWinningsRef.current = data;
    }, [generateLeaderboardData, type]);

    // ... (rest of the code remains unchanged)

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