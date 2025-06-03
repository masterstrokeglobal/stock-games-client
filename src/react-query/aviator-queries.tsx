import { SchedulerType } from "@/models/market-item";
import { useQuery } from "@tanstack/react-query";
import aviatorAPI from "../lib/axios/aviator-API";
import { RoundRecord } from "@/models/round-record";
import { AviatorPlacement } from "@/models/aviator-placement";

type AviatorRoundHistory = {
    time: Date;
    status: string;
    multiplier: number;
    duration: number;
    name: string;
    code: string;
    roundId: number;
}
export const useAviatorRoundHistory = (type: SchedulerType) => {
    return useQuery<AviatorRoundHistory[], Error>({
        queryKey: ["aviator-round-history", type],
        queryFn: async () => {
            const response = await aviatorAPI.getAviatorRoundHistory(type);
            return response.data.map((round: any) => ({
                time: new Date(round.time),
                status: round.status,
                multiplier: round.multiplier,
                duration: round.duration,
                name: round.name,
                code: round.code,
                roundId: round.roundId
            }));
        },
    });
};

export const useAviatorToken = () => {
    return useQuery({
        queryKey: ["aviator-token"],
        queryFn: async () => {
            const response = await aviatorAPI.getAviatorToken();
            return response.data.token;
        },
    });
};

export const useAviatorRoundResult = (type: SchedulerType) => {
    return useQuery({
        queryKey: ["aviator-round-result", type],
        queryFn: () => aviatorAPI.getAviatorRoundResult(type),
    });
};


export const useAviatorMyPlacement = (roundId: number) => {
    return useQuery<AviatorPlacement[], Error>({
        queryKey: ["aviator-my-placement", roundId],
        queryFn: async () => {
            const response = await aviatorAPI.getAviatorMyPlacement(roundId);
            return response.data.data.map((placement: any) => new AviatorPlacement(placement));
        },
    });
};


export const useAviatorPlacement = (roundId: number) => {
    return useQuery({
        queryKey: ["aviator-placement", roundId],
        queryFn: async () => {
            const response = await aviatorAPI.getAviatorPlacement(roundId);
            return response.data;
        },
    });
};

