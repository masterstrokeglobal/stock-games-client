"use client";
import ContactForm, { ContactFormValues } from "@/components/features/gamer/contact-form";
import { useRouter } from "next/navigation";

const ContactPage = () => {
    const router = useRouter();

    const handleSubmit = (data: ContactFormValues) => {
        // Here you would typically handle the contact form submission
        console.log('Contact form submitted:', data);
        // You could add API call here
        // After successful submission, redirect to a thank you page or home
        router.push("/game");
    };

    return (
        <ContactForm
            onSubmit={handleSubmit}
        />
    );
};

export default ContactPage;