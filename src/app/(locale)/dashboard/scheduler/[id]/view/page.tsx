"use client";

import React from "react";
import { useGetSchedulerById } from "@/react-query/scheduler-queries";
import { useParams, useRouter } from "next/navigation";
import LoadingScreen from "@/components/common/loading-screen";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft } from "lucide-react";
import dayjs from "dayjs";

const ViewSchedulerPage = () => {
    const params = useParams();
    const { id } = params;
    const { data, isLoading, isSuccess } = useGetSchedulerById(id.toString());
    const router = useRouter();

    if (isLoading) return <LoadingScreen>Loading scheduler details...</LoadingScreen>;

    if (!isSuccess || !data?.data) {
        return <p className="text-center text-red-500">Scheduler not found</p>;
    }

    const scheduler = data.data;

    return (
        <section className="container mx-auto max-w-3xl py-10">
            <header className="mb-6 flex items-center space-x-4">
                <Button
                    variant="ghost"
                    onClick={() => router.push("/dashboard/scheduler")}
                >
                    <ArrowLeft className="mr-2 h-5 w-5" />
                    Back to List
                </Button>
                <h2 className="text-2xl font-semibold">Scheduler Details</h2>
            </header>

            <Card className="shadow-sm">
                <CardHeader>
                    <CardTitle className="text-xl font-bold">Scheduler Information</CardTitle>
                    <CardDescription className="text-gray-500">ID: {scheduler.id}</CardDescription>
                </CardHeader>

                <Separator />

                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                    <div>
                        <label className="block text-gray-600">Start Date</label>
                        <p>{dayjs(scheduler.startDate).format("DD-MM-YYYY")}</p>
                    </div>
                    <div>
                        <label className="block text-gray-600">End Date</label>
                        <p>{dayjs(scheduler.endDate).format("DD-MM-YYYY")}</p>
                    </div>
                    <div>
                        <label className="block text-gray-600">Start Time</label>
                        <p>{dayjs(`1970-01-01T${scheduler.startTime}`).format("hh:mm A")}</p>
                    </div>
                    <div>
                        <label className="block text-gray-600">End Time</label>
                        <p>{dayjs(`1970-01-01T${scheduler.endTime}`).format("hh:mm A")}</p>
                    </div>
                    <div>
                        <label className="block text-gray-600">Type</label>
                        <Badge variant="outline">{scheduler.type}</Badge>
                    </div>
                    <div>
                        <label className="block text-gray-600">Company ID</label>
                        <p>{scheduler.companyId ?? "N/A"}</p>
                    </div>
                    <div>
                        <label className="block text-gray-600">Created At</label>
                        <p>{dayjs(scheduler.createdAt).format("DD-MM-YYYY hh:mm A")}</p>
                    </div>
                    <div>
                        <label className="block text-gray-600">Updated At</label>
                        <p>{dayjs(scheduler.updatedAt).format("DD-MM-YYYY hh:mm A")}</p>
                    </div>
                </CardContent>
            </Card>
        </section>
    );
};

export default ViewSchedulerPage;
