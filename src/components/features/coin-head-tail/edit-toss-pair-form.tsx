"use client";

import LoadingScreen from "@/components/common/loading-screen";
import { SchedulerType } from "@/models/market-item";
import { useGetCoinTossPairById, useUpdateCoinTossPair } from "@/react-query/coin-toss-queries";
import { useMemo } from "react";
import CoinTossPairForm, { CoinTossPairFormValues } from "./coin-toss-pair-form";
import { useRouter } from "next/navigation";

type Props = {
    id: string;
}

const EditTossPairForm = ({ id }: Props) => {
    const router = useRouter();
    const { data: coinTossPair, isLoading: isLoadingPair } = useGetCoinTossPairById(id);
    const { mutate: updateCoinTossPair, isPending: isUpdating } = useUpdateCoinTossPair(id);

    const handleSubmit = (data: CoinTossPairFormValues) => {
        updateCoinTossPair({
            id: coinTossPair?.id?.toString() || "",
            ...data
        },{
            onSuccess: () => {
                router.push(`/dashboard/coin-toss-pair`);
            },
        });
    };

    const defaultValues = useMemo(() => {
        return {
            type: coinTossPair?.type as SchedulerType,
            head: coinTossPair?.head?.id?.toString() || "",
            tail: coinTossPair?.tail?.id?.toString() || "",
            active: coinTossPair?.active || false
        }
    }, [coinTossPair]);

    if (isLoadingPair) {
        return <LoadingScreen />
    }

    return (
        <CoinTossPairForm
            onSubmit={handleSubmit}
            isLoading={isUpdating}
            defaultValues={defaultValues}
        />
    );
};

export default EditTossPairForm;