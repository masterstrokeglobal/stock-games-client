import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import coinTossPairAPI from "@/lib/axios/coin-toss-pair-API";
import { CoinTossPair } from "@/models/coin-toss-pair";

export const useCreateCoinTossPair = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: coinTossPairAPI.createCoinTossPair,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['coin-toss-pairs'] });
            toast.success("Coin toss pair created successfully");
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message ?? "Error creating coin toss pair");
        }
    });

};

export const useGetCoinTossPairs = (filter: SearchFilters) => {
    return useQuery({
        queryKey: ['coin-toss-pairs', filter],
        queryFn: async () => {
            const response = await coinTossPairAPI.getCoinTossPairs(filter);
            return {
                data: response.data.data.map((item: any) => new CoinTossPair(item)),
                count: response.data.count
            }
        },
    });
};

export const useGetCoinTossPairById = (id: string) => {
    return useQuery({
        queryKey: ['coin-toss-pair', id],
        queryFn: async () => {
            const response = await coinTossPairAPI.getCoinTossPairById(id);
            return new CoinTossPair(response.data);
        },
    });
};

export const useUpdateCoinTossPair = (id: string) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: coinTossPairAPI.updateCoinTossPair,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['coin-toss-pair', id] });
            toast.success("Coin toss pair updated successfully");
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message ?? "Error updating coin toss pair");
        }
    });
};

export const useDeleteCoinTossPair = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: coinTossPairAPI.deleteCoinTossPair,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['coin-toss-pairs'] });
            toast.success("Coin toss pair deleted successfully");
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message ?? "Error deleting coin toss pair");
        }
    });
};
