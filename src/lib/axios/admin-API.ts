import api from "./instance";

export const adminAPI = {
    createAdmin: async (payload: any) => {
        return api.post("/admin", payload);
    },

    getAllAdmins: async () => {
        return api.get("/admin");
    },

    getAdminById: async (adminId: string) => {
        return api.get(`/admin/${adminId}`);
    },

    updateAdminById: async (payload:Admin) => {
        return api.patch(`/admin/${adminId}`, payload);
    },

    deleteAdminById: async (adminId: string) => {
        return api.delete(`/admin/${adminId}`);
    },
};
