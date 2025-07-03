"use client";

import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import Container from '@/components/common/container';
import TopBar from '@/components/common/top-bar';
import { CardIcons, MoneyIcon, WithdrawIcon } from '../../../../../../components/features/user-menu/icons';
import useWallet from '@/hooks/use-wallet';
import WalletBalanceCard from '@/components/features/gamer/wallet/wallet-balance';
import { useTranslations } from 'next-intl';
import { useGetMyCompany } from '@/react-query/company-queries';
import { BitcoinIcon } from 'lucide-react';

const WalletMenu = () => {
    const wallet = useWallet();
    const t = useTranslations('wallet');

    const { data: company } = useGetMyCompany();
    
    return (
        <Container className="flex flex-col items-center min-h-screen pt-24">
            <TopBar>
                {t('title')}
            </TopBar>
            
            <WalletBalanceCard wallet={wallet} />
            
            <nav className="space-y-3 w-full flex flex-col gap-3.5 mt-4 max-w-sm">
                <Link href="/game/wallet/deposit" passHref>
                    <Button variant="game-secondary" className="w-full gap-x-2 h-14">
                        <MoneyIcon />
                        {t('menu.deposit')}
                    </Button>
                </Link>

                <Link href="/game/wallet/withdrawl" passHref>
                    <Button variant="game-secondary" className="w-full gap-x-2 h-14">
                        <WithdrawIcon />
                        {t('menu.withdraw')}
                    </Button>
                </Link>

                <Link href="/game/wallet/menu/withdrawl-details" passHref>
                    <Button variant="game-secondary" className="w-full gap-x-2 h-14">
                        <CardIcons />
                        {t('menu.paymentMethod')}
                    </Button>
                </Link>

                {company?.cryptoPayIn && (
                    <Link href="/game/wallet/deposit/crypto" passHref>
                        <Button variant="game-secondary" className="w-full gap-x-2 h-14">
                            <BitcoinIcon />
                            Crypto Deposit
                        </Button>
                    </Link>
                )}
            </nav>
        </Container>
    );
};

export default WalletMenu;