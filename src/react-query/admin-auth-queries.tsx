import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { adminAuthAPI } from "@/lib/axios/admin-auth-API"; // Adjust the path according to your project structure

export const useAdminLogin = () => {
    return useMutation({
        mutationFn: adminAuthAPI.adminLogin,
        onSuccess: (data) => {
            toast.success("Logged in successfully");
            localStorage.setItem("token", data.data.token); // Adjust based on your response structure
        },
        onError: (error: any) => {
            toast.error(error.response.data.error ?? "Error logging in");
        },
    });
};

export const useAdminLogout = () => {
    return useMutation({
        mutationFn: adminAuthAPI.logout,
        onSuccess: () => {
            localStorage.removeItem("token"); // Clear token or other user data as necessary
            toast.success("Logged out successfully");
        },
        onError: (error: any) => {
            toast.error(error.response.data.error ?? "Error logging out");
        },
    });
};
