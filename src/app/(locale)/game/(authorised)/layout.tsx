"use client";
import { PropsWithChildren, useEffect } from "react";
import { useAuthStore } from "@/context/auth-context";
import LoadingScreen from "@/components/common/loading-screen";
import { useRouter } from "next/navigation";
import User from "@/models/user";
import useGameUserLogin from "@/hooks/use-game-user-login";

const GameLayout = ({ children }: PropsWithChildren) => {
    const { loading, userDetails } = useAuthStore();
    const router = useRouter();

    useGameUserLogin();
    useEffect(() => {
        if (!loading && !(userDetails instanceof User)) {
            router.push("/game/auth/login");
        }
    }, [userDetails, loading, router]);

    if (loading || !(userDetails instanceof User)) {
        return <LoadingScreen className="h-screen" />;
    }

    return <>
        <head>
            <link rel="icon" href={userDetails?.company?.logo ?? "/logo.png"} />
            <title>{userDetails?.company?.name ?? "--"}</title>
        </head>
        <div className="bg-background-game">{children}</div>
    </>
};

export default GameLayout;
