import { RoundRecordGameType } from "@/models/round-record";
import { COMPANYID } from "../utils";
import api from "./instance";

type UserTier = {

  name: string;
  companyId: number;
  totalPoints: number;
  tierId: number;
  imageUrl: string;
  lastLoginBonusDate: string;
  lastGameBonuDate: string | null;
  gamesPlayed: number;
  redeemablePoints: number;
  pointsPerHundredRupees: number;
  pointsRedeemed: number;
  loginBonusAmount: number;
  gameBonusAmount: number;
  tierName: string;
  nextTierName: string;
  nextTierGameRequires: number;
  nextTierPointsRequired: number;
  nextTierImageUrl: string;
}
export const gameUserAPI = {
  createUser: async (payload: any) => {
    return api.post("/user", { ...payload, company: COMPANYID });
  },

  getCaptcha: async () => {
    return api.get("/auth/captcha");
  },

  verifyUser: async ({
    userId,
    verificationData,
  }: {
    userId: string;
    verificationData: { otp: string };
  }) => {
    return api.post(`/user/verify/${userId}`, verificationData);
  },

  resendOTP: async ({ userId }: { userId: string }) => {
    return api.post(`/user/resend-otp/${userId}`);
  },

  updateUserById: async ({
    userId,
    updateData,
  }: {
    userId: string;
    updateData: Record<string, any>;
  }) => {
    return api.patch(`/user/${userId}`, updateData);
  },

  changePassword: async (payload: {
    oldPassword: string;
    newPassword: string;
  }) => {
    return api.post(`/user/change-password`, payload);
  },
  deleteUserById: async ({ userId }: { userId: string }) => {
    return api.delete(`/user/${userId}`);
  },
  forgotPassword: async ({ email }: { email: string }) => {
    return api.post(`/user/forget-password`, { email });
  },

  verifyForgotPassword: async (verificationData: {
    otp: string;
    userId: string;
  }) => {
    return api.post(
      `/user/verify-forget-password/${verificationData.userId}`,
      verificationData
    );
  },

  changeForgotPassword: async (payload: {
    password: string;
    userId: string;
  }) => {
    return api.post(`/user/forget-password/change`, payload);
  },
  login: async (payload: any) => {
    return api.post("/auth/user-login", { ...payload, companyId: COMPANYID });
  },

  googleCreateLogin: async (payload: any) => {
    return api.post("/auth/google", payload);
  },


  getTier: async () => {
    return api.get<UserTier>("/user/my-tier");
  }, 

  demoLogin: async () => {
    return api.post("/auth/create-demo-user", { companyId: COMPANYID });
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

  toggleFavoriteMarket: async (payload: {marketId: string}) => {
    return api.post("/favourite", payload);
  },

  getFavoriteMarket: async () => {
    return api.get("/favourite");
  },

  getUserGameHistory: async ({ page, roundRecordGameType }: { page: number, roundRecordGameType: RoundRecordGameType }) => {
    return api.get(`/user/game-history/round-record-game-type/${roundRecordGameType}`, { params: { page } });
  },

  getUserGameHistoryByRoundId: async (roundId: string) => {
    return api.get(`/user/game-history/${roundId}`);
  }
};
