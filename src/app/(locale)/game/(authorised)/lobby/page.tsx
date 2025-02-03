"use client";
import React from 'react';
import { Button } from '@/components/ui/button';
import Container from '@/components/common/container';
import TopBar from '@/components/common/top-bar';
import { Users, Plus } from 'lucide-react';
import CreateLobbyForm from '@/components/features/lobby/create-lobby-form';
import LobbyList from '@/components/features/lobby/lobby-list';

const GameLobby = () => {
    const [activeTab, setActiveTab] = React.useState('join');

    return (
        <div className="bg-primary-game w-full">
            <Container className="flex flex-col bg-primary-game items-center min-h-screen pt-24">
                <TopBar>Game Lobby</TopBar>

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

                    {activeTab === 'create' ? <CreateLobbyForm /> : <LobbyList />}
                </div>
            </Container>
        </div>
    );
};

export default GameLobby;