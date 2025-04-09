"use client";
import LocaleSwitcher from "@/components/common/LocaleSwitcher";
import Logo from "@/components/common/logo";
import { MuteButton } from "@/components/common/mute-button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/context/auth-context";
import { useGameType } from "@/hooks/use-game-type";
import { cn } from "@/lib/utils";
import { SchedulerType } from "@/models/market-item";
import User from "@/models/user";
import Wallet from "@/models/wallet";
import { useGetWallet } from "@/react-query/payment-queries";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useMemo } from "react";

const Navbar = ({ className }: PropsWithClassName) => {
    const { userDetails } = useAuthStore();
    const { data, isLoading } = useGetWallet();
    const t = useTranslations("common");
    const [gameType] = useGameType();

    const isNSE = gameType === SchedulerType.NSE;

    const wallet = useMemo(() => {
        if (isLoading) return new Wallet();
        return new Wallet(data?.data?.wallet);
    }, [data])

    const user = userDetails as User | null;
    const isLoggedIn = user !== null;
    return (
        <nav className={cn("items-center md:px-6 px-4 z-50  flex fixed top-0 justify-between font-semibold w-full h-14 bg-primary-game", className)}>
            <div className="flex items-center space-x-4 ">
                <span className="md:text-xl text-sm font-semibold flex items-end">
                    <Logo />
                </span>

                {isNSE && <div className="items-center hidden md:flex space-x-4 ml-auto">
                    <span className="text-sm text-game-secondary">{t("timings")}</span>
                </div>}
            </div>
            <div className="flex items-center space-x-4 ml-auto">
                <MuteButton className="md:block hidden " />
                <LocaleSwitcher className="md:block hidden " />
                {isLoggedIn && <div className="bg-secondary-game text-game-text px-4 md:h-12 flex items-center md:py-2 py-2   rounded-md">
                    <div className="shadow-custom-glow mr-2 rounded-md" >
                        <img src="/coin.svg" alt="coin" className="md:w-auto w-5" />
                    </div>
                    <span className=" md:text-xl">
                        {isLoading ? "..." : wallet.totalBalance}
                    </span>
                    <Link href="/game/wallet/deposit">
                        <Button size="icon" variant="ghost" className="ml-6 md:block hidden">
                            <img src="/plus-icon.svg" className="size-7" alt="arrow-down" />
                        </Button>
                    </Link>
                </div>}
                {isLoggedIn && <Link href="/game/user-menu">
                    <button className="bg-secondary-game md:px-4 md:h-12 h-10 text-game-text justify-center  md:aspect-auto aspect-square space-x-3 flex items-center md:py-2 p-1 rounded-md">
                        <Avatar className="size-6">
                            <AvatarFallback className="bg-secondary-game">
                                {user?.firstname?.charAt(0) ?? "A"}
                            </AvatarFallback>
                            <AvatarImage src={user?.profileImage ?? ""} />
                        </Avatar>
                        <span className="text-sm md:block hidden" >
                            {user?.firstname}
                        </span>
                    </button>
                </Link>}
                {!isLoggedIn && <Link href="/game/auth/login">
                    <Button className="bg-secondary-game text-game-text px-4 md:h-12 flex items-center md:py-2 py-2   rounded-md">
                        Login
                    </Button>
                </Link>}
            </div>
            <div className="h-0.5 bottom-0 absolute w-full md:-mx-12 -mx-4" style={{ background: "radial-gradient(51.91% 51.91% at 48.09% 91.82%, #2397FA 0%, rgba(35, 151, 250, 0) 100%)" }} />
        </nav>
    );
}

export default Navbar;