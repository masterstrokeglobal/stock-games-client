import { Loader2 } from "lucide-react";
import { Skeleton } from "../ui/skeleton";
import { cn } from "@/lib/utils";

type Props = {
    className?: string;
    children?: React.ReactNode;
};

const LoadingScreen = ({ className, children }: Props) => {
    return (
        <Skeleton className={cn("flex justify-center items-center w-full h-full", className)}>
            <div className="flex-col justify-center items-center">
                <Loader2 className="animate-spin mx-auto mb-2" />
                {children}
            </div>
        </Skeleton>
    );
}

export default LoadingScreen;