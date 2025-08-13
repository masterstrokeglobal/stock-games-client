import {
    Dialog,
    DialogContent,
    DialogTrigger,
} from "@/components/ui/dialog";
import { useLocale } from "next-intl";
import React, { useMemo, useState } from "react";

interface HowToPlayDialogProps {
    children: React.ReactNode;
}



const HowToPlayDialog: React.FC<HowToPlayDialogProps> = ({
    children,
}) => {
    const [open, setOpen] = useState(false);

    const locale = useLocale();

    const videoUrl = useMemo(() => {
        switch (locale) {
            case "en":
                return "/images/how-to-play/videos/coin-toss-en.mp4";
            case "hi":
                return "/images/how-to-play/videos/coin-toss-hi.mp4";
            default:
                return "/images/how-to-play/videos/coin-toss-en.mp4";
        }
    }, [locale]);

    return (
        <Dialog open={open} onOpenChange={setOpen} modal={true}>
            <DialogTrigger asChild>
                {children}
            </DialogTrigger>
            <DialogContent
                showButton={false}
                overlayClassName="backdrop-blur-md"
                className="max-w-2xl w-full p-0 border-none bg-transparent backdrop-blur-md "
            >
                <div
                    style={{
                        background: 'linear-gradient(0deg, #0A023B 0%, #002A5A 90.29%)',
                        boxShadow: '0px 0px 8px 1px rgba(0, 92, 164, 1) inset',
                    }}
                    className="w-full border backdrop-blur-md border-[#0074FF] rounded-3xl shadow-2xl overflow-hidden"
                >
                    {/* Header */}
                    <div className="flex items-center border-b border-[#0074FF] bg-[#004DA9] justify-between p-4 pb-3 flex-shrink-0">
                        <div className="flex items-center font-play text-white text-base font-semibold space-x-3">
                            How to Play?
                        </div>
                        <button
                            onClick={() => setOpen(false)}
                            className="text-white hover:text-gray-200 text-2xl px-2 font-play transition-colors"
                        >
                            X
                        </button>
                    </div>
                    <div className="p-0">
                        <div className="p-6">
                            <div className="bg-[#004DA9B0] rounded-lg p-4 text-white text-sm whitespace-pre-line min-h-[200px] leading-relaxed">
                                <video src={videoUrl} controls className="h-auto w-full" />
                            </div>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default HowToPlayDialog;