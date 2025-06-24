import { SchedulerType } from "@/models/market-item";
import api from "./instance";

export const roundRecordsAPI = {
    getAllRoundRecords: async (filter: any) => {
        return api.get("/round-records", {
            params: filter
        });
    },

    getWinningReport: async (filter: any) => {
        const sanitizeFilter: any = {};

        for (const key in filter) {
            if (filter[key]) {
                sanitizeFilter[key] = filter[key];
            }
        }
        return api.get("/round-records/winning-report", {
            params: sanitizeFilter
        });
    },
    getWinningReportExcel: async (filter: any) => {
        return api.get("/round-records/winning-report/excel", {
            params: filter,
            responseType: 'arraybuffer',
        });
    },
    getRoundRecordById: async (id: number) => {
        return api.get(`/round-records/${id}`);
    },
    getMyResult: async (id: number) => {

        return api.get(`/round-records/my-result/${id}`);
    },
    getRoundBets: async (id: string) => {
        return api.get(`/round-records/history/${id}`);
    },

    getLastRoundWinner: async (type: SchedulerType) => {
        return api.get(`/round-records/round-winners`, {
            params: {
                type,
            }
        });
    },
    getWheelOfFortuneHistory: async ({ page, limit, type }: { page: number, limit: number, type: SchedulerType }) => {
        return api.get(`/round-records/wheel-of-fortune/history`, { params: { page, limit, type } });
    },
};
