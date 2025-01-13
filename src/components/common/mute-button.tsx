// MuteButton.tsx
import { useAudio } from '@/context/audio-context';
import React from 'react';
import { Button } from '../ui/button';
import { Volume2Icon, VolumeOff } from 'lucide-react';

export const MuteButton: React.FC = () => {
    const { isMuted, toggleMute } = useAudio();

    return (
        <Button onClick={toggleMute} className="px-4 py-2 text-white bg-[#122146] border border-[#EFF8FF17]  h-11 rounded-full ">
            {isMuted ? <VolumeOff size={24} /> : <Volume2Icon size={24} />}
        </Button>
    );
};
