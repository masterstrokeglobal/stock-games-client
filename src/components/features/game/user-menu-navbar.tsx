"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuthStore } from "@/context/auth-context";
import User from "@/models/user";
import Wallet from "@/models/wallet";
import { useGetWallet } from "@/react-query/payment-queries";
import Link from "next/link";
import { useMemo } from "react";
const UserMenuNavbar = () => {
    const { userDetails } = useAuthStore();
    const { data, isLoading } = useGetWallet();


    const wallet = useMemo(() => {
        if (isLoading) return new Wallet();
        return new Wallet(data?.data?.wallet);
    }, [data])

    const user = userDetails as User;
    return (
        <>
            <div className="text-top-bar-text text-xs space-y-1 font-medium">
                <div>Bonus: {wallet.bonusBalance}</div>
                <div>Bal: {wallet.mainBalance}</div>
            </div>
            <Link href="/game/user-menu">
                <button className="  md:px-4 md:h-12 h-10 text-game-text justify-center  md:aspect-auto aspect-square space-x-3 flex items-center md:py-2 p-1 rounded-md">
                    <Avatar className="size-6" p-6>
                        <AvatarFallback className="bg-secondary-game">
                            {user.firstname?.charAt(0) ?? "A"}
                        </AvatarFallback>
                        <AvatarImage src={user.profileImage} />
                    </Avatar>
                </button>
            </Link>
        </>
    )
}


export default UserMenuNavbar;
