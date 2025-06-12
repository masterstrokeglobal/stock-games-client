// MuteButton.tsx
import { useAudio } from '@/context/audio-context';
import React from 'react';
import { Button } from '../ui/button';
import { Volume2Icon, VolumeOff } from 'lucide-react';
import { cn } from '@/lib/utils';   
export const MuteButton: React.FC<PropsWithClassName> = ({ className }) => {
    const { isMuted, toggleMute } = useAudio();

    return (
        <Button onClick={toggleMute} className={cn("px-4 py-2 bg-secondary-game aspect-square text-game-text border border-[#EFF8FF17]  h-10 rounded-md ", className)}>
            {isMuted ? <VolumeOff size={20} /> : <Volume2Icon size={20} />}
        </Button>
    );
};
