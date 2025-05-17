import { Button } from "@/components/ui/button"
import FormImage from "@/components/ui/form/form-image-compact"
import FormInput from "@/components/ui/form/form-input"
import FormProvider from "@/components/ui/form/form-provider"
import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2 } from "lucide-react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Switch } from "@/components/ui/switch"
import { useState } from "react"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"

const tierFormSchema = z.object({
    name: z.string().min(1),
    imageUrl: z.string().url(),
    minPoints: z.coerce.number().min(0),
    gamesRequired: z.coerce.number().min(0),
    redeemablePoints: z.coerce.number().min(0),
    loginPoints: z.coerce.number().min(0),
    firstGamePoints: z.coerce.number().min(0),
    pointsPerHundredRupees: z.coerce.number().min(0),
})

export type TierFormSchema = z.infer<typeof tierFormSchema>

type Props = {
    onSubmit: (data: TierFormSchema) => void
    defaultValues?: TierFormSchema,
    isLoading?: boolean
}

const TierForm = ({ onSubmit, defaultValues, isLoading }: Props) => {
    const [redeemEnabled, setRedeemEnabled] = useState(defaultValues?.redeemablePoints !== 0)
    const [loginEnabled, setLoginEnabled] = useState(defaultValues?.loginPoints !== 0)
    const [firstGameEnabled, setFirstGameEnabled] = useState(defaultValues?.firstGamePoints !== 0)
    const [pointsPerHundredEnabled, setPointsPerHundredEnabled] = useState(defaultValues?.pointsPerHundredRupees !==    0)

    const form = useForm<TierFormSchema>({
        resolver: zodResolver(tierFormSchema),
        defaultValues
    })

    return (
        <FormProvider methods={form}
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-6 max-w-2xl mx-auto"
        >
            <div className="space-y-4">
                <FormInput
                    type="text"
                    label="Name"
                    control={form.control}
                    name="name"
                />
                <FormImage
                    control={form.control}
                    name="imageUrl"
                    label="Image"
                />

                <FormInput
                    type="number"
                    label="Min Points"
                    control={form.control}
                    name="minPoints"
                    description="Minimum points required to reach the tier"
                />

                <FormInput
                    type="number"
                    label="Min Game Required"
                    control={form.control}
                    name="gamesRequired"
                    description="Minimum number of games required to reach the tier"
                />
            </div>

            <Card className="p-6 space-y-6">
                <h3 className="text-lg font-semibold">Point Settings</h3>

                <div className="space-y-6">
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <Label className="text-base">Redeem Points</Label>
                            <Switch
                                checked={redeemEnabled}
                                onCheckedChange={(checked) => {
                                    setRedeemEnabled(checked)
                                    if (!checked) form.setValue('redeemablePoints', 0)
                                }}
                            />
                        </div>
                        <FormInput
                            type="number"
                            control={form.control}
                            name="redeemablePoints"
                            description="Points required to redeem a reward"
                            disabled={!redeemEnabled}
                        />
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <Label className="text-base">Login Points</Label>
                            <Switch
                                checked={loginEnabled}
                                onCheckedChange={(checked) => {
                                    setLoginEnabled(checked)
                                    if (!checked) form.setValue('loginPoints', 0)
                                }}
                            />
                        </div>
                        <FormInput
                            type="number"
                            control={form.control}
                            name="loginPoints"
                            description="Points received daily for login"
                            disabled={!loginEnabled}
                        />
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <Label className="text-base">First Game Points</Label>
                            <Switch
                                checked={firstGameEnabled}
                                onCheckedChange={(checked) => {
                                    setFirstGameEnabled(checked)
                                    if (!checked) form.setValue('firstGamePoints', 0)
                                }}
                            />
                        </div>
                        <FormInput
                            type="number"
                            control={form.control}
                            name="firstGamePoints"
                            description="Points received for playing the first game"
                            disabled={!firstGameEnabled}
                        />
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <Label className="text-base">Points Per Hundred Rupees</Label>
                            <Switch
                                checked={pointsPerHundredEnabled}
                                onCheckedChange={(checked) => {
                                    setPointsPerHundredEnabled(checked)
                                    if (!checked) form.setValue('pointsPerHundredRupees', 0)
                                }}
                            />
                        </div>
                        <FormInput
                            type="number"
                            control={form.control}
                            name="pointsPerHundredRupees"
                            description="Points received per 100 rupees deposited"
                            disabled={!pointsPerHundredEnabled}
                        />
                    </div>
                </div>
            </Card>

            <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Submitting...</span>
                </> : "Submit"}
            </Button>

        </FormProvider>
    )
}
export default TierForm