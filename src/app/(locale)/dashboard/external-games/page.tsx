"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useMemo, useRef, useState } from "react";
import Image from "next/image";
import { toast } from "sonner";
import { useGetExternalGames, useS3PresignedUpload, useUpdateExternalGame } from "@/react-query/external-games";
import api from "@/lib/axios/instance";
import { COMPANYID } from "@/lib/utils";
import { useAuthStore } from "@/context/auth-context";

export default function ExternalGamesPage() {
    const { userDetails } = useAuthStore();
    const companyId = String((userDetails as any)?.companyId ?? COMPANYID ?? process.env.NEXT_PUBLIC_COMPANY_ID ?? "");
    const { data: gamesResp } = useGetExternalGames(companyId);
    const updateGame = useUpdateExternalGame(companyId);
    const presignUpload = useS3PresignedUpload();
    const fileInputsRef = useRef<Record<string, HTMLInputElement | null>>({});
    const [uploadingKey, setUploadingKey] = useState<string | null>(null);

    const games = useMemo(() => gamesResp ?? [], [gamesResp]);

    const toggleActive = (id: string) => {
        updateGame.mutate({ identifier: id, thumbnail : "" });
    };

    const onClickUpload = (id: string) => {
        if (!fileInputsRef.current[id]) return;
        fileInputsRef.current[id]!.click();
    };

    const onFileChange = async (id: string, file?: File | null) => {
        if (!file) return;
        const isValidType = ["image/png", "image/jpeg"].includes(file.type);
        if (!isValidType) return toast.error("Only PNG or JPEG allowed");
        const MAX_MB = 5;
        if (file.size > MAX_MB * 1024 * 1024) return toast.error(`File too large. Max ${MAX_MB}MB`);

        try {
            setUploadingKey(id);
            // Use the existing company upload endpoint for consistency
            // If a global companyId is needed, inject it here (e.g., from auth store)
            const form = new FormData();
            form.append("image", file);
            const resp = await api.post(`/company/upload-image?companyId=${companyId}`, form, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            const objectUrl = resp.data?.fileUrl || resp.data?.data?.url || resp.data?.url || resp.data?.objectUrl;
            if (!objectUrl) throw new Error("Upload did not return URL");
            await updateGame.mutateAsync({ identifier: id, thumbnail: objectUrl });
        } catch (err: any) {
            toast.error(err?.message ?? "Upload failed");
        } finally {
            setUploadingKey(null);
            if (fileInputsRef.current[id]) fileInputsRef.current[id]!.value = "";
        }
    };

    return (
        <section className="container-main min-h-[60vh] my-6">
            <header className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">External Games</h2>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {games.slice().sort((a: any,b: any) => a.order - b.order).map((game: any) => (
                    <Card key={game.identifier}>
                        <CardHeader>
                            <CardTitle className="flex items-center justify-between">
                                <span>{game.name}</span>
                                <span className="text-xs text-muted-foreground">{game.identifier}</span>
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="aspect-[3/2] relative rounded overflow-hidden bg-muted">
                                {game.thumbnail ? (
                                    <Image 
                                        src={game.thumbnail.replace(/\+/g, '%2B')} 
                                        alt={game.name} 
                                        fill 
                                        className="object-cover" 
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-sm text-muted-foreground">No thumbnail</div>
                                )}
                            </div>
                            <div className="flex items-center justify-between mt-3">
                                <Button variant={game.active ? "secondary" : "outline"} onClick={() => toggleActive(game.identifier)}>
                                    {game.active ? "Active" : "Inactive"}
                                </Button>
                                <div className="flex gap-2">
                                    <Button variant="outline" size="sm" onClick={() => onClickUpload(game.identifier)} disabled={uploadingKey === game.identifier || presignUpload.isPending}>
                                        {uploadingKey === game.identifier ? "Uploading..." : "Upload"}
                                    </Button>
                                    <input
                                        ref={(el) => { fileInputsRef.current[game.identifier] = el; }}
                                        type="file"
                                        accept="image/png,image/jpeg"
                                        className="hidden"
                                        onChange={(e) => onFileChange(game.identifier, e.target.files?.[0])}
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </section>
    );
}


