"use client";
import GameLoadingScreen from "@/components/common/game-loading-screen";
import { useAuthStore } from "@/context/auth-context";
import useExternalUserLogin from "@/hooks/use-external-user-login";
import { PropsWithChildren } from "react";

const ExternalUserLayout = ({ children }: PropsWithChildren) => {
  const { loading, userDetails } = useAuthStore();
  useExternalUserLogin();

  if (loading || !(userDetails)) {
    return <GameLoadingScreen className="h-screen" />;
  }
  
  return (
    <>
      <div className="bg-background-game">{children}</div>
    </>
  );
};

export default ExternalUserLayout;
