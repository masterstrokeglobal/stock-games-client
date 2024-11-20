"use client";

import { SchedulerType } from "@/models/market-item";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect, useCallback } from "react";


export function useGameType() {
    const searchParams = useSearchParams();
    const router = useRouter();

    const initialGameType = searchParams.get("gameType") as SchedulerType | null;
    const [gameType, setGameType] = useState<SchedulerType>(
        initialGameType ?? SchedulerType.NSE
    );

    // Update the URL whenever gameType changes
    const updateUrl = useCallback(
        (newGameType: SchedulerType) => {
            const newParams = new URLSearchParams(searchParams.toString());
            newParams.set("gameType", newGameType);
            router.replace(`?${newParams.toString()}`);
        },
        [searchParams, router]
    );

    // Set the URL with "NSE" if no gameType is present
    useEffect(() => {
        if (!initialGameType) {
            updateUrl(SchedulerType.NSE);
        }
    }, [initialGameType, updateUrl]);

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
