"use client";
import LoadingScreen from "@/components/common/loading-screen";
import CasinoGameForm, { CasinoGameFormType } from "@/components/features/casino-games/casino-game-form";
import { GameStatus } from "@/models/casino-games";
import { useGetGameById, useUpdateGame } from "@/react-query/casino-games-queries";
import { useParams, useRouter } from "next/navigation";
import { useMemo } from "react";
import { toast } from "sonner";

const CasinoGamePage = () => {
    const params = useParams();
    const router = useRouter();

    const { data: game, isLoading } = useGetGameById(params.id as string);
    const { mutate: updateGame, isPending: isUpdating } = useUpdateGame();

    const defaultValues: CasinoGameFormType | null = useMemo(() => {
        if (!game) return null;
        return {
            name: game.name,
            imageUrl: game.imageUrl,
            providerName: game.providerName,
            subProviderName: game.subProviderName,
            category: game.category,
            isActive: game.status === GameStatus.ACTIVE,
            type: game.type,
            gameId: game.gameId.toString(),
            popular: game.popular,
            status: game.status,
            new: game.new,
        } as CasinoGameFormType;
    }, [game]);

    const onSubmit = (data: CasinoGameFormType) => {
        updateGame({
            ...data,
            id: Number(params.id),
        }, {
            onSuccess: () => {
                router.push("/dashboard/casino-games");
            },
            onError: (error) => {
                toast.error(error.message);
            }
        });
    }

    if (isLoading) return <LoadingScreen />
    return (
        <div>
            <CasinoGameForm defaultValues={defaultValues || undefined} onSubmit={onSubmit} isLoading={isLoading || isUpdating} />
        </div>
    )
}

export default CasinoGamePage;