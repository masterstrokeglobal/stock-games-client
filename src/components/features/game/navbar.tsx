"use client";
import LocaleSwitcher from "@/components/common/LocaleSwitcher";
import Logo from "@/components/common/logo";
import { MuteButton } from "@/components/common/mute-button";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/context/auth-context";
import { cn } from "@/lib/utils";
import Link from "next/link";
import GameTimings from "./game-timings";
import UserMenuNavbar from "./user-menu-navbar";
import ThemeSwitcher from "@/context/theme-swithcer";
import { useTranslations } from "next-intl";
type Props = {
    className?: string
}
const Navbar = ({ className }: Props) => {
    const t = useTranslations("platform.navbar");
    const { isLoggedIn } = useAuthStore();

    return (
        <nav className={cn("items-center md:px-6 sm:px-4 px-2 z-50 border-b border-platform-border bg-primary-game flex fixed top-0 justify-between font-semibold w-full h-14  mb-4", className)}>
            <div className="flex items-center space-x-4 ">
                <Link href="/game/platform">
                    <span className="md:text-xl text-sm font-semibold flex items-end">
                        <Logo className="h-14 py-0" />
                    </span>
                </Link>
                {isLoggedIn && <GameTimings />}
            </div>
            <div className="flex items-center space-x-4 ml-auto justify-end">
                <ThemeSwitcher className="md:flex hidden" />
                <MuteButton className="md:flex hidden border rounded-full platform-gradient header-inner-shadow  size-10  justify-center p-1" />
                <LocaleSwitcher className="md:block hidden " selectClassName="h-10" />
                {isLoggedIn && <UserMenuNavbar />}
                {!isLoggedIn && <div className="flex items-center space-x-4">
                    <Link href="/game/auth/login">
                        <Button>{t("login")}</Button>
                    </Link>
                    <Link href="/game/auth/register" >
                        <Button className="active-menu-button  rounded-full">{t("signup")}</Button>
                    </Link>
                </div>}
            </div>
        </nav>
    );
}

export default Navbar;

