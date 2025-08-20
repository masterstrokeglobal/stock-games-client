"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, Gamepad2, Target, Gift } from 'lucide-react';
import StockBettingIntegration from '@/components/features/platform/stock-betting-integration';
import BonusProgressComponent from '@/components/features/bonus/bonus-progress';
import { useAuthStore } from '@/context/auth-context';
import { useGetUserWagerProgress, useRecordQTechBet } from '@/react-query/enhanced-bonus-queries';
import { ProviderType, BonusStatus } from '@/models/enhanced-bonus';
import { toast } from 'sonner';

interface GamePlatformLayoutProps {
    currentRound?: {
        id: string;
        startTime: Date;
        endTime: Date;
        isActive: boolean;
    };
    qtechGames?: Array<{
        id: string;
        name: string;
        thumbnail: string;
        category: string;
        provider: string;
    }>;
}

const GamePlatformLayout: React.FC<GamePlatformLayoutProps> = ({
    currentRound,
    qtechGames = []
}) => {
    const { userDetails } = useAuthStore();
    const [activeTab, setActiveTab] = useState('stock');
    const [selectedQTechGame, setSelectedQTechGame] = useState<string | null>(null);
    
    const { data: wagerProgress } = useGetUserWagerProgress(
        userDetails?.id?.toString() || '',
        !!userDetails?.id
    );
    
    const recordQTechBetMutation = useRecordQTechBet();

    // Check for active bonuses by provider
    const stockBonuses = wagerProgress?.data?.assignments?.filter(
        assignment => assignment.status === BonusStatus.ACTIVE &&
        (!assignment.bonusCampaign.applicableProviders || 
         assignment.bonusCampaign.applicableProviders.includes(ProviderType.STOCK))
    ) || [];

    const qtechBonuses = wagerProgress?.data?.assignments?.filter(
        assignment => assignment.status === BonusStatus.ACTIVE &&
        (!assignment.bonusCampaign.applicableProviders || 
         assignment.bonusCampaign.applicableProviders.includes(ProviderType.QTECH))
    ) || [];

    // Handle QTech game launch
    const launchQTechGame = async (gameId: string) => {
        try {
            setSelectedQTechGame(gameId);
            
            // In a real implementation, you would:
            // 1. Get game URL from your QTech integration
            // 2. Open game in iframe or new window
            // 3. Set up postMessage listeners for bet tracking
            
            console.log('Launching QTech game:', gameId);
            
            // Simulate game launch
            toast.success('QTech game launching...');
            
            // Set up bet tracking (simulated)
            setupQTechBetTracking(gameId);
            
        } catch (error) {
            console.error('Failed to launch QTech game:', error);
            toast.error('Failed to launch QTech game');
        }
    };

    const setupQTechBetTracking = (gameId: string) => {
        // In a real implementation, this would listen for postMessage events
        // from the QTech game iframe for bet placed events
        
        // Simulated bet tracking
        const simulateBet = () => {
            if (selectedQTechGame && userDetails?.id) {
                recordQTechBetMutation.mutate({
                    userId: userDetails.id.toString(),
                    gameId: gameId,
                    betAmount: Math.random() * 50 + 10, // Random bet amount
                    gameType: 'slot'
                });
            }
        };

        // Simulate periodic bets (for demo purposes)
        const interval = setInterval(simulateBet, 30000); // Every 30 seconds
        
        // Cleanup after 5 minutes
        setTimeout(() => {
            clearInterval(interval);
            setSelectedQTechGame(null);
        }, 300000);
    };

    const getTotalBonusValue = (bonuses: any[]) => {
        return bonuses.reduce((sum, bonus) => sum + bonus.potBalance, 0);
    };

    return (
        <div className="container mx-auto p-4 space-y-6">
            {/* Header with Bonus Summary */}
            <Card className="bg-gradient-to-r from-blue-50 to-purple-50">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Gift className="w-6 h-6 text-yellow-500" />
                        Game Platform - Bonus Tracking Enabled
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="text-center">
                            <p className="text-2xl font-bold text-blue-600">
                                ${getTotalBonusValue(stockBonuses).toFixed(2)}
                            </p>
                            <p className="text-sm text-gray-600">Stock Trading Bonuses</p>
                        </div>
                        <div className="text-center">
                            <p className="text-2xl font-bold text-purple-600">
                                ${getTotalBonusValue(qtechBonuses).toFixed(2)}
                            </p>
                            <p className="text-sm text-gray-600">Casino Game Bonuses</p>
                        </div>
                        <div className="text-center">
                            <p className="text-2xl font-bold text-green-600">
                                ${(wagerProgress?.data?.totalWageredToday || 0).toFixed(2)}
                            </p>
                            <p className="text-sm text-gray-600">Today&apos;s Wagering</p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Main Game Platform */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Game Tabs */}
                <div className="lg:col-span-2">
                    <Tabs value={activeTab} onValueChange={setActiveTab}>
                        <TabsList className="grid w-full grid-cols-2">
                            <TabsTrigger value="stock" className="flex items-center gap-2">
                                <TrendingUp className="w-4 h-4" />
                                Stock Trading
                                {stockBonuses.length > 0 && (
                                    <Badge variant="secondary" className="ml-1">
                                        {stockBonuses.length}
                                    </Badge>
                                )}
                            </TabsTrigger>
                            <TabsTrigger value="qtech" className="flex items-center gap-2">
                                <Gamepad2 className="w-4 h-4" />
                                Casino Games
                                {qtechBonuses.length > 0 && (
                                    <Badge variant="secondary" className="ml-1">
                                        {qtechBonuses.length}
                                    </Badge>
                                )}
                            </TabsTrigger>
                        </TabsList>

                        <TabsContent value="stock" className="mt-4">
                            <StockBettingIntegration
                                currentRound={currentRound}
                                onBetPlaced={(betData) => {
                                    console.log('Stock bet placed:', betData);
                                    toast.success(`Stock bet placed: ${betData.direction} on ${betData.symbol}`);
                                }}
                            />
                        </TabsContent>

                        <TabsContent value="qtech" className="mt-4">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Gamepad2 className="w-5 h-5" />
                                        Casino Games
                                        {qtechBonuses.length > 0 && (
                                            <Badge className="bg-purple-100 text-purple-800">
                                                {qtechBonuses.length} Bonus{qtechBonuses.length > 1 ? 'es' : ''} Active
                                            </Badge>
                                        )}
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    {qtechGames.length > 0 ? (
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                            {qtechGames.map((game) => (
                                                <Card key={game.id} className="cursor-pointer hover:shadow-lg transition-shadow">
                                                    <CardContent className="p-4">
                                                        <div className="aspect-square bg-gray-200 rounded-lg mb-3 overflow-hidden">
                                                            <img 
                                                                src={game.thumbnail} 
                                                                alt={game.name}
                                                                className="w-full h-full object-cover"
                                                                onError={(e) => {
                                                                    e.currentTarget.src = '/images/game-placeholder.png';
                                                                }}
                                                            />
                                                        </div>
                                                        <h4 className="font-medium text-sm mb-1">{game.name}</h4>
                                                        <p className="text-xs text-gray-600 mb-3">{game.category}</p>
                                                        <Button 
                                                            size="sm" 
                                                            className="w-full"
                                                            onClick={() => launchQTechGame(game.id)}
                                                            disabled={selectedQTechGame === game.id}
                                                        >
                                                            {selectedQTechGame === game.id ? 'Playing...' : 'Play Now'}
                                                        </Button>
                                                    </CardContent>
                                                </Card>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="text-center py-8">
                                            <Gamepad2 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                                            <p className="text-gray-600">No casino games available</p>
                                        </div>
                                    )}

                                    {/* QTech Bonus Progress */}
                                    {qtechBonuses.length > 0 && (
                                        <div className="mt-6 p-4 bg-purple-50 rounded-lg">
                                            <h4 className="font-medium text-purple-800 mb-3 flex items-center gap-2">
                                                <Target className="w-4 h-4" />
                                                Casino Game Bonus Progress
                                            </h4>
                                            <div className="space-y-3">
                                                {qtechBonuses.map((assignment) => {
                                                    const progress = ((assignment.requiredWager - assignment.remainingWager) / assignment.requiredWager) * 100;
                                                    const qtechProgress = assignment.providerProgress?.[ProviderType.QTECH.toString()] || 0;
                                                    
                                                    return (
                                                        <div key={assignment.id} className="text-sm">
                                                            <div className="flex justify-between mb-1">
                                                                <span className="font-medium">{assignment.bonusCampaign.bonusName}</span>
                                                                <span>${assignment.potBalance}</span>
                                                            </div>
                                                            <div className="w-full bg-purple-200 rounded-full h-2 mb-1">
                                                                <div 
                                                                    className="bg-purple-600 h-2 rounded-full transition-all" 
                                                                    style={{ width: `${Math.min(progress, 100)}%` }}
                                                                ></div>
                                                            </div>
                                                            <div className="flex justify-between text-xs text-purple-600">
                                                                <span>Casino bets: ${qtechProgress.toFixed(2)}</span>
                                                                <span>${assignment.remainingWager.toFixed(2)} remaining</span>
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </TabsContent>
                    </Tabs>
                </div>

                {/* Sidebar - Bonus Progress */}
                <div className="lg:col-span-1">
                    <BonusProgressComponent showHeader={true} />
                </div>
            </div>
        </div>
    );
};

export default GamePlatformLayout;
