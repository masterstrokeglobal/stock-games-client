import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import Wallet from '@/models/wallet';

type Props = {
    wallet: Wallet;
}

const WalletBalanceCard = ({ wallet }: Props) => {
    return (
        <Card className="w-full bg-transparent border-none max-w-sm bg-[#182B5A] text-white justify-start border border-[#EFF8FF17]">
            <CardHeader className="pb-4">
                <CardTitle className="text-lg font-semibold text-white">Wallet Balance</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col space-y-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                        <div className="shadow-custom-glow h-fit w-fit mr-2 rounded-full">
                            <img src="/coin.svg" alt="coin" className="w-8 h-8" />
                        </div>
                        <span className="text-white text-xl font-bold">
                            {wallet.totalBalance}
                        </span>
                        <span className="text-white/70 text-sm">Main </span>
                    </div>
                </div>
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                        <div className="shadow-custom-glow h-fit w-fit mr-2 rounded-full">
                            <img src="/coin.svg" alt="bonus coin" className="w-8 h-8" />
                        </div>
                        <span className="text-white text-xl font-bold">
                            {wallet.bonusBalance}
                        </span>
                        <span className="text-white/70 text-sm">Bonus </span>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

export default WalletBalanceCard;