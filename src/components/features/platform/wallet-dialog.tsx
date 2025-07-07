"use client";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { useTranslations } from "next-intl";
import { ReactNode, useState } from "react";
import FundsTransfers from "./funds-transfer";
import BalanceCard from "./balance-card";
import { ScrollArea } from "@/components/ui/scroll-area";

interface WalletDialogProps {
    children: ReactNode;
}

const WalletDialog = ({ children }: WalletDialogProps) => {
    const t = useTranslations("wallet");
    const [defaultTab, setDefaultTab] = useState<"balance" | "deposit" | "withdraw">("balance");

    const handleClose = (open: boolean) => {
        if (!open) {
            setDefaultTab("balance");
        }
    }
    return (
        <Dialog onOpenChange={handleClose}>
            <DialogTrigger asChild>
                {children}
            </DialogTrigger>
            <DialogContent className="sm:max-w-xl bg-primary-game dark:bg-[#121456] bg-primary-game gap-0 rounded-2xl border-2 dark:border-platform-border border-primary-game p-0 overflow-hidden">
                <DialogHeader className="px-6 py-4 rounded-t-2xl ">
                    <DialogTitle className="text-white text-lg font-semibold text-center">
                        {t("title", { defaultValue: "Your Wallet" })}
                    </DialogTitle>
                </DialogHeader>
                <ScrollArea className="md:h-[calc(100vh-400px)] max-h-[calc(100vh-150px)] bg-primary-game rounded-t-3xl" scrollThumbClassName="bg-platform-border">
                {defaultTab === "balance" && <BalanceCard onDeposit={() => setDefaultTab("deposit")} onWithdraw={() => setDefaultTab("withdraw")} />}
                {defaultTab === "deposit" && <FundsTransfers defaultTab="deposit" />}
                {defaultTab === "withdraw" && <FundsTransfers defaultTab="withdraw" />}
                </ScrollArea>
            </DialogContent>
        </Dialog>
    );
};

export default WalletDialog;
