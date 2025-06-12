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

export const useStockSelectorAviator = () => {
    const [stockSelectedAviator, setStockSelectedAviator] = useQueryState<string | null>("aviatorStockId", { defaultValue: null, parse: (value) => value as string | null });

    return {
        stockSelectedAviator,
        setStockSelectedAviator
    }
}

export const useStockType = () => {
    const [stockType, setStockType] = useQueryState<string>("stockType", { defaultValue: "", parse: (value) => value as string });

    return {
        stockType,
        setStockType
    }
}