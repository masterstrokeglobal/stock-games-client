import { Button } from "@/components/ui/button"
import FormComboboxSelect from "@/components/ui/form/form-combobox"
import FormInput from "@/components/ui/form/form-input"
import FormProvider from "@/components/ui/form/form-provider"
import { useGetCrypto } from "@/react-query/crypto-wallet-queries"
import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2 } from "lucide-react"
import { useMemo, useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"

const cryptoWalletFormSchema = z.object({
    currency: z.string().min(1),
    label: z.string().min(1),
})

export type CryptoWalletFormSchema = z.infer<typeof cryptoWalletFormSchema>

type Props = {
    onSubmit: (data: CryptoWalletFormSchema) => void
    defaultValues?: CryptoWalletFormSchema,
    isLoading?: boolean
}

const CryptoWalletForm = ({ onSubmit, defaultValues, isLoading }: Props) => {

    const [search, setSearch] = useState("")
    const { data: cryptoData } = useGetCrypto(
        {
            search: search,
            page: 1,
            limit: 1000
        }
    );
    const cryptoOptions = useMemo(() => {
        return cryptoData?.map((crypto: any) => ({
            label: crypto.name,
            value: crypto.id.toString()
        })) || []
    }, [cryptoData])
    const form = useForm<CryptoWalletFormSchema>({
        resolver: zodResolver(cryptoWalletFormSchema),
        defaultValues
    })

    return (
        <FormProvider methods={form}
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-6 max-w-2xl mx-auto"
        >
            <div className="space-y-4">
                <FormComboboxSelect
                    type="text"
                    label="Currency"
                    control={form.control}
                    name="currency"
                    options={cryptoOptions}
                    onSearchInputChange={(e) => {
                        setSearch(e)
                    }}
                />
                <FormInput
                    control={form.control}
                    name="label"
                    label="Label"
                />

            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Submitting...</span>
                </> : "Submit"}
            </Button>

        </FormProvider>
    )
}
export default CryptoWalletForm