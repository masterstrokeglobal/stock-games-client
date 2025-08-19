import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { useAuthStore } from '@/context/auth-context';
import User from '@/models/user';
import { PopoverClose } from '@radix-ui/react-popover';
import { ArrowLeft, ChevronLeft, X } from 'lucide-react';
import React, { useState } from 'react';
import HowToPlayDialog from './how-to-play';
import GameRulesDialog from '../stock-roulette/game-rules';
import { Separator } from '@/components/ui/separator';
import GameHistoryDialog from '../stock-roulette/game-history';
import Link from 'next/link';

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
            <PopoverContent className="md:w-80 w-64 p-0 game-gradient-card border-platform-border shadow-lg " align="end" onInteractOutside={(e) => e.preventDefault()} onPointerDownOutside={(e) => e.preventDefault()}     >
                <div
                    className="w-full max-w-sm rounded-3xl shadow-2xl overflow-hidden">
                    {/* Header */}
                    <PopoverClose asChild>
                        <button
                            className="text-white absolute top-2 right-2 hover:text-gray-200 transition-colors"
                        >
                            <X size={24} />
                        </button>
                    </PopoverClose>
                    {/* Menu Items */}
                    <div className="p-6 space-y-3">

                        <Link href="/game">
                            <button className="w-full text-left">
                                <span className="text-white h-10 font-light flex items-center gap-2"> <ChevronLeft className='size-4' /> Back to Game</span>
                            </button>
                        </Link>
                        <Separator className="bg-platform-border" />
                        {/* How to Play */}
                        <HowToPlayDialog>
                            <button className="w-full   text-left">
                                <span className="text-white h-10 font-light">How to Play ?</span>
                            </button>
                        </HowToPlayDialog>
                        <Separator className="bg-platform-border" />
                        <GameRulesDialog>
                            <button className="w-full   text-left">
                                <span className="text-white h-10 font-light">Game Rules</span>
                            </button>
                        </GameRulesDialog>
                        <Separator className="bg-platform-border" />
                        <GameHistoryDialog>
                            <button className="w-full   text-left">
                                <span className="text-white h-10 font-light">Game History</span>
                            </button>
                        </GameHistoryDialog>
                        <Separator className="bg-platform-border" />
                        <Link href="/game/single-player/stock-roulette/betting-history">
                            <button className="w-full text-left h-10">
                                <span className="text-white font-light">Bet History</span>
                            </button>
                        </Link>
                                            </div>
                </div>
            </PopoverContent>
        </Popover>
    );
};

export default GameSettingsPopover;