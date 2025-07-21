"use client";
import LocaleSwitcher from "@/components/common/LocaleSwitcher";
import Logo from "@/components/common/logo";
import { MuteButton } from "@/components/common/mute-button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useAuthStore } from "@/context/auth-context";
import ThemeSwitcher from "@/context/theme-swithcer";
import { cn, INR } from "@/lib/utils";
import User from "@/models/user";
import GameTimings from "./game-timings";
type Props = {
    className?: string
}
const ExternalUserNavbar = ({ className }: Props) => {
    const { isLoggedIn, userDetails } = useAuthStore();
    const user = userDetails as User;

    return (
        <nav className={cn("items-center md:px-6 sm:px-4 px-2 z-50 border-b border-platform-border bg-primary-game flex fixed top-0 justify-between font-semibold w-full h-14  mb-4", className)}>
            <div className="flex items-center space-x-4 ">
                <span className="md:text-xl text-sm font-semibold flex items-end">
                    <Logo className="h-14 py-0" />
                </span>
                {isLoggedIn && <GameTimings />}
            </div>
            <div className="flex items-center space-x-4 ml-auto justify-end">
                <ThemeSwitcher className="md:flex hidden" />
                <MuteButton className="md:flex hidden border rounded-full platform-gradient header-inner-shadow  size-10  justify-center p-1" />
                <LocaleSwitcher className="md:block hidden " selectClassName="h-10" />
                <div className=" flex flex-col ">
                    <span className="md:text-sm text-xs">Bal: {INR(user.balance ?? 0, true)}</span>
                </div>

                <Avatar className="size-6">
                    <AvatarFallback>
                        {user.firstname?.charAt(0)}
                    </AvatarFallback>
                </Avatar>
                <ThemeSwitcher className="md:hidden flex !ml-0" />
            </div>
        </nav>
    );
}

export default ExternalUserNavbar;

