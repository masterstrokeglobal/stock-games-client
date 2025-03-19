"use client";

import { SchedulerType } from "@/models/market-item";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect, useCallback } from "react";
import useNSEAvailable from "./use-nse-available";
import { useAuthStore } from "@/context/auth-context";
import User from "@/models/user";

export function useGameType() {
    const { userDetails } = useAuthStore();
    const searchParams = useSearchParams();
    const router = useRouter();
    const isNseAvailable = useNSEAvailable();

    const user = userDetails as User;

    const getCurrentGameType = useCallback((): SchedulerType => {
        const gameTypeFromParams = searchParams.get("gameType") as SchedulerType | null;
        let type =  gameTypeFromParams ??(isNseAvailable? SchedulerType.NSE : SchedulerType.CRYPTO);
        if (user.isNotAllowedToPlaceOrder(type)) {
            type = SchedulerType.NSE;
        }
        return type;
    }, [searchParams, isNseAvailable, user.isNotAllowedToPlaceOrder]);

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
    }, [getCurrentGameType, searchParams, isNseAvailable]);

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
