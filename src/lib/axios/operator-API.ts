import api from "./instance";

export const operatorAPI = {
    createOperator: async (operatorData: any) => {
        return api.post("/operator", operatorData);
    },

    getAllOperators: async (filter?: any) => {
        return api.get("/operator", {
            params: filter
        });
    },

    depositOperatorWallet: async (payload: any) => {
        return api.post("/operator/wallet-deposit", payload);
    },

    createUser: async (userData: any) => {
        return api.post("/operator/create-user", userData);
    },
};