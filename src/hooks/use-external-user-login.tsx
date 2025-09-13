import { useAuthStore } from "@/context/auth-context";
import { useGetExternalWallet, useVerifyExternalSession } from "@/react-query/external-user-queries";
import User from "@/models/user";
import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useRef } from "react";

const useExternalUserLogin = () => {
    const { setUser, setLoadig } = useAuthStore();
    const sessionId = useSearchParams().get("session");
    const pathname = usePathname();
    const gameName = pathname.split("/")[2];

    // Only call wallet query when session is verified
    const {  isSuccess: isSessionSuccess, isPending: isSessionPending, isError: isSessionError, error: sessionError } = useVerifyExternalSession({ sessionId: sessionId as string, gameName: gameName as string });

    // Only enable wallet query when session is verified
    const { data: walletData, isSuccess: isWalletSuccess, isPending: isWalletPending, isError: isWalletError, error: walletError, refetch: refetchWallet } = useGetExternalWallet(isSessionSuccess);

    // Prevent refetchWallet from being called repeatedly
    const hasRefetchedWallet = useRef(false);

    useEffect(() => {
        if (isSessionSuccess && !hasRefetchedWallet.current) {
            refetchWallet();
            hasRefetchedWallet.current = true;
        }
        if (isSessionError) {
            setUser(null);
            setLoadig(false);
        }
    }, [isSessionSuccess, isSessionError, refetchWallet, setUser, setLoadig]);

    // Only set user when wallet is fetched and session is valid
    const hasSetUser = useRef(false);
    useEffect(() => {
        if (isSessionSuccess && isWalletSuccess && !hasSetUser.current) {
            const user = new User({
                id: walletData?.data?.id,
                firstname: walletData?.data?.name,
                externalUser: true,
                balance: walletData?.data?.balance
            });
            setUser(user);
            setLoadig(false);
            hasSetUser.current = true;
        }
        if (isWalletError && !hasSetUser.current) {
            setUser(null);
            setLoadig(false);
            hasSetUser.current = true;
        }
    }, [isSessionSuccess, isWalletSuccess, isWalletError, walletData, setUser, setLoadig]);

    // Reset refs if sessionId or gameName changes (new login)
    useEffect(() => {
        hasRefetchedWallet.current = false;
        hasSetUser.current = false;
    }, [sessionId, gameName]);

    // Debug
    // console.log("isSessionPending is: ", isSessionPending, "isWalletPending is: ", isWalletPending);

    return {
        isLoading: isSessionPending || isWalletPending,
        isError: isSessionError || isWalletError,
        error: sessionError || walletError,
    }
};

export default useExternalUserLogin;