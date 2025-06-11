"use client";
import { useCreateCoinTossPair } from "@/react-query/coin-toss-queries";
import { CoinTossPairFormValues } from "./coin-toss-pair-form";
import CoinTossPairForm from "./coin-toss-pair-form";
import { useRouter } from "next/navigation";

const CreateCoinTossPairForm = () => {
    const router = useRouter();
    const { mutate: createCoinTossPair, isPending: isCreating } = useCreateCoinTossPair();

    const handleSubmit = (data: CoinTossPairFormValues) => {
        createCoinTossPair(data, {
            onSuccess: () => {
                router.push("/dashboard/coin-toss-pair");
            }
        });
    }

    return (
        <CoinTossPairForm onSubmit={handleSubmit} isLoading={isCreating} />
    )
}

export default CreateCoinTossPairForm;