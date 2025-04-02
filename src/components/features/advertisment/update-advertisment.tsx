import { AdvertismentForm } from "./advertisment-form"
import {
    useGetAdvertisementById, useUpdateAdvertisementById
} from "@/react-query/advertisment-queries"
import { useParams } from "next/navigation"

const UpdateAdvertisment = () => {
    const { id } = useParams()
    const { data: advertisment, isLoading } = useGetAdvertisementById(id as string);
    const { mutate: updateAdvertisment, isPending } = useUpdateAdvertisementById();

    if (isLoading) {
        return <div>Loading...</div>
    }

    if (!advertisment) {
        return <div>Advertisment not found</div>
    }


    return (
        <div>
            <AdvertismentForm
                defaultValues={advertisment.data}
                onSubmit={updateAdvertisment}
                isLoading={isPending}
            />
        </div>
    )
}

export default UpdateAdvertisment;