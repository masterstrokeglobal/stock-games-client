"use client";
import { Button } from "@/components/ui/button";
import FormInput from "@/components/ui/form/form-input";
import FormTextarea from "@/components/ui/form/form-text-area";
import FormProvider from "@/components/ui/form/form-provider";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useTranslations } from "next-intl";

export const createContactSchema = (t: any) => z.object({
    subject: z.string().nonempty(t('validation.subject-required')),
    message: z.string()
        .min(10, t('validation.message-min'))
        .max(500, t('validation.message-max'))
        .nonempty(t('validation.message-required')),
});

export type ContactFormValues = z.infer<ReturnType<typeof createContactSchema>>;

type Props = {
    defaultValues?: ContactFormValues;
    onSubmit: (data: ContactFormValues) => void;
    isLoading?: boolean;
};

const ContactForm = ({ defaultValues, onSubmit, isLoading }: Props) => {
    const t = useTranslations('contact');

    const form = useForm<ContactFormValues>({
        resolver: zodResolver(createContactSchema(t)),
        defaultValues: defaultValues || {
            subject: '',
            message: ''
        },
    });

    const { control, handleSubmit } = form;

    return (
        <div className="w-full max-w-lg">
            <h1 className="text-3xl text-center mb-10 font-semibold text-white">
                {t('titles.contact-us')}
            </h1>

            <FormProvider
                methods={form}
                onSubmit={handleSubmit(onSubmit)}
                className="space-y-6"
            >
                <FormInput
                    control={control}
                    game
                    name="subject"
                    label={t('labels.subject')}
                    required
                />

                <FormTextarea
                    control={control}
                    game
                    name="message"
                    label={t('labels.message')}
                    required
                />

                <footer className="flex justify-end mt-8">
                    <Button
                        type="submit"
                        size="lg"
                        variant="game"
                        className="w-full"
                        disabled={isLoading}
                    >
                        {isLoading ? t('buttons.sending') : t('buttons.send-message')}
                    </Button>
                </footer>
            </FormProvider>
        </div>
    );
};

export default ContactForm;