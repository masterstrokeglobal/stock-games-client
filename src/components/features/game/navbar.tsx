"use client";
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
        <nav className="items-center px-12  flex fixed top-0 justify-between text-white font-semibold w-full h-20 bg-primary-game ">
            <div>
                <span className="text-xl font-semibold">
                    STOCK DERBY
                </span>
            </div>
            <div className="flex items-center space-x-4">
                <button className="bg-[#112148] px-4 h-12 flex items-center py-2 rounded-full">
                    <div className="shadow-custom-glow mr-2 rounded-full" >
                        <img src="/coin.svg" alt="coin" />
                    </div>
                    <span className="text-white text-xl">
                        {isLoading ? "..." : wallet.totalBalance}
                    </span>

                    <Button size="icon" variant="ghost" className="ml-6">
                        <img src="/plus-icon.svg" className="size-7" alt="arrow-down" />
                    </Button>
                </button>
                <Link href="/game/user-menu">
                    <button className="bg-[#112148] px-4 h-12 space-x-3 flex items-center py-2 rounded-full">

                        <Avatar className="size-6">
                            <AvatarFallback className="bg-primary-game">
                                J
                            </AvatarFallback>
                        </Avatar>

                        <span className="text-sm" >
                            {user.firstname}
                        </span>
                    </button>
                </Link>
            </div>
            <div className="h-0.5 bottom-0 absolute w-full -mx-12" style={{ background: "radial-gradient(51.91% 51.91% at 48.09% 91.82%, #2397FA 0%, rgba(35, 151, 250, 0) 100%)" }} />
        </nav>
    );
}

export default Navbar;