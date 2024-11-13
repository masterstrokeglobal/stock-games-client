"use client";
import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button'; // Adjust the path based on your setup
import Container from '@/components/common/container';
import { LogOutIcon } from 'lucide-react';
import TopBar from '@/components/common/top-bar';
import { CardIcons, MoneyIcon, WithdrawIcon } from '../../user-menu/icons';

const WalletMenu = () => {
    return (
        <Container className="flex flex-col items-center min-h-screen pt-24">
            <TopBar >
                Your Wallet
            </TopBar>
            <nav className="space-y-3 w-full flex flex-col gap-3.5 mt-4  max-w-sm">
                <Link href="/game/wallet/deposit" passHref>
                    <Button variant="game-secondary" className="w-full  gap-x-2 h-14">
                        <MoneyIcon />
                        Deposit Funds
                    </Button>
                </Link>
                <Link href="/game/wallet/withdraw" passHref>
                    <Button variant="game-secondary" className="w-full   gap-x-2 h-14">
                        <WithdrawIcon />
                        Withdraw Funds
                    </Button>
                </Link>
                <Link href="/game/wallet/menu/withdrawl-details" passHref>
                    <Button variant="game-secondary" className="w-full  gap-x-2 h-14">
                        <CardIcons />
                        Payment Method
                    </Button>
                </Link>

            </nav>
        </Container>
    );
};

export default WalletMenu;
