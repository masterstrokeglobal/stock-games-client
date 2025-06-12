import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import FormInput from "@/components/ui/form/form-input"
import FormProvider from "@/components/ui/form/form-provider"
import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2 } from "lucide-react"
import { useForm } from "react-hook-form"
import { z } from "zod"

const userWithdrawlLimitFormSchema = z.object({
    weeklyWithdrawLimit: z.coerce.number().min(0),
    dailyWithdrawLimit: z.coerce.number().min(0),
    monthlyWithdrawLimit: z.coerce.number().min(0)
})

export type UserWithdrawlLimitFormSchema = z.infer<typeof userWithdrawlLimitFormSchema>

type Props = {
    onSubmit: (data: UserWithdrawlLimitFormSchema) => void
    defaultValues?: UserWithdrawlLimitFormSchema,
    isLoading?: boolean
}

const UserWithdrawlLimitForm = ({ onSubmit, defaultValues, isLoading }: Props) => {

    const form = useForm<UserWithdrawlLimitFormSchema>({
        resolver: zodResolver(userWithdrawlLimitFormSchema),
        defaultValues
    })

    return (
        <FormProvider methods={form}
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-6  mx-auto"
        >
            <Card className="p-6 space-y-6">
                <h3 className="text-lg font-semibold">Withdrawal Limits</h3>
                <div className="space-y-4">
                    <FormInput
                        type="number"
                        label="Weekly Withdrawal Limit"
                        control={form.control}
                        name="weeklyWithdrawLimit"
                        description="Maximum amount that can be withdrawn in a week"
                    />
                    <FormInput
                        type="number"
                        label="Daily Withdrawal Limit"
                        control={form.control}
                        name="dailyWithdrawLimit"
                        description="Maximum amount that can be withdrawn in a day"
                    />

                    <FormInput
                        type="number"
                        label="Monthly Withdrawal Limit"
                        control={form.control}
                        name="monthlyWithdrawLimit"
                        description="Maximum amount that can be withdrawn in a month"
                    />
                </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Submitting...</span>
                </> : "Submit"}
            </Button>
            </Card>


        </FormProvider>
    )
}

export default UserWithdrawlLimitForm 