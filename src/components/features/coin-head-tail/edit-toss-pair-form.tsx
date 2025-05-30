"use client";

import LoadingScreen from "@/components/common/loading-screen";
import { SchedulerType } from "@/models/market-item";
import { useGetCoinTossPairById, useUpdateCoinTossPair } from "@/react-query/coin-toss-queries";
import { useMemo } from "react";
import CoinTossPairForm, { CoinTossPairFormValues } from "./coin-toss-pair-form";

type Props = {
    id: string;
}

const EditTossPairForm = ({ id }: Props) => {
    const { data: coinTossPair, isLoading: isLoadingPair } = useGetCoinTossPairById(id);
    const { mutate: updateCoinTossPair, isPending: isUpdating } = useUpdateCoinTossPair(id);

    const handleSubmit = (data: CoinTossPairFormValues) => {
        updateCoinTossPair({
            id: coinTossPair?.id?.toString() || "",
            ...data
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