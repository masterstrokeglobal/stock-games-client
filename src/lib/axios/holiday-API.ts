// Axios API Instance
import api from "./instance";

export const holidayAPI = {
    createHoliday: async (data: any) => {
        return api.post("/holiday", data);
    },

    getAllHolidays: async (filter?: any) => {
        return api.get("/holiday", {
            params: filter
        });
    },

    getHolidayById: async (holidayId: string) => {
        return api.get(`/holiday/${holidayId}`);
    },

    updateHoliday: async (holidayId: string, data: any) => {
        return api.put(`/holiday/${holidayId}`, data);
    },
    deleteHoliday: async (holidayId: string) => {
        return api.delete(`/holiday/${holidayId}`);
    }
};