import { ScrollArea } from "@/components/ui/scroll-area"
import { useLocale } from "next-intl";
import { useMemo } from "react";

const HowToPlay = () => {
    const locale = useLocale();

    const videoUrl = useMemo(() => {
        switch (locale) {
            case "en":
                return "/images/how-to-play/videos/hi-lo-en.mp4";
            case "hi":
                return "/images/how-to-play/videos/hi-lo-hi.mp4";
            default:
                return "/images/how-to-play/videos/hi-lo-en.mp4";
        }
    }, [locale]);

    return <div className="max-w-xl mx-auto rounded-2xl" style={{ backgroundColor: '#003B4952' }}>
        <ScrollArea className="h-[40vh] pr-2  p-4" scrollThumbClassName="bg-[#C7F4FF80]">
            <div className="space-y-4  text-white">
                <h3 className="text-white font-medium mb-2">How to play?</h3>
            </div>
            <div>
                <video src={videoUrl} controls className="w-full h-auto" />
            </div>
        </ScrollArea>
    </div>
}

export default HowToPlay;