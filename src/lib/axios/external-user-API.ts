import api from "./instance";

export const externalUserAPI = {

  // Verify external user session
  verifyExternalSession: async (payload: { sessionId: string ,gameName: string}) => {
    return api.post("/external-user/verify-session", payload);
  },

  // Place an external bet (requires external token)
  createExternalBet: async (payload: any) => {
    return api.post("/external-user/external-bet", payload);
  },

    // Get external user wallet/balance (requires external token)
  getExternalWallet: async () => {
    return api.get("/external-user/external-wallet");
  },

  // Get external user's placements for a round (requires external token)
  getExternalUsersPlacements: async (roundId: string) => {
    return api.get(`/external-user/placement/${roundId}`);
  },
};
