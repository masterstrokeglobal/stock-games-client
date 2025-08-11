"use client";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DepositTab from "./deposit-form";
import DynamicDepositTab from "./dynamic-desposit-form";
import WithdrawTab from "./withdrawl-form";
import { useGetMyCompany } from '@/react-query/company-queries';

// Amount Input Component
interface AmountInputProps {
    value: string;
    onChange: (value: string) => void;
    placeholder: string;
    number?: boolean;
    minAmount?: number;
    label?: string;
    error?: string;
    required?: boolean; 
}

export const AmountInput = ({ value, onChange, placeholder, minAmount, error, label = "Amount", number = false , required = true }: AmountInputProps) => {
    return (
        <div className="space-y-3">
            <fieldset className="relative border-2 dark:border-platform-border border-primary-game rounded-sm px-4 py-3">
                <legend className="px-2 text-platform-text text-sm font-medium">{label}</legend>
                <Input
                    type={number ? "number" : "text"}
                    className="w-full bg-transparent border-none rounded-none text-platform-text text-base focus:outline-none placeholder:text-platform-text transition-all p-0 h-auto focus-visible:ring-0 focus-visible:ring-offset-0"
                    placeholder={placeholder}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    required={required}
                />
            </fieldset>
            {minAmount && (
                <div className="flex items-center gap-2 text-yellow-400 text-sm">
                    <span>⚠️</span>
                    <span>Minimum withdrawal is ₹{minAmount}!</span>
                </div>
            )}
            {error && (
                <div className="flex items-center gap-2 mt-px text-red-400 text-sm">
                    <span>{error}</span>
                </div>
            )}
        </div>
    );
};




// Main Dialog Component
interface FundsTransfersDialogProps {
    defaultTab?: "deposit" | "withdraw";
}

const FundsTransfers = ({ defaultTab = "deposit" }: FundsTransfersDialogProps) => {
    const { data: company } = useGetMyCompany();
    const isDynamicDeposit = company?.dynamicQR;
    return (
        <div className="dark:bg-[#050128] bg-[#C3E3FF] border-t-2 border-platform-border rounded-t-3xl md:px-6 px-4 py-8">
            <Tabs defaultValue={defaultTab} className="w-full">
                <TabsList className="grid w-full grid-cols-2 bg-transparent border-2 dark:border-platform-border border-primary-game rounded-sm p-0 h-auto">
                    <TabsTrigger
                        value="deposit"
                        className="rounded-sm py-3 text-platform-text  bg-transparent data-[state=active]:bg-gradient-to-r dark:data-[state=active]:from-[#252AB2] dark:data-[state=active]:to-[#111351] data-[state=active]:from-[#64B6FD] data-[state=active]:to-[#64B7FE] data-[state=active]:text-white data-[state=active]:border-r-2 dark:data-[state=active]:border-[#3B4BFF] data-[state=active]:border-[#64B7FE] border-transparent"
                    >
                        Deposit Funds
                    </TabsTrigger>
                    <TabsTrigger
                        value="withdraw"
                            className="rounded-sm py-3 text-platform-text  bg-transparent data-[state=active]:bg-gradient-to-r dark:data-[state=active]:from-[#252AB2] dark:data-[state=active]:to-[#111351] data-[state=active]:from-[#64B6FD] data-[state=active]:to-[#64B7FE] data-[state=active]:text-white data-[state=active]:border-l-2 dark:data-[state=active]:border-[#3B4BFF] data-[state=active]:border-[#64B7FE] border-transparent"
                    >
                        Withdraw Funds
                    </TabsTrigger>
                </TabsList>
                <div className="mt-6">
                    <TabsContent value="deposit" className="mt-0">
                        {isDynamicDeposit ? <DynamicDepositTab /> : <DepositTab />}
                    </TabsContent>
                    <TabsContent value="withdraw" className="mt-0">
                        <WithdrawTab />
                    </TabsContent>
                </div>
            </Tabs>

            <div className="mt-8 text-center">
                <p className="text-platform-text text-sm">
                    Having Trouble? <span className="text-[#3B4BFF] cursor-pointer hover:underline">Contact Support</span>
                </p>
            </div>
        </div>
    );
};

export default FundsTransfers;