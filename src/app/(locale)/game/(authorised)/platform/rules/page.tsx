"use client";
import { BookIcon, PlayCircle } from 'lucide-react';
import { useTranslations } from 'next-intl';

const GameRules = () => {
    const t = useTranslations('game-rules');

    return (
        <div className="flex-1 w-full mx-auto flex flex-col max-w-4xl">
            <div className="mb-8 flex mt-8 gap-4 flex-col p-0">
                <div className="flex items-center gap-3 mb-2">
                    <BookIcon size={24} className="text-primary dark:text-white" />
                    <h1 className="text-2xl font-bold text-platform-text dark:text-white">{t('title')}</h1>
                </div>

                <div className="p-0 mb-8">
                    <div className="flex items-center gap-3 mb-4">
                        <PlayCircle className="text-primary dark:text-white" size={24} />
                        <h2 className="text-xl font-bold text-platform-text dark:text-white">{t('video-title')}</h2>
                    </div>
                    <div className="aspect-video rounded-lg flex items-center justify-center">
                        <video src="/videos/roulette-tutorial.mp4" controls loop className="w-full h-full object-cover" />
                    </div>
                </div>

                <div className="space-y-6 text-platform-text dark:text-white">
                    <p>{t('description')}</p>

                    <div className="space-y-4">
                        <h2 className="text-xl font-semibold text-platform-text dark:text-white">{t('betting-options')}</h2>

                        <div className="space-y-3">
                            <div className="p-0 rounded-lg">
                                <div className="flex items-center gap-2">
                                    <div className="min-w-3 h-3 rounded-full bg-primary mt-0.5"></div>
                                    <span className="font-medium">{t('straight-bet')}</span>
                                </div>
                                <p className="text-sm text-gray-500 dark:text-gray-300 ml-5 mt-1">
                                    {t('straight-bet-description')}
                                </p>
                            </div>

                            <div className="p-0 rounded-lg">
                                <div className="flex items-center gap-2">
                                    <div className="min-w-3 h-3 rounded-full bg-primary mt-0.5"></div>
                                    <span className="font-medium">{t('between-two-numbers')}</span>
                                </div>
                                <p className="text-sm text-gray-500 dark:text-gray-300 ml-5 mt-1">
                                    {t('between-two-numbers-description')}
                                </p>
                            </div>

                            <div className="p-0 rounded-lg">
                                <div className="flex items-center gap-2">
                                    <div className="min-w-3 h-3 rounded-full bg-primary mt-0.5"></div>
                                    <span className="font-medium">{t('row-of-four-numbers')}</span>
                                </div>
                                <p className="text-sm text-gray-500 dark:text-gray-300 ml-5 mt-1">
                                    {t('row-of-four-numbers-description')}
                                </p>
                            </div>

                            <div className="p-0 rounded-lg">
                                <div className="flex items-center gap-2">
                                    <div className="min-w-3 h-3 rounded-full bg-primary mt-0.5"></div>
                                    <span className="font-medium">{t('even-odd')}</span>
                                </div>
                                <p className="text-sm text-gray-500 dark:text-gray-300 ml-5 mt-1">
                                    {t('even-odd-description')}
                                </p>
                            </div>

                            <div className="p-0 rounded-lg">
                                <div className="flex items-center gap-2">
                                    <div className="min-w-3 h-3 rounded-full bg-primary mt-0.5"></div>
                                    <span className="font-medium">{t('red-black-colors')}</span>
                                </div>
                                <p className="text-sm text-gray-500 dark:text-gray-300 ml-5 mt-1">
                                    {t('red-black-colors-description')}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <h2 className="text-xl font-semibold text-platform-text dark:text-white">{t('winning-odds')}</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="rounded-lg p-0 flex items-center gap-3">
                                <div className="shadow-custom-glow h-10 w-10 rounded-full flex items-center justify-center border-2 border-primary">
                                    <span className="text-lg font-bold text-game-text-secondary">{t('single-number-odds')}</span>
                                </div>
                                <div>
                                    <p className="text-platform-text dark:text-white">{t('single-number')}</p>
                                    <p className="text-sm text-gray-500 dark:text-gray-300">{t('single-number-description')}</p>
                                </div>
                            </div>
                            <div className="rounded-lg p-0 flex items-center gap-3">
                                <div className="shadow-custom-glow h-10 w-10 rounded-full flex items-center justify-center border-2 border-primary">
                                    <span className="text-lg font-bold text-game-text-secondary">{t('between-two-numbers-odds')}</span>
                                </div>
                                <div>
                                    <p className="text-platform-text dark:text-white">{t('between-two-numbers')}</p>
                                    <p className="text-sm text-gray-500 dark:text-gray-300">{t('between-two-numbers-description')}</p>
                                </div>
                            </div>
                            <div className="rounded-lg p-0 flex items-center gap-3">
                                <div className="shadow-custom-glow h-10 w-10 rounded-full flex items-center justify-center border-2 border-primary">
                                    <span className="text-lg font-bold text-game-text-secondary">{t('row-of-four-numbers-odds')}</span>
                                </div>
                                <div>
                                    <p className="text-platform-text dark:text-white">{t('row-of-four-numbers')}</p>
                                    <p className="text-sm text-gray-500 dark:text-gray-300">{t('row-of-four-numbers-description')}</p>
                                </div>
                            </div>
                            <div className="rounded-lg p-0 flex items-center gap-3">
                                <div className="shadow-custom-glow h-10 w-10 rounded-full flex items-center justify-center border-2 border-primary">
                                    <span className="text-lg font-bold text-game-text-secondary">{t('even-odd-odds')}</span>
                                </div>
                                <div>
                                    <p className="text-platform-text dark:text-white">{t('even-odd')}</p>
                                    <p className="text-sm text-gray-500 dark:text-gray-300">{t('even-odd-description')}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GameRules;