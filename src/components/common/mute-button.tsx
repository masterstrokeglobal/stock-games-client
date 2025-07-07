// MuteButton.tsx
import { useAudio } from '@/context/audio-context';
import { cn } from '@/lib/utils';
import { Volume2Icon, VolumeOff } from 'lucide-react';
import React from 'react';
export const MuteButton: React.FC<PropsWithClassName> = ({ className }) => {
    const { isMuted, toggleMute } = useAudio();

    return (
        <button onClick={toggleMute} className={cn("px-4 py-2 h-10 flex items-center justify-center rounded-md ", className)}>
            {isMuted ? <VolumeOff className='text-platform-text' size={20} /> : <Volume2Icon className='text-platform-text'  size={20} />}
        </button>
    );
};
