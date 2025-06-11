import { RoundRecordGameType } from "@/models/round-record";
import { usePathname } from "next/navigation";
import { useMemo } from "react";

const usePlayGameType = () => {
    const pathname = usePathname();

    const gameType: RoundRecordGameType = useMemo(() => {
        if (pathname.includes("lobby")) return RoundRecordGameType.LOBBY;
        if (pathname.includes("derby")) return RoundRecordGameType.DERBY;
        return RoundRecordGameType.DERBY;
    }, [pathname]);

    const isLobby = gameType === RoundRecordGameType.LOBBY;
    const isDerby = gameType === RoundRecordGameType.DERBY;

    return { gameType, isLobby, isDerby };
};

export default usePlayGameType;