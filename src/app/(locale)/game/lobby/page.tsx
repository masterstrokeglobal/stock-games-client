"use client";
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import Container from '@/components/common/container';
import TopBar from '@/components/common/top-bar';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Input } from "@/components/ui/input";
import { Users, Plus, Gamepad2, Trophy, Crown } from 'lucide-react';
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

const GameLobby = () => {
    const [activeTab, setActiveTab] = useState('join');
    const [selectedGame, setSelectedGame] = useState('');
    const [isPublic, setIsPublic] = useState(true);
    const [lobbyName, setLobbyName] = useState('');
    const [maxCapacity, setMaxCapacity] = useState('');

    const allLobbies = [
        // First 3 (Guest)
        { id: 1, gameType: 'Space Warriors', prizePool: 1000, players: '24/50', isGuest: true },
        { id: 2, gameType: 'Dragon Quest', prizePool: 500, players: '8/10', isGuest: true },
        { id: 3, gameType: 'Cyber Runner', prizePool: 750, players: '12/16', isGuest: true },
        // Last game
        { id: 4, gameType: 'Pixel Legends', prizePool: 2500, players: '30/50', isGuest: false }
    ];

    // Get top prize pool lobby (4th game)
    const topPrizeLobby = allLobbies[3];

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

                    {activeTab === 'create' ? (
                        <Card className="bg-gray-900 border-gray-800">
                            <CardHeader>
                                <CardTitle className="text-white">Create New Lobby</CardTitle>
                                <CardDescription>Set up your game lobby</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                {/* Basic Info Section */}
                                <div className="space-y-4">
                                    <h3 className="text-lg font-semibold text-white">Basic Information</h3>
                                    <div className="space-y-2">
                                        <Label htmlFor="lobby-name" className="text-sm text-gray-400">Lobby Name</Label>
                                        <Input
                                            id="lobby-name"
                                            placeholder="Enter a unique lobby name"
                                            className="h-14 bg-gray-800 border-gray-700 text-white"
                                            value={lobbyName}
                                            onChange={(e) => setLobbyName(e.target.value)}
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label className="text-sm text-gray-400">Game Type</Label>
                                            <Select onValueChange={setSelectedGame}>
                                                <SelectTrigger className="h-14 bg-gray-800 text-white border-gray-700">
                                                    <SelectValue placeholder="Select game" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {allLobbies.map(lobby => (
                                                        <SelectItem key={lobby.id} value={lobby.gameType.toLowerCase().replace(/\s+/g, '-')}>
                                                            {lobby.gameType}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="max-capacity" className="text-sm text-gray-400">Max Capacity</Label>
                                            <Input
                                                id="max-capacity"
                                                type="number"
                                                placeholder="Max players"
                                                className="h-14 bg-gray-800 border-gray-700 text-white"
                                                value={maxCapacity}
                                                onChange={(e) => setMaxCapacity(e.target.value)}
                                            />
                                        </div>
                                    </div>
                                </div>

                                <Separator className="bg-gray-800" />

                                {/* Settings Section */}
                                <div className="space-y-4">
                                    <h3 className="text-lg font-semibold text-white">Lobby Settings</h3>
                                    <div className="space-y-2">
                                        <Label className="text-sm text-gray-400">Prize Pool</Label>
                                        <Select>
                                            <SelectTrigger className="h-14 bg-gray-800 border-gray-700 text-white">
                                                <SelectValue placeholder="Select prize pool" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="100">100 Coins</SelectItem>
                                                <SelectItem value="500">500 Coins</SelectItem>
                                                <SelectItem value="1000">1000 Coins</SelectItem>
                                                <SelectItem value="2500">2500 Coins</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="flex items-center justify-between p-4 bg-gray-800 rounded-lg">
                                        <div className="space-y-1">
                                            <Label htmlFor="public-mode" className="text-white font-medium">
                                                {isPublic ? 'Public Lobby' : 'Private Lobby'}
                                            </Label>
                                            <p className="text-sm text-gray-400">
                                                {isPublic ? 'Anyone can join this lobby' : 'Only invited players can join'}
                                            </p>
                                        </div>
                                        <Switch
                                            id="public-mode"
                                            checked={isPublic}
                                            onCheckedChange={setIsPublic}
                                        />
                                    </div>
                                </div>

                                <Button className="w-full h-14 mt-6" variant="game">
                                    Create Lobby
                                </Button>
                            </CardContent>
                        </Card>
                    ) : (
                        <div className="space-y-4">
                            {/* Top Prize Pool Lobby */}
                            <Card className="bg-gray-800 border-yellow-500 border-2">
                                <CardContent className="flex items-center justify-between p-6">
                                    <div className="flex items-center gap-4">
                                        <div className="p-3 bg-yellow-500 rounded-lg">
                                            <Trophy className="w-6 h-6 text-gray-900" />
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <h3 className="text-white font-semibold">{topPrizeLobby.gameType}</h3>
                                                <Crown className="w-4 h-4 text-yellow-500" />
                                            </div>
                                            <p className="text-sm text-gray-400">Players: {topPrizeLobby.players}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <div className="text-right">
                                            <p className="text-yellow-500 font-semibold">{topPrizeLobby.prizePool}</p>
                                            <p className="text-sm text-gray-400">Prize Pool</p>
                                        </div>
                                        <Button variant="game" className="h-12">
                                            Join
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* First 3 Guest Games */}
                            {allLobbies.slice(0, 3).map((lobby) => (
                                <Card key={lobby.id} className="bg-gray-900 border-gray-800">
                                    <CardContent className="flex items-center justify-between p-6">
                                        <div className="flex items-center gap-4">
                                            <div className="p-3 bg-gray-800 rounded-lg">
                                                <Gamepad2 className="w-6 h-6 text-white" />
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <h3 className="text-white font-semibold">{lobby.gameType}</h3>
                                                    <span className="px-2 py-1 text-xs bg-blue-500 text-white rounded">
                                                        Guest
                                                    </span>
                                                </div>
                                                <p className="text-sm text-gray-400">Players: {lobby.players}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <div className="text-right">
                                                <p className="text-white font-semibold">{lobby.prizePool}</p>
                                                <p className="text-sm text-gray-400">Prize Pool</p>
                                            </div>
                                            <Button variant="game" className="h-12">
                                                Join
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    )}
                </div>
            </Container>
        </div>
    );
};

export default GameLobby;