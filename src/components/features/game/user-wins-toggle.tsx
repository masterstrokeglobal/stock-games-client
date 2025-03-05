import { cn, indianNames } from '@/lib/utils';
import { useCallback, useEffect, useRef, useState } from 'react';

// Define types for our data structures
type WinnerData = {
    id: number;
    username: string;
    amount: number;
};

// Comprehensive list of Indian names


// Generate usernames and amounts
const generateLeaderboardData = (count = 100): WinnerData[] => {
    const generateUsername = (): string => {
        const firstName = indianNames[Math.floor(Math.random() * indianNames.length)];
        const suffix = Math.floor(Math.random() * 1000);
        return `${firstName}${suffix}`;
    };

    const generateAmount = (): number => {
        return Math.floor(Math.random() * 50000) + 1000;
    };

    const data: WinnerData[] = [];
    for (let i = 0; i < count; i++) {
        data.push({
            id: i + 1,
            username: generateUsername(),
            amount: generateAmount()
        });
    }

    return data.sort((a, b) => b.amount - a.amount);
};

const UserWins = ({ className }: { className?: string }) => {
    const [displayWinnings, setDisplayWinnings] = useState<WinnerData[]>([]);
    const allWinningsRef = useRef<WinnerData[]>([]);

    // Initialize data on first render
    useEffect(() => {
        const data = generateLeaderboardData(100);
        setDisplayWinnings(data);
        allWinningsRef.current = data;
    }, []);

    // Use useCallback to memoize the update function
    const updateWinnings = useCallback(() => {
        const now = new Date();
        const hours = now.getHours();
        const minutes = now.getMinutes();
        const currentTime = hours * 60 + minutes;

        // Stock market timing checks
        const marketCloseTime = 15 * 60 + 30; // 3:30 PM
        const marketOpenTime = 9 * 60 + 15;   // 9:15 AM

        const updatedWinnings = allWinningsRef.current.map(winner => {
            let newAmount = winner.amount;

            // Decrease amount after 3:30 PM
            if (currentTime >= marketCloseTime) {
                newAmount = Math.max(1000, Math.floor(winner.amount * (0.9 + Math.random() * 0.1)));
            }
            // Start rising after 9:15 AM
            else if (currentTime >= marketOpenTime) {
                newAmount = Math.floor(winner.amount * (1 + Math.random() * 0.1));
            }

            return { ...winner, amount: newAmount };
        });

        const sortedWinnings = [...updatedWinnings].sort((a, b) => b.amount - a.amount);
        
        // Update both state and ref
        allWinningsRef.current = sortedWinnings;
        setDisplayWinnings(sortedWinnings);
    }, []); // Empty dependency array to prevent unnecessary re-creation

    // Setup interval for updates
    useEffect(() => {
        // Initial update
        updateWinnings();

        // Set up interval to update every 2 seconds
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