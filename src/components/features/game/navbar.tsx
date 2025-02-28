"use client";
import LocaleSwitcher from "@/components/common/LocaleSwitcher";
import Logo from "@/components/common/logo";
import { MuteButton } from "@/components/common/mute-button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/context/auth-context";
import User from "@/models/user";
import Wallet from "@/models/wallet";
import { useGetWallet } from "@/react-query/payment-queries";
import Link from "next/link";
import { useMemo } from "react";

const Navbar = () => {
    const { userDetails } = useAuthStore();
    const { data, isLoading } = useGetWallet();

    const wallet = useMemo(() => {
        if (isLoading) return new Wallet();
        return new Wallet(data?.data?.wallet);
    }, [data])

    const user = userDetails as User;
    return (
        <nav className="items-center md:px-6 px-4 z-50  flex fixed top-0 justify-between  font-semibold w-full h-16 bg--game bg-primary-game">
            <div className="">
                <span className="md:text-xl text-sm font-semibold flex items-end">
                    <Logo />

                </span>
            </div>
            <div className="flex items-center space-x-4 ml-auto">
                <MuteButton />
                <LocaleSwitcher />
                <div className="bg-secondary-game px-4 md:h-12 md:flex hidden items-center md:py-2 py-2   rounded-md">
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
                </div>
                <Link href="/game/user-menu">
                    <button className="bg-secondary-game md:px-4 md:h-12 h-10 justify-center  md:aspect-auto aspect-square space-x-3 flex items-center md:py-2 p-1 rounded-md">

                        <Avatar className="size-6">
                            <AvatarFallback className="bg-secondary-game">
                                J
                            </AvatarFallback>
                        </Avatar>

                        <span className="text-sm md:block hidden" >
                            {user.firstname}
                        </span>
                    </button>
                </Link>
            </div>
            <div className="h-0.5 bottom-0 absolute w-full md:-mx-12 -mx-4" style={{ background: "radial-gradient(51.91% 51.91% at 48.09% 91.82%, #2397FA 0%, rgba(35, 151, 250, 0) 100%)" }} />
        </nav>
    );
}

export default Navbar;