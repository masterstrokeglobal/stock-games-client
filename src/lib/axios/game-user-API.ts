import { COMPANYID } from "../utils";
import api from "./instance";

export const gameUserAPI = {
    createUser: async (payload: any) => {
        return api.post("/user", { ...payload, company: COMPANYID });
    },

    verifyUser: async ({ userId, verificationData }: { userId: string; verificationData: { otp: string } }) => {
        return api.post(`/user/verify/${userId}`, verificationData);
    },

    resendOTP: async ({ userId }: { userId: string }) => {
        return api.post(`/user/resend-otp/${userId}`);
    },

    updateUserById: async ({ userId, updateData }: { userId: string; updateData: Record<string, any> }) => {
        return api.patch(`/user/${userId}`, updateData);
    },

    changePassword: async (payload: { oldPassword: string; newPassword: string }) => {
        return api.post(`/user/change-password`, payload);
    }
    ,
    deleteUserById: async ({ userId }: { userId: string }) => {
        return api.delete(`/user/${userId}`);
    },
    forgotPassword: async ({ email }: { email: string }) => {
        return api.post(`/user/forget-password`, { email });
    },

    verifyForgotPassword: async (verificationData: { otp: string, userId: string, }) => {
        return api.post(`/user/verify-forget-password/${verificationData.userId}`, verificationData);
    },

    changeForgotPassword: async (payload: { password: string, userId: string }) => {
        return api.post(`/user/forget-password/change`, payload);
    },
    login: async (payload: any) => {
        return api.post("/auth/user-login", { ...payload, companyId: COMPANYID });
    },

    myProfile: async () => {
        return api.get("/user/profile");
    },

    googleLogin: async () => {
        return api.get("/auth/google");
    },
    googleLoginCallback: async () => {
        return api.get("/auth/google/callback");
    },
};
