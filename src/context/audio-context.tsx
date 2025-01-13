// AudioProvider.tsx
import  { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Howl, Howler } from 'howler';
const AudioContext = createContext<AudioContextType | null>(null);

interface AudioProviderProps {
  children: ReactNode;
}

export const AudioProvider: React.FC<AudioProviderProps> = ({ children }) => {
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [bgMusic, setBgMusic] = useState<Howl | null>(null);
  const [horseRaceSounds, setHorseRaceSounds] = useState<HorseRaceSounds | null>(null);
  const [isHorseRacePlaying, setIsHorseRacePlaying] = useState<boolean>(false);

  useEffect(() => {
    const backgroundMusic = new Howl({
      src: ['/path/to/your/background-music.mp3'],
      loop: true,
      volume: 0.5,
      autoplay: true,
    });

    const horseRace: HorseRaceSounds = {
      gallop: new Howl({ src: ['/path/to/horse-gallop.mp3'], loop: true, volume: 0.5, autoplay: false }),
      crowd: new Howl({ src: ['/path/to/crowd-cheering.mp3'], loop: true, volume: 0.3, autoplay: false }),
      announcer: new Howl({ src: ['/path/to/race-announcer.mp3'], loop: false, volume: 0.4, autoplay: false }),
    };

    setBgMusic(backgroundMusic);
    setHorseRaceSounds(horseRace);

    return () => {
      backgroundMusic.unload();
      Object.values(horseRace).forEach((sound) => sound.unload());
    };
  }, []);

  const toggleMute = (): void => {
    Howler.mute(!isMuted);
    setIsMuted(!isMuted);
  };

  const startHorseRace = (): void => {
    if (bgMusic && horseRaceSounds) {
      bgMusic.pause();
      horseRaceSounds.gallop.play();
      horseRaceSounds.crowd.play();
      horseRaceSounds.announcer.play();
      setIsHorseRacePlaying(true);
    }
  };

  const stopHorseRace = (): void => {
    if (horseRaceSounds) {
      Object.values(horseRaceSounds).forEach((sound) => sound.stop());
      bgMusic?.play();
      setIsHorseRacePlaying(false);
    }
  };

  const setHorseRaceVolume = (soundType: SoundType, volume: number): void => {
    horseRaceSounds?.[soundType]?.volume(volume);
  };

  const playSoundEffect = (soundUrl: string): void => {
    const sound = new Howl({ src: [soundUrl], volume: 0.5 });
    sound.play();
  };

  const contextValue: AudioContextType = {
    isMuted,
    isHorseRacePlaying,
    toggleMute,
    playSoundEffect,
    startHorseRace,
    stopHorseRace,
    setHorseRaceVolume,
  };

  return <AudioContext.Provider value={contextValue}>{children}</AudioContext.Provider>;
};

export const useAudio = (): AudioContextType => {
  const context = useContext(AudioContext);
  if (!context) throw new Error('useAudio must be used within an AudioProvider');
  return context;
};

// MuteButton.tsx
import React from 'react';
import { useAudio } from './AudioProvider';

export const MuteButton: React.FC = () => {
  const { isMuted, toggleMute } = useAudio();

  return (
    <button onClick={toggleMute} className="px-4 py-2 bg-gray-500 text-white rounded">
      {isMuted ? 'Unmute' : 'Mute'}
    </button>
  );
};
