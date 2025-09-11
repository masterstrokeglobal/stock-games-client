import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import React, { useMemo, useState } from "react";
import Image from "next/image";
import useWindowSize from "@/hooks/use-window-size";

const DemoVideo = ({ children }: { children: React.ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [lang, setLang] = useState("en");
  const {isMobile} = useWindowSize()

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
        showButton={false}
        className=" bg-transparent border-none flex flex-col items-center justify-center"
      >
        <div
          style={{
            backgroundImage: isMobile ? "url('/images/slot-machine/dialog-mb.png')" : "url('/images/slot-machine/dialog-bg.png')",
            backgroundSize: "100% 100%",
            backgroundPosition: "center center",
            backgroundRepeat: "no-repeat",
          }}
          className="relative flex flex-col px-[10%] lg:px-[12%] py-10 sm:py-12 font-blood-melt text-[#FFFFFFB2] h-[584px] w-[402px] lg:h-[623px] lg:w-[592px] slot-dialog"
        >
          <button
            onClick={() => setIsOpen(false)}
            className="absolute -top-3 right-0"
          >
            <Image
              src="/images/slot-machine/cancel-btn.png"
              alt="cancel"
              width={40}
              height={40}
            />
          </button>
          <DialogHeader className="p-1 relative w-full flex justify-center items-center">
            <DialogTitle className="text-[15px] lg:text-[30px] xl:text-[40px] text-center uppercase lg:pt-2">
              Demo Video
            </DialogTitle>
          </DialogHeader>
          <DialogDescription className="text-center items-center text-white mb-5 p-5 flex flex-col gap-2 w-full overflow-y-auto text-xs lg:text-base xl:text-2xl">
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
