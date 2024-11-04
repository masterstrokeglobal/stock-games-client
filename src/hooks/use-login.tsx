import { useAuthStore } from "@/context/auth-context";
import Admin from "@/models/admin";
import { useAdminProfile } from "@/react-query/admin-auth-queries";
import { useEffect } from "react";

const useLogin = () => {
    const { setUser, setLoadig } = useAuthStore();
    const { data, isSuccess, isError, error } = useAdminProfile();
    useEffect(() => {

        if (isSuccess) {
            const user = new Admin(data.data);
            setUser(user);
        }
        if (isError) {
            console.log("error", error);
            setUser(null);
            setLoadig(false);
        }


    }, [data, isSuccess, isError]);

}

export default useLogin;