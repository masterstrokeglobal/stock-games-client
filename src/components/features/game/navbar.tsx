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
type Props = {
    className?: string
}
const Navbar = ({ className }: Props) => {
    const { isLoggedIn } = useAuthStore();

    return (
    <nav className= {cn("items-center md:px-6 px-4 z-50 border-b-2 game-gradient-border flex fixed top-0 justify-between font-semibold w-full h-14  mb-4 bg-primary-game", className)}>
            <div className="flex items-center space-x-4 ">
                <Link href="/game/platform">
                    <span className="md:text-xl text-sm font-semibold flex items-end">
                        <Logo />
                    </span>
                </Link>
                {isLoggedIn && <GameTimings />}
            </div>
            <div className="flex items-center space-x-4 ml-auto">
                <MuteButton className="md:flex hidden border rounded-full text-white border-[#29FEFE] bg-[#003662E5] size-10  justify-center p-1" />
                <LocaleSwitcher className="md:block hidden " selectClassName="h-10" />
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
        <div className="absolute bottom-0 h-px bg-gradient-to-r from-[#29FEFE] to-[#013169] w-[120%] -mx-12"/> 
        </nav>
    );
}

export default Navbar;

