"use client";

import LoadingScreen from "@/components/common/loading-screen";
import MarketItem from "@/models/market-item";
import { useGetSevenUpDownPairById, useUpdateSevenUpDownPair } from "@/react-query/seven-up-down-pair-queries";
import { useMemo } from "react";
import SevenUpDownPairForm, { SevenUpDownPairFormValues } from "./seven-up-down-pair-form";

type Props = {
    id: string;
}

const EditSevenUpDownPairForm = ({ id }: Props) => {
    const { data: sevenUpDownPair, isLoading: isLoadingPair } = useGetSevenUpDownPairById(id);
    const { mutate: updateSevenUpDownPair, isPending: isUpdating } = useUpdateSevenUpDownPair();

    const handleSubmit = (data: SevenUpDownPairFormValues) => {
        updateSevenUpDownPair({
            id: sevenUpDownPair?.id?.toString() || "",
            ...data
        });
    };

    const defaultValues = useMemo(() => {
        return {
            type: sevenUpDownPair?.type || "",
            marketItems: sevenUpDownPair?.marketItems?.map((item: MarketItem) => item.id?.toString() || "").slice(0, 13) || [],
            active: sevenUpDownPair?.active || false
        }
    }, [sevenUpDownPair]);

    if (isLoadingPair) {
        return <LoadingScreen />
    }

    return (
        <SevenUpDownPairForm
            onSubmit={handleSubmit}
            isLoading={isUpdating}
            defaultValues={defaultValues}
        />
    );
};

export default EditSevenUpDownPairForm;