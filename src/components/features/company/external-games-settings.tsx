"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import Image from "next/image";
import { useGetCompanyApiDetails, useUpdateAllowedGames, useUpdateGameThumbnails } from "@/react-query/company-api-details";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import api from "@/lib/axios/instance";

type Props = {
    companyId: string;
    className?: string;
};

const ALL_IDENTIFIERS = [
    "derby",
    "stock_slots",
    "stock_jackpot",
    "seven_up_down",
    "head_tail",
    "wheel_of_fortune",
    "aviator",
    "dice",
];

export default function ExternalGamesSettings({ companyId, className }: Props) {
    const { data, isLoading } = useGetCompanyApiDetails(companyId);
    const updateAllowed = useUpdateAllowedGames();
    const updateThumbs = useUpdateGameThumbnails();

    const fileInputsRef = useRef<Record<string, HTMLInputElement | null>>({});

    const initialAllowed = useMemo(() => {
        const allowed = (data as any)?.allowedGames as string[] | undefined;
        return allowed && allowed.length ? allowed : [];
    }, [data]);

    const initialThumbs = useMemo(() => {
        const thumbs = (data as any)?.gameThumbnails as Record<string, string> | undefined;
        return thumbs || {};
    }, [data]);

    const [allowedGames, setAllowedGames] = useState<string[]>([]);
    const [gameThumbnails, setGameThumbnails] = useState<Record<string, string>>({});
    const [uploadingKey, setUploadingKey] = useState<string | null>(null);

    useEffect(() => {
        setAllowedGames(initialAllowed);
    }, [initialAllowed]);

    useEffect(() => {
        setGameThumbnails(initialThumbs);
    }, [initialThumbs]);

    const toggleAllowed = (id: string) => {
        if (id === "all") {
            setAllowedGames(["all"]);
            return;
        }
        const next = new Set(allowedGames.includes("all") ? [] : allowedGames);
        if (next.has(id)) next.delete(id); else next.add(id);
        setAllowedGames(Array.from(next));
    };

    const onSaveAllowed = () => {
        if (!companyId) return;
        const payload = allowedGames.length ? allowedGames : [];
        updateAllowed.mutate({ companyId, allowedGames: (payload as any) }, {
            onSuccess: () => {},
        });
    };

    const onClickUpload = (id: string) => {
        if (!fileInputsRef.current[id]) return;
        fileInputsRef.current[id]!.click();
    };

    const onFileChange = async (id: string, file?: File | null) => {
        if (!file) return;
        // Validate type and size
        const isValidType = ["image/png", "image/jpeg"].includes(file.type);
        if (!isValidType) {
            toast.error("Only PNG or JPEG allowed");
            return;
        }
        const MAX_MB = 5;
        if (file.size > MAX_MB * 1024 * 1024) {
            toast.error(`File too large. Max ${MAX_MB}MB`);
            return;
        }

        try {
            setUploadingKey(id);
            const form = new FormData();
            form.append("file", file);
            // Direct company upload endpoint; backend stores and returns URL
            const resp = await api.post(`/company/upload-image?companyId=${companyId}`, form, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            const objectUrl = resp.data?.fileUrl || resp.data?.data?.url || resp.data?.url || resp.data?.objectUrl;
            if (!objectUrl) throw new Error("Upload did not return URL");
            // Persist immediately
            await updateThumbs.mutateAsync({ companyId, gameThumbnails: { [id]: objectUrl } });
            setGameThumbnails((prev) => ({ ...prev, [id]: objectUrl }));
            toast.success("Thumbnail saved");
        } catch (err: any) {
            toast.error(err?.message ?? "Upload failed");
        } finally {
            setUploadingKey(null);
            if (fileInputsRef.current[id]) fileInputsRef.current[id]!.value = "";
        }
    };

    const onSaveThumbs = () => {
        if (!companyId) return;
        updateThumbs.mutate({ companyId, gameThumbnails }, { onSuccess: () => {} });
    };

    return (
        <Card className={cn("", className)}>
            <CardHeader>
                <CardTitle>External Games Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                {/* Allowed Games */}
                <section>
                    <div className="mb-2 font-medium">Allowed Games</div>
                    <div className="flex flex-wrap gap-3">
                        <label className="flex items-center gap-2">
                            <Checkbox checked={allowedGames.includes("all")} onCheckedChange={() => toggleAllowed("all")} />
                            <span>All</span>
                        </label>
                        {ALL_IDENTIFIERS.map((id) => (
                            <label key={id} className="flex items-center gap-2">
                                <Checkbox checked={!allowedGames.includes("all") && allowedGames.includes(id)} onCheckedChange={() => toggleAllowed(id)} />
                                <span>{id}</span>
                            </label>
                        ))}
                    </div>
                    <div className="mt-3">
                        <Button onClick={onSaveAllowed} disabled={updateAllowed.isPending || isLoading}>Save Allowed</Button>
                    </div>
                </section>

                {/* Thumbnails */}
                <section>
                    <div className="mb-2 font-medium">Thumbnails</div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {ALL_IDENTIFIERS.map((id) => (
                            <div key={id} className="border rounded p-3">
                                <div className="flex items-center justify-between mb-2">
                                    <div className="font-medium">{id}</div>
                                    {gameThumbnails[id] ? (
                                        <Badge variant="secondary">Set</Badge>
                                    ) : (
                                        <Badge variant="outline">Not set</Badge>
                                    )}
                                </div>
                                <div className="aspect-[3/2] relative bg-muted rounded overflow-hidden">
                                    {gameThumbnails[id] ? (
                                        <Image 
                                            src={gameThumbnails[id].replace(/\+/g, '%2B')} 
                                            alt={`${id} thumbnail`} 
                                            fill 
                                            className="object-cover" 
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-sm text-muted-foreground">No image</div>
                                    )}
                                </div>
                                <div className="flex gap-2 mt-3">
                                    <Button variant="outline" size="sm" onClick={() => onClickUpload(id)} disabled={uploadingKey === id }>
                                        {uploadingKey === id ? "Uploading..." : "Upload"}
                                    </Button>
                                    {gameThumbnails[id] && (
                                        <Button variant="ghost" size="sm" onClick={() => setGameThumbnails((p) => ({ ...p, [id]: "" }))}>Remove</Button>
                                    )}
                                    <input
                                        ref={(el) => {
                                            fileInputsRef.current[id] = el;
                                        }}
                                        type="file"
                                        accept="image/png,image/jpeg"
                                        className="hidden"
                                        onChange={(e) => onFileChange(id, e.target.files?.[0])}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="mt-3">
                        <Button onClick={onSaveThumbs} disabled={updateThumbs.isPending || isLoading}>Save Thumbnails</Button>
                    </div>
                </section>
            </CardContent>
        </Card>
    );
}


