"use client";
import Container from '@/components/common/container';
import TopBar from '@/components/common/top-bar';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/context/auth-context';
import User from '@/models/user';
import Wallet from '@/models/wallet';
import { useUserLogout } from '@/react-query/admin-auth-queries';
import { useGetWallet } from '@/react-query/payment-queries';
import { Coins, HelpCircleIcon, LogOutIcon } from 'lucide-react';
import Link from 'next/link';
import { useMemo } from 'react';
import { PasswordIcon, ProfileIcon, TransactionIcon, WalletIcon } from './icons';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
const UserMenu = () => {
    const t = useTranslations('user-menu');
    const { userDetails } = useAuthStore();
    const { data, isLoading } = useGetWallet();

    const router = useRouter();
    const { mutate } = useUserLogout();

    const wallet = useMemo(() => {
        if (isLoading) return new Wallet();
        return new Wallet(data?.data?.wallet);
    }, [data])
    const user = userDetails as User;

    return (
        <Container className="flex flex-col items-center min-h-screen pt-24 ">
            <TopBar onBack={() => router.push('/game')}>
                {t('title')}
            </TopBar>
            <div className="flex-1 w-full mx-auto max-w-sm flex flex-col ">
                <div className="mb-8 flex mt-8 gap-4 sm:flex-row flex-col bg-tertiary p-4 rounded-xl">
                    <div className='w-24 h-24 border-2 rounded-3xl border-[#EEC53C]'>
                        <img src={user?.profileImage} alt={t('profile-image-alt')} className="rounded-3xl h-full w-full object-cover" />
                    </div>
                    <div className='space-y-2'>
                        <h2 className="text-2xl text-white font-semibold">
                            {user?.name}
                        </h2>
                        <div className='flex items-center justify-start gap-4'>
                            <div className="shadow-custom-glow h-fit w-fit mr-2 rounded-full" >
                                <img src="/coin.svg" alt={t('coin-image-alt')} />
                            </div>
                            <span className="text-white text-xl">
                                {isLoading ? t('loading') : wallet.totalBalance}
                            </span>
                            <Link href="/game/wallet/menu" passHref>
                                <Button size="icon" variant="ghost" className="ml-auto">
                                    <img src="/plus-icon.svg" className="size-7" alt={t('add-funds-alt')} />
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>

                <nav className="space-y-4 w-full flex flex-col gap-3.5  max-w-sm">
                    <Link href="/game/profile" passHref>
                        <Button variant="game-secondary" className="w-full  gap-x-2 h-14">
                            <ProfileIcon />
                            {t('your-info')}
                        </Button>
                    </Link>
                    <Link href="/game/change-password" passHref>
                        <Button variant="game-secondary" className="w-full   gap-x-2 h-14">
                            <PasswordIcon />
                            {t('change-password')}
                        </Button>
                    </Link>
                    <Link href="/game/wallet/menu" passHref>
                        <Button variant="game-secondary" className="w-full  gap-x-2 h-14">
                            <WalletIcon />
                            {t('your-wallet')}
                        </Button>
                    </Link>
                    <Link href="/game/transaction-history" passHref>
                        <Button variant="game-secondary" className="w-full gap-2 h-14">
                            <TransactionIcon />
                            {t('transaction-history')}
                        </Button>
                    </Link>
                    <Link href="/game/betting-history" passHref>
                        <Button variant="game-secondary" className="w-full gap-2 h-14">
                            <Coins className='text-white' />
                            {t('betting-history')}
                        </Button>
                    </Link>
                    <Link href="/game/contact" passHref>
                        <Button variant="game-secondary" className="w-full gap-2 h-14">
                            <HelpCircleIcon />
                            {t('contact-us')}
                        </Button>
                    </Link>
                </nav>
            </div>

            <div className="mt-8  w-full max-w-sm">
                <Button variant="destructive" className="w-full mx-auto gap-2 h-14" onClick={() => mutate()}>
                    <LogOutIcon />
                    {t('logout')}
                </Button>
            </div>
        </Container>
    );
};

export default UserMenu;