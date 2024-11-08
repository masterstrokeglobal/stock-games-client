import api from "./instance";
import { SchedulerFormValues } from "@/components/features/scheduler/scheduler-form";

export const schedulerAPI = {
    // Create a new scheduler
    createScheduler: async (payload: SchedulerFormValues) => {
        return api.post("/schedule", payload);
    },

    // Fetch all schedule with optional filters
    getSchedulers: async (filter?: SearchFilters) => {
        return api.get("/schedule", { params: filter });
    },

    // Fetch a single scheduler by ID
    getSchedulerById: async (id: string) => {
        return api.get(`/schedule/${id}`);
    },

    // Fetch a unique scheduler (based on some criteria)
    getUniqueScheduler: async (filter?: any) => {
        return api.get("/schedule/unique", { params: filter });
    },

    // Update a scheduler by ID
    updateSchedulerById: async (payload: Partial<SchedulerFormValues>) => {
        const { id, ...data } = payload;
        return api.patch(`/schedule/${id}`, data);
    },
};
