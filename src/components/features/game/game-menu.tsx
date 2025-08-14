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
import React, { useState } from 'react';
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
            <PopoverContent className="md:w-80 w-64 p-0 bg-[#000E37] border-none" align="end" onInteractOutside={(e) => e.preventDefault()} onPointerDownOutside={(e) => e.preventDefault()}     >
                <div 
                    className="w-full max-w-sm rounded-3xl shadow-2xl overflow-hidden">
                    {/* Header */}
                    <div className="flex items-center justify-between p-6 pb-4">
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

                    {/* Menu Items */}
                    <div className="p-6 space-y-3">

                        {/* How to Play */}
                        <HowToPlayDialog>
                            <button className="w-full  h-14 text-left">
                                <span className="text-white text-lg font-light">How to Play ?</span>
                            </button>
                        </HowToPlayDialog>

                    </div>
                </div>
            </PopoverContent>
        </Popover>
    );
};

export default GameSettingsPopover;