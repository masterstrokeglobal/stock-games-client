import { CryptoWalletFormSchema } from "@/components/features/crypto-wallet/crypto-wallet-form";
import api from "./instance";

const cryptoWalletAPI = {
    createCryptoWallet: async (cryptoWalletData: CryptoWalletFormSchema) => {
        return api.post("/crypto-wallet", cryptoWalletData);
    },
    getCrypto: async (filter?: SearchFilters) => {
        return api.get("/crypto", {
            params: filter
        });
    },

    getCryptoWallets: async (filter?: SearchFilters) => {
        return api.get("/crypto-wallet", {
            params: filter
        });
    },
    getCryptoWalletById: async (id: string) => {
        return api.get(`/crypto-wallet/${id}`);
    },

    updateCryptoWallet: async (cryptoWalletData: CryptoWalletFormSchema & { id: string }) => {
        return api.patch(`/crypto-wallet/${cryptoWalletData.id}`, cryptoWalletData);
    },

    deleteCryptoWallet: async (id: string) => {
        return api.delete(`/crypto-wallet/${id}`);
    },
    getConversionRate: async (id: string) => {
        return api.get(`/crypto/get-conversion-rate/${id}`);
    }
}


export default cryptoWalletAPI;
