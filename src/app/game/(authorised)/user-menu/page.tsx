import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button'; // Adjust the path based on your setup
import Container from '@/components/common/container';
import { PasswordIcon, ProfileIcon, TransactionIcon, WalletIcon } from './icons';
import { LogOutIcon } from 'lucide-react';

const UserMenu = () => {
    return (
        <Container className="flex flex-col items-center min-h-screen ">
            <div className="flex-1 w-full mx-auto max-w-sm flex flex-col ">
                <div className="mb-8 flex mt-8 gap-4 sm:flex-row flex-col">
                    <div className='w-24 h-24 border-2 rounded-3xl border-[#EEC53C]'>

                    </div>
                    <div className='space-y-2'>
                        <h2 className="text-2xl text-white font-semibold">JohnDoe92</h2>
                        <div className='flex items-center justify-start gap-4'>
                            <div className="shadow-custom-glow h-fit w-fit mr-2 rounded-full" >
                                <img src="/coin.svg" alt="coin" />
                            </div>
                            <span className="text-white text-xl">
                                25,000
                            </span>
                            <Button size="icon" variant="ghost" className="ml-auto">
                                <img src="/plus-icon.svg" className="size-7" alt="arrow-down" />
                            </Button>
                        </div>
                    </div>
                </div>

                <nav className="space-y-4 w-full flex flex-col gap-3.5  max-w-sm">
                    <Link href="/game/profile" passHref>
                        <Button variant="game-secondary" className="w-full  gap-x-2 h-14">
                            <ProfileIcon />
                            Your Info
                        </Button>
                    </Link>
                    <Link href="/game/change-password" passHref>
                        <Button variant="game-secondary" className="w-full   gap-x-2 h-14">
                            <PasswordIcon />
                            Change Password
                        </Button>
                    </Link>
                    <Link href="/game/wallet/menu" passHref>
                        <Button variant="game-secondary" className="w-full  gap-x-2 h-14">
                            <WalletIcon />
                            Your Wallet
                        </Button>
                    </Link>
                    <Link href="/game/transaction-history" passHref>
                        <Button variant="game-secondary" className="w-full gap-2 h-14">
                            <TransactionIcon />
                            Transaction History
                        </Button>
                    </Link>
                </nav>
            </div>

            <div className="mt-8  w-full max-w-sm">
                <Button variant="destructive" className="w-full mx-auto gap-2 h-14">
                    <LogOutIcon />
                    Log Out
                </Button>
            </div>
        </Container >
    );
};

export default UserMenu;
