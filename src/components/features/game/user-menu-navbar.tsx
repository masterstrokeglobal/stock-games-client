"use client";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { useAuthStore } from "@/context/auth-context";
import User from "@/models/user";
import Wallet from "@/models/wallet";
import { useGetWallet } from "@/react-query/payment-queries";
import Link from "next/link";
import { useMemo } from "react";
import { INR } from "@/lib/utils";
import useWindowSize from "@/hooks/use-window-size";
import ProfileDialog from "../platform/profile-dialog";
const UserMenuNavbar = () => {
    const { userDetails } = useAuthStore();
    const { data, isLoading } = useGetWallet();

    const { isMobile } = useWindowSize()

    const wallet = useMemo(() => {
        if (isLoading) return new Wallet();
        return new Wallet(data?.data?.wallet);
    }, [data])

    const user = userDetails as User;
    return (
        <>
            <div className=" flex flex-col ">
                <span className="md:text-sm text-xs">Bonus: {INR(wallet.bonusBalance, true)}</span>
                <span className="md:text-sm text-xs">Bal: {INR(wallet.mainBalance, true)}</span>
            </div>
            {isMobile ? (
                <Link href="/game/user-menu">
                    <button className="md:px-4 md:h-12 h-10 text-game-text justify-center md:aspect-auto aspect-square space-x-3 flex items-center md:py-2 p-1 rounded-md">
                        <Avatar className="size-6" p-6>
                            <AvatarImage src={user.profileImage ?? "/icons/profile.png"} />
                        </Avatar>
                    </button>
                </Link>
            ) : (
                <ProfileDialog>
                    <button className="md:px-4 md:h-12 h-10 text-game-text justify-center md:aspect-auto aspect-square space-x-3 flex items-center md:py-2 p-1 rounded-md">
                        <Avatar className="size-6" p-6>
                            <AvatarImage src={user.profileImage ?? "/icons/profile.png"} />
                        </Avatar>
                    </button>
                </ProfileDialog>
            )}
        </>
    )
}


export default UserMenuNavbar;
