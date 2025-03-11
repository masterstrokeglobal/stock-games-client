import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { adminAPI } from "@/lib/axios/admin-API"; // Adjust the path as needed

export const useCreateAdmin = () => {
    return useMutation({
        mutationFn: adminAPI.createAdmin,
        onSuccess: () => {
            toast.success("Admin created successfully");
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message ?? "Error creating admin");
        },
    });
};

export const useGetAllAdmins = (filter: SearchFilters) => {
    return useQuery({
        queryKey: ["admins", filter],
        queryFn: () => adminAPI.getAllAdmins(filter),
    });
};

export const useGetAdminById = (adminId: string) => {
    return useQuery({
        queryKey: ["admin", adminId],
        queryFn: () => adminAPI.getAdminById(adminId),
    });
};

export const useUpdateAdminById = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: adminAPI.updateAdminById,
        onSuccess: () => {
            queryClient.invalidateQueries({
                predicate: (query) => {
                    return query.queryKey[0] === "admins";
                }
            });
            toast.success("Admin updated successfully");
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message ?? "Error updating admin");
        },
    });
};

export const useDeleteAdminById = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: adminAPI.deleteAdminById,
        onSuccess: () => {
            queryClient.invalidateQueries({
                predicate: (query) => {
                    return query.queryKey[0] === "admins";
                }
            });
            toast.success("Admin deleted successfully");
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message ?? "Error deleting admin");
        },
    });
};

export const useSaveToken = () => {
    return useMutation({
        mutationFn: adminAPI.saveToken,
    });
}