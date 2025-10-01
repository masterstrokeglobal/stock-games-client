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
  const shouldVerify = typeof window !== "undefined" && (
    sessionStorage.getItem("sessionId") === null ||
    sessionStorage.getItem("sessionId") === undefined ||
    sessionStorage.getItem("sessionId") === ""
  );
  const {
    isSuccess: isSessionSuccess,
    isError: isSessionError,
    data: sessionData,
  } = useGameUserSessionVerify(shouldVerify);

  useEffect(() => {
    const sessionId = sessionStorage.getItem("sessionId");

    if (sessionId === null || sessionId === undefined || sessionId === "") {
      if (isSessionSuccess) {
        sessionStorage.setItem("sessionId", sessionData?.data?.sessionId);
      }
      if (isSessionError) {
        setUser(null);
        sessionStorage.removeItem("sessionId");
        toast.error("Session expired");
      }
    }

    if (!userDetails) {
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
  }, [data, isSuccess, isError, userDetails, setLoadig, setUser, isSessionSuccess, isSessionError, sessionData]);
};

export default useGameUserLogin;
