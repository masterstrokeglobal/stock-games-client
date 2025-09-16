import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { adminExternalGamesAPI } from "@/lib/axios/admin-external-games-API";
import api from "@/lib/axios/instance";
import { toast } from "sonner";

const ORDER: Record<string, number> = {
    derby: 1,
    stock_slots: 2,
    stock_jackpot: 3,
    seven_up_down: 4,
    head_tail: 5,
    wheel_of_fortune: 6,
    aviator: 7,
    dice: 8,
};

const NAMES: Record<string, string> = {
    derby: "Derby",
    stock_slots: "Stock Slots",
    stock_jackpot: "Stock Jackpot",
    seven_up_down: "Seven Up Down",
    head_tail: "Head Tail",
    wheel_of_fortune: "Wheel of Fortune",
    aviator: "Aviator",
    dice: "Dice",
};

export type ExternalGame = { name: string; identifier: string; thumbnail: string; active: boolean; order: number };

export const useGetExternalGames = (companyId: string) => {
    return useQuery({
        queryKey: ["external-games", companyId],
        queryFn: async () => {
            const { data } = await adminExternalGamesAPI.get({ companyId });
            const payload = (data && (data as any).data) ? (data as any).data : data;
            const allowed: string[] | ["all"] = payload?.allowedGames || [];
            const thumbs: Record<string, string> = payload?.gameThumbnails || {};
            const identifiers = Object.keys(ORDER);
            const list: ExternalGame[] = identifiers.map((id) => ({
                name: NAMES[id],
                identifier: id,
                thumbnail: thumbs?.[id] || "",
                active: Array.isArray(allowed) && (allowed as any).includes("all") ? true : (Array.isArray(allowed) && (allowed as string[]).includes(id)),
                order: ORDER[id],
            }));
            return list;
        },
        enabled: !!companyId,
        retry: 1,
    });
};

export const useUpdateExternalGame = (companyId: string) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ identifier, thumbnail }: { identifier: string; thumbnail: string }) => {
            return adminExternalGamesAPI.updateThumbnails(companyId, { gameThumbnails: { [identifier]: thumbnail } });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["external-games", companyId] });
            toast.success("Thumbnail saved");
        },
        onError: (e: any) => toast.error(e.response?.data?.message ?? "Failed to update thumbnail"),
    });
};

export const useS3PresignedUpload = () => {
    return useMutation({
        mutationFn: async ({ fileName, fileType }: { fileName: string; fileType: string }) => {
            const { data } = await api.post(`/superadmin/uploads/s3-signed-url`, { fileName, fileType });
            return data; // { url, fields }
        },
        onError: (error: any) => toast.error(error.response?.data?.message ?? "Failed to get upload URL"),
    });
};


