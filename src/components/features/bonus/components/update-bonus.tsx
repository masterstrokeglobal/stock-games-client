import { useRouter } from "next/navigation";

import { useGetBonusById, useUpdateBonusById } from "@/react-query/bonus-queries";
import BonusForm, { BonusFormValues } from "./bonus-form";
import { useMemo } from "react";
import { useParams } from "next/navigation";
import LoadingScreen from "@/components/common/loading-screen";

const UpdateBonus = () => {
    const router = useRouter();
    const { id } = useParams();
    const { data, isLoading } = useGetBonusById(id as string);
    const { mutate: updateBonus, isPending } = useUpdateBonusById();

    const defaultValues: BonusFormValues | null = useMemo(() => {
        return data ? {
            ...data,
        } : null;
    }, [data]);


    const handleSubmit = (data: BonusFormValues) => {
        updateBonus({ ...data, id: id as string });
        router.push("/dashboard/bonus");
    }

    if (isLoading) return <LoadingScreen />
    return <section className="flex flex-col gap-4">
        <header className="flex justify-start ">
            <h1 className="text-2xl font-bold">Update Bonus</h1>
        </header>
        {defaultValues && <BonusForm onSubmit={handleSubmit} isLoading={isPending} defaultValues={defaultValues} />}
    </section>
};

export default UpdateBonus;


