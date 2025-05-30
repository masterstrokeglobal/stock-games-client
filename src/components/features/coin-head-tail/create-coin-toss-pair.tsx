import { useCreateCoinTossPair } from "@/react-query/coin-toss-queries";
import { CoinTossPairFormValues } from "./coin-toss-pair-form";
import CoinTossPairForm from "./coin-toss-pair-form";

const CreateCoinTossPairForm = () => {
    const { mutate: createCoinTossPair, isPending: isCreating } = useCreateCoinTossPair();

    const handleSubmit = (data: CoinTossPairFormValues) => {
        createCoinTossPair(data);
    }

    return (
        <CoinTossPairForm onSubmit={handleSubmit} isLoading={isCreating} />
    )
}

export default CreateCoinTossPairForm;