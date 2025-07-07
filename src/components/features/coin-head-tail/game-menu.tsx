import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { useAuthStore } from '@/context/auth-context';
import User from '@/models/user';
import { PopoverClose } from '@radix-ui/react-popover';
import { X } from 'lucide-react';
import Link from 'next/link';
import React, { useState } from 'react';
import BettingHistoryDialog from './betting-history';
import GameHistoryDialog from './game-history';
import HowToPlayDialog from './how-to-play';

interface GameSettingsPopoverProps {
    children: React.ReactNode;
}

const GameSettingsPopover = ({ children }: GameSettingsPopoverProps) => {
    const [open, setOpen] = useState(false);
    const { userDetails } = useAuthStore()

    const user = userDetails as User;
    return (
        <Popover open={open} onOpenChange={setOpen} >
            <PopoverTrigger asChild>
                {children}
            </PopoverTrigger>
            <PopoverContent className="md:w-80 w-64 p-0 border-none bg-transparent" align="end" onInteractOutside={(e) => e.preventDefault()} onPointerDownOutside={(e) => e.preventDefault()}     >
                <div style={{
                    background: 'linear-gradient(180deg, #002A5A 0%, #0A023B 100%)',
                }}
                    className="w-full border border-[#0074FF]  max-w-sm rounded-3xl shadow-2xl overflow-hidden">
                    {/* Header */}
                    <div className="flex items-center border-b border-[#0074FF]  bg-[#004DA9] justify-between p-6 pb-4">
                        <div className="flex items-center space-x-3">
                            <Avatar>
                                <AvatarImage src={user?.profileImage} />
                                <AvatarFallback>{user?.name?.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <span className="text-white  font-medium">{user?.name}</span>
                        </div>

                        <PopoverClose asChild>
                            <button
                                className="text-white hover:text-gray-200 transition-colors"
                            >
                                <X size={24} />
                            </button>
                        </PopoverClose>
                    </div>

                    {/* Divider */}

                    {/* Menu Items */}
                    <div className="p-6 space-y-3">
                        {/* My Bet History */}
                        <BettingHistoryDialog>
                            <button className="w-full border-b h-14 px-4 border-[#0074FF] text-[#BEDBFF] text-left">
                                <span className="text-[#BEDBFF] text-lg font-light">My Bet History</span>
                            </button>
                        </BettingHistoryDialog>

                        {/* Divider */}

                        {/* Game History */}
                        <GameHistoryDialog>
                            <button className="w-full border-b h-14 px-4 border-[#0074FF] text-[#BEDBFF] text-left">
                                <span className="text-[#BEDBFF] text-lg font-light">Game History</span>
                            </button>
                        </GameHistoryDialog>    

                        {/* Divider */}

                        {/* How to Play */}
                        <HowToPlayDialog>
                            <button className="w-full border-b h-14 px-4 border-[#0074FF] text-[#BEDBFF] text-left">
                                <span className="text-[#BEDBFF] text-lg font-light">How to Play ?</span>
                            </button>
                        </HowToPlayDialog>

                        <HowToPlayDialog>
                            <button className="w-full border-b h-14 px-4 border-[#0074FF] text-[#BEDBFF] text-left">
                                <span className="text-[#BEDBFF] text-lg font-light">Game Rules</span>
                            </button>
                        </HowToPlayDialog>
                    </div>

                    {/* Home Button */}
                    <div className="p-6 pt-12">
                        <Link href="/game/platform">
                            <button className="w-full bg-[#0074FF] hover:bg-[#0074FF] text-white text-xl font-medium py-4 rounded-2xl transition-colors shadow-lg">
                                Home
                            </button>
                        </Link>
                    </div>
                </div>
            </PopoverContent>
        </Popover>
    );
};

export default GameSettingsPopover;