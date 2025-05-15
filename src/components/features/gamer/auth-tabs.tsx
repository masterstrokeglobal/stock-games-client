import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";

const AuthTabs = () => {
    const pathname = usePathname();
    const isLogin = pathname === "/game/auth/login";
    
    return (
        <div className="w-full mb-6">
            <div className=" w-full grid grid-cols-2 rounded-full bg-gray-800/50 p-1 border border-gray-700">
                <Link href="/game/auth/login" >
                    <Button 
                        className={cn(
                            "w-full rounded-full text-sm font-medium transition-all",
                            isLogin ? 
                                "bg-gradient-to-b from-[var(--bet-button-start)] via-[var(--bet-button-mid)] to-[var(--bet-button-end)] border border-[var(--bet-button-border)] text-white" : 
                                "text-gray-300 hover:text-white bg-transparent"
                        )}
                    >
                        Sign In
                    </Button>
                </Link>
                <Link href="/game/auth/register">
                    <Button 
                        value="register" 
                        className={cn(
                            "w-full rounded-full text-sm font-medium transition-all",
                            !isLogin ? 
                                "bg-gradient-to-b from-[var(--bet-button-start)] via-[var(--bet-button-mid)] to-[var(--bet-button-end)] border border-[var(--bet-button-border)] text-white" : 
                                "text-gray-300 hover:text-white bg-transparent"
                        )}
                    >
                        Sign Up
                    </Button>
                </Link>
            </div>
        </div>
    )
}

export default AuthTabs;