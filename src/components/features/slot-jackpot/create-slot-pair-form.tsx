"use client";

import { useCreateSlotPair } from "@/react-query/slot-pair-queries";
import { useRouter } from "next/navigation";
import SlotPairForm, { SlotPairFormValues } from "./slot-pair-form";

const CreateSlotPairForm = () => {
    const router = useRouter();
    const { mutate: createSlotPair, isPending: isCreating } = useCreateSlotPair();

    const handleSubmit = (data: SlotPairFormValues) => {
        createSlotPair(data, {
            onSuccess: () => {
                router.push("/dashboard/slot-pair");
            }
        });
    }

    return (
        <SlotPairForm onSubmit={handleSubmit} isLoading={isCreating} />
    )
}

export default CreateSlotPairForm;