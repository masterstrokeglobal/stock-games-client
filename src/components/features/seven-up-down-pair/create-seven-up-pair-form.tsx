"use client";

import { useRouter } from "next/navigation";
import SevenUpDownPairForm, { SevenUpDownPairFormValues } from "./seven-up-down-pair-form";
import { useCreateSevenUpDownPair } from "@/react-query/seven-up-down-pair-queries";

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
        <SevenUpDownPairForm onSubmit={handleSubmit} isLoading={isCreating} />
    )
}

export default CreateSevenUpDownPairForm;