
import { cn } from "@/lib/utils";
import { useDemoLogin } from "@/react-query/game-user-queries";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { PropsWithChildren } from "react";
interface DemoUserLoginProps extends PropsWithChildren {
    className?: string;
}

const DemoUserLogin = ({ className }: DemoUserLoginProps) => {
    const router = useRouter();
    const t = useTranslations("game");
    const { mutate: demoLogin } = useDemoLogin();

    const handleDemoLogin = () => {
        demoLogin(undefined, {
            onSuccess: () => {
                // router.push("/game/platform");
                router.back();
            }
        });
    }
    return (
        <button className={cn("w-full rounded-xl py-2 flex justify-center items-center text-white border-none shadow-none bg-gradient-to-r from-[#142E93] to-[#070F47]", className)} onClick={handleDemoLogin}>{t("demoLogin")}</button>
    );
};

export default DemoUserLogin;
