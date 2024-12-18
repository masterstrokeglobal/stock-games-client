import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { adminAuthAPI } from "@/lib/axios/admin-auth-API"; // Adjust the path according to your project structure
import { adminAPI } from "@/lib/axios/admin-API";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/context/auth-context";

export const useAdminLogin = () => {
    return useMutation({
        mutationFn: adminAuthAPI.adminLogin,
        onSuccess: () => {
            toast.success("Logged in successfully");
        },
        onError: (error: any) => {
            toast.error(error.response.data.message ?? "Error logging in");
        },
    });
};

export const useAdminLogout = () => {
    const router = useRouter();
    const queryClient = useQueryClient();
    const { setUser } = useAuthStore();
    return useMutation({
        mutationFn: async () => {

            await adminAuthAPI.logout();
            setUser(null);
            queryClient.clear();
        },
        onSuccess: () => {
            localStorage.removeItem("token");
            toast.success("Logged out successfully");
            router.push("/login");

        },
        onError: (error: any) => {
            console.log(error);
            toast.error(error.response.data.message ?? "Error logging out");
        },
    });
};
export const useUserLogout = () => {
    const router = useRouter();
    return useMutation({
        mutationFn: adminAuthAPI.logout,
        onSuccess: () => {
            localStorage.removeItem("token");
            toast.success("Logged out successfully");

            router.push("/game/auth/login");

        },
        onError: (error: any) => {
            console.log(error);
            toast.error(error.response.data.message ?? "Error logging out");
        },
    });
};

export const useAdminProfile = () => {
    return useQuery({
        queryKey: ["admin-profile", "admin"],
        retry: 1,
        queryFn: adminAPI.getAdminProfile,
    });
}