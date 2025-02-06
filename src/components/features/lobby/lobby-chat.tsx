import React, { useState, useEffect, useRef } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { ShieldAlert, Smile, SendHorizontal } from 'lucide-react';
import { useGetLobbyChat } from '@/react-query/lobby-query';

type Message = {
    id: number;
    type: 'system' | 'message';
    content: string;
    sender?: string;
    timestamp?: string;
};

type Props = {
    lobbyId: number;
    onSend: (message: string) => void;
};

const LobbyChat = ({ lobbyId, onSend }: Props) => {
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState<Message[]>([]);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const { data: chatData, isLoading } = useGetLobbyChat(lobbyId);

    const emojis = ['😀', '😂', '🎮', '👋', '❤️', '🎯', '🎲', '🎪', '🏆', '✨'];

    useEffect(() => {
        if (chatData) {
            setMessages(chatData);
        }
    }, [chatData]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSendMessage = async () => {
        if (message.trim()) {
            try {
                onSend(message);
                // Only update local state after successful send
                setMessages(prev => [...prev, {
                    id: Date.now(),
                    type: 'message',
                    sender: 'You',
                    content: message,
                    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                }]);
                setMessage('');
            } catch (error) {
                console.error('Failed to send message:', error);
                // You might want to show an error toast here
            }
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            handleSendMessage();
        }
    };

    return (
        <Card className="lg:w-[400px] bg-gray-950  h-[calc(100vh-200px)]  border-gray-800 shadow-xl">
            <CardHeader className="border-b border-gray-800">
                <CardTitle className="text-white flex items-center justify-between">
                    <span className="text-lg font-semibold bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
                        Lobby Chat #{lobbyId}
                    </span>
                    <Button variant="ghost" size="icon" className="hover:bg-gray-800">
                        <ShieldAlert className="w-5 h-5 text-gray-400" />
                    </Button>
                </CardTitle>
            </CardHeader>
            <CardContent className="p-4 flex flex-col overflow-hidden bg-gradient-to-b from-gray-900 to-gray-950">
                {isLoading ? (
                    <div className="flex-1 flex items-center justify-center">
                        <div className="text-gray-400">Loading chat...</div>
                    </div>
                ) : (
                    <div className="flex-1 overflow-y-auto space-y-4 mb-4 scrollbar-thin scrollbar-thumb-gray-800 scrollbar-track-transparent">
                        {messages.map((msg) => (
                            <div key={msg.id} className="flex flex-col">
                                {msg.type === 'system' ? (
                                    <div className="text-sm text-gray-400 text-center py-2 px-3 bg-gray-800/30 rounded-md backdrop-blur-sm">
                                        {msg.content}
                                    </div>
                                ) : (
                                    <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-3 hover:bg-gray-800/60 transition-colors">
                                        <div className="flex items-center justify-between mb-1">
                                            <span className="text-yellow-400 font-medium">{msg.sender}</span>
                                            {msg.timestamp && (
                                                <span className="text-xs text-gray-500">{msg.timestamp}</span>
                                            )}
                                        </div>
                                        <p className="text-gray-100">{msg.content}</p>
                                    </div>
                                )}
                            </div>
                        ))}
                        <div ref={messagesEndRef} />
                    </div>
                )}

                <div className="flex gap-2 pt-3 border-t border-gray-800">
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="text-gray-400 hover:text-yellow-400 hover:bg-gray-800 transition-colors"
                            >
                                <Smile className="w-5 h-5" />
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-full p-2 bg-gray-900 border-gray-800">
                            <div className="grid grid-cols-5 gap-2">
                                {emojis.map((emoji) => (
                                    <button
                                        key={emoji}
                                        className="text-2xl hover:bg-gray-800 p-2 rounded transition-colors"
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
                        className="flex-1 bg-gray-800/50 border-gray-700 text-white h-12 focus:ring-2 focus:ring-yellow-500/20 placeholder:text-gray-500"
                    />

                    <Button
                        variant="game"
                        className="h-12 px-4 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white"
                        onClick={handleSendMessage}
                    >
                        <SendHorizontal className="w-5 h-5" />
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
};

export default LobbyChat;