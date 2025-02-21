"use client";
import Container from '@/components/common/container';
import TopBar from '@/components/common/top-bar';
import CreateLobbyForm from '@/components/features/lobby/create-lobby-form';
import LobbyList from '@/components/features/lobby/lobby-list';
import { Button } from '@/components/ui/button';
import { LobbyGameType } from '@/models/lobby';
import { Plus, Users } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import React from 'react';

const GameLobby = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const gameType = searchParams.get('gameType') as LobbyGameType;
    const [activeTab, setActiveTab] = React.useState('join');

    const handleBack = () => {
        router.push('/game/lobby/select');
    };

    if (gameType === null) return handleBack();

    return (
        <div className="bg-primary-game w-full">
            <Container className="flex flex-col bg-primary-game items-center min-h-screen pt-24">
                <TopBar handleBackButton={handleBack}>Game Lobby</TopBar>

                <div className="w-full max-w-3xl mx-auto mt-8">
                    <div className="flex gap-4 mb-6">
                        <Button
                            variant={activeTab === 'join' ? 'game' : 'game-secondary'}
                            className="flex-1 h-14 gap-2"
                            onClick={() => setActiveTab('join')}
                        >
                            <Users className="w-5 h-5" />
                            Join Lobby
                        </Button>
                        <Button
                            variant={activeTab === 'create' ? 'game' : 'game-secondary'}
                            className="flex-1 h-14 gap-2"
                            onClick={() => setActiveTab('create')}
                        >
                            <Plus className="w-5 h-5" />
                            Create Lobby
                        </Button>
                    </div>

                    {activeTab === 'create' ? <CreateLobbyForm gameType={gameType} onCreate={() => setActiveTab('join')} /> : <LobbyList type={gameType} />}
                </div>
            </Container>
        </div>
    );
};

export default GameLobby;