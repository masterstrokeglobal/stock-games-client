import {
    Dialog,
    DialogContent,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { X } from "lucide-react";
import { useTranslations } from "next-intl";
import React, { useState } from "react";

interface HowToPlayDialogProps {
    children: React.ReactNode;
}
const GameRulesDialog: React.FC<HowToPlayDialogProps> = ({
    children }) => {
    const [open, setOpen] = useState(false);
    const t = useTranslations('game-rules');
    return (
        <Dialog open={open} onOpenChange={setOpen} modal={true}>
            <DialogTrigger asChild>
                {children}
            </DialogTrigger>
            <DialogContent showButton={false} className="max-w-3xl xs:w-[95vw] bg-[#140538] w-full p-0 border-none backdrop-blur-md">
                <div
                    style={{
                        background: 'linear-gradient(180deg, #1B1E4B 0%, #23245A 100%)',
                    }}
                    className="w-full border border-[#4061C0] rounded-xl shadow-2xl overflow-hidden max-h-[80vh] flex flex-col"
                >
                    {/* Header */}
                    <div className="flex items-center border-b border-[#4467CC] bg-[#140538] justify-between px-6 py-4 flex-shrink-0">
                        <DialogTitle className="flex tracking-wide items-center text-white text-center text-lg flex-1 justify-center font-semibold w-full">
                            Game Rules
                        </DialogTitle>
                        <button
                            onClick={() => setOpen(false)}
                            className="text-white hover:text-gray-200 transition-colors"
                        >
                            <X size={24} />
                        </button>
                    </div>
                    <div className="py-4 flex-1 relative px-4 overflow-hidden border-x-[1.5rem] border-b-[1.5rem] border-[#140538] flex flex-col">
                        <div className="absolute top-0 left-0 w-full h-full backdrop-blur-sm  bg-opacity-30" />
                        <div className="relative z-10 text-white flex flex-col items-center overflow-y-auto">
                            {/* Rules Content */}
                            <div className="space-y-6 text-white w-full mt-4 px-2">
                                <p>{t('description')}</p>

                                <div className="space-y-4">
                                    <h2 className="text-xl font-semibold text-white">{t('betting-options')}</h2>
                                    <div className="space-y-3">
                                        <div className="p-0 rounded-lg">
                                            <div className="flex items-center gap-2">
                                                <div className="min-w-3 h-3 rounded-full bg-primary mt-0.5"></div>
                                                <span className="font-medium">{t('straight-bet')}</span>
                                            </div>
                                            <p className="text-sm text-gray-300 ml-5 mt-1">
                                                {t('straight-bet-description')}
                                            </p>
                                        </div>
                                        <div className="p-0 rounded-lg">
                                            <div className="flex items-center gap-2">
                                                <div className="min-w-3 h-3 rounded-full bg-primary mt-0.5"></div>
                                                <span className="font-medium">{t('between-two-numbers')}</span>
                                            </div>
                                            <p className="text-sm text-gray-300 ml-5 mt-1">
                                                {t('between-two-numbers-description')}
                                            </p>
                                        </div>
                                        <div className="p-0 rounded-lg">
                                            <div className="flex items-center gap-2">
                                                <div className="min-w-3 h-3 rounded-full bg-primary mt-0.5"></div>
                                                <span className="font-medium">{t('row-of-four-numbers')}</span>
                                            </div>
                                            <p className="text-sm text-gray-300 ml-5 mt-1">
                                                {t('row-of-four-numbers-description')}
                                            </p>
                                        </div>
                                        <div className="p-0 rounded-lg">
                                            <div className="flex items-center gap-2">
                                                <div className="min-w-3 h-3 rounded-full bg-primary mt-0.5"></div>
                                                <span className="font-medium">{t('even-odd')}</span>
                                            </div>
                                            <p className="text-sm text-gray-300 ml-5 mt-1">
                                                {t('even-odd-description')}
                                            </p>
                                        </div>
                                        <div className="p-0 rounded-lg">
                                            <div className="flex items-center gap-2">
                                                <div className="min-w-3 h-3 rounded-full bg-primary mt-0.5"></div>
                                                <span className="font-medium">{t('red-black-colors')}</span>
                                            </div>
                                            <p className="text-sm text-gray-300 ml-5 mt-1">
                                                {t('red-black-colors-description')}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <h2 className="text-xl font-semibold text-white">{t('winning-odds')}</h2>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="rounded-lg p-0 flex items-center gap-3">
                                            <div className=" h-10 w-10 rounded-full flex items-center justify-center border-2 border-primary flex-shrink-0">
                                                <span className="text-lg font-bold text-game-text-secondary">{t('single-number-odds')}</span>
                                            </div>
                                            <div>
                                                <p className="text-white">{t('single-number')}</p>
                                                <p className="text-sm text-gray-300">{t('single-number-description')}</p>
                                            </div>
                                        </div>
                                        <div className="rounded-lg p-0 flex items-center gap-3">
                                            <div className=" h-10 w-10 rounded-full flex items-center justify-center border-2 border-primary flex-shrink-0">
                                                <span className="text-lg font-bold text-game-text-secondary">{t('between-two-numbers-odds')}</span>
                                            </div>
                                            <div>
                                                <p className="text-white">{t('between-two-numbers')}</p>
                                                <p className="text-sm text-gray-300">{t('between-two-numbers-description')}</p>
                                            </div>
                                        </div>
                                        <div className="rounded-lg p-0 flex items-center gap-3">
                                            <div className=" h-10 w-10 rounded-full flex items-center justify-center border-2 border-primary flex-shrink-0">
                                                <span className="text-lg font-bold text-game-text-secondary">{t('row-of-four-numbers-odds')}</span>
                                            </div>
                                            <div>
                                                <p className="text-white">{t('row-of-four-numbers')}</p>
                                                <p className="text-sm text-gray-300">{t('row-of-four-numbers-description')}</p>
                                            </div>
                                        </div>
                                        <div className="rounded-lg p-0 flex items-center gap-3">
                                            <div className=" h-10 w-10 rounded-full flex items-center justify-center border-2 border-primary flex-shrink-0">
                                                <span className="text-lg font-bold text-game-text-secondary">{t('even-odd-odds')}</span>
                                            </div>
                                            <div>
                                                <p className="text-white">{t('even-odd')}</p>
                                                <p className="text-sm text-gray-300">{t('even-odd-description')}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default GameRulesDialog;