import { cn } from "@/lib/utils";
import Image from "next/image";
type Props = {
    className?: string;
    children?: React.ReactNode;
    loadingText?: string;
    loadingImageClassName?: string;
};

const GameLoadingScreen = ({ className, loadingText = "Loading...", loadingImageClassName }: Props) => {
    return (
        <div className={cn("flex justify-center bg-[#1A2C38] items-center w-full h-full", className)}>
            <div className="flex-col justify-center items-center">
                <Image src="/images/loading.gif" alt="logo" width={100} height={100} className={cn("w-20 h-auto", loadingImageClassName)} />
                <p className="text-white font-semibold mt-4 md:text-base text-sm">{loadingText}</p>
            </div>
        </div>
    );
}

export default GameLoadingScreen;