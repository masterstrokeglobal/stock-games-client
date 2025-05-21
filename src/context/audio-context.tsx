import { RoundRecord } from "@/models/round-record";
import { Howl, Howler } from "howler";
import { usePathname } from "next/navigation";
import { createContext, ReactNode, useContext, useEffect, useState } from "react";
const AudioContext = createContext<AudioContextType | null>(null);

export interface HorseRaceSounds {
  gallop: Howl;
  crowd: Howl;
  announcer: Howl;
}

export type SoundType = keyof HorseRaceSounds;

export interface AudioContextType {
  isMuted: boolean;
  isHorseRacePlaying: boolean;
  toggleMute: () => void;
  playSoundEffect: (soundUrl: string) => void;
  startHorseRace: () => void;
  stopHorseRace: () => void;
  setHorseRaceVolume: (soundType: SoundType, volume: number) => void;
}

interface AudioProviderProps {
  children: ReactNode;
}

export const AudioProvider: React.FC<AudioProviderProps> = ({ children }) => {
  const [isMuted, setIsMuted] = useState<boolean>(true);
  const [horseRaceSounds, setHorseRaceSounds] = useState<HorseRaceSounds | null>(null);
  const [isHorseRacePlaying, setIsHorseRacePlaying] = useState<boolean>(false);
  const pathname = usePathname();

  useEffect(() => {
    Howler.mute(isMuted);
  }, [isMuted]);
  
  useEffect(() => {
    const backgroundMusic = new Howl({
      src: ["/background-sound.mp3"],
      loop: true,
      volume: 0.2,
      autoplay: true,
    });


    return () => {
      backgroundMusic.unload();
    };
  }, []);

  useEffect(() => {
    if (pathname !== "/game") return;

    const horseRace: HorseRaceSounds = {
      gallop: new Howl({ src: ["/horseNeigh1.mp3"], loop: true, volume: 0.5, autoplay: false }),
      crowd: new Howl({ src: ["/horseNeigh5.mp3"], loop: true, volume: 0.3, autoplay: false }),
      announcer: new Howl({ src: ["/horseSteps.mp3"], loop: true, volume: 0.4, autoplay: false }),
    };

    setHorseRaceSounds(horseRace);

    return () => {
      Object.values(horseRace).forEach((sound) => sound.unload());
    };
  }, [pathname]);

  const toggleMute = (): void => {
    setIsMuted(!isMuted);
  };

  const startHorseRace = (): void => {
    if (pathname !== "/game" || !horseRaceSounds) return;

    horseRaceSounds.gallop.play();
    horseRaceSounds.crowd.play();
    horseRaceSounds.announcer.play();
    setIsHorseRacePlaying(true);
  };

  const stopHorseRace = (): void => {
    if (pathname !== "/game" || !horseRaceSounds) return;

    Object.values(horseRaceSounds).forEach((sound) => sound.stop());
    setIsHorseRacePlaying(false);
  };

  const setHorseRaceVolume = (soundType: SoundType, volume: number): void => {
    if (pathname !== "/game") return;

    horseRaceSounds?.[soundType]?.volume(volume);
  };

  const playSoundEffect = (soundUrl: string): void => {
    if (pathname !== "/game") return;

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


export const useHorseRaceSound = (roundRecord: RoundRecord | null): void => {
  const { startHorseRace, stopHorseRace } = useAudio();

  useEffect(() => {
    if (!roundRecord) {
      stopHorseRace();
      return;
    }

    const now = Date.now();
    const placementEndTimestamp = new Date(roundRecord.placementEndTime).getTime();
    const raceEndTimestamp = new Date(roundRecord.endTime).getTime();

    // Stop immediately if we're past the end time
    if (now >= raceEndTimestamp) {
      stopHorseRace();
      return;
    }

    // If we're already in the race phase (after placement end)
    if (now >= placementEndTimestamp) {
      startHorseRace();

      const stopTimeout = setTimeout(() => {
        stopHorseRace();
      }, raceEndTimestamp - now);

      return () => {
        clearTimeout(stopTimeout);
        stopHorseRace();
      };
    }

    // If we're before placement end, set up both timeouts
    const startTimeout = setTimeout(() => {
      startHorseRace();
    }, placementEndTimestamp - now);

    const stopTimeout = setTimeout(() => {
      stopHorseRace();
    }, raceEndTimestamp - now);

    return () => {
      clearTimeout(startTimeout);
      clearTimeout(stopTimeout);
      stopHorseRace();
    };
  }, [roundRecord, startHorseRace, stopHorseRace]); // Removed isHorseRacePlaying from dependencies
};