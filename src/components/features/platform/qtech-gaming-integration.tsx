"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Coins, GamepadIcon, Target, ExternalLink, Zap } from 'lucide-react';
import { useAuthStore } from '@/context/auth-context';
import { useRecordQTechBet, useGetUserWagerProgress } from '@/react-query/enhanced-bonus-queries';
import { ProviderType, BonusStatus } from '@/models/enhanced-bonus';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface QTechGame {
    id: string;
    name: string;
    provider: string;
    category: string;
    imageUrl?: string;
    minBet: number;
    maxBet: number;
}

interface QTechBetData {
    gameId: string;
    betAmount: number;
    gameType: string;
}

interface QTechGamingIntegrationProps {
    games?: QTechGame[];
    onGameLaunch?: (gameId: string) => void;
    onBetRecorded?: (betData: QTechBetData) => void;
    className?: string;
}

const QTechGamingIntegration: React.FC<QTechGamingIntegrationProps> = ({
    games = [
        { id: 'slot-1', name: 'Fortune Wheel', provider: 'QTech', category: 'Slots', minBet: 1, maxBet: 100 },
        { id: 'slot-2', name: 'Lucky Seven', provider: 'QTech', category: 'Slots', minBet: 0.5, maxBet: 50 },
        { id: 'card-1', name: 'Blackjack Pro', provider: 'QTech', category: 'Cards', minBet: 5, maxBet: 200 },
        { id: 'roulette-1', name: 'European Roulette', provider: 'QTech', category: 'Roulette', minBet: 1, maxBet: 500 }
    ],
    onGameLaunch,
    onBetRecorded,
    className
}) => {
    const { userDetails } = useAuthStore();
    const [selectedGame, setSelectedGame] = useState<QTechGame | null>(null);
    const [gameSessionActive, setGameSessionActive] = useState(false);
    const [showBonusProgress, setShowBonusProgress] = useState(false);
    
    const recordQTechBetMutation = useRecordQTechBet();
    const { data: wagerProgress, refetch: refetchProgress } = useGetUserWagerProgress(
        userDetails?.id?.toString() || '',
        !!userDetails?.id
    );

    // Check for active casino bonuses
    const casinoBonuses = wagerProgress?.data?.assignments?.filter(
        assignment => assignment.status === BonusStatus.ACTIVE &&
        (!assignment.bonusCampaign.applicableProviders || 
         assignment.bonusCampaign.applicableProviders.includes(ProviderType.QTECH))
    ) || [];

    const hasActiveCasinoBonuses = casinoBonuses.length > 0;

    useEffect(() => {
        if (hasActiveCasinoBonuses) {
            setShowBonusProgress(true);
        }
    }, [hasActiveCasinoBonuses]);

    // Set up QTech bet tracking (simulating postMessage listener)
    useEffect(() => {
        const handleQTechMessage = (event: MessageEvent) => {
            // In real implementation, check event.origin === 'https://qtech-games.com'
            if (event.data?.type === 'BET_PLACED') {
                handleQTechBetPlaced(event.data.data);
            }
        };

        window.addEventListener('message', handleQTechMessage);
        return () => window.removeEventListener('message', handleQTechMessage);
    }, []);

    const handleQTechBetPlaced = async (betData: {
        player_id: string;
        game_id: string;
        bet_amount: number;
        game_type: string;
    }) => {
        if (!userDetails?.id) return;

        try {
            await recordQTechBetMutation.mutateAsync({
                userId: userDetails.id.toString(),
                gameId: betData.game_id,
                betAmount: betData.bet_amount,
                gameType: betData.game_type
            });

            // Show bonus progress update if applicable
            if (hasActiveCasinoBonuses) {
                const totalBonusValue = casinoBonuses.reduce(
                    (sum, bonus) => sum + bonus.potBalance, 0
                );
                
                toast.success(
                    `Casino bet recorded! Contributing to ${casinoBonuses.length} active bonus${casinoBonuses.length > 1 ? 'es' : ''} (${totalBonusValue.toFixed(2)} total value)`,
                    { duration: 5000 }
                );
                
                // Refresh bonus progress
                setTimeout(() => refetchProgress(), 1000);
            }

            onBetRecorded?.({
                gameId: betData.game_id,
                betAmount: betData.bet_amount,
                gameType: betData.game_type
            });

        } catch (error: any) {
            toast.error(error?.response?.data?.message || 'Failed to record casino bet');
        }
    };

    const launchGame = async (game: QTechGame) => {
        if (!userDetails?.id) {
            toast.error('Please log in to play casino games');
            return;
        }

        setSelectedGame(game);
        setGameSessionActive(true);
        
        // Show bonus eligibility notification
        if (hasActiveCasinoBonuses) {
            toast.info(
                `This game contributes to ${casinoBonuses.length} active bonus${casinoBonuses.length > 1 ? 'es' : ''}!`,
                { duration: 3000 }
            );
        }

        // In real implementation, this would get the game URL from your backend
        // const gameUrl = await getQTechGameUrl(game.id);
        // window.open(gameUrl, '_blank');
        
        onGameLaunch?.(game.id);
        
        // Simulate game launch
        toast.success(`Launching ${game.name}...`);
    };

    const getBonusProgressBar = (assignment: any) => {
        const totalWagered = assignment.requiredWager - assignment.remainingWager;
        const progress = (totalWagered / assignment.requiredWager) * 100;
        return Math.min(progress, 100);
    };

    const getGameCategoryIcon = (category: string) => {
        switch (category.toLowerCase()) {
            case 'slots':
                return '🎰';
            case 'cards':
                return '🃏';
            case 'roulette':
                return '🎡';
            default:
                return '🎮';
        }
    };

    return (
        <div className={cn("space-y-4", className)}>
            {/* Casino Games Grid */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <GamepadIcon className="w-5 h-5" />
                        Casino Games
                        {hasActiveCasinoBonuses && (
                            <Badge className="bg-purple-100 text-purple-800">
                                {casinoBonuses.length} Bonus{casinoBonuses.length > 1 ? 'es' : ''} Active
                            </Badge>
                        )}
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {games.map((game) => (
                            <Card key={game.id} className="hover:shadow-md transition-shadow">
                                <CardContent className="p-4 space-y-3">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <span className="text-2xl">{getGameCategoryIcon(game.category)}</span>
                                            <div>
                                                <h4 className="font-medium text-sm">{game.name}</h4>
                                                <p className="text-xs text-gray-500">{game.category}</p>
                                            </div>
                                        </div>
                                        {hasActiveCasinoBonuses && (
                                            <Badge variant="outline" className="text-xs">
                                                Bonus ✓
                                            </Badge>
                                        )}
                                    </div>
                                    
                                    <div className="text-xs text-gray-600">
                                        Bet range: ${game.minBet} - ${game.maxBet}
                                    </div>
                                    
                                    <Button
                                        size="sm"
                                        onClick={() => launchGame(game)}
                                        className="w-full"
                                        disabled={gameSessionActive && selectedGame?.id === game.id}
                                    >
                                        <ExternalLink className="w-4 h-4 mr-2" />
                                        {gameSessionActive && selectedGame?.id === game.id ? 'Playing...' : 'Play Now'}
                                    </Button>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* Bonus Progress for Casino Games */}
            {showBonusProgress && casinoBonuses.length > 0 && (
                <Card className="border-purple-200 bg-purple-50">
                    <CardHeader className="pb-3">
                        <CardTitle className="text-purple-800 flex items-center gap-2">
                            <Target className="w-5 h-5" />
                            Casino Bonus Progress
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {casinoBonuses.map((assignment) => {
                            const progress = getBonusProgressBar(assignment);
                            const casinoProgress = assignment.providerProgress?.[ProviderType.QTECH.toString()] || 0;
                            
                            return (
                                <div key={assignment.id} className="space-y-3">
                                    <div className="flex justify-between items-center">
                                        <div>
                                            <h4 className="font-medium text-purple-800">
                                                {assignment.bonusCampaign.bonusName}
                                            </h4>
                                            <p className="text-sm text-purple-600">
                                                Bonus Value: ${assignment.potBalance}
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-sm font-medium">{progress.toFixed(1)}%</p>
                                            <p className="text-xs text-purple-600">Complete</p>
                                        </div>
                                    </div>
                                    
                                    <Progress 
                                        value={progress} 
                                        className="h-2 bg-purple-100"
                                    />
                                    
                                    <div className="flex justify-between text-xs text-purple-600">
                                        <span>Casino bets: ${casinoProgress.toFixed(2)}</span>
                                        <span>${assignment.remainingWager.toFixed(2)} remaining</span>
                                    </div>
                                    
                                    {progress >= 100 && (
                                        <div className="flex items-center gap-2 p-2 bg-green-100 rounded-md">
                                            <Zap className="w-4 h-4 text-green-600" />
                                            <span className="text-sm text-green-700 font-medium">
                                                Bonus completed! Claim ${assignment.potBalance} now.
                                            </span>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                        
                        <div className="pt-2 border-t border-purple-200">
                            <div className="flex justify-between text-sm">
                                <span className="text-purple-700">Total Active Casino Bonuses:</span>
                                <span className="font-semibold text-purple-800">
                                    ${casinoBonuses.reduce((sum, b) => sum + b.potBalance, 0).toFixed(2)}
                                </span>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Active Game Session */}
            {gameSessionActive && selectedGame && (
                <Card className="border-blue-200 bg-blue-50">
                    <CardContent className="pt-4">
                        <div className="flex justify-between items-center">
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                                <span className="text-sm font-medium text-blue-800">
                                    Playing: {selectedGame.name}
                                </span>
                            </div>
                            <Button
                                size="sm"
                                variant="outline"
                                onClick={() => {
                                    setGameSessionActive(false);
                                    setSelectedGame(null);
                                }}
                            >
                                End Session
                            </Button>
                        </div>
                        
                        {hasActiveCasinoBonuses && (
                            <p className="text-xs text-blue-600 mt-2">
                                Your bets in this game will contribute to active bonus progress
                            </p>
                        )}
                    </CardContent>
                </Card>
            )}

            {/* Manual Bet Recording (for testing) */}
            {gameSessionActive && selectedGame && (
                <Card className="border-dashed border-2">
                    <CardHeader className="pb-3">
                        <CardTitle className="text-sm">Simulate Casino Bet (Testing)</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <div className="flex gap-2">
                            {[5, 10, 25, 50].map((amount) => (
                                <Button
                                    key={amount}
                                    size="sm"
                                    variant="outline"
                                    onClick={() => handleQTechBetPlaced({
                                        player_id: userDetails?.id?.toString() || '',
                                        game_id: selectedGame.id,
                                        bet_amount: amount,
                                        game_type: selectedGame.category
                                    })}
                                    disabled={recordQTechBetMutation.isPending}
                                >
                                    Bet ${amount}
                                </Button>
                            ))}
                        </div>
                        
                        {recordQTechBetMutation.isPending && (
                            <div className="flex items-center gap-2 text-blue-600 text-sm">
                                <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                                <span>Recording bet...</span>
                            </div>
                        )}
                    </CardContent>
                </Card>
            )}

            {/* Eligibility Notice */}
            {!hasActiveCasinoBonuses && (wagerProgress?.data?.assignments?.length || 0) > 0 && (
                <Card className="border-gray-200">
                    <CardContent className="pt-4">
                        <div className="flex items-center gap-2 text-gray-600">
                            <Coins className="w-4 h-4" />
                            <span className="text-sm">
                                You have active bonuses, but none are eligible for casino games. 
                                Casino bets will not contribute to current bonus progress.
                            </span>
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
};

export default QTechGamingIntegration;
