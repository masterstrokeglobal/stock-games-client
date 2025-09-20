import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { usePathname } from "next/navigation";

const AuthTabs = () => {
    const pathname = usePathname();
    const t = useTranslations("auth");
    const isLogin = pathname === "/game/auth/login";
    
    return (
        <div className="w-full mb-6">
            <div className=" w-full grid grid-cols-2 rounded-xl ">
                <Link href="/game/auth/login" >
                    <button 
                        className={cn(
                            "w-full rounded-xl py-3 rounded-r-none text-sm font-medium transition-all border-2 border-transparent shadow-none",
                            isLogin ? 
                                "bg-gradient-to-r from-[#142E93]  to-[#070F47] text-white" : 
                                "text-[#040029] bg-transparent bg-white border-[#142E93]"
                        )}
                    >
                        {t("sign-in")}
                    </button>
                </Link>
                <Link href="/game/auth/register">
                    <button 
                        value="register" 
                        className={cn(
                            "w-full rounded-xl py-3 rounded-l-none text-sm font-medium transition-all border-2 border-transparent shadow-none",
                            !isLogin ? 
                                "bg-gradient-to-r from-[#142E93]  to-[#070F47] text-white" : 
                                "text-[#040029] bg-transparent bg-white border-[#070F47] "
                        )}
                    >
                        {t("sign-up")}
                    </button>
                </Link>
            </div>
        </div>
    )
}

export default AuthTabs;