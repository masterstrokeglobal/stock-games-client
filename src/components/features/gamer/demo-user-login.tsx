import { Button } from "@/components/ui/button";
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
                router.push("/game");
            }
        });
    }
    return (
        <Button variant="game" className={cn("w-full", className)} size="lg" onClick={handleDemoLogin}>{t("demoLogin")}</Button>
    );
};

export default DemoUserLogin;
