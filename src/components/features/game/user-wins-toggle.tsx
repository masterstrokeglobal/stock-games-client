import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from '@/components/ui/button';
import { Trophy } from 'lucide-react';
import { cn } from '@/lib/utils';

// Define types for our data structures
type WinnerData = {
    id: number;
    username: string;
    amount: number;
};

type ContentVariants = {
    hidden: {
        height: number;
        width: number;
        opacity: number;
        transition: {
            duration: number;
            ease: string;
        };
    };
    visible: {
        height: string;
        width: string;
        opacity: number;
        transition: {
            duration: number;
            ease: string;
        };
    };
};

// Generate usernames and amounts
const generateLeaderboardData = (count = 100): WinnerData[] => {
    const usernames: string[] = [
        "PokerPro", "CardShark", "RoyalFlush", "AceKing", "HighRoller",
        "BigStack", "LuckyDraw", "FullHouse", "TopDeck", "WildCard",
        "JackpotWinner", "PokerFace", "AllIn", "ChipLeader", "TableKing",
        "DeuceWild", "StraightDraw", "FlushHunter", "PotSplitter", "BluffMaster"
    ];

    const generateUsername = (): string => {
        const base = usernames[Math.floor(Math.random() * usernames.length)];
        const suffix = Math.floor(Math.random() * 1000);
        return `${base}${suffix}`;
    };

    const generateAmount = (): number => {
        return Math.floor(Math.random() * 9000) + 1000;
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


const UserWins = ({ className }: PropsWithClassName) => {
    const [isOpen, setIsOpen] = useState<boolean>(true);
    const [allWinnings, setAllWinnings] = useState<WinnerData[]>([]);
    const [displayWinnings, setDisplayWinnings] = useState<WinnerData[]>([]);

    useEffect(() => {
        const data = generateLeaderboardData(100);
        setAllWinnings(data);
        setDisplayWinnings(data.slice(0, 5));
    }, []);

    useEffect(() => {
        if (allWinnings.length === 0) return;

        const interval = setInterval(() => {
            const updatedWinnings = allWinnings.map(winner => ({
                ...winner,
                amount: Math.floor(winner.amount * (0.95 + Math.random() * 0.1))
            }));

            const sortedWinnings = [...updatedWinnings].sort((a, b) => b.amount - a.amount);
            setAllWinnings(sortedWinnings);
            setDisplayWinnings(sortedWinnings.slice(0, 5));
        }, 2000);

        return () => clearInterval(interval);
    }, [allWinnings]);

    const toggleLeaderboard = (): void => {
        setIsOpen(!isOpen);
    };

    const contentVariants: ContentVariants = {
        hidden: {
            height: 0,
            width: 0,
            opacity: 0,
            transition: {
                duration: 0.3,
                ease: "easeInOut"
            }
        },
        visible: {
            height: "auto",
            width: "100%",
            opacity: 1,
            transition: {
                duration: 0.3,
                ease: "easeInOut"
            }
        }
    };

    return (
        <div className={cn(`relative transition-all z-50 duration-300 ${isOpen ? "w-64" : "w-10"}`, className)}>

            <div className="absolute inset-0  rounded-lg bg-transparent" />
            <div className="relative z-10 overflow-hidden rounded-lg border   ">
                <AnimatePresence initial={false}>
                    {isOpen && (
                        <motion.div
                            initial="hidden"
                            animate="visible"
                            exit="hidden"
                            variants={contentVariants}

                            className=" backdrop-blur-sm"
                        >
                            <div className="divide-y divide-gray-700/30">
                                {displayWinnings.map((winner) => (
                                    <motion.div
                                        key={winner.id}
                                        className="flex items-center py-2 px-3"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        <span className="text-yellow-500 font-medium mr-3 w-20 text-right">
                                            ₹{winner.amount.toLocaleString('en-IN')}
                                        </span>
                                        <span className="text-white opacity-90">{winner.username}</span>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                <div className="bg-secondary-game p-1 flex justify-end">
                    <Button
                        variant="ghost"
                        size="sm"
                        className="bg-primary-game p-1 rounded-full"
                        onClick={toggleLeaderboard}
                    >

                        <Trophy className="h-5 w-5 text-white" />
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default UserWins;