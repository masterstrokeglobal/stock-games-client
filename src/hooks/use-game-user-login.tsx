import { useAuthStore } from "@/context/auth-context";
import User from "@/models/user";
import {
  useGameUserProfile,
  useGameUserSessionVerify,
} from "@/react-query/game-user-queries";
import { useEffect } from "react";
import { H } from "@highlight-run/next/client";
import { toast } from "sonner";

const useGameUserLogin = () => {
  const { setUser, setLoadig, userDetails } = useAuthStore();
  const { data, isSuccess, isError } = useGameUserProfile();

  const verifySession = () => {
    const sessionId = sessionStorage.getItem("sessionId");

    if (!sessionId || sessionId === "null" || sessionId === "undefined") {
      setUser(null);
      return;
    }

    const {
      isSuccess: isSessionSuccess,
      isError: isSessionError,
      data: sessionData,
    } = useGameUserSessionVerify();

    // If session verification is successful, update the sessionId
    if (isSessionSuccess) {
      sessionStorage.setItem("sessionId", sessionData?.data?.sessionId);
    }

    // If session verification failed, clear user and show error
    if (isSessionError) {
      setUser(null);
      sessionStorage.removeItem("sessionId");
      toast.error("Session expired");
      return;
    }
  };

  useEffect(() => {
    const sessionId = sessionStorage.getItem("sessionId");

    if (sessionId === null || sessionId === undefined || sessionId === "") {
      console.log("loki sessionId is null, undefined, or empty");
      verifySession();
    }

    if (!userDetails) {
      console.log("loki userDetails is null");
      if (isSuccess) {
        const user = new User(data?.data);
        if (user?.username) {
          H.identify(user.username, {
            name: user.name,
            companyId: user.company?.id ?? "",
            companyName: user.company?.name ?? "N/A",
          });
        }
        setUser(user);
      }
    }
    if (isError) {
      setUser(null);
      setLoadig(false);
    }
  }, [data, isSuccess, isError, userDetails, setLoadig, setUser]);
};

export default useGameUserLogin;
