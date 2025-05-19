"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/context/auth-context";
import User from "@/models/user";
import Wallet from "@/models/wallet";
import { useGetWallet } from "@/react-query/payment-queries";
import { RefreshCw } from "lucide-react";
import Link from "next/link";
import { useMemo } from "react";
const UserMenuNavbar = () => {
    const { userDetails } = useAuthStore();
    const { data, isLoading, refetch,isRefetching } = useGetWallet();


    const wallet = useMemo(() => {
        if (isLoading) return new Wallet();
        return new Wallet(data?.data?.wallet);
    }, [data])

    const user = userDetails as User;
    return (
        <>
            <div className="gold-button  text-game-text px-4 md:h-12 flex items-center md:py-2 py-2   rounded-md">
                <div className="shadow-custom-glow mr-2 rounded-md" >
                    <img src="/coin.svg" alt="coin" className="md:w-auto w-5" />
                </div>
                <span className=" md:text-xl">
                    {isLoading || isRefetching ? "..." : wallet.totalBalance}
                </span>
                <Link href="/game/wallet/deposit">
                    <Button size="icon" variant="ghost" className="ml-6 md:block hidden">
                        <img src="/plus-icon.svg" className="size-7" alt="arrow-down" />
                    </Button>
                </Link>
                <Button onClick={() => refetch()} disabled={isRefetching} size="icon" variant="ghost" className="md:flex hidden items-center justify-center px-0">
                    <RefreshCw className="size-5" />
                </Button>
            </div>
            <Link href="/game/user-menu">
                <button className="options-button  md:px-4 md:h-12 h-10 text-game-text justify-center  md:aspect-auto aspect-square space-x-3 flex items-center md:py-2 p-1 rounded-md">
                    <Avatar className="size-6">
                        <AvatarFallback className="bg-secondary-game">
                            {user.firstname?.charAt(0) ?? "A"}
                        </AvatarFallback>
                        <AvatarImage src={user.profileImage} />
                    </Avatar>
                    <span className="text-sm md:block hidden" >
                        {user.firstname}
                    </span>
                </button>
            </Link>
        </>
    )
}


export default UserMenuNavbar;
