
"use client"
import { SkewedButton } from "@/components/ui/skew-button";
import { useMemo, useState } from "react";

const HowToPlay = () => {
    const [language, setLanguage] = useState("en");

    const videoUrl = useMemo(() => {
        switch (language) {
            case "en":
                return "/images/how-to-play/videos/hi-lo-en.mp4";
            case "hi":
                return "/images/how-to-play/videos/hi-lo-hi.mp4";
            default:
                return "/images/how-to-play/videos/hi-lo-en.mp4";
        }
    }, [language]);

    return <div className="max-w-3xl mx-auto w-full rounded-2xl" style={{ backgroundColor: '#003B4952' }}>
        <div className="h-[46vh] min-h-[400px] pr-2 p-2 flex-col justify-center items-center">
            <video src={videoUrl} controls className="w-auto flex-1 rounded-sm" />
            <div className="flex gap-4 pt-4 ">
                <SkewedButton
                    variant={language === "en" ? "green" : "red"}
                    size="sm"
                    fullWidth
                    skew="left"
                    onClick={() => setLanguage("en")}
                >
                    English
                </SkewedButton>
                <SkewedButton
                    variant={language === "hi" ? "green" : "red"}
                    size="sm"
                    skew="right"
                    fullWidth
                    onClick={() => setLanguage("hi")}
                >
                    Hindi
                </SkewedButton>
            </div>
        </div>
    </div>
}

export default HowToPlay;