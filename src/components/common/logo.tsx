import { cn } from "@/lib/utils";

const Logo = ({ className }: PropsWithClassName) => {
    return (
        <div className={cn("h-24 w-auto py-4 px-6", className)}>
          STOCK DERBY
        </div>
    );
}

export default Logo;