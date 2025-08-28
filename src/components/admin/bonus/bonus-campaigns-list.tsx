"use client";

import bonusCampaignsColumns from '@/columns/bonus-campaigns-columns';
// import { Button } from '@/components/ui/button';
import DataTable from '@/components/ui/data-table-server';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from '@/components/ui/select';
import { useGetAllBonusCampaigns } from '@/react-query/enhanced-bonus-queries';
import {  Search } from 'lucide-react';
import Link from 'next/link';
import React, { useMemo, useState } from 'react';

const BonusCampaignsList: React.FC = () => {
    const [page, setPage] = useState(1);
    const [statusFilter, setStatusFilter] = useState('all');
    const [triggerFilter, setTriggerFilter] = useState('all');
    const [search, setSearch] = useState('');

    const { data: campaigns, isFetching } = useGetAllBonusCampaigns({
        status: statusFilter !== 'all' ? statusFilter : undefined,
        triggerEvent: triggerFilter !== 'all' ? triggerFilter : undefined,
        page: page,
        search: search
    });

    const bonusCampaigns = useMemo(() => {
        if (Array.isArray(campaigns?.data)) {
            return campaigns.data;
        } else if (Array.isArray(campaigns)) {
            return campaigns;
        } else if (campaigns?.data?.campaigns && Array.isArray(campaigns.data.campaigns)) {
            return campaigns.data.campaigns;
        } else if (campaigns?.campaigns && Array.isArray(campaigns.campaigns)) {
            return campaigns.campaigns;
        } else {
            return [];
        }
    }, [campaigns]);

    const totalPages = useMemo(() => {
        return Math.ceil((campaigns?.data?.count || bonusCampaigns.length) / 10) || 1;
    }, [campaigns, bonusCampaigns]);

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(e.target.value);
        setPage(1); // Reset to first page on search
    };

    const changePage = (newPage: number) => {
        setPage(newPage);
    };




    return (
        <section className="container-main min-h-[60vh] my-12">
            <header className="flex flex-col md:flex-row gap-4 flex-wrap md:items-center justify-between">
                <h2 className="text-xl font-semibold">Bonus Campaigns</h2>
                <div className="flex gap-5 flex-wrap">
                    <div className="relative min-w-60 flex-1">
                        <Search size={18} className="absolute top-2.5 left-2.5" />
                        <Input
                            placeholder="Search campaigns"
                            onChange={handleSearch}
                            className="pl-10"
                        />
                    </div>
                    <Link href="/dashboard/bonus/create">
                        {/* <Button>
                            <Plus
                                size={18}
                                className="mr-2 bg-white text-primary p-px rounded-full"
                            />
                            Create Campaign
                        </Button> */}
                    </Link>
                </div>
            </header>

            {/* Filters */}
            <div className="flex gap-4 mt-4">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Statuses</SelectItem>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
                        <SelectItem value="draft">Draft</SelectItem>
                        <SelectItem value="paused">Paused</SelectItem>
                    </SelectContent>
                </Select>

                <Select value={triggerFilter} onValueChange={setTriggerFilter}>
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Filter by trigger" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Triggers</SelectItem>
                        <SelectItem value="FIRST_DEPOSIT">First Deposit</SelectItem>
                        <SelectItem value="EVERY_DEPOSIT">Every Deposit</SelectItem>
                        {/* <SelectItem value="LOSS_BASED">Loss Based</SelectItem>
                        <SelectItem value="WAGER_BASED">Wager Based</SelectItem>
                        <SelectItem value="LOGIN_BASED">Login Based</SelectItem>
                        <SelectItem value="GAME_SPECIFIC">Game Specific</SelectItem>
                        <SelectItem value="TIME_LIMITED">Time Limited</SelectItem>
                        <SelectItem value="CUSTOM_EVENT">Custom Event</SelectItem> */}
                    </SelectContent>
                </Select>
            </div>

            <main className="mt-4">
                <DataTable
                    page={page}
                    loading={isFetching}
                    columns={bonusCampaignsColumns}
                    data={bonusCampaigns}
                    totalPage={totalPages}
                    changePage={changePage}
                />
            </main>
        </section>
    );
};

export default BonusCampaignsList;