import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { FormField, FormItem } from "@/components/ui/form"
import FormProvider from "@/components/ui/form/form-provider"
import Tiptap from "@/components/ui/tiptap"
import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2 } from "lucide-react"
import { useForm } from "react-hook-form"
import { z } from "zod"

const userNoteFormSchema = z.object({
    notes: z.string().min(1, { message: "Note cannot be empty" }),
})

export type UserNoteFormSchema = z.infer<typeof userNoteFormSchema>

type Props = {
    onSubmit: (data: UserNoteFormSchema) => void
    defaultValues?: UserNoteFormSchema,
    isLoading?: boolean
}

const UserNoteForm = ({ onSubmit, defaultValues, isLoading }: Props) => {

    const form = useForm<UserNoteFormSchema>({
        resolver: zodResolver(userNoteFormSchema),
        defaultValues: defaultValues || { notes: "" }
    })

    return (
        <FormProvider methods={form}
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-6 mx-auto"
        >
            <Card className="p-6 space-y-6">
                <h3 className="text-lg font-semibold">User Note</h3>
                <FormField
                    control={form.control}
                    name="notes"
                    render={({ field }) => (
                        <FormItem>
                            <Tiptap description={field.value} limit={500} onChange={field.onChange} />
                        </FormItem>
                    )}
                />
                <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Saving Note...</span>
                    </> : "Save Note"}
                </Button>
            </Card>
        </FormProvider>
    )
}

export default UserNoteForm