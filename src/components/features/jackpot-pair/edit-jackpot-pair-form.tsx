"use client";

import LoadingScreen from "@/components/common/loading-screen";
import MarketItem, { SchedulerType } from "@/models/market-item";
import { useGetJackpotPairById, useUpdateJackpotPair } from "@/react-query/jackpot-pair-queries";
import { useMemo } from "react";
import JackpotPairForm, { JackpotPairFormValues } from "./jackpot-pair-form";

type Props = {
    id: string;
}

const EditJackpotPairForm = ({ id }: Props) => {
    const { data: jackpotPair, isLoading: isLoadingPair } = useGetJackpotPairById(id);
    const { mutate: updateJackpotPair, isPending: isUpdating } = useUpdateJackpotPair();

    const handleSubmit = (data: JackpotPairFormValues) => {
        updateJackpotPair({
            id: jackpotPair?.id?.toString() || "",
            ...data
        });
    };

    const defaultValues = useMemo(() => {
        return {
            type: jackpotPair?.type as SchedulerType,
            marketItems: jackpotPair?.marketItems?.map((item: MarketItem) => item.id?.toString() || "") || [],
            active: jackpotPair?.active || false
        }
    }, [jackpotPair]);

    if (isLoadingPair) {
        return <LoadingScreen />
    }

    return (
        <JackpotPairForm
            onSubmit={handleSubmit}
            isLoading={isUpdating}
            defaultValues={defaultValues}
        />
    );
};

export default EditJackpotPairForm;