"use client";

import LoadingScreen from "@/components/common/loading-screen";
import { Separator } from "@/components/ui/separator";
import UserCard from "@/components/features/user/user-card";
import { userIpLogsColumns } from "@/columns/user-ip-logs-columns";
import { useGetUserById, useGetUserIpLogs } from "@/react-query/user-queries";
import { useParams } from "next/navigation";
import { useMemo, useState } from "react";
import User from "@/models/user";
import DataTable from "@/components/ui/data-table-server";
import { Button } from "@/components/ui/button";

const UserIpLogsPage = () => {
    const params = useParams();
    const { id } = params;

    // Get first and last day of current month
    const today = new Date();
    const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
    const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0);

    const [filters, setFilters] = useState({
        page: 1,
        startDate: firstDay,
        endDate: lastDay
    });

    const { data: userData, isLoading: isUserLoading } = useGetUserById(id.toString());
    const { data: ipLogsData, isLoading: isIpLogsLoading } = useGetUserIpLogs({
        userId: id.toString(),
        page: filters.page,
        limit: 10,
        startDate: filters.startDate,
        endDate: filters.endDate
    });

    const userDetails = useMemo(() => {
        if (userData?.data) {
            return new User(userData.data);
        }
        return null;
    }, [userData]);

    const handlePageChange = (newPage: number) => {
        setFilters(prev => ({ ...prev, page: newPage }));
    };

    const handleFilter = () => {
        setFilters(prev => ({ ...prev, page: 1 })); // Reset to first page when applying filters
    };

    const handleClearFilter = () => {
        setFilters({
            page: 1,
            startDate: firstDay,
            endDate: lastDay
        });
    };

    if (isUserLoading || isIpLogsLoading) {
        return <LoadingScreen className="h-[60vh]">Loading...</LoadingScreen>;
    }

    return (
        <section className="container-main min-h-[60vh]">
            <header className="flex flex-col md:flex-row gap-4 flex-wrap md:items-center justify-between">
                <h2 className="text-xl font-semibold">User IP Logs</h2>
                <div className="flex gap-4 items-center">
                    <input
                        type="date"
                        value={filters.startDate.toISOString().split('T')[0]}
                        onChange={(e) => setFilters(prev => ({ ...prev, startDate: new Date(e.target.value) }))}
                        className="border rounded px-2 py-1"
                    />
                    <input
                        type="date"
                        value={filters.endDate.toISOString().split('T')[0]}
                        onChange={(e) => setFilters(prev => ({ ...prev, endDate: new Date(e.target.value) }))}
                        className="border rounded px-2 py-1"
                    />
                    <Button onClick={handleFilter}>Filter</Button>
                    <Button variant="outline" onClick={handleClearFilter}>Clear</Button>
                </div>
            </header>
            <Separator className="mt-4" />

            {userDetails && (
                <main className="mt-4">
                    <UserCard user={userDetails} />
                </main>
            )}

            <div className="mt-8">
                <DataTable
                    changePage={handlePageChange}
                    columns={userIpLogsColumns}
                    data={ipLogsData?.data || []}
                    totalPage={ipLogsData?.totalPage || 0}
                    page={filters.page}
                />
            </div>
        </section>
    );
}

export default UserIpLogsPage;


