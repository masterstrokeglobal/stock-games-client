import api from "./instance";
import { HeadTailPlacement, HeadTailPlacementType } from "@/models/head-tail";

type HeadTailRoundResult = {
    isWinner: boolean;
    amountWon: number;
    amountPlaced: number;
    platformFeeAmount: number;
    winningSide: HeadTailPlacementType;
}
export const headTailAPI = {
    createHeadTailPlacement: async (data: { roundId: number, placement: HeadTailPlacementType, amount: number }) => {
        const response = await api.post("/head-tail", data);
        return response.data;
    },
    getMyCurrentRoundHeadTailPlacement: async (roundId: number): Promise<HeadTailPlacement[]> => {
        const response = await api.get(`/head-tail/my-current-placement/${roundId}`);
        return response.data.data.map((placement: HeadTailPlacement) => new HeadTailPlacement(placement));
    },
    getCurrentRoundHeadTailPlacement: async (roundId: number) => {
        const response = await api.get(`/head-tail/current-round-placements/${roundId}`);
        return response.data;
    },
    getHeadTailRoundResult: async (roundId: number) => {
        const response = await api.get(`/head-tail/result/${roundId}`);
        return response.data.data as HeadTailRoundResult[]; 
    }
} as const;
