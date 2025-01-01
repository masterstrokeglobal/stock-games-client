import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { withdrawDetailsAPI } from "@/lib/axios/withdrawl-details-API";

export const useCreateWithdrawDetail = () => {
    return useMutation({
        mutationFn: withdrawDetailsAPI.createWithdrawDetail,
        onSuccess: () => {
            toast.success("Withdrawal detail created successfully");
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message ?? "Error creating withdrawal detail");
        },
    });
};

export const useGetAllWithdrawDetails = (filter: any) => {
    return useQuery({
        queryKey: ["withdrawDetails", filter],
        queryFn: () => withdrawDetailsAPI.getWithdrawDetails(filter),
    });
};

export const useGetWithdrawDetailById = (withdrawDetailId: string) => {
    return useQuery({
        queryKey: ["withdrawDetail", withdrawDetailId],
        queryFn: () => withdrawDetailsAPI.getWithdrawDetailById(withdrawDetailId),
    });
};

export const useUpdateWithdrawDetailById = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: withdrawDetailsAPI.updateWithdrawDetailById,
        onSuccess: () => {
            queryClient.invalidateQueries({
                predicate: (query) => {
                    return query.queryKey[0] === "withdrawDetails";
                }
            });
            toast.success("Withdrawal detail updated successfully");
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message ?? "Error updating withdrawal detail");
        },
    });
};

export const useDeleteWithdrawDetailById = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: withdrawDetailsAPI.deleteWithdrawDetailById,
        onSuccess: () => {
            queryClient.invalidateQueries({
                predicate: (query) => {
                    return query.queryKey[0] === "withdrawDetails";
                }
            });
            toast.success("Withdrawal detail deleted successfully");
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message ?? "Error deleting withdrawal detail");
        },
    });
};
