"use client";
import LocaleSwitcher from '@/components/common/LocaleSwitcher';
import { MuteButton } from '@/components/common/mute-button';
import { Button } from "@/components/ui/button";
import { useAuthStore } from '@/context/auth-context';
import { INR } from "@/lib/utils";
import User from '@/models/user';
import Wallet from '@/models/wallet';
import { useUserLogout } from '@/react-query/admin-auth-queries';
import { useGetUserTier } from "@/react-query/game-user-queries";
import { useGetWallet } from '@/react-query/payment-queries';
import { useTranslations } from "next-intl";
import Image from "next/image";
import Link from "next/link";
import { useMemo } from "react";
import WalletDialog from '../platform/wallet-dialog';
import ContactDialog from '../platform/contact-dialog';
import BonusDialog from '../platform/bonus-dialog';


const UserMenu = () => {
    const t = useTranslations("user-menu");
    const { userDetails } = useAuthStore();
    const { data, isLoading } = useGetWallet();

    const { data: userTier } = useGetUserTier();

    const { mutate } = useUserLogout();

    const wallet = useMemo(() => {
        if (isLoading) return new Wallet();
        return new Wallet(data?.data?.wallet);
    }, [data]);

    const user = userDetails as User;

    // Menu items configuration with updated image icons
    const menuItems = [
        {
            href: "/game/profile",
            icon: "/images/platform/user-menu/your-info.png",
            label: t('your-info')
        },
        {
            href: "/game/change-password",
            icon: "/images/platform/user-menu/change-password.png",
            label: t('change-password')
        },
        {
            href: "/game/platform/transaction-history",
            icon: "/images/platform/user-menu/transaction-history.png",
            label: t('transaction-history')
        },
        {
            href: "/game/betting-history",
            icon: "/images/platform/user-menu/betting-history.png",
            label: t('betting-history')
        },
        {
            href: "/game/wallet/menu",
            icon: "/images/platform/user-menu/wallet.png",
            parent:WalletDialog,
            label: t('your-wallet')
        },
        {
            href: "/game/bonus",
            icon: "/images/platform/user-menu/wallet.png", // TODO: Add bonus-specific icon
            parent: BonusDialog,
            label: "My Bonuses" // Hardcoded for testing - should show t('my-bonuses')
        },
        {
            href: "/game/terms-and-condition",
            icon: "/images/platform/user-menu/terms-and-conditions.png",
            label: t('terms-and-conditions')
        },
        {
            href: "/game/contact",
            icon: "/images/platform/user-menu/contact-us.png",
            parent:ContactDialog,
            label: t('contact-us')
        },
        {
            href: "/game/rules",
            icon: "/images/platform/user-menu/rules.png",
            label: t('rules')
        },
        // {
        //     href: "/game/faq",
        //     icon: HelpCircleIcon,
        //     label: t('faq')
        // }
    ];

    return (
        <>
            <div className="flex flex-col items-center py-4 gap-6">
                {/* User Profile Card */}
                <div className="max-w-lg w-full flex bg-gradient-to-b text-platform-text dark:from-[#262BB5] dark:to-[#11134F] from-[#64B6FD] to-[#466CCF] rounded-none dark:border-2 border-platform-border shadow-lg p-4 items-center mb-2">
                    <div className="flex items-center justify-center mr-4">
                        <div className='w-20 h-20 border-2 rounded-full border-[#EEC53C] overflow-hidden'>
                            <img
                                src={user?.profileImage || "/images/default-avatar.png"}
                                alt="Profile"
                                className="rounded-3xl h-full w-full object-cover"
                            />
                        </div>
                    </div>
                    <div className="flex flex-col justify-center h-full flex-1">
                        <div className="text-lg font-semibold mb-2">
                            {user?.name || "Player Name"}
                        </div>
                        <div className='flex items-center justify-start gap-2'>
                            <div className="h-fit w-fit rounded-full">
                                <img src="/images/coins/bag.png" alt="Coin" className="w-6 h-6" />
                            </div>
                            <span className="text-white text-base">
                                {isLoading ? t('loading') : INR(wallet.totalBalance, true)}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Progress Section */}
                <div className="max-w-lg w-full  dark:border-2 bg-gradient-to-b dark:from-[#262BB5] dark:to-[#11134F] from-[#64B6FD] to-[#466CCF] border-platform-border rounded-none p-4 flex items-center gap-6 shadow-lg">
                    {/* Tier Icon */}
                    <div className="flex flex-col items-center mr-4">
                        <div className="w-16 h-16 rounded-full border-2 border-[#EEC53C] flex items-center justify-center bg-[#181E6A]">
                            <Image
                                src={userTier?.imageUrl ? userTier?.imageUrl : "/images/tier/tier-bg-light.png"}
                                alt={userTier?.tierName || "Tier"}
                                width={44}
                                height={44}
                                className="object-contain"
                            />
                        </div>
                        <span className="text-white text-base font-semibold mt-2">{userTier?.tierName}</span>
                    </div>
                    {/* Progress Info */}
                    <div className="flex-1 flex flex-col justify-center">
                        <div className="flex items-center mb-2">
                            <span className="text-white font-semibold text-sm mr-auto">Point Progress</span>
                            <span className="text-white font-bold text-sm">{userTier?.totalPoints || 0}/{userTier?.nextTierPointsRequired || 0} Points</span>
                        </div>
                        <div className="w-full h-2 rounded-full bg-[#3B418C] overflow-hidden">
                            <div
                                className="h-2 rounded-full bg-gradient-to-r from-[#E96B8A] via-[#7AC6F9] to-[#3B418C]"
                                style={{
                                    width: `${userTier?.totalPoints && userTier?.nextTierPointsRequired
                                        ? Math.min((userTier.totalPoints / userTier.nextTierPointsRequired) * 100, 100)
                                        : 0
                                        }%`
                                }}
                            />
                        </div>
                    </div>
                </div>

                {/* Menu Grid */}
                <div className="w-full max-w-lg grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {menuItems.map((item, index) => {

                        if (item.parent) {
                            return (
                                <item.parent key={index}>
                                 <Button variant="ghost" className="w-full rounded-none h-16 border-2 dark:border-platform-border border-primary-game justify-start text-platform-text flex gap-4">
                                    <div className="w-10 h-10 backdrop-blur-sm p-0.5 border-2 dark:border-platform-border border-primary-game rounded-full flex items-center justify-center">
                                        <img src={`${item.icon}`} alt={item.label} className="w-full h-auto block" />
                                    </div>
                                    <span className="font-semibold line-clamp-2">{item.label}</span>
                                </Button>
                                </item.parent>
                            );
                        }
                        return (
                            <Link key={index} href={item.href} passHref>
                                <Button variant="ghost" className="w-full rounded-none h-16 border-2 dark:border-platform-border border-primary-game justify-start text-platform-text flex gap-4">
                                    <div className="w-10 h-10 backdrop-blur-sm p-0.5 border-2 dark:border-platform-border border-primary-game rounded-full flex items-center justify-center">
                                        <img src={`${item.icon}`} alt={item.label} className="w-full h-auto block" />
                                    </div>
                                    <span className="font-semibold line-clamp-2">{item.label}</span>
                                </Button>
                            </Link>
                        );
                    })}
                </div>

                {/* Settings Section */}
                <div className="w-full max-w-lg space-y-3">
                    <LocaleSwitcher theme="solid" className="w-full " />
                    <MuteButton className="w-full bg-gradient-to-b rounded-none dark:from-[#262BB5] dark:to-[#11134F] from-[#64B6FD] to-[#466CCF] border-2 border-platform-border text-white hover:from-[#2B2BB5] hover:to-[#15154F]" />
                </div>

                {/* Logout Button */}
                <div className="w-full max-w-lg">
                    <Button
                        variant="destructive"
                        className="rounded-none w-full h-10 tracking-wide bg-[#AA2D2D] border-[#E73E3E] border font-inter"
                        onClick={() => mutate()}
                    >
                        {t('logout')}
                    </Button>
                </div>
            </div>

        </>
    );
};

export default UserMenu;