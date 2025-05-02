import { BonusCategory, BonusFrequency } from "@/models/bonus";
import BonusForm, { BonusFormValues } from "./bonus-form"
import { useCreateBonus } from "@/react-query/bonus-queries";
import { useRouter } from "next/navigation";


const defaultValues: BonusFormValues = {
    name: "",
    description: "",
    amount: 0,
    maxAmount: 0,
    minAmount: 0,
    category: BonusCategory.DEPOSIT,
    active: true,
    maxCount: 0,
    percentage: false,
    startDate: new Date(),
    endDate: new Date(),
    frequency: BonusFrequency.DAILY,
}

const CreateBonus = () => {
    const router = useRouter();
    const { mutate: createBonus, isPending } = useCreateBonus();

    const handleSubmit = (data: BonusFormValues) => {
<<<<<<< HEAD
        createBonus(data, {
=======
        let payload = data;
        if (data.category === BonusCategory.SIGNUP) {
            payload = {
                ...data,
                maxCount: undefined,
                frequency: undefined,
            };
        }
        createBonus(payload, {
>>>>>>> main
            onSuccess: () => {
                router.push("/dashboard/bonus");
            }
        });
    }
    return (
        <section className="flex flex-col gap-4">
            <header className="flex justify-start ">
                <h1 className="text-2xl font-bold">Create Bonus</h1>
            </header>
            <BonusForm onSubmit={handleSubmit} isLoading={isPending} defaultValues={defaultValues} />
        </section>
    )
}

export default CreateBonus;
