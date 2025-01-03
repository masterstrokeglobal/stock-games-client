import { cn } from "@/lib/utils";

const Logo = ({ className }: PropsWithClassName) => {
    return (
        <div className={cn("h-24 w-auto flex gap-4 items-center py-4", className)}>
            <img src="/logo.png" alt="logo" className="h-full w-auto" />
            <span className="hidden md:inline-block">
                Stock Derby
            </span>
        </div>
    );
}

export default Logo;