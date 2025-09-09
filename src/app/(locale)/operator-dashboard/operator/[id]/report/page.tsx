"use client";

import { useGetOperatorIndividualReport } from "@/react-query/operator-queries";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import ReportTable from "@/components/features/report/report-table";
import dayjs from "dayjs";

export default function OperatorReportPage() {
    const params = useParams();
    const childId = parseInt(params.id as string);

    // Set default dates to today
    const todayStr = dayjs().format('YYYY-MM-DD');

    const [startDate, setStartDate] = useState<string>(todayStr);
    const [endDate, setEndDate] = useState<string>(todayStr);
    const [dateError, setDateError] = useState<string>("");

    // Handle start date change with validation
    const handleStartDateChange = (value: string) => {
        setStartDate(value);
        
        // Check if start date is after end date
        if (dayjs(value).isAfter(dayjs(endDate))) {
            setDateError("Start date cannot be later than end date");
        } else {
            setDateError("");
        }
    };

    // Handle end date change with validation
    const handleEndDateChange = (value: string) => {
        setEndDate(value);
        
        // Check if end date is before start date
        if (dayjs(value).isBefore(dayjs(startDate))) {
            setDateError("End date cannot be earlier than start date");
        } else {
            setDateError("");
        }
    };

    // Prepare filter object with start and end of day
    const filter = {
        childId,
        startDate: dayjs(startDate).startOf('day').toDate(),
        endDate: dayjs(endDate).endOf('day').toDate()
    };

    // Only fetch data if there's no date validation error
    const shouldFetchData = !dateError;
    const { data, isLoading, error } = useGetOperatorIndividualReport(
        shouldFetchData ? filter : undefined
    );

    useEffect(() => {
        console.log("Report filter parameters:", filter);
    }, [filter]);

    useEffect(() => {
        if (data) {
            console.log("Operator Individual Report Response:", data);
        }
    }, [data]);

    useEffect(() => {
        if (error) {
            console.error("Report fetch error:", error);
        }
    }, [error]);

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-6">Operator Report</h1>

            {/* Filters */}
            <div className="mb-6 bg-white p-4 rounded-lg shadow">
                <h2 className="text-lg font-semibold mb-4">Filters</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Start Date
                        </label>
                        <input
                            type="date"
                            value={startDate}
                            onChange={(e) => handleStartDateChange(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            End Date
                        </label>
                        <input
                            type="date"
                            value={endDate}
                            onChange={(e) => handleEndDateChange(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>
                </div>
                
                {/* Date Validation Error */}
                {dateError && (
                    <div className="mt-4 bg-red-50 border border-red-200 rounded-lg p-3">
                        <p className="text-red-600 text-sm font-medium">{dateError}</p>
                    </div>
                )}
            </div>

            {/* Error Display */}
            {error && (
                <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
                    <p className="text-red-600">Error loading report: {error.message}</p>
                </div>
            )}

            {/* Report Table */}
            <ReportTable 
                data={data || []} 
                isLoading={isLoading}
            />
        </div>
    );
}