"use client";
import { MoneyIcon, WithdrawIcon } from "@/components/features/user-menu/icons";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/context/auth-context";
import useWallet from "@/hooks/use-wallet";
import { INR } from "@/lib/utils";
import User from "@/models/user";
import { useTranslations } from "next-intl";
import Image from "next/image";

type BalanceCardProps = {
    onDeposit: () => void;
    onWithdraw: () => void;
}

const BalanceCard = ({ onDeposit, onWithdraw }: BalanceCardProps) => {
    const t = useTranslations("wallet");
    const wallet = useWallet();
    const { userDetails } = useAuthStore();
    const user = userDetails as User;
    return (
        <div className="flex flex-col items-center  dark:bg-[#050128] bg-[#C3E3FF]  border-t-2 dark:border-platform-border border-primary-game rounded-t-3xl md:px-6 px-4 py-8 gap-8">
            {/* Balance Card */}
            <div className="max-w-sm w-full bg-gradient-to-b dark:from-[#262BB5] dark:to-[#11134F] from-[#64B6FD] to-[#466CCF] rounded-none dark:border-2 border-platform-border shadow-lg p-4 flex flex-col items-center mb-2">
                <div className="text-white text-base font-medium mb-1">
                    {t("balance.total", { defaultValue: "Total Balance" })}
                </div>
                <div className="flex items-center gap-2 text-2xl font-bold text-yellow-400 mb-2">
                    <Image src="/images/coins/bag.png" alt="coin" width={24} height={24} />
                    {wallet.totalBalance ?? "--"}
                </div>
                <div className="flex flex-col gap-1 w-full mt-2">
                    <div className="flex items-center justify-between text-sm text-white/90">
                        <span className="flex items-center gap-1">
                            <Image src="/images/coins/star-coin.png" alt="coin" width={24} height={24} className="w-6 h-6" />
                            {t("balance.main.label", { defaultValue: "Main" })}
                        </span>
                        {INR(wallet.mainBalance) ?? "--"}
                    </div>
                    <div className="flex items-center justify-between text-sm text-white/90">
                        <span className="flex items-center gap-1">
                            <Image src="/images/coins/star-coin.png" alt="coin" width={24} height={24} />
                            {t("balance.bonus.label", { defaultValue: "Bonus" })}
                        </span>
                        {INR(wallet.bonusBalance) ?? "--"}
                    </div>
                </div>
            </div>

            {
                !user.isDemoUser ? (

                    <div className="flex flex-col gap-8 w-full max-w-sm">
                        <Button
                            size="lg"
                            className="w-full gap-x-2"
                            variant="platform-outline"
                            onClick={onDeposit}
                        >
                            <MoneyIcon />
                            {t("menu.deposit", { defaultValue: "Deposit Funds" })}
                        </Button>
                        <Button
                            size="lg"
                            className="w-full gap-x-2"
                            variant="platform-outline"
                            onClick={onWithdraw}
                        >
                            <WithdrawIcon />
                            {t("menu.withdraw", { defaultValue: "Withdraw Funds" })}
                        </Button>
                    </div>
                ) : (
                    <></>
                )}
        </div>
    );
};

export default BalanceCard;
