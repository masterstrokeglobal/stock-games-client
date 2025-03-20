import { Button } from "@/components/ui/button";
import FormInput from "@/components/ui/form/form-input";
import FormProvider from "@/components/ui/form/form-provider";
import { useAuthStore } from "@/context/auth-context";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { z } from "zod";

// Zod schema for deposit form
const depositSchema = (t: any,external:boolean) => z.object({
    pgId: z
        .string()
        .min(0, t('validation.transaction-id-required'))
        .max(50, t('validation.transaction-id-max')).optional(),
    amount: z
        .coerce.number({
            message: t('validation.amount-invalid')
        })
        .min(1, t('validation.amount-required'))
}).refine((data) => external ? data.pgId === '' : data.pgId !== '', {
    message: t('validation.transaction-id-required'),
    path: ['pgId']
});

export type DepositFormValues = z.infer<ReturnType<typeof depositSchema>>;

type Props = {
    onSubmit: (data: DepositFormValues) => void;
    isLoading: boolean;
    external: boolean;
};

const DepositForm = ({ onSubmit, isLoading, external }: Props) => {
    const t = useTranslations('deposit');
    const { userDetails } = useAuthStore();
    const form = useForm<DepositFormValues>({
        resolver: zodResolver(depositSchema(t, external)),
        defaultValues: {
            pgId: '',
            amount: 0,
        }
    });

    const { control, handleSubmit } = form;
    const paymentImage = userDetails?.company?.paymentImage;

    console.log(form.formState.errors);
    return (

        <div className="w-full max-w-sm flex flex-col min-h-[calc(100svh-5rem)] p-4 rounded-lg">

            {/* QR Code Section */}
            <header>
                <h2 className="text-2xl font-semibold text-center mb-2 text-white">
                    {t('scan-qr-code')}
                </h2>
                <p className="text-[#6A84C3] text-center text-sm">
                    {t('qr-description')}
                </p>
                {!external && paymentImage && (
                    <div className="bg-white p-4 rounded-lg w-fit mx-auto mt-4">
                        <img src={paymentImage} alt="QR Code" />
                    </div>
                )}
            </header>

            <FormProvider
                methods={form}
                onSubmit={handleSubmit(onSubmit)}
                className="space-y-4 flex-1 mt-8 flex flex-col"
            >
                <div className="space-y-4 flex-1">
                    {!external && <FormInput
                        control={control}
                        game
                        name="pgId"
                        label={t('transaction-id-label')}
                        placeholder={t('transaction-id-placeholder')}
                        required
                    />}
                    <FormInput
                        control={control}
                        game
                        name="amount"
                        label={t('amount-label')}
                        placeholder={t('amount-placeholder')}
                        type="number"
                        required
                    />
                </div>

                <footer className="mt-auto pt-4">
                    <Button
                        type="submit"
                        size="lg"
                        variant="game"
                        disabled={isLoading}
                        className="w-full"
                    >
                        {t('confirm-deposit')}
                    </Button>
                </footer>
            </FormProvider>
        </div>
    );
};

export default DepositForm;
