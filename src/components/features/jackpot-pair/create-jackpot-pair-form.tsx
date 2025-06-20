"use client";

import { useRouter } from "next/navigation";
import JackpotPairForm, { JackpotPairFormValues } from "./jackpot-pair-form";
import { useCreateJackpotPair } from "@/react-query/jackpot-pair-queries";

const CreateJackpotPairForm = () => {
    const router = useRouter();
    const { mutate: createJackpotPair, isPending: isCreating } = useCreateJackpotPair();

    const handleSubmit = (data: JackpotPairFormValues) => {
        createJackpotPair(data, {
            onSuccess: () => {
                router.push("/dashboard/jackpot-pair");
            }
        });
    }

    return (
        <JackpotPairForm onSubmit={handleSubmit} isLoading={isCreating} />
    )
}

export default CreateJackpotPairForm;