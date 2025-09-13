import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { externalUserAPI } from "@/lib/axios/external-user-API";
import { toast } from "sonner";

// Verify external user session
export const useVerifyExternalSession = ({ sessionId, gameName }: { sessionId: string, gameName: string }) => {
  return useQuery({
    queryKey: ["externalUser", "verifySession", sessionId, gameName],
    queryFn: () => externalUserAPI.verifyExternalSession({ sessionId, gameName }),
    enabled: !!sessionId && !!gameName,
  });
};

// Place an external bet (requires external token)
export const useCreateExternalBet = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: any) =>
      externalUserAPI.createExternalBet(payload),
    onSuccess: () => {
      toast.success("Bet placed successfully");
      queryClient.invalidateQueries({
        predicate: (query) => {
          const queryKey = query.queryKey;
          const invalidateQueries = queryKey[0] === "user" && queryKey[1] === "wallet" || queryKey[0] === "externalUser";
          return invalidateQueries;
        }
      });
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message ?? "Error placing bet");
    },
  });
};

// Get external user wallet/balance (requires external token)
export const useGetExternalWallet = (enabled: boolean = false) => {
  return useQuery({
    queryKey: ["user", "wallet", "external"],
    queryFn: () => externalUserAPI.getExternalWallet(),
    retry: 1,
    enabled: enabled,
  });
};

// Get external user's placements for a round (requires external token)
export const useGetExternalUsersPlacements = (token: string, enabled: boolean = true) => {
  return useQuery({
    queryKey: ["externalUser", "placements", token],
    queryFn: () => externalUserAPI.getExternalUsersPlacements(token),
    enabled: !!token && enabled,
    retry: 1,
  });
};
