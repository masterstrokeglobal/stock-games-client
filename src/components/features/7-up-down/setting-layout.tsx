import { cn } from "@/lib/utils";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import React from "react";

interface SettingLayoutProps {
    children: React.ReactNode;
    className?: string;
    parentClassName?: string;
}

const SettingLayout: React.FC<SettingLayoutProps> = ({ children, className, parentClassName }) => {
    const queryParams = useSearchParams();
    console.log(queryParams.toString());
    return (
        <div className={cn("relative sm:w-[calc(100%-4rem)] sm:pb-0 pb-10 sm:px-0 px-2 w-full mx-auto sm:min-h-[calc(100svh-7rem)]  h-full flex flex-col items-center justify-center bg-transparent", parentClassName)}>
            <div className="flex-1 relative sm:w-[calc(100%-4rem)]  w-full grid grid-cols-1 grid-rows-1">
                <div className="absolute -rotate-[2deg] z-0 top-0 left-0 w-full h-full rounded-2xl bg-[#517ED4]" />
                <div
                    className={cn(
                        "w-full relative z-10 grid sm:pb-4  rounded-2xl h-full bg-[linear-gradient(99deg,_#295AB2_0%,_#171E57_100.75%)] shadow-[0px_0px_7.1px_0px_rgba(1,59,177,0.25)_inset] border-2 border-[#295CB5] flex-1 py-4 px-2 pb-20",
                        className
                    )}
                >
                    {children}
                </div>
            </div>
            <img src="/images/seven-up-down/bull.png" alt="Bull" className="absolute z-[11] sm:bottom-0 bottom-16 left-0  -translate-x-1/4 translate-y-4     w-auto h-32  sm:h-40 md:h-52  xxl:h-80" />
            <img src="/images/seven-up-down/bear.png" alt="Bear" className="absolute z-[11] sm:bottom-0 bottom-16 right-0 translate-x-1/4  translate-y-4 w-auto h-32  sm:h-40 md:h-52  xxl:h-80" />
            <div className="w-full h-20 flex items-center md:pt-0 pt-32 justify-end">
                <Link href={`/game/single-player/7-up-down?${queryParams.toString()}`} className="relative z-20 md:flex-none max-w-[200px] w-full md:mr-auto mx-auto  flex-1">
                    <button className="tracking-wider bg-[#1246B8] hover:bg-[rgb(50,123,183)]  w-full text-white font-bold px-8 py-2 rounded-[10px] border-2 border-[#6DC1EE] shadow-[0px_0px_5.1px_1px_#3881FF] transition-all min-w-[100px] text-[1.1rem] ">
                        PLAY
                    </button>
                </Link>
            </div>
        </div>
    );
};

export default SettingLayout;
