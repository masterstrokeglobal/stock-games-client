"use client";
import Container from "@/components/common/container";
import TopBar from "@/components/common/top-bar";
import ContactForm, { ContactFormValues } from "@/components/features/gamer/contact-form";
import { useCreateContact } from "@/react-query/contact-queries";

const ContactPage = () => {
    const { mutate, isPending } = useCreateContact();

    const handleSubmit = (data: ContactFormValues) => {
        mutate({...data});
    };

    return (
        <Container className="flex flex-col items-center min-h-screen pt-24 ">
            <TopBar>
                Contact
            </TopBar>
            <ContactForm
                isLoading={isPending}
                onSubmit={handleSubmit}
            />
        </Container>
    );
};

export default ContactPage;