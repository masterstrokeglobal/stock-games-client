import { LedgerEntryType } from "@/models/ledger";

import { useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import FormInput from "@/components/ui/form/form-input";
import FormProvider from "@/components/ui/form/form-provider";
import FormSelect from "@/components/ui/form/form-select";
import { IconCoinRupee } from "@tabler/icons-react";
import { z } from "zod";
const ledgerFormSchema = z.object({
    amount: z.coerce.number().min(1),
    entryType: z.nativeEnum(LedgerEntryType),
});

export type LedgerFormData = z.infer<typeof ledgerFormSchema>;

type LedgerFormProps = {
    onSubmit: (data: LedgerFormData) => void;
    defaultValues?: LedgerFormData;
    isLoading?: boolean;
};

const LedgerForm = ({ onSubmit, defaultValues, isLoading }: LedgerFormProps) => {
    const form = useForm<z.infer<typeof ledgerFormSchema>>({
        resolver: zodResolver(ledgerFormSchema),
        defaultValues,
    });

    return (
        <FormProvider className="space-y-4" methods={form} onSubmit={form.handleSubmit(onSubmit)}>
            <FormInput
                control={form.control}
                name="amount"
                label="Amount"
                type="number"
                Icon={<IconCoinRupee />}
                placeholder="Enter amount"
            />

            <FormSelect
                control={form.control}
                name="entryType"
                label="Type"
                options={Object.values(LedgerEntryType).map((type) => ({ label: type.toString(), value: type }))}
            />

            <Button type="submit" disabled={isLoading}>
                {isLoading ? "Loading..." : "Submit"}
            </Button>

        </FormProvider>
    );
};

export default LedgerForm;
