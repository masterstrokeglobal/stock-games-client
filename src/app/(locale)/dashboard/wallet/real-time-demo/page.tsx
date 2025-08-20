/**
 * Real-time Wallet Demo Page
 * Demonstrates the real-time wallet update functionality
 */

"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import RealTimeWallet from '@/components/wallet/RealTimeWallet';
import BonusProgressComponent from '@/components/features/bonus/bonus-progress';
import { useAuthStore } from '@/context/auth-context';
import { useActiveWallet } from '@/hooks/useRealTimeWallet';
import { toast } from 'sonner';
import { 
    Play, 
    Pause, 
    RefreshCw, 
    DollarSign, 
    Gift, 
    TrendingUp,
    Clock,
    Users
} from 'lucide-react';

const RealTimeWalletDemoPage: React.FC = () => {
    const { userDetails } = useAuthStore();
    const [depositAmount, setDepositAmount] = useState<number>(1000);
    const [betAmount, setBetAmount] = useState<number>(100);
    const [selectedProvider, setSelectedProvider] = useState<number>(1);

    // Real-time wallet hook with faster polling for demo
    const {
        mainBalance,
        bonusBalance,
        totalBalance,
        isLoading,
        lastUpdated,
        onDeposit,
        onBet,
        onTransaction,
        serviceStatus
    } = useActiveWallet(userDetails?.id?.toString() || null, 5000); // 5 second polling

    const handleDemoDeposit = async () => {
        if (!userDetails?.id || depositAmount <= 0) {
            toast.error('Please enter a valid deposit amount');
            return;
        }

        try {
            await onDeposit(depositAmount);
            toast.success(`Demo deposit of ₹${depositAmount} processed!`);
            setDepositAmount(1000); // Reset
        } catch (error) {
            toast.error('Demo deposit failed');
        }
    };

    const handleDemoBet = async () => {
        if (!userDetails?.id || betAmount <= 0) {
            toast.error('Please enter a valid bet amount');
            return;
        }

        try {
            await onBet(betAmount, selectedProvider);
            toast.success(`Demo bet of ₹${betAmount} placed on Provider ${selectedProvider}!`);
            setBetAmount(100); // Reset
        } catch (error) {
            toast.error('Demo bet failed');
        }
    };

    const handleDemoWin = async () => {
        if (!userDetails?.id) return;

        try {
            await onTransaction('GAME_WIN', 500);
            toast.success('Demo win of ₹500 credited!');
        } catch (error) {
            toast.error('Demo win failed');
        }
    };

    const handleDemoLoss = async () => {
        if (!userDetails?.id) return;

        try {
            await onTransaction('GAME_LOSS', 100);
            toast.info('Demo loss of ₹100 deducted');
        } catch (error) {
            toast.error('Demo loss failed');
        }
    };

    if (!userDetails?.id) {
        return (
            <div className="container mx-auto p-6">
                <Card>
                    <CardContent className="p-6 text-center">
                        <h1 className="text-2xl font-bold mb-4">Real-time Wallet Demo</h1>
                        <p className="text-gray-600">Please log in to view the real-time wallet demo.</p>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-6 space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold">Real-time Wallet Demo</h1>
                <Badge variant={serviceStatus.isPolling ? "default" : "secondary"}>
                    {serviceStatus.isPolling ? 'Live Updates' : 'Offline'}
                </Badge>
            </div>

            <Tabs defaultValue="wallet" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="wallet">Wallet</TabsTrigger>
                    <TabsTrigger value="transactions">Transactions</TabsTrigger>
                    <TabsTrigger value="bonuses">Bonuses</TabsTrigger>
                    <TabsTrigger value="status">Status</TabsTrigger>
                </TabsList>

                {/* Wallet Tab */}
                <TabsContent value="wallet" className="space-y-6">
                    <RealTimeWallet 
                        userId={userDetails.id.toString()} 
                        enablePolling={true}
                        showActions={false}
                    />
                    
                    {/* Quick Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Main Balance</CardTitle>
                                <DollarSign className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">₹{mainBalance.toLocaleString()}</div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Bonus Balance</CardTitle>
                                <Gift className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold text-orange-600">₹{bonusBalance.toLocaleString()}</div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Last Update</CardTitle>
                                <Clock className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-lg font-medium">
                                    {lastUpdated ? lastUpdated.toLocaleTimeString() : 'Never'}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                {/* Transactions Tab */}
                <TabsContent value="transactions" className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Deposit Demo */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <TrendingUp className="h-5 w-5" />
                                    Demo Deposit
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="deposit-amount">Amount (₹)</Label>
                                    <Input
                                        id="deposit-amount"
                                        type="number"
                                        value={depositAmount}
                                        onChange={(e) => setDepositAmount(Number(e.target.value))}
                                        min="100"
                                        max="10000"
                                    />
                                </div>
                                <Button 
                                    onClick={handleDemoDeposit} 
                                    className="w-full"
                                    disabled={isLoading}
                                >
                                    Simulate Deposit
                                </Button>
                            </CardContent>
                        </Card>

                        {/* Bet Demo */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Play className="h-5 w-5" />
                                    Demo Bet
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="bet-amount">Bet Amount (₹)</Label>
                                    <Input
                                        id="bet-amount"
                                        type="number"
                                        value={betAmount}
                                        onChange={(e) => setBetAmount(Number(e.target.value))}
                                        min="10"
                                        max="1000"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Provider</Label>
                                    <div className="flex gap-2">
                                        <Button
                                            variant={selectedProvider === 1 ? "default" : "outline"}
                                            onClick={() => setSelectedProvider(1)}
                                            size="sm"
                                        >
                                            Stock Games
                                        </Button>
                                        <Button
                                            variant={selectedProvider === 2 ? "default" : "outline"}
                                            onClick={() => setSelectedProvider(2)}
                                            size="sm"
                                        >
                                            QTech Games
                                        </Button>
                                    </div>
                                </div>
                                <Button 
                                    onClick={handleDemoBet} 
                                    className="w-full"
                                    disabled={isLoading}
                                >
                                    Place Bet
                                </Button>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Game Results */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Game Results</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex gap-2">
                                <Button variant="outline" onClick={handleDemoWin}>
                                    Simulate Win (+₹500)
                                </Button>
                                <Button variant="outline" onClick={handleDemoLoss}>
                                    Simulate Loss (-₹100)
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Bonuses Tab */}
                <TabsContent value="bonuses">
                    <BonusProgressComponent showHeader={true} />
                </TabsContent>

                {/* Status Tab */}
                <TabsContent value="status" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Service Status</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                    <strong>Polling Status:</strong>
                                    <Badge className="ml-2" variant={serviceStatus.isPolling ? "default" : "secondary"}>
                                        {serviceStatus.isPolling ? 'Active' : 'Inactive'}
                                    </Badge>
                                </div>
                                <div>
                                    <strong>User ID:</strong> {serviceStatus.currentUserId}
                                </div>
                                <div>
                                    <strong>Poll Interval:</strong> {serviceStatus.pollInterval / 1000}s
                                </div>
                                <div>
                                    <strong>Document Visible:</strong> {serviceStatus.isDocumentVisible ? 'Yes' : 'No'}
                                </div>
                                <div>
                                    <strong>Subscribers:</strong> {serviceStatus.subscriberCount}
                                </div>
                                <div>
                                    <strong>Loading:</strong> {isLoading ? 'Yes' : 'No'}
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>How It Works</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2 text-sm">
                            <p>• <strong>Real-time Updates:</strong> Wallet balance is checked every 5 seconds automatically</p>
                            <p>• <strong>Transaction Triggers:</strong> After deposits/bets, balance is updated immediately</p>
                            <p>• <strong>Auto-sync Backend:</strong> Balance is always accurate due to backend auto-sync</p>
                            <p>• <strong>Smart Polling:</strong> Pauses when tab is inactive to save resources</p>
                            <p>• <strong>Error Handling:</strong> Graceful fallbacks and retry mechanisms</p>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
};

export default RealTimeWalletDemoPage;
