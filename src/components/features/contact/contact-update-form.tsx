"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import FormProvider from "@/components/ui/form/form-provider";
import FormSelect from "@/components/ui/form/form-select";
import Contact, { ContactStatus } from "@/models/contact";
import { zodResolver } from "@hookform/resolvers/zod";
import dayjs from "dayjs";
import { useForm } from "react-hook-form";
import { z } from "zod";

export const contactEditSchema = z.object({
    status: z.enum([
        ContactStatus.OPEN,
        ContactStatus.IN_PROGRESS,
        ContactStatus.CLOSED
    ]),
});

type ContactFormValues = z.infer<typeof contactEditSchema>;

type ContactEditProps = {
    contact: Contact;
    onSubmit: (data: ContactFormValues) => void;
    isLoading?: boolean;
};

const ContactEditForm = ({
    contact,
    onSubmit,
    isLoading
}: ContactEditProps) => {
    const form = useForm<ContactFormValues>({
        resolver: zodResolver(contactEditSchema),
        defaultValues: { status: contact.status },
    });

    const { control, handleSubmit } = form;

    return (
        <section className="container-main min-h-[60vh] max-w-xl">
            <Card className="border shadow-none bg-white">
                <CardHeader>
                    <CardTitle className="text-xl font-semibold">Contact Details</CardTitle>
                </CardHeader>
                <CardContent>

                    <div>
                        <p><strong>Created At:</strong> {contact.createdAt ? dayjs(contact.createdAt).format("DD MMM YYYY") : "N/A"}</p>
                        <p><strong>Subject:</strong> {contact.subject}</p>
                        <p><strong>Message:</strong></p>
                        <p>{contact.description}</p>
                    </div>


                    <FormProvider
                        methods={form}
                        onSubmit={handleSubmit(onSubmit)}
                        className="mt-6 space-y-4"
                    >
                        <FormSelect
                            control={control}
                            name="status"
                            label="Update Status"
                            options={[
                                { label: "open", value: ContactStatus.OPEN },
                                { label: "In Progress", value: ContactStatus.IN_PROGRESS },
                                { label: "Closed", value: ContactStatus.CLOSED },
                            ]}
                        />

                        <footer className="flex justify-end gap-4 mt-8">
                            <Button type="submit" disabled={isLoading}>
                                {isLoading ? "Updating..." : "Update Status"}
                            </Button>
                        </footer>
                    </FormProvider>


                </CardContent>
            </Card>
        </section>
    );
};

export default ContactEditForm;