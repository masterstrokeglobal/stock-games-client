import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { companyApiDetailsAPI } from "@/lib/axios/company-api-details-API"; // legacy company API details
import { adminExternalGamesAPI } from "@/lib/axios/admin-external-games-API"; // new unified admin endpoints
// import CompanyApiDetails from "@/models/company-api-details";
import api from "@/lib/axios/instance";

export const useCreateCompanyApiDetails = () => {
    return useMutation({
        mutationFn: companyApiDetailsAPI.createCompanyApiDetails,
        onSuccess: () => {
            toast.success("Company API details created successfully");
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message ?? "Error creating company API details");
        },
    });
};

export const useGetCompanyApiDetails = (companyId: string) => {
    return useQuery({
        queryKey: ["company-api-details", companyId],
        queryFn: async () => {
            // Prefer new admin endpoint which returns { allowedGames, gameThumbnails }
            const { data } = await adminExternalGamesAPI.get({ companyId });
            return { allowedGames: data.data.allowedGames, gameThumbnails: data.data.gameThumbnails } as any;
        },
        retry: 1,
        enabled: !!companyId,
    });
};

export const useUpdateCompanyApiDetailsById = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: companyApiDetailsAPI.updateCompanyApiDetailsById,
        onSuccess: () => {
            queryClient.invalidateQueries({
                predicate: (query) => {
                    return query.queryKey[0] === "company-api-details";
                }
            });
            toast.success("Company API details updated successfully");
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message ?? "Error updating company API details");
        },
    });
};

export const useGetCompanyApiDetailsById = (id: string) => {
    return useQuery({
        queryKey: ["company-api-details", id],
        queryFn: () => companyApiDetailsAPI.getCompanyApiDetailsById(id),
        enabled: !!id,
    });
};

export const useDeleteCompanyApiDetailsById = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: companyApiDetailsAPI.deleteCompanyApiDetailsById,
        onSuccess: () => {
            queryClient.invalidateQueries({
                predicate: (query) => {
                    return query.queryKey[0] === "company-api-details";
                }
            });
        }
    })
}

// Superadmin: update allowed games (array of identifiers or ["all"]).
export const useUpdateAllowedGames = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({  allowedGames }: { companyId: string; allowedGames: string[] | ["all"] }) =>
            adminExternalGamesAPI.updateAllowed({ allowedGames }),
        onSuccess: () => {
            queryClient.invalidateQueries({ predicate: (q) => q.queryKey[0] === "company-api-details" });
            toast.success("Allowed games updated");
        },
        onError: (error: any) => toast.error(error.response?.data?.message ?? "Failed to update allowed games"),
    });
};

// Superadmin: update game thumbnails map
export const useUpdateGameThumbnails = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ companyId, gameThumbnails }: { companyId: string; gameThumbnails: Record<string, string> }) =>
            adminExternalGamesAPI.updateThumbnails(companyId, { gameThumbnails }),
        onSuccess: () => {
            queryClient.invalidateQueries({ predicate: (q) => q.queryKey[0] === "company-api-details" });
            toast.success("Game thumbnails updated");
        },
        onError: (error: any) => toast.error(error.response?.data?.message ?? "Failed to update thumbnails"),
    });
};

// Superadmin: get S3 signed URL and post to S3
export const useS3PresignedUpload = () => {
    return useMutation({
        mutationFn: async ({ fileName, fileType }: { fileName: string; fileType: string }) => {
            const { data } = await api.post(`/superadmin/uploads/s3-signed-url`, { fileName, fileType });
            return data; // { url, fields }
        },
        onError: (error: any) => toast.error(error.response?.data?.message ?? "Failed to get upload URL"),
    });
};