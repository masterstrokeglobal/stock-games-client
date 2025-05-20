import { SevenUpDownPlacementType } from "@/models/seven-up-down";
import api from "./instance";
export const sevenUpDownAPI = {
    createSevenUpDownPlacement: async (data: { roundId: number, placement: SevenUpDownPlacementType, amount: number } ) => {
        const response = await api.post("/seven-up-down", data);
        return response.data;
    },
    getMyCurrentRoundSevenUpDownPlacement: async (roundId: number) => {
        const response = await api.get(`/seven-up-down/my-current-placement/${roundId}`);
        return response.data;
    },
    getCurrentRoundSevenUpDownPlacement: async (roundId: number) => {
        const response = await api.get(`/seven-up-down/current-round-placements/${roundId}`);
        return response.data;
    },
    getSevenUpDownRoundResult: async (roundId: number) => {
        const response = await api.get(`/seven-up-down/result/${roundId}`);
        return response.data.data as  {
            netProfitLoss: number;
            netWinning: number;
            platformFeeAmount: number;
            amountWon: number;
            grossWinning: number;
            totalPlaced: number;
        };
    }
} as const;
