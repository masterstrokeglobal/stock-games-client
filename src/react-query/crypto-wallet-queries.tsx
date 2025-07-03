import cryptoWalletAPI from "@/lib/axios/crypto-wallet-API";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const useGetCrypto = (filter?: SearchFilters) => {
    return useQuery({
        queryKey: ["crypto", filter],
        queryFn: async () => {
            const response = await cryptoWalletAPI.getCrypto(filter);
            return response.data.crypto;
        }
    });
};

export const useGetCryptoWallets = (filter?: SearchFilters) => {
    return useQuery({
        queryKey: ["crypto-wallets", filter],
        queryFn: async () => {
            const response = await cryptoWalletAPI.getCryptoWallets(filter);
            return response.data;
        }
    });
};

export const useGetCryptoWalletById = (id: string) => {
    return useQuery({
        queryKey: ["crypto-wallets", id],
        queryFn: async () => {
            const response = await cryptoWalletAPI.getCryptoWalletById(id);
            return response.data;
        },
        enabled: !!id
    });
};

export const useCreateCryptoWallet = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: cryptoWalletAPI.createCryptoWallet,
        onSuccess: () => {
            queryClient.invalidateQueries({
                predicate: (query) => query.queryKey[0] === "crypto-wallets"
            });
            toast.success("Crypto wallet created successfully");
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message ?? "Error creating crypto wallet");
        }
    });
};

export const useUpdateCryptoWallet = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: cryptoWalletAPI.updateCryptoWallet,
        onSuccess: () => {
            queryClient.invalidateQueries({
                predicate: (query) => query.queryKey[0] === "crypto-wallets"
            });
            toast.success("Crypto wallet updated successfully");
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message ?? "Error updating crypto wallet");
        }
    });
};

export const useDeleteCryptoWallet = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: cryptoWalletAPI.deleteCryptoWallet,
        onSuccess: () => {
            queryClient.invalidateQueries({
                predicate: (query) => query.queryKey[0] === "crypto-wallets"
            });
            toast.success("Crypto wallet deleted successfully");
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message ?? "Error deleting crypto wallet");
        }
    });
};
