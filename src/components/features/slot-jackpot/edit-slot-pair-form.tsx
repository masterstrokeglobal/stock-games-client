"use client";

import LoadingScreen from "@/components/common/loading-screen";
import MarketItem, { SchedulerType } from "@/models/market-item";
import { useGetSlotPairById, useUpdateSlotPair } from "@/react-query/slot-pair-queries";
import { useMemo } from "react";
import SlotPairForm, { SlotPairFormValues } from "./slot-pair-form";

type Props = {
    id: string;
}

const EditSlotPairForm = ({ id }: Props) => {
    const { data: slotPair, isLoading: isLoadingPair } = useGetSlotPairById(id);
    const { mutate: updateSlotPair, isPending: isUpdating } = useUpdateSlotPair();

    const handleSubmit = (data: SlotPairFormValues) => {
        updateSlotPair({
            id: slotPair?.id?.toString() || "",
            ...data
        });
    };

    const defaultValues = useMemo(() => {
        return {
            type: slotPair?.type as SchedulerType,
            marketItems: slotPair?.marketItems?.map((item: MarketItem) => item.id?.toString() || "") || [],
            active: slotPair?.active || false
        }
    }, [slotPair]);

    if (isLoadingPair) {
        return <LoadingScreen />
    }

    return (
        <SlotPairForm
            onSubmit={handleSubmit}
            isLoading={isUpdating}
            defaultValues={defaultValues}
        />
    );
};

export default EditSlotPairForm;