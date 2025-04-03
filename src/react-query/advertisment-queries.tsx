import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { advertisementAPI } from "@/lib/axios/advertisment-API"; // Adjust the path as needed

export const useCreateAdvertisement = () => {
    return useMutation({
        mutationFn: advertisementAPI.createAdvertisement,
        onSuccess: () => {
            toast.success("Advertisement created successfully");
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message ?? "Error creating advertisement");
        },
    });
};

export const useGetAdvertisements = (filter?: SearchFilters) => {
    return useQuery({
        queryKey: ["advertisements", filter],
        queryFn: () => advertisementAPI.getAdvertisement(filter),
    });
};

export const useUpdateAdvertisementById = () => {
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationFn: advertisementAPI.updateAdvertisementById,
        onSuccess: () => {
            queryClient.invalidateQueries({
                predicate: (query) => {
                    return query.queryKey[0] === "advertisements";
                }
            });
            toast.success("Advertisement updated successfully");
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message ?? "Error updating advertisement");
        },
    });
};

export const useGetAdvertisementById = (id: string) => {
    return useQuery({
        queryKey: ["advertisements", id],
        queryFn: () => advertisementAPI.getAdvertisementById(id),
    });
};

export const useUpdateStatus = () => {
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationFn: advertisementAPI.updateStatus,
        onSuccess: () => {
            queryClient.invalidateQueries({
                predicate: (query) => {
                    return query.queryKey[0] === "advertisements";
                }
            });
            toast.success("Advertisement status updated successfully");
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message ?? "Error updating advertisement status");
        },
    });
};

export const useDeleteAdvertisementById = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: advertisementAPI.deleteAdvertisementById,
        onSuccess: () => {
            queryClient.invalidateQueries({
                predicate: (query) => {
                    return query.queryKey[0] === "advertisements";
                }
            });
        }
    })
}
