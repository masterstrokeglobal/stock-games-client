import tierAPI from "@/lib/axios/tier-API";
import { Tier } from "@/models/tier";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";


export const useGetTiers = (filter: SearchFilters) => {
    return useQuery<{ tiers: Tier[], count: number }, Error>({
        queryKey: ["tiers", filter],
        queryFn: async () => {
            const response = await tierAPI.getTiers(filter);
            return { tiers: response.data.tierList.map((tier: any) => new Tier(tier)), count: response.data.count };
        }
    });
};


export const useCreateTier = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: tierAPI.createTier,
        onSuccess: () => {
            queryClient.invalidateQueries({
                predicate: (query) => query.queryKey[0] === "tiers"
            });
            toast.success("Tier created successfully");
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message ?? "Error creating tier");
        },
    });
};

export const useUpdateTier = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: tierAPI.updateTier,
        onSuccess: () => {
            queryClient.invalidateQueries({
                predicate: (query) => query.queryKey[0] === "tiers"
            });
            toast.success("Tier updated successfully");
        },
    });
};

export const useGetTierById = (id: string) => {
    return useQuery<Tier, Error>({
        queryKey: ["tiers", id],
        queryFn: async () => {
            const response = await tierAPI.getTierById(id);
            return new Tier(response.data);
        }
    });
};


export const useDeleteTier = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: tierAPI.deleteTier,
        onSuccess: () => {
            queryClient.invalidateQueries({
                predicate: (query) => query.queryKey[0] === "tiers"
            });
            toast.success("Tier deleted successfully");
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message ?? "Error deleting tier");
        },

    });
};

