import { useGameType } from "@/hooks/use-game-type";
import GameMaintenanceMarquee from "./game-maintainaince-screen"
import useSchedularInactive from "@/hooks/use-schedular-inactive";

const MaintainceScreen = ({forceTrue = false}:{forceTrue?:boolean}) => {
    const [gameType] = useGameType();

    const { isActive, isFetching } = useSchedularInactive(gameType);

    if (!isActive && !isFetching) return (
        <>
            <div className='absolute top-0 left-0 w-full h-full z-40 bg-black/90 flex items-center justify-center' />
            <GameMaintenanceMarquee className='z-50' />
        </>
    );

    if (forceTrue) return (
        <>
            <div className='absolute top-0 left-0 w-full h-full z-40 bg-black/90 flex items-center justify-center' />
            <GameMaintenanceMarquee className='z-50' />
        </>
    );
};

export default MaintainceScreen;