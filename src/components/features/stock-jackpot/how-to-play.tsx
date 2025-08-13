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

    return <div className="max-w-3xl mx-auto w-full w-fit rounded-2xl" style={{ backgroundColor: '#003B4952' }}>
           <div className="h-[46vh] pr-2 p-2 flex justify-center items-center">
              <video src={videoUrl} controls className="w-auto h-full rounded-sm" />
           </div>
    </div>
}

export default HowToPlay;