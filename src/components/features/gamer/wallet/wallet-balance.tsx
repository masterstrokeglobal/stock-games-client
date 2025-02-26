import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import Wallet from '@/models/wallet';
import { useTranslations } from 'next-intl';

type Props = {
    wallet: Wallet;
}

const WalletBalanceCard = ({ wallet }: Props) => {
    const t = useTranslations('wallet.balance');

    return (
        <Card className="w-full bg-transparent border-none max-w-sm bg-tertiary text-white justify-start border border-[#EFF8FF17]">
            <CardHeader className="pb-4">
                <CardTitle className="text-lg font-semibold text-white">
                    {t('title')}
                </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col space-y-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                        <div className="shadow-custom-glow h-fit w-fit mr-2 rounded-full">
                            <img 
                                src="/coin.svg" 
                                alt={t('main.alt')} 
                                className="w-8 h-8" 
                            />
                        </div>
                        <span className="text-white text-xl font-bold">
                            {wallet.totalBalance}
                        </span>
                        <span className="text-white/70 text-sm">
                            {t('main.label')}
                        </span>
                    </div>
                </div>
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                        <div className="shadow-custom-glow h-fit w-fit mr-2 rounded-full">
                            <img 
                                src="/coin.svg" 
                                alt={t('bonus.alt')} 
                                className="w-8 h-8" 
                            />
                        </div>
                        <span className="text-white text-xl font-bold">
                            {wallet.bonusBalance}
                        </span>
                        <span className="text-white/70 text-sm">
                            {t('bonus.label')}
                        </span>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

export default WalletBalanceCard;