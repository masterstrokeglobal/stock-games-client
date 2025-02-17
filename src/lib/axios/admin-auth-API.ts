import { COMPANYID } from "../utils";
import api from "./instance"; // Adjust the path according to your project structure

export const adminAuthAPI = {
    adminLogin: async (payload: { email: string; password: string,loginAs }) => {
        return api.post("/auth/admin-login", { ...payload, companyId: COMPANYID });
    },
    logout: async () => {
        return api.post("/auth/logout");
    },
};
