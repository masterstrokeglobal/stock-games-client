"use client";
import LocaleSwitcher from '@/components/common/LocaleSwitcher';
import { MuteButton } from '@/components/common/mute-button';
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAuthStore } from '@/context/auth-context';
import { INR } from "@/lib/utils";
import User from '@/models/user';
import Wallet from '@/models/wallet';
import { useUserLogout } from '@/react-query/admin-auth-queries';
import { useGetUserTier } from "@/react-query/game-user-queries";
import { useGetWallet } from '@/react-query/payment-queries';
import { CircleX } from 'lucide-react';
import { useTranslations } from "next-intl";
import Image from "next/image";
import Link from "next/link";
import { ReactNode, useMemo, useRef, useState } from "react";
import WalletDialog from './wallet-dialog';
import ContactDialog from './contact-dialog';
import BonusDialog from './bonus-dialog';

interface ProfileDialogProps {
    children: ReactNode;
}

const ProfileDialog = ({ children }: ProfileDialogProps) => {
    const [openWalletDialog, setOpenWalletDialog] = useState(false);
    const [openContactDialog, setOpenContactDialog] = useState(false);
    const closebuttonref = useRef<HTMLButtonElement>(null);
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
            href: "/game/platform/profile",
            icon: "/images/platform/user-menu/your-info.png",
            label: t('your-info'),
            demouser: true
        },
        {
            href: "/game/platform/change-password",
            icon: "/images/platform/user-menu/change-password.png",
            label: t('change-password'),
            demouser: false
        },
        {
            href: "/game/platform/transaction-history",
            icon: "/images/platform/user-menu/transaction-history.png",
            label: t('transaction-history'),
            demouser: false
        },
        // {
        //     href: "/game/platform/betting-history",
        //     icon: "/images/platform/user-menu/betting-history.png",
        //     label: t('betting-history'),
        //     demouser: false
        // },
        {
            href: "/game/platform/wallet/menu",
            Parent: (item: { icon: string, label: string }) => (
                <Button onClick={() => {
                    setOpenWalletDialog(true);
                    closebuttonref.current?.click();
                }} variant="ghost" className="w-full rounded-none h-16 border-2 dark:border-platform-border border-primary-game justify-start text-platform-text flex gap-4">
                    <div className="w-10 h-10 backdrop-blur-sm p-0.5 border-2 dark:border-platform-border border-primary-game rounded-full flex items-center justify-center">
                        <img src={`${item.icon}`} alt={item.label} className="w-full h-auto block" />
                    </div>
                    <span className="font-semibold">{item.label}</span>
                </Button>
            ),
            icon: "/images/platform/user-menu/wallet.png",
            label: t('your-wallet'),
            demouser: true
        },
        // My Bonuses (user bonus summary)
        {
            href: "/game/bonus", // will open dialog instead
            icon: "/images/platform/user-menu/wallet.png", // TODO: replace with dedicated bonus icon
            label: t('my-bonuses'),
            demouser: true,
            Parent: (item: { icon: string, label: string }) => (
                <BonusDialog>
                    <Button variant="ghost" className="w-full rounded-none h-16 border-2 dark:border-platform-border border-primary-game justify-start text-platform-text flex gap-4">
                        <div className="w-10 h-10 backdrop-blur-sm p-0.5 border-2 dark:border-platform-border border-primary-game rounded-full flex items-center justify-center">
                            <img src={item.icon} alt={item.label} className="w-full h-auto block" />
                        </div>
                        <span className="font-semibold">{item.label}</span>
                    </Button>
                </BonusDialog>
            )
        },
        {
            href: "/game/platform/terms-and-condition",
            icon: "/images/platform/user-menu/terms-and-conditions.png",
            label: t('terms-and-conditions'),
            demouser: true
        },
        {
            href: "/game/platform/contact",
            icon: "/images/platform/user-menu/contact-us.png",
            label: t('contact-us'),
            demouser: true,
            Parent: (item: { icon: string, label: string }) => (
                <Button onClick={() => {
                    setOpenContactDialog(true);
                    closebuttonref.current?.click();
                }} variant="ghost" className="w-full rounded-none h-16 border-2 dark:border-platform-border border-primary-game justify-start text-platform-text flex gap-4">
                    <div className="w-10 h-10 backdrop-blur-sm p-0.5 border-2 dark:border-platform-border border-primary-game rounded-full flex items-center justify-center">
                        <img src={`${item.icon}`} alt={item.label} className="w-full h-auto block" />
                    </div>
                    <span className="font-semibold">{item.label}</span>
                </Button>
            ),
        },
        {
            href: "/game/platform/rules",
            icon: "/images/platform/user-menu/rules.png",
            label: t('rules'),
            demouser: true
        },
        // {
        //     href: "/game/faq",
        //     icon: HelpCircleIcon,
        //     label: t('faq')
        // }
    ];

    return (
        <>
            <WalletDialog key={String(`${openWalletDialog}-wallet`)} open={openWalletDialog} onClose={() => setOpenWalletDialog(false)} />
            <ContactDialog key={String(`${openContactDialog}-contact`)} open={openContactDialog} onClose={() => setOpenContactDialog(false)} />
            <Dialog>
                <DialogTrigger asChild>
                    {children}
                </DialogTrigger>
                <DialogContent showButton={false} className="sm:max-w-2xl dark:bg-[#121456] bg-primary-game  rounded-xl border-2 dark:border-platform-border border-primary-game  gap-0 p-0 overflow-hidden">
                    <ScrollArea
                        className="h-full max-h-[90vh] overflow-y-auto"
                        scrollThumbClassName="bg-[#191D7B] "
                    >
                        <DialogHeader className="px-6 py-4 dark:bg-[#121456] bg-primary-game  sticky top-0 z-10 rounded">
                            <DialogTitle className="text-white text-lg font-semibold text-center">
                                {t('title')}
                            </DialogTitle>  
                            <DialogClose asChild>
                                <Button ref={closebuttonref} variant="ghost" size="icon" className="absolute bg-transparent right-4 top-2 mt-0">
                                    <CircleX className="text-white" />
                                </Button>
                            </DialogClose>
                        </DialogHeader>
                        <div className="flex flex-col items-center dark:bg-[#050128] bg-[#C3E3FF] border-t-2 dark:border-platform-border border-primary-game rounded-t-3xl rounded-b px-6 py-8 gap-6">
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
                                        <span className="text-white font-semibold text-sm mr-auto">{t('point-progress')}</span>
                                        <span className="text-white font-bold text-sm">{userTier?.totalPoints || 0}/{userTier?.nextTierPointsRequired || 0} {t('points')}</span>
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
                            <div className="w-full max-w-lg grid grid-cols-2 gap-4">
                                {menuItems.map((item, index) => {
                                    if (item.Parent) {
                                        return <item.Parent key={index} icon={item.icon} label={item.label} />
                                    }
                                    return (
                                        <Link key={index} href={user.isDemoUser && !item.demouser ? "#" : item.href} passHref>
                                            <Button  onClick={() => {
                                            closebuttonref.current?.click();
                                        }} disabled={user.isDemoUser && !item.demouser} variant="ghost" className="w-full rounded-none h-16 border-2 dark:border-platform-border border-primary-game justify-start text-platform-text flex gap-4">
                                                <div className="w-10 h-10 backdrop-blur-sm p-0.5 border-2 dark:border-platform-border border-primary-game rounded-full flex items-center justify-center">
                                                    <img src={`${item.icon}`} alt={item.label} className="w-full h-auto block" />
                                                </div>
                                                <span className="font-semibold">{item.label}</span>
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
                    </ScrollArea>
                </DialogContent>
            </Dialog>
        </>
    );
};

export default ProfileDialog;