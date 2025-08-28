import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import React, { useMemo, useState } from "react";

const DemoVideo = ({ children }: { children: React.ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [lang, setLang] = useState("en");

  const videoUrl = useMemo(() => {
    switch (lang) {
      case "en":
        return "/images/how-to-play/videos/slot-en.mp4";
      case "hi":
        return "/images/how-to-play/videos/slot-hi.mp4";
      default:
        return "/images/how-to-play/videos/slot-en.mp4";
    }
  }, [lang]);
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger className="w-full">{children}</DialogTrigger>
      <DialogContent
        className="[&>button]:text-white [&>button]:focus:ring-0 bg-transparent border-none w-full max-w-xl md:max-w-2xl lg:max-w-3xl xl:max-w-4xl"
      >
        <div
          style={{
            backgroundImage: "url('/images/slot-machine/dialog-bg.png')",
            backgroundSize: "100% 100%",
            backgroundPosition: "center center",
            backgroundRepeat: "no-repeat",
          }}
          className="md:max-h-[70vh] w-full h-full relative flex flex-col items-center justify-center p-[10%] pt-[15%] font-wendy-one text-[#FFFFFFB2]"
        >
          <img
            src="/images/slot-machine/happy-bull.png"
            alt=""
            className="absolute w-[100px] md:w-[120px] lg:w-[160px] top-0 translate-y-[-50%]"
          />
          <DialogHeader className="p-1">
            <DialogTitle className="text-[15px] lg:text-[30px] xl:text-[40px]">
              Demo Video
            </DialogTitle>
          </DialogHeader>
          <DialogDescription className="text-center items-center text-white mb-5 p-2 flex flex-col gap-2 w-full overflow-y-auto text-xs lg:text-base xl:text-2xl">
            
              <video
                src={videoUrl}
                controls
                className="h-full w-fit rounded-xl"
              />
            
            <div className="flex justify-center w-full py-4 flex-shrink-0">
              <button
                className={`px-4 py-1 rounded-l-lg text-sm  flex-1 transition-colors ${
                  lang === "en"
                    ? "bg-white/20   text-white"
                    : "bg-[#23245A40] text-white/60"
                }`}
                onClick={() => setLang("en")}
              >
                English
              </button>
              <button
                className={`px-4 py-1 rounded-r-lg text-sm flex-1 transition-colors ${
                  lang === "hi"
                    ? "bg-white/20 text-white"
                    : "bg-[rgba(35,36,90,0.25)] text-white/60"
                }`}
                onClick={() => setLang("hi")}
              >
                Hindi
              </button>
            </div>
          </DialogDescription>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DemoVideo;
