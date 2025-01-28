"use client";
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import Container from '@/components/common/container';
import TopBar from '@/components/common/top-bar';
import { Input } from '@/components/ui/input';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Crown, Gamepad2, Timer, Smile, SendHorizontal, Users, Settings, Volume2, VolumeX, Medal, ShieldAlert } from 'lucide-react';
import { Progress } from "@/components/ui/progress";

const LobbyWithChat = () => {
  const [message, setMessage] = useState('');
  const [isMuted, setIsMuted] = useState(false);
  const [isReady, setIsReady] = useState(false);

  const players = [
    { id: 1, name: "Player123", level: 42, isHost: true, status: "Ready", avatar: "/api/placeholder/40/40", rank: "Diamond", wins: 156 },
    { id: 2, name: "GameMaster", level: 38, isHost: false, status: "Ready", avatar: "/api/placeholder/40/40", rank: "Platinum", wins: 89 },
    { id: 3, name: "ProGamer", level: 27, isHost: false, status: "Not Ready", avatar: "/api/placeholder/40/40", rank: "Gold", wins: 45 },
    { id: 4, name: "NewPlayer", level: 15, isHost: false, status: "Joining...", avatar: "/api/placeholder/40/40", rank: "Bronze", wins: 12 },
  ];

  const messages = [
    { id: 1, type: 'system', content: 'Game will start in 2:30 minutes' },
    { id: 2, type: 'player', sender: 'Player123', content: 'Hello everyone! 👋', timestamp: '2:45 PM' },
    { id: 3, type: 'player', sender: 'GameMaster', content: 'Good luck! 🎮', timestamp: '2:46 PM' },
    { id: 4, type: 'system', content: 'ProGamer joined the lobby' },
    { id: 5, type: 'player', sender: 'ProGamer', content: 'Ready to win 🏆', timestamp: '2:47 PM' },
  ];

  const emojis = ['👋', '😊', '🎮', '🏆', '👍', '🔥', '💪', '⭐', '🎯', '🎲', '🎪', '🎨', '🎭', '🎪', '🎯'];

  const lobbyRules = {
    gameMode: "Battle Royale",
    maxPlayers: 50,
    minLevel: 10,
    prizePool: 1000,
    mapName: "Ancient Ruins",
    gameLength: "20 minutes"
  };

  const handleSendMessage = () => {
    if (message.trim()) {
      // Add message handling logic here
      setMessage('');
    }
  };

  const handleKeyPress = (e: { key: string; shiftKey: any; preventDefault: () => void; }) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className='bg-primary-game w-full'>
      <Container className="flex flex-col items-center min-h-screen pt-24">
        <TopBar>
          <div className="flex items-center justify-between w-full">
            <span>Battle Royale Lobby</span>
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" onClick={() => setIsMuted(!isMuted)}>
                {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
              </Button>
              <Button variant="ghost" size="icon">
                <Settings className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </TopBar>

        <div className="w-full max-w-7xl mx-auto mt-8 px-4">
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Left Side - Game Info and Players */}
            <div className="flex-1 space-y-6">
              {/* Game Info Card */}
              <Card className="bg-gray-900 border-gray-800">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-gray-800 rounded-lg">
                        <Gamepad2 className="w-6 h-6 text-[#EEC53C]" />
                      </div>
                      <div>
                        <h3 className="text-white font-semibold text-xl">{lobbyRules.gameMode}</h3>
                        <div className="flex items-center gap-4 mt-1">
                          <span className="text-sm text-gray-400">Map: {lobbyRules.mapName}</span>
                          <span className="text-sm text-gray-400">Length: {lobbyRules.gameLength}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2 text-gray-400">
                        <Timer className="w-5 h-5" />
                        <span>Starting in 2:30</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    <div className="bg-gray-800 p-3 rounded-lg">
                      <div className="text-gray-400 text-sm mb-1">Prize Pool</div>
                      <div className="text-[#EEC53C] font-semibold">{lobbyRules.prizePool} Coins</div>
                    </div>
                    <div className="bg-gray-800 p-3 rounded-lg">
                      <div className="text-gray-400 text-sm mb-1">Players</div>
                      <div className="text-white font-semibold">4/{lobbyRules.maxPlayers}</div>
                    </div>
                    <div className="bg-gray-800 p-3 rounded-lg">
                      <div className="text-gray-400 text-sm mb-1">Min Level</div>
                      <div className="text-white font-semibold">{lobbyRules.minLevel}</div>
                    </div>
                    <div className="bg-gray-800 p-3 rounded-lg">
                      <div className="text-gray-400 text-sm mb-1">Status</div>
                      <div className="text-green-400 font-semibold">Waiting</div>
                    </div>
                  </div>

                  <Progress value={8} className="bg-gray-800" />
                </CardContent>
              </Card>

              {/* Players Section */}
              <Card className="bg-gray-900 border-gray-800">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Users className="w-5 h-5" />
                    Players
                  </CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {players.map((player) => (
                    <Card key={player.id} className="bg-gray-800 border-gray-700">
                      <CardContent className="flex items-center justify-between p-4">
                        <div className="flex items-center gap-3">
                          <div className="relative">
                            <img
                              src={player.avatar}
                              alt={player.name}
                              className="w-12 h-12 rounded-full border-2 border-gray-700"
                            />
                            <div className="absolute -bottom-1 -right-1 bg-gray-900 rounded-full p-1">
                              <Medal className="w-4 h-4 text-[#EEC53C]" />
                            </div>
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-white font-medium">{player.name}</span>
                              {player.isHost && (
                                <Crown className="w-4 h-4 text-[#EEC53C]" />
                              )}
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                              <span className="text-gray-400">Level {player.level}</span>
                              <span className="text-[#EEC53C]">{player.rank}</span>
                              <span className="text-gray-400">{player.wins} wins</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className={`text-sm px-3 py-1 rounded-full ${
                            player.status === 'Ready'
                              ? 'bg-green-900/50 text-green-400'
                              : player.status === 'Joining...'
                                ? 'bg-blue-900/50 text-blue-400'
                                : 'bg-gray-800 text-gray-400'
                          }`}>
                            {player.status}
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </CardContent>
              </Card>

              {/* Ready Button */}
              <Button 
                variant={isReady ? "destructive" : "game"} 
                className="w-full h-14 gap-2"
                onClick={() => setIsReady(!isReady)}
              >
                {isReady ? 'Cancel Ready' : 'Ready'}
              </Button>
            </div>

            {/* Right Side - Chat */}
            <Card className="lg:w-[400px] bg-gray-900 border-gray-800">
              <CardHeader>
                <CardTitle className="text-white flex items-center justify-between">
                  <span>Chat</span>
                  <Button variant="ghost" size="icon">
                    <ShieldAlert className="w-5 h-5" />
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 flex flex-col h-[600px]">
                {/* Chat Messages */}
                <div className="flex-1 overflow-y-auto space-y-4 mb-4">
                  {messages.map((msg) => (
                    <div key={msg.id} className="flex flex-col">
                      {msg.type === 'system' ? (
                        <div className="text-sm text-gray-400 text-center py-1 bg-gray-800/50 rounded">
                          {msg.content}
                        </div>
                      ) : (
                        <div className="bg-gray-800 rounded-lg p-3">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-[#EEC53C] font-medium">{msg.sender}</span>
                            {msg.timestamp && (
                              <span className="text-xs text-gray-500">{msg.timestamp}</span>
                            )}
                          </div>
                          <p className="text-white">{msg.content}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* Chat Input */}
                <div className="flex gap-2">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white">
                        <Smile className="w-5 h-5" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-full p-2 bg-gray-900 border-gray-800">
                      <div className="grid grid-cols-5 gap-2">
                        {emojis.map((emoji) => (
                          <button
                            key={emoji}
                            className="text-2xl hover:bg-gray-800 p-2 rounded"
                            onClick={() => setMessage(prev => prev + emoji)}
                          >
                            {emoji}
                          </button>
                        ))}
                      </div>
                    </PopoverContent>
                  </Popover>
                  
                  <Input
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Type a message..."
                    className="flex-1 bg-gray-800 border-gray-700 text-white h-12"
                  />
                  
                  <Button variant="game" className="h-12 px-4" onClick={handleSendMessage}>
                    <SendHorizontal className="w-5 h-5" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default LobbyWithChat;