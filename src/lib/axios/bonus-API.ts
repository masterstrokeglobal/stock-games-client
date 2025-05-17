import api from "./instance";
import { BonusFormValues } from "@/components/features/bonus/components/bonus-form";

const bonusAPI = {
    createBonus: async (bonus: BonusFormValues) => {
        const response = await api.post(`/bonus`, bonus);
        return response.data;
    },

    getAllBonus: async (filters: any) => {
        const response = await api.get(`/bonus`, { params: filters });
        return response.data;
    },

    getBonusById: async (id: string) => {
        const response = await api.get(`/bonus/${id}`);
        return response.data;
    },

    updateBonusById: async (bonus: BonusFormValues & { id: string }) => {
        const { id, ...rest } = bonus;  
        const response = await api.patch(`/bonus/${id}`, rest);
        return response.data;
    },

    deleteBonusById: async (id: string) => {
        const response = await api.delete(`/bonus/${id}`);
        return response.data;
    },

    getActiveBonus: async () => {
        const response = await api.get(`/bonus/active`);
        return response.data;
    }
}


export default bonusAPI;
