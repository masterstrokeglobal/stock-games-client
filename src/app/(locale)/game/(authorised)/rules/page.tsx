"use client";
import Container from '@/components/common/container';
import TopBar from '@/components/common/top-bar';
import { Button } from '@/components/ui/button';
import { useTranslations } from 'next-intl';
import { Home, BookIcon, PlayCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const GameRules = () => {
    const t = useTranslations('game-rules');
    const router = useRouter();

    return (
        <>
            <Container className="flex flex-col items-center min-h-screen pt-24">
                <TopBar leftContent={
                    <Button variant="ghost" className='flex gap-2 items-end' onClick={() => router.push('/game')}>
                        <Home size={20} /> Home
                    </Button>
                }>
                    {t('title')}
                </TopBar>

                <div className="flex-1 w-full mx-auto flex flex-col">
                    <div className="mb-8 flex mt-8 gap-4 flex-col bg-tertiary p-4 rounded-xl">
                        <div className="flex items-center gap-3 mb-2">
                            <BookIcon size={24} />
                            <h1 className="text-2xl text-white font-bold">{t('title')}</h1>
                        </div>

                        <div className="bg-tertiary p-4 rounded-xl mb-8">
                            <div className="flex items-center gap-3 mb-4">
                                <PlayCircle className='text-white' size={24} />
                                <h2 className="text-xl text-white font-bold">{t('video-title')}</h2>
                            </div>
                            <div className="aspect-video bg-primary bg-opacity-20 rounded-lg flex items-center justify-center">
                                <video src="/videos/roulette-tutorial.mp4" controls loop className='w-full h-full object-cover' />
                            </div>
                        </div>


                        <div className="space-y-6 text-white">
                            <p>{t('description')}</p>

                            <div className="space-y-4">
                                <h2 className="text-xl font-semibold text-white">{t('betting-options')}</h2>

                                <div className="space-y-3">
                                    <div className="bg-primary bg-opacity-10 p-3 rounded-lg">
                                        <div className="flex items-center gap-2">
                                            <div className="min-w-3 h-3 rounded-full bg-primary mt-0.5"></div>
                                            <span className="font-medium">{t('straight-bet')}</span>
                                        </div>
                                        <p className="text-sm text-gray-300 ml-5 mt-1">
                                            {t('straight-bet-description')}
                                        </p>
                                    </div>

                                    <div className="bg-primary bg-opacity-10 p-3 rounded-lg">
                                        <div className="flex items-center gap-2">
                                            <div className="min-w-3 h-3 rounded-full bg-primary mt-0.5"></div>
                                            <span className="font-medium">{t('between-two-numbers')}</span>
                                        </div>
                                        <p className="text-sm text-gray-300 ml-5 mt-1">
                                            {t('between-two-numbers-description')}
                                        </p>
                                    </div>

                                    <div className="bg-primary bg-opacity-10 p-3 rounded-lg">
                                        <div className="flex items-center gap-2">
                                            <div className="min-w-3 h-3 rounded-full bg-primary mt-0.5"></div>
                                            <span className="font-medium">{t('row-of-four-numbers')}</span>
                                        </div>
                                        <p className="text-sm text-gray-300 ml-5 mt-1">
                                            {t('row-of-four-numbers-description')}
                                        </p>
                                    </div>

                                    <div className="bg-primary bg-opacity-10 p-3 rounded-lg">
                                        <div className="flex items-center gap-2">
                                            <div className="min-w-3 h-3 rounded-full bg-primary mt-0.5"></div>
                                            <span className="font-medium">{t('even-odd')}</span>
                                        </div>
                                        <p className="text-sm text-gray-300 ml-5 mt-1">
                                            {t('even-odd-description')}
                                        </p>
                                    </div>

                                    <div className="bg-primary bg-opacity-10 p-3 rounded-lg">
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
                                    <div className="bg-primary bg-opacity-20 rounded-lg p-4 flex items-center gap-3">
                                        <div className="shadow-custom-glow h-10 w-10 rounded-full flex items-center justify-center border-2 border-primary">
                                            <span className="text-lg font-bold text-game-text-secondary">{t('single-number-odds')}</span>
                                        </div>
                                        <div>
                                            <p>{t('single-number')}</p>
                                            <p className="text-sm text-gray-300">{t('single-number-description')}</p>
                                        </div>
                                    </div>
                                    <div className="bg-primary bg-opacity-20 rounded-lg p-4 flex items-center gap-3">
                                        <div className="shadow-custom-glow h-10 w-10 rounded-full flex items-center justify-center border-2 border-primary">
                                            <span className="text-lg font-bold text-game-text-secondary">{t('between-two-numbers-odds')}</span>
                                        </div>
                                        <div>
                                            <p>{t('between-two-numbers')}</p>
                                            <p className="text-sm text-gray-300">{t('between-two-numbers-description')}</p>
                                        </div>
                                    </div>
                                    <div className="bg-primary bg-opacity-20 rounded-lg p-4 flex items-center gap-3">
                                        <div className="shadow-custom-glow h-10 w-10 rounded-full flex items-center justify-center border-2 border-primary">
                                            <span className="text-lg font-bold text-game-text-secondary">{t('row-of-four-numbers-odds')}</span>
                                        </div>
                                        <div>
                                            <p>{t('row-of-four-numbers')}</p>
                                            <p className="text-sm text-gray-300">{t('row-of-four-numbers-description')}</p>
                                        </div>
                                    </div>
                                    <div className="bg-primary bg-opacity-20 rounded-lg p-4 flex items-center gap-3">
                                        <div className="shadow-custom-glow h-10 w-10 rounded-full flex items-center justify-center border-2 border-primary">
                                            <span className="text-lg font-bold text-game-text-secondary">{t('even-odd-odds')}</span>
                                        </div>
                                        <div>
                                            <p>{t('even-odd')}</p>
                                            <p className="text-sm text-gray-300">{t('even-odd-description')}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>


                </div>
            </Container>

            <footer className='w-full mx-auto bg-gray-200 p-2 mt-20'>
                <p className='text-sm text-center text-gray-500'>
                    Copyright © 2025. All rights reserved. <Link href="/game/terms-and-condition" passHref className='text-primary underline'>Terms and Conditions</Link>
                </p>
            </footer>
        </>
    );
};

export default GameRules;