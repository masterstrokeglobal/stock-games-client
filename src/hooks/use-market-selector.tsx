import { SchedulerType } from "@/models/market-item";
import { useQueryState } from "nuqs";


export const useMarketSelector = () => {
    const [marketSelected, setMarketSelected] = useQueryState<boolean>("marketSelected", { defaultValue: false, parse: (value) => value === "true" });

    return {
        marketSelected,
        setMarketSelected
    }
}


export const useGameType = () => {
    const [gameType, setGameType] = useQueryState<SchedulerType>("gameType", { defaultValue: SchedulerType.NSE, parse: (value) => value as SchedulerType });

    return {
        gameType,
        setGameType
    }
}
