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
  const { isMobile } = useWindowSize();

  const videoUrl = useMemo(() => {
    switch (lang) {
      case "en":
        return "https://res.cloudinary.com/dt8iv1hds/video/upload/v1758185321/WhatsApp_Video_2025-09-18_at_11.39.46_AM_uiiu7b.mp4";
      case "hi":
        return "https://res.cloudinary.com/dt8iv1hds/video/upload/v1758872495/WhatsApp_Video_2025-09-26_at_1.05.12_PM_f6jncu.mp4";
      default:
        return "https://res.cloudinary.com/dt8iv1hds/video/upload/v1758185321/WhatsApp_Video_2025-09-18_at_11.39.46_AM_uiiu7b.mp4";
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
            backgroundImage: isMobile
              ? "url('https://res.cloudinary.com/dt8iv1hds/image/upload/v1758179644/dialog-mb_gdbbq4.png')"
              : "url('https://res.cloudinary.com/dt8iv1hds/image/upload/v1758179644/dialog-bg_bylyqs.png')",
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
              src="https://res.cloudinary.com/dt8iv1hds/image/upload/v1758179642/cancel-btn_ebj094.png"
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
