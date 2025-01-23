import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { userAPI } from "@/lib/axios/user-API"; // Adjust the path as needed
import { gameUserAPI } from "@/lib/axios/game-user-API";

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
        mutationFn: userAPI.deleteUserById,
        onSuccess: () => {
            queryClient.invalidateQueries({
                predicate: (query) => {
                    return query.queryKey[0] === "users";
                },
            });
            toast.success("User deleted successfully");
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message ?? "Error deleting user");
        },
    });
};

export const usePasswordChange = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: gameUserAPI.changePassword,
        onSuccess: () => {
            queryClient.invalidateQueries({
                predicate: (query) => {
                    return query.queryKey[0] === "users";
                },
            });
            toast.success("Password changed successfully");
        },
        onError: (error: any) => {
            toast.error(error.response?.data.message ?? "Error changing password");
        },
    });
}

export const useUploadImage = () => {
    return useMutation({
        mutationFn: userAPI.uploadImage,
        onSuccess: () => {
            toast.success("Image uploaded successfully");
        },
        onError: (error: any) => {
            toast.error(error.response?.data.message ?? "Error uploading image");
        },
    });
}

export const useCreateUser = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: userAPI.createUser,
        onSuccess: () => {
            queryClient.invalidateQueries({
                predicate: (query) => {
                    return query.queryKey[0] === "users";
                },
            });
            toast.success("User created successfully");
        },
        onError: (error: any) => {
            toast.error(error.response?.data.message ?? "Error creating user");
        },
    });
}

export const useUpdateUser = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: userAPI.updateUser,
        onSuccess: () => {
            queryClient.invalidateQueries({
                predicate: (query) => {
                    return query.queryKey[0] === "users";
                },
            });
            toast.success("User updated successfully");
        },
        onError: (error: any) => {
            toast.error(error.response?.data.message ?? "Error updating user");
        },
    });
}

export const useAddUserPlacementNotAllowed = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: userAPI.addUserPlacementNotAllowed,
        onSuccess: () => {
            queryClient.invalidateQueries({
                predicate: (query) => {
                    return query.queryKey[0] === "users";
                },
            });
            toast.success("Placement not allowed added successfully");
        },
        onError: (error: any) => {
            toast.error(error.response?.data.message ?? "Error adding placement not allowed");
        },
    });
}

export const useRemoveUserPlacementNotAllowed = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: userAPI.removeUserPlacementNotAllowed,
        onSuccess: () => {
            queryClient.invalidateQueries({
                predicate: (query) => {
                    return query.queryKey[0] === "users";
                },
            });
            toast.success("Placement not allowed removed successfully");
        },
        onError: (error: any) => {
            toast.error(error.response?.data.message ?? "Error removing placement not allowed");
        },
    });
}

export const useAddAgentUserPlacementNotAllowed = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: userAPI.addAgentUserPlacementNotAllowed,
        onSuccess: () => {
            queryClient.invalidateQueries({
                predicate: (query) => {
                    return query.queryKey[0] === "agents";
                },
            });
            toast.success("Agent placement not allowed added successfully");
        },
        onError: (error: any) => {
            toast.error(error.response?.data.message ?? "Error adding agent placement not allowed");
        },
    });
}

export const useRemoveAgentUserPlacementNotAllowed = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: userAPI.removeAgentUserPlacementNotAllowed,
        onSuccess: () => {
            queryClient.invalidateQueries({
                predicate: (query) => {
                    return query.queryKey[0] === "agents";
                },
            });
            toast.success("Agent placement not allowed removed successfully");
        },
        onError: (error: any) => {
            toast.error(error.response?.data.message ?? "Error removing agent placement not allowed");
        },
    });
}