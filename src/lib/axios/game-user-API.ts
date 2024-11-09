import api from "./instance";

export const gameUserAPI = {
    createUser: async (payload: any) => {
        return api.post("/user", payload);
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

    deleteUserById: async ({ userId }: { userId: string }) => {
        return api.delete(`/user/${userId}`);
    },

    login: async (payload: any) => {
        return api.post("/auth/user-login", payload);
    },
    
    myProfile: async () => {
        return api.get("/user/profile");
    },
};
