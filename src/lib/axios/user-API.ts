import User from "@/models/user";
import api from "./instance";
import { add } from "date-fns";
import { SchedulerType } from "@/models/market-item";

export const userAPI = {
    getAllUsers: async (filter: SearchFilters) => {
        return api.get("/user", {
            params: filter
        });
    },

    getUserById: async (userId: string) => {
        return api.get(`/user/${userId}`);
    },

    deleteUserById: async (userId: string) => {
        return api.delete(`/user/${userId}`);
    },
    uploadImage: async (data: FormData) => {
        return api.post("/company/upload-image", data, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
    },
    createUser: async (data: User) => {
        return api.post("/user", data);
    },
    updateUser: async (data: User) => {
        return api.patch(`/user/${data.id}`, data);
    },
    addUserPlacementNotAllowed: async (data: { placementNotAllowed: SchedulerType, userId: string }) => {
        return api.post(`/user/add-placement-not-allowed/${data.userId}`, data);
    },
    removeUserPlacementNotAllowed: async (data: { placementNotAllowed: SchedulerType, userId: string }) => {
        return api.post(`/user/remove-placement-not-allowed/${data.userId}`, data);
    },
    addAgentUserPlacementNotAllowed: async (data: { placementNotAllowed: SchedulerType, userId: string }) => {
        return api.post(`/user/add-agent-placement-not-allowed/${data.userId}`, data);
    },
    removeAgentUserPlacementNotAllowed: async (data: { placementNotAllowed: SchedulerType, userId: string }) => {
        return api.post(`/user/remove-agent-placement-not-allowed/${data.userId}`, data);
    },
};

