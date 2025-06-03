import { SchedulerType } from "@/models/market-item";
import User from "@/models/user";
import api from "./instance";
import { COMPANYID } from "../utils";
import UserIpLog from "@/models/user-ip-logs";
export type GetUserIpLogsParams = {
    userId: string;
    page: number;
    limit: number;
    startDate?: Date;
    endDate?: Date;
}

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
        return api.post("/user", { ...data, companyId: COMPANYID });
    },
    updateUser: async (data: User) => {
        return api.patch(`/user/${data.id}`, data);
    },
    getUserWallet: async (userId: string) => {
        return api.get(`/admin/user-wallet/${userId}`);
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

    getUserIpLogs: async ({ userId, page, limit, startDate, endDate }: GetUserIpLogsParams) => {
        const response = await api.get(`/user/ip-logs/${userId}`, {
            params: {
                page,
                limit,
                startDate,
                endDate
            }
        });
        return response.data as {
            data: UserIpLog[];
            totalPage: number;
        };
    },
};

