"use client";

import { useRouter } from "next/navigation";
import SevenUpDownPairForm, { SevenUpDownPairFormValues } from "./seven-up-down-pair-form";
import { useCreateSevenUpDownPair } from "@/react-query/seven-up-down-pair-queries";
import { SchedulerType } from "@/models/market-item";

const CreateSevenUpDownPairForm = () => {
    const router = useRouter();
    const { mutate: createSevenUpDownPair, isPending: isCreating } = useCreateSevenUpDownPair();

    const handleSubmit = (data: SevenUpDownPairFormValues) => {
        createSevenUpDownPair(data, {
            onSuccess: () => {
                router.push("/dashboard/seven-up-down-pair");
            }
        });
    }

    return (
        <SevenUpDownPairForm defaultValues={{ marketItems: Array(13).fill(""), active: true, type: SchedulerType.NSE }} onSubmit={handleSubmit} isLoading={isCreating} />
    )
}

export default CreateSevenUpDownPairForm;