import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { gameUserAPI } from "@/lib/axios/game-user-API"; // Adjust the path as needed
import { useAuthStore } from "@/context/auth-context";
import User from "@/models/user";
import { RoundRecordGameType } from "@/models/round-record";

// Fetch current user's profile
export const useGameUserProfile = () => {
  return useQuery({
    retry: 1,
    queryKey: ["gameUser", "profile"],
    queryFn: () => gameUserAPI.myProfile(),
  });
};

export const useGameUserSessionVerify = () => {
  return useQuery({
    retry: 1,
    queryKey: ["gameUser", "sessionVerify"],
    queryFn: () => gameUserAPI.sessionVerify(),
    enabled: typeof window !== 'undefined' && 
             !!sessionStorage.getItem('sessionId') && 
             sessionStorage.getItem('sessionId') !== 'null' && 
             sessionStorage.getItem('sessionId') !== 'undefined',
  });
};

// Create a new user
export const useGameUserRegister = () => {
  const queryClient = useQueryClient();
  const { setUser } = useAuthStore();

  return useMutation({
    mutationFn: (payload: any) => gameUserAPI.createUser(payload),
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ["gameUser", "allUsers"],
        predicate: (query) => query.queryKey[0] === "gameUser",
      });
      const user = new User(data.data);
      setUser(user);
      toast.success("User created successfully");
    },
    onError: (error: any) => {
      toast.error(error.response?.data.message ?? "Error creating user");
    },
  });
};

export const useGameUserLogin = () => {
  const queryClient = useQueryClient();
  const { setUser } = useAuthStore();

  return useMutation({
    mutationFn: (payload: any) => gameUserAPI.login(payload),
    onSuccess: (data) => {
      const user = new User(data.data);
      setUser(user);
      if (user.sessionId) {
        console.log("loki login sessionId set:", user.sessionId);
        sessionStorage.setItem('sessionId', user.sessionId);
      }
      queryClient.invalidateQueries({
        predicate: (query) => query.queryKey[0] === "gameUser",
      });
      toast.success("User logged in successfully");
    },
    onError: (error: any) => {
      toast.error(error.response?.data.message ?? "Error logging in");
    },
  });
};

export const useForgotPasswordEmail = () => {
  return useMutation({
    mutationFn: gameUserAPI.forgotPassword,
    onSuccess: () => {
      toast.success("Email sent successfully");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message ?? "Error sending email");
    },
  });
};

export const useVerifyForgotPassword = () => {
  return useMutation({
    mutationFn: gameUserAPI.verifyForgotPassword,
    onSuccess: () => {
      toast.success("Password reset successfully");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message ?? "Error resetting password");
    },
  });
};

export const useForgotChangePassword = () => {
  return useMutation({
    mutationFn: gameUserAPI.changeForgotPassword,
    onSuccess: () => {
      toast.success("Password changed successfully");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message ?? "Error changing password");
    },
  });
};
// Verify a user
export const useGameUserVerify = () => {
  return useMutation({
    mutationFn: (data: { userId: string; verificationData: { otp: string } }) =>
      gameUserAPI.verifyUser(data),
    onSuccess: () => {
      toast.success("User verified successfully");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message ?? "Error verifying user");
    },
  });
};

// Resend OTP to a user
export const useGameUserResendOTP = () => {
  return useMutation({
    mutationFn: (data: { userId: string }) => gameUserAPI.resendOTP(data),
    onSuccess: () => {
      toast.success("OTP resent successfully");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message ?? "Error resending OTP");
    },
  });
};

// Update a user by ID
export const useGameUserUpdateById = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { userId: string; updateData: Record<string, any> }) =>
      gameUserAPI.updateUserById(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["gameUser", "allUsers"] });
      toast.success("User updated successfully");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message ?? "Error updating user");
    },
  });
};

// Delete a user by ID
export const useGameUserDeleteById = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { userId: string }) => gameUserAPI.deleteUserById(data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        predicate: (query) =>
          query.queryKey[0] === "gameUser" && query.queryKey[1] === "allUsers",
      });
      toast.success("User deleted successfully");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message ?? "Error deleting user");
    },
  });
};

export const useGoogleLogin = () => {
  return useMutation({
    mutationFn: gameUserAPI.googleLogin,
    onSuccess: () => {
      toast.success("Google login initiated");
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data.message ?? "Error initiating Google login"
      );
    },
  });
};

export const useGoogleLoginCallback = () => {
  return useMutation({
    mutationFn: gameUserAPI.googleLoginCallback,
    onSuccess: () => {
      toast.success("Google login successful");
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data.message ?? "Error logging in with Google"
      );
    },
  });
};

export const useGoogleCreateLogin = () => {
  const queryClient = useQueryClient();
  const { setUser } = useAuthStore();
  return useMutation({
    mutationFn: gameUserAPI.googleCreateLogin,
    onSuccess: (data) => {
      const user = new User(data.data);
      setUser(user);
      queryClient.invalidateQueries({
        predicate: (query) => query.queryKey[0] === "gameUser",
      });
      toast.success("Google login successful");
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data.message ?? "Error logging in with Google"
      );
    },
  });
};

export const useDemoLogin = () => {
  const queryClient = useQueryClient();
  const { setUser } = useAuthStore();
  return useMutation({
    mutationFn: gameUserAPI.demoLogin,
    onSuccess: (data) => {
      const user = new User(data.data);
      setUser(user);
      queryClient.invalidateQueries({
        predicate: (query) => query.queryKey[0] === "gameUser",
      });
      toast.success("Demo login successful");
    },
    onError: (error: any) => {
      toast.error(
        error.response?.data.message ?? "Error logging in with Demo"
      );
    },
  });
};

export const useCaptcha = () => {
  return useQuery({
    queryKey: ["captcha"],
    queryFn: () => gameUserAPI.getCaptcha(),
    staleTime: 0, // Always consider data stale to force fresh captcha on page load
    refetchOnWindowFocus: false, // Prevent refetch on focus
    refetchOnMount: true, // Refresh captcha on component mount
  });
};

// Get User Tier Hook
export const useGetUserTier = () => {
  return useQuery({
    queryKey: ["userTier"],
    queryFn: async () => {
      const response = await gameUserAPI.getTier();
      return response.data;
    },
  });
};


export const useGetUserGameHistory = ({ page, roundRecordGameType, startDate }: { page: number, roundRecordGameType: RoundRecordGameType, startDate?: string }) => {
  return useQuery({
    queryKey: ["userGameHistory", page, roundRecordGameType, startDate],
    queryFn: async () => {
      const response = await gameUserAPI.getUserGameHistory({ page, roundRecordGameType, startDate } );
      return response.data;
    },
  });
};

export const useGetUserGameHistoryByRoundId = (roundId: string) => {
  return useQuery({
    queryKey: ["userGameHistoryByRoundId", roundId],
    queryFn: async () => {
      const response = await gameUserAPI.getUserGameHistoryByRoundId(roundId);
      return response.data;
    },
  });
};      

export type UserBetsResponse = {
  casino: { items: any[]; totalCount: number };
  stock: { items: any[]; totalCount: number };
};

export const useGetUserBets = (params: { page: number; limit: number; startDate?: string; endDate?: string }) => {
  return useQuery<UserBetsResponse>({
    queryKey: ["userBets", params.page, params.limit, params.startDate, params.endDate],
    queryFn: async () => {
      const response = await gameUserAPI.getUserBets(params);
      return response.data as UserBetsResponse;
    },
    refetchOnMount: true,
    refetchOnWindowFocus: false,
    staleTime: 0,
    gcTime: 0, // No caching to prevent stale data (renamed from cacheTime in newer React Query)
  });
};