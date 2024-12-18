import { cn } from "@/lib/utils";

const Logo = ({ className }: PropsWithClassName) => {
    return (
        <div className={cn("h-24 w-auto py-4", className)}>
         <img src="/logo.png" alt="logo" className="h-full w-auto" />
        </div>
    );
}

export default Logo;