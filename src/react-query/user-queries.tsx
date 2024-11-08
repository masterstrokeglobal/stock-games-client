import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { userAPI } from "@/lib/axios/user-API"; // Adjust the path as needed

export const useGetAllUsers = (filter: SearchFilters) => {
    return useQuery({
        queryKey: ["users", filter],
        queryFn: () => userAPI.getAllUsers(filter),
    });
};

export const useGetUserById = (userId: string) => {
    return useQuery({
        queryKey: ["users", userId],
        queryFn: () => userAPI.getUserById(userId),
    });
};


export const useDeleteUserById = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: userAPI.deleteUserById, // You need to implement this function in userAPI
        onSuccess: () => {
            queryClient.invalidateQueries({
                predicate: (query) => {
                    return query.queryKey[0] === "users";
                },
            }); // Invalidate the users query to refresh the list
            toast.success("User deleted successfully");
        },
        onError: (error: any) => {
            toast.error(error.response?.data.error ?? "Error deleting user");
        },
    });
};
