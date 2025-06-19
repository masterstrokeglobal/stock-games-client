"use client";
import { cn } from "@/lib/utils";
import { useGetMyCompany } from "@/react-query/company-queries";
import { Avatar, AvatarFallback } from "../ui/avatar";

type LogoProps = {
    className?: string;
    dark?: boolean;
}

const Logo = ({ className, dark = true }: LogoProps) => {
    const { data } = useGetMyCompany();
    const initials = data?.name?.split(" ").map(name => name[0]).join("");

    return (
        <div className={cn("h-20 w-auto flex gap-4 items-center py-4", className)}>
            {data?.logo ? <img src={data?.logo} alt="logo" className="h-full w-auto max-h-12" /> : <Avatar className="bg-transparent">
                <AvatarFallback className="bg-transparent text-white text-lg">
                    {initials}
                </AvatarFallback>   
            </Avatar>}
            <span className={cn("hidden md:inline-block capitalize font-semibold", dark ? "text-white" : "text-black")}>
                {data?.name || "--"}
            </span>
        </div>
    );
}

export default Logo;