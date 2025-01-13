import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";

const Logo = ({ className }: PropsWithClassName) => {
    const t = useTranslations("common");

    return (
        <div className={cn("h-24 w-auto flex gap-4 items-center py-4", className)}>
            <img src="/logo.png" alt="logo" className="h-full w-auto" />
            <span className="hidden md:inline-block">
                {t("app-name")}
            </span>
        </div>
    );
}

export default Logo;