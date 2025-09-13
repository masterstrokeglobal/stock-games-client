import { RoundRecord } from "@/models/round-record";
import api from "./instance";
import { HeadTailPlacement, HeadTailPlacementType } from "@/models/head-tail";

interface HeadTailRoundResult {
    isWinner: boolean;
    amountWon: number;
    amountPlaced: number;
    platformFeeAmount: number;
    winningSide: string;
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
    getExternalUsersPlacements: async (roundId: number) => {
        const response = await api.get(`/external-user/placement/${roundId}`);
        return response.data.data.map((placement: HeadTailPlacement) => new HeadTailPlacement(placement));
    },
    getCurrentRoundHeadTailPlacement: async (roundId: number) => {
        const response = await api.get(`/head-tail/current-round-placements/${roundId}`);
        return response.data;
    },
    getExternalUsersHeadTailRoundResult: async (roundId: number) => {
        const response = await api.get(`/external-user/result/${roundId}`);
        return  {
            round: new RoundRecord(response.data.round as any),
            placements: response.data.placements as HeadTailRoundResult[]
        } as {
            round: RoundRecord;
            placements: HeadTailRoundResult[];
        };
    },
    getHeadTailRoundResult: async (roundId: number) => {
        const response = await api.get(`/head-tail/result/${roundId}`);

        return {
            round: new RoundRecord(response.data.round as any),
            placements: response.data.data
        } as {
            round: RoundRecord;
            placements: HeadTailRoundResult[];
        };
    }
} as const;
