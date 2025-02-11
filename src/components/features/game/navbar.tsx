"use client";
import LocaleSwitcher from "@/components/common/LocaleSwitcher";
import Logo from "@/components/common/logo";
import { MuteButton } from "@/components/common/mute-button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/context/auth-context";
import usePlayGameType from "@/hooks/use-play-game-type";
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

    const { isDerby } = usePlayGameType();
    const user = userDetails as User;
    return (
        <nav className="items-center md:px-6 px-4 z-50  flex fixed top-0 justify-between text-white font-semibold w-full h-16 bg-primary-game ">
            <div className="">
                <span className="md:text-xl text-sm font-semibold flex items-end">
                    <Logo />
                </span>
            </div>
            <div className="flex items-center space-x-4 ml-auto">
                {isDerby && <Link href="/game/lobby/">
                    <Button className="px-4 py-2 text-white hidden md:flex bg-[#122146] border border-[#EFF8FF17]  h-11 rounded-full ">
                        <img width="24" height="24" className="mr-2" src="https://img.icons8.com/external-filled-line-andi-nur-abdillah/64/external-Multiplayer-gaming-(filled-line)-filled-line-andi-nur-abdillah.png" alt="external-Multiplayer-gaming-(filled-line)-filled-line-andi-nur-abdillah" />
                        Play with Friends             </Button>
                </Link>}
                <MuteButton />
                <LocaleSwitcher />
                <div className="bg-[#112148] px-4 md:h-12 md:flex hidden items-center md:py-2 py-2   rounded-full">
                    <div className="shadow-custom-glow mr-2 rounded-full" >
                        <img src="/coin.svg" alt="coin" className="md:w-auto w-5" />
                    </div>
                    <span className="text-white md:text-xl">
                        {isLoading ? "..." : wallet.totalBalance}
                    </span>

                    <Link href="/game/wallet/deposit">
                        <Button size="icon" variant="ghost" className="ml-6 md:block hidden">
                            <img src="/plus-icon.svg" className="size-7" alt="arrow-down" />
                        </Button>
                    </Link>
                </div>
                <Link href="/game/user-menu">
                    <button className="bg-[#112148] md:px-4 md:h-12 h-10 justify-center  md:aspect-auto aspect-square space-x-3 flex items-center md:py-2 p-1 rounded-full">

                        <Avatar className="size-6">
                            <AvatarFallback className="bg-primary-game">
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