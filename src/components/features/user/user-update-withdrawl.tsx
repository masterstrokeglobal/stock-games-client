import User from "@/models/user"
import { useUpdateUserWithdrawlLimit } from "@/react-query/user-queries"
import UserWithdrawlLimitForm, { UserWithdrawlLimitFormSchema } from "./user-withdrawl-form"


const UserUpdateWithdrawl = ({ user }: { user: User }) => {

    const { mutate, isPending } = useUpdateUserWithdrawlLimit();

    const handleSubmit = (data: UserWithdrawlLimitFormSchema) => {
        const userId = user.id?.toString() ?? "";
        mutate({ userId, withdrawlLimit: data });
    }

    const defaultValues = {
        weeklyWithdrawLimit: user.weeklyWithdrawLimit ?? 0,
        dailyWithdrawLimit: user.dailyWithdrawLimit ?? 0,
        monthlyWithdrawLimit: user.monthlyWithdrawLimit ?? 0
    }

    return (
        <UserWithdrawlLimitForm
            onSubmit={handleSubmit}
            defaultValues={defaultValues}
            isLoading={isPending}
        />
    )
}

export default UserUpdateWithdrawl