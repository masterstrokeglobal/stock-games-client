"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import CreateBonusCampaign from '@/components/admin/bonus/create-bonus-campaign';
import { ArrowLeft, Plus } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

const CreateCampaignPage: React.FC = () => {
    return (
        <div className="container mx-auto p-6 space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    {/* <Link href="/dashboard/bonus">
                        <Button variant="outline" size="sm">
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Back to Bonus Overview
                        </Button>
                    </Link> */}
                    {/* <div>
                        <h1 className="text-3xl font-bold tracking-tight">Create Bonus Campaign</h1>
                        <p className="text-muted-foreground">
                            Create a new bonus campaign with advanced trigger events and configurations
                        </p>
                    </div> */}
                </div>
            </div>

            {/* Breadcrumb */}
            {/* <nav className="flex" aria-label="Breadcrumb">
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
                    <li className="text-gray-900">Create Campaign</li>
                </ol>
            </nav> */}

            {/* Main Content */}
            <Card>
             
              
                    <CreateBonusCampaign />
            </Card>
        </div>
    );
};

export default CreateCampaignPage;
