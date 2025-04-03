import { useAuthStore } from "@/context/auth-context";
import User from "@/models/user";
import { useGameUserProfile } from "@/react-query/game-user-queries";
import { useEffect } from "react";
import { H } from '@highlight-run/next/client';

const useGameUserLogin = () => {
    const { setUser, setLoadig } = useAuthStore();
    const { data, isSuccess, isError, error } = useGameUserProfile();

    useEffect(() => {
        if (isSuccess) {
            const user = new User(data?.data);

            if (user?.username) {
                H.identify(user.username, {
                    "name": user.name,
                    "companyId": user.company?.id ?? "",
                    "companyName": user.company?.name ?? "N/A",
                });
            }
            setUser(user);
        }
        if (isError) {
            console.log("error", error);
            setUser(null);
            setLoadig(false);
        }


    }, [data, isSuccess, isError]);

}

export default useGameUserLogin;