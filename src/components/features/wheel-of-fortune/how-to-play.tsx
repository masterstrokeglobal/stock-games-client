import {
    Dialog,
    DialogContent,
    DialogTrigger,
} from "@/components/ui/dialog";
import React, { useMemo, useState } from "react";
import { X } from "lucide-react";
import { useLocale } from "next-intl";
interface HowToPlayDialogProps {
    children: React.ReactNode;
}


const HowToPlayDialog: React.FC<HowToPlayDialogProps> = ({
    children }) => {
    const [open, setOpen] = useState(false);
    const locale = useLocale();

    const videoUrl = useMemo(() => {
        switch (locale) {
            case "en":
                return "/images/how-to-play/videos/wheel-of-fortune-en.mp4";
            case "hi":
                return "https://res.cloudinary.com/dmdd1tg0i/video/upload/v1756466448/wheel-of-fortune-hi_rmjh9e.mp4";
            default:
                return "/images/how-to-play/videos/wheel-of-fortune-en.mp4";
        }
    }, [locale]);

    return (
        <Dialog open={open} onOpenChange={setOpen} modal={true}>
            <DialogTrigger asChild>
                {children}
            </DialogTrigger>
            <DialogContent
                overlayClassName="bg-gradient-to-b from-[rgba(12,21,24,0.6)] via-[rgba(12,21,24,0.6)] to-[rgba(54,109,81,0.6)]"
                showButton={false}
                className="max-w-xl w-full p-0 border-none bg-transparent backdrop-blur-md"
            >
                <div
                    style={{
                        background:
                            "linear-gradient(0deg, rgba(31, 41, 41, 0.7) 0%, rgba(43, 70, 67, 0.7) 90.29%)",
                    }}
                    className="w-full border backdrop-blur-sm border-[#5C8983] rounded-2xl shadow-2xl overflow-hidden"
                >
                    {/* Header */}
                    <div className="flex items-center border-b border-[#5C8983] bg-[#366D51] justify-between p-6 pb-4">
                        <div className="flex items-center text-white text-lg font-medium">
                            How to Play?
                        </div>
                        <button
                            onClick={() => setOpen(false)}
                            className="text-white hover:text-gray-200 transition-colors"
                        >
                            <X size={24} />
                        </button>
                    </div>
                    <div className="p-6">
                        <video src={videoUrl} controls className="h-auto w-full" />
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default HowToPlayDialog;