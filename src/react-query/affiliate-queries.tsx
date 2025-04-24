import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import affiliateAPI from "@/lib/axios/affiliate-API";
import { toast } from "sonner";

export const useCreateAffiliate = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: affiliateAPI.createAffiliate,
        onSuccess: () => {
            queryClient.invalidateQueries({
                predicate: (query) => {
                    return query.queryKey[0] === "affiliate";
                },
            });

            toast.success("Affiliate created successfully");
        },
        onError: (error) => {
            toast.error(error.message);
        },
    });
};

export const useGetAllAffiliate = (filter: any) => {
    return useQuery({
        queryKey: ["affiliate", filter],
        queryFn: () => affiliateAPI.getAllAffiliate(filter),
    });
};

export const useGetAffiliateById = (id: string) => {
    return useQuery({
        queryKey: ["affiliate", id],
        queryFn: () => affiliateAPI.getAffiliateById(id),
    });
};

export const useDeleteAffiliate = () => {
    return useMutation({
        mutationFn: affiliateAPI.deleteAffiliate,
    });
};



export const useGetAffiliateUsers = (filter: any) => {
    return useQuery({
        queryKey: ["affiliate", filter],
        queryFn: () => affiliateAPI.getAffiliateUsers(filter),
    });
};


export const useGetAffiliateUsersDownload = (filter: any) => {
    return useMutation({
        mutationFn: () => affiliateAPI.getAffiliateUsersDownload(filter),
        onSuccess: (data) => {
            const blob = new Blob([data.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = "affiliate-users.xlsx";
            a.click();
            window.URL.revokeObjectURL(url);
        },
        onError: (error) => {
            toast.error(error.message);
        },
    });
};

