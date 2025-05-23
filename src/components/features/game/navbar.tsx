"use client";
import LocaleSwitcher from "@/components/common/LocaleSwitcher";
import Logo from "@/components/common/logo";
import { MuteButton } from "@/components/common/mute-button";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/context/auth-context";
import Link from "next/link";
import GameTimings from "./game-timings";
import UserMenuNavbar from "./user-menu-navbar";
import { cn } from "@/lib/utils";
type Props = {
    className?: string
}
const Navbar = ({ className }: Props) => {
    const { isLoggedIn } = useAuthStore();

    return (
    <nav className="items-center md:px-6 px-4 z-50 border-b-2 border-accent-secondary  flex fixed top-0 justify-between font-semibold w-full h-14 bg--game bg-primary-game">
            <div className="flex items-center space-x-4 ">
                <Link href="/game/platform">
                    <span className="md:text-xl text-sm font-semibold flex items-end">
                        <Logo />
                    </span>
                </Link>
                {isLoggedIn && <GameTimings />}
            </div>
            <div className="flex items-center space-x-4 ml-auto">
                <MuteButton className="md:block hidden play-button h-10" />
                <LocaleSwitcher className="md:block hidden play-button " selectClassName="play-button h-10" />
                {isLoggedIn && <UserMenuNavbar />}
                {!isLoggedIn && <div className="flex items-center space-x-4">
                    <Link href="/game/auth/login">
                        <Button>Login</Button>
                    </Link>
                    <Link href="/game/auth/register" >
                        <Button className="active-menu-button  rounded-full">Signup</Button>
                    </Link>
                </div>}
            </div>
        </nav>
    );
}

export default Navbar;

