"use client";

import { SchedulerType } from "@/models/market-item";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect, useCallback } from "react";

export function useGameType() {
    const searchParams = useSearchParams();
    const router = useRouter();

    const getCurrentGameType = useCallback((): SchedulerType => {
        const gameTypeFromParams = searchParams.get("gameType") as SchedulerType | null;
        return gameTypeFromParams ?? SchedulerType.NSE; // Default to NSE if not present
    }, [searchParams]);

    const [gameType, setGameType] = useState<SchedulerType>(getCurrentGameType);

    // Update the URL whenever gameType changes
    const updateUrl = useCallback(
        (newGameType: SchedulerType) => {
            const newParams = new URLSearchParams(searchParams.toString());
            newParams.set("gameType", newGameType);
            router.replace(`?${newParams.toString()}`);
        },
        [searchParams, router]
    );

    // Update state when searchParams change
    useEffect(() => {
        const newGameType = getCurrentGameType();
        setGameType(newGameType);
    }, [getCurrentGameType]);

    // Synchronize state and update URL when gameType changes
    const setGameTypeAndSync = useCallback(
        (newGameType: SchedulerType) => {
            setGameType(newGameType);
            updateUrl(newGameType);
        },
        [updateUrl]
    );

    return [gameType, setGameTypeAndSync] as const;
}
