"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import BonusProgressComponent from '@/components/features/bonus/bonus-progress';
import { ArrowLeft, Search, TrendingUp, Users } from 'lucide-react';
import Link from 'next/link';
import { useGetUserWagerProgress } from '@/react-query/enhanced-bonus-queries';

const UserProgressPage: React.FC = () => {
    const [searchUserId, setSearchUserId] = useState('');
    const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

    const { data: userProgress, isLoading, error } = useGetUserWagerProgress(
        selectedUserId || '',
        !!selectedUserId
    );

    const handleSearch = () => {
        if (searchUserId.trim()) {
            setSelectedUserId(searchUserId.trim());
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

    return (
        <div className="container mx-auto p-6 space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link href="/dashboard/bonus">
                        <Button variant="outline" size="sm">
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Back to Overview
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">User Bonus Progress</h1>
                        <p className="text-muted-foreground">
                            Track and monitor individual user bonus progress and completion status
                        </p>
                    </div>
                </div>
            </div>

            {/* Breadcrumb */}
            <nav className="flex" aria-label="Breadcrumb">
                <ol className="inline-flex items-center space-x-1 md:space-x-3">
                    <li>
                        <Link href="/dashboard" className="text-gray-500 hover:text-gray-700">
                            Dashboard
                        </Link>
                    </li>
                    <li>
                        <span className="text-gray-400">/</span>
                    </li>
                    <li>
                        <Link href="/dashboard/bonus" className="text-gray-500 hover:text-gray-700">
                            Bonus Management
                        </Link>
                    </li>
                    <li>
                        <span className="text-gray-400">/</span>
                    </li>
                    <li className="text-gray-900">User Progress</li>
                </ol>
            </nav>

            {/* User Search */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Search className="w-5 h-5 text-blue-500" />
                        Search User
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex gap-4 items-end">
                        <div className="flex-1">
                            <label className="text-sm font-medium">User ID</label>
                            <Input
                                type="text"
                                placeholder="Enter user ID to view their bonus progress"
                                value={searchUserId}
                                onChange={(e) => setSearchUserId(e.target.value)}
                                onKeyPress={handleKeyPress}
                                className="mt-1"
                            />
                        </div>
                        <Button onClick={handleSearch} disabled={!searchUserId.trim()}>
                            <Search className="w-4 h-4 mr-2" />
                            Search
                        </Button>
                    </div>
                    
                    {selectedUserId && (
                        <div className="mt-4 flex items-center gap-2">
                            <Badge variant="secondary">
                                <Users className="w-3 h-3 mr-1" />
                                Viewing User: {selectedUserId}
                            </Badge>
                            <Button 
                                variant="outline" 
                                size="sm" 
                                onClick={() => {
                                    setSelectedUserId(null);
                                    setSearchUserId('');
                                }}
                            >
                                Clear
                            </Button>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* User Progress Display */}
            {selectedUserId && (
                <div className="space-y-6">
                    {isLoading && (
                        <Card>
                            <CardContent className="flex items-center justify-center py-8">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                                <span className="ml-2">Loading user progress...</span>
                            </CardContent>
                        </Card>
                    )}

                    {error && (
                        <Card>
                            <CardContent className="flex items-center justify-center py-8">
                                <div className="text-center">
                                    <p className="text-red-500 mb-2">Failed to load user progress</p>
                                    <p className="text-sm text-gray-500">
                                        Please check if the user ID is correct or try again later
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {!isLoading && !error && userProgress && (
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <TrendingUp className="w-5 h-5 text-green-500" />
                                    Bonus Progress for User {selectedUserId}
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <BonusProgressComponent 
                                    showHeader={false}
                                    className="mt-4"
                                />
                            </CardContent>
                        </Card>
                    )}
                </div>
            )}

            {/* Instructions */}
            {!selectedUserId && (
                <Card>
                    <CardContent className="py-8">
                        <div className="text-center text-gray-500">
                            <Users className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                            <h3 className="text-lg font-medium mb-2">Search for a User</h3>
                            <p className="text-sm">
                                Enter a user ID in the search box above to view their detailed bonus progress,
                                active bonuses, completion status, and real-time tracking information.
                            </p>
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
};

export default UserProgressPage;
