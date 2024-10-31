import { cn } from "@/lib/utils";

const Logo = ({ className }: PropsWithClassName) => {
    return (
        <div className={cn("h-24 w-auto", className)}>
            <img src="/images/logo.png" className="h-full" alt="logo" />
        </div>
    );
}

export default Logo;