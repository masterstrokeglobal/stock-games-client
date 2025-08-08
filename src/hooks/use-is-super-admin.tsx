import { useAuthStore } from "@/context/auth-context";
import Admin, { AdminRole } from "@/models/admin";

const useIsSuperAdmin = () => {
    const { userDetails } = useAuthStore();
    const user = userDetails as Admin;
    return user.role === AdminRole.SUPER_ADMIN;
}

export default useIsSuperAdmin;
