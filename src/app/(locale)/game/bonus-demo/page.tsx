"use client";

import React from 'react';
import GamePlatformLayout from '@/components/features/platform/game-platform-layout';

const BonusIntegrationDemoPage = () => {
    // Mock data for demonstration
    const mockCurrentRound = {
        id: 'round_123',
        startTime: new Date(Date.now() - 5 * 60 * 1000), // Started 5 minutes ago
        endTime: new Date(Date.now() + 25 * 60 * 1000), // Ends in 25 minutes
        isActive: true
    };

    const mockQTechGames = [
        {
            id: 'game_1',
            name: 'Golden Slots',
            thumbnail: '/images/games/golden-slots.jpg',
            category: 'Slots',
            provider: 'QTech'
        },
        {
            id: 'game_2',
            name: 'Blackjack Pro',
            thumbnail: '/images/games/blackjack.jpg',
            category: 'Table Games',
            provider: 'QTech'
        },
        {
            id: 'game_3',
            name: 'Roulette Royal',
            thumbnail: '/images/games/roulette.jpg',
            category: 'Table Games',
            provider: 'QTech'
        },
        {
            id: 'game_4',
            name: 'Lucky Wheel',
            thumbnail: '/images/games/wheel.jpg',
            category: 'Specialty',
            provider: 'QTech'
        }
    ];

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="bg-white shadow-sm border-b">
                <div className="container mx-auto p-4">
                    <h1 className="text-2xl font-bold">Bonus System Integration Demo</h1>
                    <p className="text-gray-600 mt-1">
                        Complete platform integration with provider-specific bonus tracking
                    </p>
                </div>
            </div>
            
            <GamePlatformLayout 
                currentRound={mockCurrentRound}
                qtechGames={mockQTechGames}
            />
        </div>
    );
};

export default BonusIntegrationDemoPage;
