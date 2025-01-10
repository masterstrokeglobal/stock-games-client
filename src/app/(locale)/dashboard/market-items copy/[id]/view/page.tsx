"use client";

import React from "react";
import { useParams } from "next/navigation";
import { useGetMarketItemById } from "@/react-query/market-item-queries";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import LoadingScreen from "@/components/common/loading-screen";
import { SchedulerType } from "@/models/market-item";
import Link from "next/link";

const ViewMarketItemPage = () => {
    const params = useParams();
    const { id } = params;
    const { data, isLoading } = useGetMarketItemById(id.toString());

    if (isLoading) {
        return <LoadingScreen>Loading market item...</LoadingScreen>;
    }

    const marketItem = data?.data;

    if (!marketItem) {
        return <div className="container-main min-h-[60vh] max-w-xl">Market item not found.</div>;
    }

    return (
        <section className="container-main min-h-[60vh] max-w-xl mx-auto mt-8">
            <header className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-semibold">Market Item Details</h2>
                <Link href="/dashboard/market-items">
                    <Button variant="outline">
                        Back to List
                    </Button>
                </Link>
            </header>

            {/* Market Item Card */}
            <Card className="shadow-md">
                <CardHeader>
                    <CardTitle>{marketItem.name}</CardTitle>
                    <CardDescription>
                        {marketItem.type === SchedulerType.NSE ? "NSE" : "Crypto"}
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                        <span>Status:</span>
                        <Badge variant={marketItem.active ? "success" : "destructive"}>
                            {marketItem.active ? "Active" : "Inactive"}
                        </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                        <span>Code:</span>
                        <span>{marketItem.code}</span>
                    </div>
                    <div className="flex items-center justify-between">
                        <span>Odds Multiplier:</span>
                        <span>{marketItem.oddsMultiplier}</span>
                    </div>
                    <div className="flex items-center justify-between">
                        <span>Created At:</span>
                        <span>{new Date(marketItem.createdAt).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center justify-between">
                        <span>Updated At:</span>
                        <span>{new Date(marketItem.updatedAt).toLocaleDateString()}</span>
                    </div>
                </CardContent>
            </Card>
        </section>
    );
};

export default ViewMarketItemPage;
