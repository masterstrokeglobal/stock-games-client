import { SchedulerType } from "@/models/market-item";
import api from "./instance";
const aviatorAPI = {
    getAviatorRoundHistory: async (type: SchedulerType) => {
        return api.get(`/round-records/aviator-round-history?type=${type}`);
    },
    getAviatorToken: async () => {
        return api.get(`/aviator/token`);
    },
    getAviatorRoundResult: async (type: SchedulerType) => {
        return api.get(`/aviator/round-result/${type}`);
    },
    getAviatorMyPlacement: async (id: number) => {
        return api.get(`/aviator/my-placement/${id}`);
    },
    getAviatorPlacement: async (id: number) => {
        return api.get(`/aviator/placement/${id}`);
    }
}

export default aviatorAPI;
