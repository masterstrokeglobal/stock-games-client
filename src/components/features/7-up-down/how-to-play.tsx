import { useState } from "react";

const content = {
    en: {
        videoUrl: "https://res.cloudinary.com/dt8iv1hds/video/upload/v1758179605/7up-down-en_nnqo2k.mp4",
    },
    hi: {
        videoUrl: "https://res.cloudinary.com/dt8iv1hds/video/upload/v1758179626/7up-down-hi_wmf2la.mp4",
    },
    default: {
        videoUrl: "https://res.cloudinary.com/dt8iv1hds/video/upload/v1758179626/7up-down-en_wmf2la.mp4",
    },
};

type Language = "en" | "hi";

const HowToPlay = () => {
    const [language, setLanguage] = useState<Language>("en");

    const {  videoUrl } = content[language];

    return (
        <section className="flex flex-col h-full pb-10 gap-4">
            <header className="md:py-4 md:px-4 flex justify-between items-center">
                <h1 className="md:text-xl uppercase tracking-wide xs:text-lg font-extrabold text-[#8BB4FF]">
                    How to Play
                </h1>
                <div className="flex gap-2">
                    <button
                        onClick={() => setLanguage("en")}
                        className={`px-4 py-1 rounded-md text-sm font-semibold ${
                            language === "en"
                                ? "bg-[#12409D] text-white"
                                : "bg-transparent text-[#8BB4FF] border border-[#12409D]"
                        }`}
                    >
                        English
                    </button>
                    <button
                        onClick={() => setLanguage("hi")}
                        className={`px-4 py-1 rounded-md text-sm font-semibold ${
                            language === "hi"
                                ? "bg-[#12409D] text-white"
                                : "bg-transparent text-[#8BB4FF] border border-[#12409D]"
                        }`}
                    >
                        Hindi
                    </button>
                </div>
            </header>
            <main className="rounded-[30px] border-[3px] max-w-2xl mx-auto flex justify-center items-center overflow-hidden w-full h-[calc(100svh-29rem)]  border-[#12409D] bg-[rgba(1,15,60,0.58)] shadow-[0px_0px_7.1px_11px_rgba(1,59,177,0.25)_inset]">
                <video src={videoUrl} controls className="h-fit w-auto" />
            </main>
        </section>
    );
};

export default HowToPlay;