"use client";
import GameLoadingScreen from "@/components/common/game-loading-screen";
import { useAuthStore } from "@/context/auth-context";
import useGameUserLogin from "@/hooks/use-game-user-login";
import User from "@/models/user";
import Head from "next/head";
import { useRouter } from "next/navigation";
import { PropsWithChildren, useEffect } from "react";

const GameLayout = ({ children }: PropsWithChildren) => {
  const { loading, userDetails } = useAuthStore();
  const router = useRouter();
  useGameUserLogin();

  useEffect(() => {
    if (!loading && !(userDetails instanceof User)) {
      router.push("/game/auth/login");
    }
  }, [userDetails, loading]);

  if (loading || !(userDetails instanceof User)) {
    return <GameLoadingScreen className="h-screen" />;
  }

  return (
    <>
      <Head>
        <link rel="icon" href={userDetails?.company?.logo ?? "/logo.png"} />
        <title>{userDetails?.company?.name ?? "--"}</title>
      </Head>
        <div className="bg-background-game">{children}</div>
    </>
  );
};

export default GameLayout;
