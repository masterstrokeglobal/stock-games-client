"use client";

import { useState } from "react";
import ExternalUserTransactionsTable from "@/components/features/external-user-analytics/external-user-transactions-table";
import CompanyProfitLossTable from "@/components/features/external-user-analytics/company-profit-loss-table";
import DateRangePicker from "@/components/features/external-user-analytics/date-range-picker";
import dayjs from "dayjs";

export default function ExternalUserAnalyticsPage() {
  const [dateRange, setDateRange] = useState({
    startDate: dayjs().subtract(30, 'days').format('YYYY-MM-DD'),
    endDate: dayjs().format('YYYY-MM-DD'),
  });

  return (
    <div className="container-main min-h-[60vh] my-12">
      <div className="flex flex-col gap-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">External User Analytics</h1>
            <p className="text-muted-foreground">
              View external user transactions and profit/loss analysis
            </p>
          </div>
          <DateRangePicker
            startDate={dateRange.startDate}
            endDate={dateRange.endDate}
            onDateChange={setDateRange}
          />
        </div>

        {/* External User Profit/Loss Section */}
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight">External User Profit/Loss</h2>
            <p className="text-muted-foreground">
              Company-wise profit/loss analysis from external user transactions
            </p>
          </div>
          
          <CompanyProfitLossTable
            startDate={dateRange.startDate}
            endDate={dateRange.endDate}
          />
        </div>

        {/* External User Transactions Section */}
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight">External User Transactions</h2>
            <p className="text-muted-foreground">
              View and manage individual transactions from external users
            </p>
          </div>
          
          <ExternalUserTransactionsTable
            startDate={dateRange.startDate}
            endDate={dateRange.endDate}
          />
        </div>
      </div>
    </div>
  );
}
