import bonusAPI from "@/lib/axios/bonus-API";
import { BonusFormValues } from "@/components/features/bonus/components/bonus-form";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const useGetAllBonus = (filters: any) => {
    return useQuery({
        queryKey: ["bonus", filters],
        queryFn: () => bonusAPI.getAllBonus(filters),
    });
};

export const useCreateBonus = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: bonusAPI.createBonus,
        onSuccess: () => {
            queryClient.invalidateQueries({ predicate: (query) => query.queryKey?.[0] === "bonus" });
            toast.success("Bonus created successfully");
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || "Failed to create bonus");
        },
    });
};

export const useGetBonusById = (id: string) => {
    return useQuery({
        queryKey: ["bonus", id],
        queryFn: () => bonusAPI.getBonusById(id),
    });
};

export const useUpdateBonusById = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (bonus: BonusFormValues & { id: string }) => bonusAPI.updateBonusById(bonus),
        onSuccess: () => {
            queryClient.invalidateQueries({ predicate: (query) => query.queryKey?.[0] === "bonus" });
            toast.success("Bonus updated successfully");
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || "Failed to update bonus");
        },
    });
};


export const useDeleteBonusById = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => bonusAPI.deleteBonusById(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ predicate: (query) => query.queryKey?.[0] === "bonus" });
            toast.success("Bonus deleted successfully");
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || "Failed to delete bonus");
        },
    });
};

