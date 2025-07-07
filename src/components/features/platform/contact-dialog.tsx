"use client";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import Image from "next/image";
import { ReactNode, useState } from "react";

interface ContactDialogProps {
    children: ReactNode;
}

const ContactDialog = ({ children }: ContactDialogProps) => {
    const [subject, setSubject] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

    // Dummy handler for send message
    const handleSend = (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            setSubject("");
            setMessage("");
            // You can add a toast or success message here
        }, 1200);
    };

    return (
        <Dialog>
            <DialogTrigger asChild>
                {children}
            </DialogTrigger>
            <DialogContent className="dark:bg-[#121456] bg-primary-game rounded-2xl border-2 dark:border-platform-border border-primary-game gap-0 p-0 overflow-hidden">
                <DialogHeader className="px-4 sm:px-6 py-3 sm:py-4 rounded-t-2xl">
                    <DialogTitle className="dark:text-platform-text text-white text-base sm:text-lg font-semibold text-center">
                        Support
                    </DialogTitle>
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
                        <form className="w-full flex flex-col gap-4 sm:gap-6" onSubmit={handleSend}>
                            <div className="space-y-4 sm:space-y-6">
                                <fieldset className="relative border-2 dark:border-platform-border border-primary-game rounded-none px-3 sm:px-4 py-2 sm:py-3">
                                    <legend className="px-2 dark:text-white/80 text-platform-text text-xs sm:text-sm font-medium">Subject</legend>
                                    <Input
                                        id="subject"
                                        type="text"
                                        className="w-full bg-transparent border-none rounded-none text-platform-text text-sm sm:text-base focus:outline-none placeholder:text-white/40 transition-all p-0 h-auto focus-visible:ring-0 focus-visible:ring-offset-0"
                                        placeholder=""
                                        value={subject}
                                        onChange={e => setSubject(e.target.value)}
                                        required
                                    />
                                </fieldset>
                                <fieldset className="relative border-2 dark:border-platform-border border-primary-game rounded-none px-3 sm:px-4 py-2 sm:py-3">
                                    <legend className="px-2 dark:text-white/80 text-platform-text text-xs sm:text-sm font-medium">Message</legend>
                                    <Textarea
                                        id="message"
                                        className="w-full bg-transparent border-none rounded-none  text-platform-text text-sm sm:text-base min-h-[100px] sm:min-h-[120px] focus:outline-none placeholder:text-white/40 transition-all resize-none p-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                                        placeholder=""
                                        value={message}
                                        onChange={e => setMessage(e.target.value)}
                                        required
                                    />
                                </fieldset>
                            </div>
                            <Button
                                type="submit"
                                size="lg"
                                className="w-full bg-gradient-to-b dark:from-[#262BB5] dark:to-[#11134F] from-[#64B6FD] to-[#466CCF] rounded-none text-white font-semibold text-base sm:text-lg py-2 sm:py-3 dark:border-2 border-platform-border hover:from-[#2B2BB5] hover:to-[#15154F] transition-all"
                                disabled={loading}
                            >
                                {loading ? (
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
                        </form>
                    </div>
                </ScrollArea>
            </DialogContent>
        </Dialog>
    );
};

export default ContactDialog;   