import { useLocale } from "next-intl";
import { useMemo } from "react";

const HowToPlay = () => {

    const locale = useLocale();

    const videoUrl = useMemo(() => {
        switch (locale) {
            case "en":
                return "/images/how-to-play/videos/7up-down-en.mp4";
            case "hi":
                return "/images/how-to-play/videos/7up-down-hi.mp4";
            default:
                return "/images/how-to-play/videos/7up-down-en.mp4";
        }
    }, [locale]);

    return (
        <section className="flex flex-col h-full pb-10 gap-4">
            <header className="md:py-4  md:px-4">
                <h1 className="md:text-xl uppercase tracking-wide xs:text-lg  font-extrabold text-[#8BB4FF]">How to Play?</h1>
            </header>
            <main className="rounded-[30px] border-[3px] max-w-2xl mx-auto overflow-hidden w-full min-h-[300px] border-[#12409D] bg-[rgba(1,15,60,0.58)] shadow-[0px_0px_7.1px_11px_rgba(1,59,177,0.25)_inset]">
                <video src={videoUrl} controls className="h-full w-auto" />
            </main>
        </section>
    );
};

export default HowToPlay;