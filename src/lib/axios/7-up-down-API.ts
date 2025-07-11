
import { RoundRecord } from "@/models/round-record";
import { SevenUpDownPlacementType } from "@/models/seven-up-down";
import api from "./instance";



export type SevenUpDownRoundResult = {
    selectedSide: "up" | "down";
    isWinner: boolean;
    amountWon: number;
    amountPlaced: number;
    platformFeeAmount: number;
    winner: "7" | "7 Up" | "7 Down";
    round: RoundRecord
}

export const getWinnerSide = (winner: "7" | "7 Up" | "7 Down") => {
    if (winner === "7") return "seven";
    if (winner === "7 Up") return "up";
    if (winner === "7 Down") return "down";
    return "seven";
}

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
        return response.data.data as unknown as SevenUpDownRoundResult[];
    }
} as const;
