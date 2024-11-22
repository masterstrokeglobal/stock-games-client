import api from "./instance";

export const roundRecordsAPI = {
    getAllRoundRecords: async (filter: any) => {
        return api.get("/round-records", {
            params: filter
        });
    },

    getRoundRecordById: async (id: number) => {
        return api.get(`/round-records/${id}`);
    },
    getMyResult: async (id: number) => {
        return api.get(`/round-records/my-result/${id}`);
    },
};
