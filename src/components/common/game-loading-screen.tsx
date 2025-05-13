import { cn } from "@/lib/utils";
import Image from "next/image";
import { Skeleton } from "../ui/skeleton";
type Props = {
    className?: string;
    children?: React.ReactNode;
};

const GameLoadingScreen = ({ className }: Props) => {
    return (
        <div className={cn("flex justify-center bg-primary-game items-center w-full h-full", className)}>
            <div className="flex-col justify-center items-center">
                <Image src="/images/loading.gif" alt="logo" width={100} height={100} className="w-20 h-auto" />
            </div>
        </div>
    );
}

export default GameLoadingScreen;