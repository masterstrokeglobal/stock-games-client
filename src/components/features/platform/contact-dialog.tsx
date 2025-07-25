"use client";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { CircleX } from "lucide-react";
import Image from "next/image";
import { ReactNode } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCreateContact } from "@/react-query/contact-queries";

const contactSchema = z.object({
    subject: z.string().nonempty("Subject is required"),
    message: z
        .string()
        .min(10, "Message must be at least 10 characters")
        .max(500, "Message must be at most 500 characters")
        .nonempty("Message is required"),
});

type ContactFormValues = z.infer<typeof contactSchema>;

interface ContactDialogProps {
    children?: ReactNode;
    open?: boolean;
    onClose?: () => void;
}

const ContactDialog = ({ children, open, onClose }: ContactDialogProps) => {
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<ContactFormValues>({
        resolver: zodResolver(contactSchema),
        defaultValues: {
            subject: "",
            message: "",
        },
    });

    const { mutate, isPending, isSuccess } = useCreateContact();

    const onSubmit = (data: ContactFormValues) => {
        mutate(
            {
                subject: data.subject,
                description: data.message,
            },
            {
                onSuccess: () => {
                    reset();
                },
            }
        );
    };

    const handleClose = (open: boolean) => {
        if (!open) {
            reset();
            onClose?.();
        }
    };

    return (
        <Dialog defaultOpen={open} onOpenChange={handleClose}>
            <DialogTrigger asChild>
                {children}
            </DialogTrigger>
            <DialogContent showButton={false} className="dark:bg-[#121456] bg-primary-game rounded-2xl border-2 dark:border-platform-border border-primary-game gap-0 p-0 overflow-hidden">
                <DialogHeader className="px-4 sm:px-6 py-3 sm:py-4 rounded-t-2xl">
                    <DialogTitle className="dark:text-platform-text text-white text-base sm:text-lg font-semibold text-center">
                        Support
                    </DialogTitle>
                    <DialogClose asChild>
                        <Button variant="ghost" size="icon" className="absolute bg-transparent right-4 top-2 mt-0">
                            <CircleX className="text-white" />
                        </Button>
                    </DialogClose>
                </DialogHeader>
                <ScrollArea className="max-h-[calc(100vh-120px)] bg-primary-game rounded-t-3xl border-t-2 border-platform-border" scrollThumbClassName="bg-platform-border">
                    <div className="flex flex-col items-center dark:bg-[#050128] bg-[#C3E3FF] rounded-t-3xl rounded-b px-4 sm:px-6 py-6 sm:py-8 gap-6 sm:gap-8">
                        {/* Call Us Now Card */}
                        <div className="w-full flex bg-gradient-to-b text-platform-text dark:from-[#262BB5] dark:to-[#11134F] from-[#64B6FD] to-[#466CCF] rounded-none dark:border-2 border-platform-border shadow-lg p-3 sm:p-4 items-center mb-2">
                            <div className="flex items-center justify-center">
                                <Image src="/images/support-badge.png" alt="Support" width={100} height={100} className="h-14 sm:h-12 md:h-full aspect-square w-auto" />
                            </div>
                            <div className="flex flex-col dark:text-platform-text text-white justify-around h-full flex-1 gap-1 text-center">
                                <div className="text-sm sm:text-base font-semibold">
                                    Call Us Now
                                </div>
                                <div className="text-xs sm:text-sm">
                                    Need Urgent Help? Call Our Support Team Now
                                </div>
                                <div className="text-center w-full text-sm sm:text-base">
                                    +971 00 000 0000
                                </div>
                            </div>
                        </div>

                        {/* Divider */}
                        <div className="flex items-center gap-3 sm:gap-4 w-full">
                            <hr className="flex-1 border-t dark:border-platform-border border-primary-game" />
                            <span className="text-platform-text text-xs sm:text-sm font-medium">Or</span>
                            <hr className="flex-1 border-t dark:border-platform-border border-primary-game" />
                        </div>

                        {/* Support Form */}
                        <form className="w-full flex flex-col gap-4 sm:gap-6" onSubmit={handleSubmit(onSubmit)} noValidate>
                            <div className="space-y-4 sm:space-y-6">
                                <fieldset className="relative border-2 dark:border-platform-border border-primary-game rounded-none px-3 sm:px-4 py-2 sm:py-3">
                                    <legend className="px-2 dark:text-white/80 text-platform-text text-xs sm:text-sm font-medium">Subject</legend>
                                    <Input
                                        id="subject"
                                        type="text"
                                        className="w-full bg-transparent border-none rounded-none text-platform-text text-sm sm:text-base focus:outline-none placeholder:text-white/40 transition-all p-0 h-auto focus-visible:ring-0 focus-visible:ring-offset-0"
                                        placeholder=""
                                        {...register("subject")}
                                        aria-invalid={!!errors.subject}
                                        required
                                    />
                                    {errors.subject && (
                                        <span className="text-xs text-red-500 mt-1 block">{errors.subject.message}</span>
                                    )}
                                </fieldset>
                                <fieldset className="relative border-2 dark:border-platform-border border-primary-game rounded-none px-3 sm:px-4 py-2 sm:py-3">
                                    <legend className="px-2 dark:text-white/80 text-platform-text text-xs sm:text-sm font-medium">Message</legend>
                                    <Textarea
                                        id="message"
                                        className="w-full bg-transparent border-none rounded-none  text-platform-text text-sm sm:text-base min-h-[100px] sm:min-h-[120px] focus:outline-none placeholder:text-white/40 transition-all resize-none p-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                                        placeholder=""
                                        {...register("message")}
                                        aria-invalid={!!errors.message}
                                        required
                                    />
                                    {errors.message && (
                                        <span className="text-xs text-red-500 mt-1 block">{errors.message.message}</span>
                                    )}
                                </fieldset>
                            </div>
                            <Button
                                type="submit"
                                size="lg"
                                className="w-full bg-gradient-to-b dark:from-[#262BB5] dark:to-[#11134F] from-[#64B6FD] to-[#466CCF] rounded-none text-white font-semibold text-base sm:text-lg py-2 sm:py-3 dark:border-2 border-platform-border hover:from-[#2B2BB5] hover:to-[#15154F] transition-all"
                                disabled={isPending}
                            >
                                {isPending ? (
                                    <span className="flex items-center justify-center gap-2">
                                        <svg className="animate-spin h-4 w-4 sm:h-5 sm:w-5 text-white" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
                                        </svg>
                                        Sending...
                                    </span>
                                ) : (
                                    "Send Message"
                                )}
                            </Button>
                            {isSuccess && (
                                <div className="text-green-500 text-center text-sm mt-2">
                                    Message sent successfully!
                                </div>
                            )}
                        </form>
                    </div>
                </ScrollArea>
            </DialogContent>
        </Dialog>
    );
};

export default ContactDialog;