"use client";
import { cn } from "@/lib/utils";
import { useGetMyCompany } from "@/react-query/company-queries";

const Logo = ({ className }: PropsWithClassName) => {
    const { data } = useGetMyCompany();
    return (
        <div className={cn("h-24 w-auto flex gap-4 items-center py-4", className)}>
            <img src="/logo.png" alt="logo" className="h-full w-auto" />
            <span className="hidden md:inline-block text-white capitalize">
                {data?.name||"--"}
            </span>
        </div>
    );
}

export default Logo;