import {
    Dialog,
    DialogContent,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import React, { useMemo, useState } from "react";
import { X } from "lucide-react";
import Image from "next/image";

interface DemoVideoDialogProps {
    children: React.ReactNode;
}
const DemoVideoDialog: React.FC<DemoVideoDialogProps> = ({
    children }) => {
    const [open, setOpen] = useState(false);
    const [lang, setLang] = useState('en');


    const videoUrl = useMemo(() => {
        switch (lang) {
            case 'en':
                return '/images/how-to-play/videos/dice-en.mp4';
            case 'hi':
                return '/images/how-to-play/videos/dice-hi.mp4';
            default:
                return '/images/how-to-play/videos/dice-en.mp4';
        }
    }, [lang]);


    return (
        <Dialog open={open} onOpenChange={setOpen} modal={true}>
            <DialogTrigger asChild>
                {children}
            </DialogTrigger>
            <DialogContent showButton={false} className="max-w-3xl xs:w-[95vw] bg-[#140538] w-full p-0 border-none backdrop-blur-md">
                <div
                    style={{
                        background: 'linear-gradient(180deg, #1B1E4B 0%, #23245A 100%)',
                    }}
                    className="w-full border border-[#4061C0] rounded-xl shadow-2xl overflow-hidden max-h-[80vh] flex flex-col"
                >
                    {/* Header */}
                    <div className="flex items-center border-b border-[#4467CC] bg-[#140538] justify-between px-6 py-4 flex-shrink-0">
                        <DialogTitle className="flex tracking-wide items-center text-white text-center text-lg flex-1 justify-center font-semibold w-full">
                            Demo Video
                        </DialogTitle>
                        <button
                            onClick={() => setOpen(false)}
                            className="text-white hover:text-gray-200 transition-colors"
                        >
                            <X size={24} />
                        </button>
                    </div>
                    <div className="py-4 flex-1 relative px-4 overflow-hidden border-x-[1.5rem] border-b-[1.5rem] border-[#140538] flex flex-col">
                        <Image src="/images/dice-game/table-bg.png" alt="dice-1" fill />
                        <div className="absolute top-0 left-0 w-full h-full backdrop-blur-sm bg-[#520B8E] bg-opacity-30" />
                        <div className="relative z-10 text-white  flex flex-col items-center">
                            {/* Video Section */}
                            <div className="w-full  rounded-lg overflow-hidden">
                                <video src={videoUrl} controls className="w-full h-96" />
                                <div className="flex justify-center w-full py-4">
                                    <button
                                        className={`px-4 py-1 rounded-l-lg text-sm font-semibold flex-1 transition-colors ${lang === "en"
                                                ? "bg-white/20   text-white"
                                                : "bg-[#23245A40] text-white/60"
                                            }`}
                                        onClick={() => setLang("en")}
                                    >
                                        English
                                    </button>
                                    <button
                                        className={`px-4 py-1 rounded-r-lg text-sm font-semibold flex-1 transition-colors ${lang === "hi"
                                                ? "bg-white/20 text-white"
                                                : "bg-[rgba(35,36,90,0.25)] text-white/60"
                                            }`}
                                        onClick={() => setLang("hi")}
                                    >
                                        Hindi
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default DemoVideoDialog;