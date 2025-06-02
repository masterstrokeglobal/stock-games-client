"use client";

import { useFinancialReport } from "@/react-query/company-queries";
import dayjs from "dayjs";
import { useState } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";

interface DateRange {
  startDate: string;
  endDate: string;
  selectedMonth: string;
}

interface TopUser {
  userId: number;
  email: string;
  username: string;
  firstName: string;
  lastName: string;
  phone: string;
  totalAmount: number;
}

interface DailyData {
  date: string;
  signUps: number;
  ftdCount: number;
  totalDepositAmount: number;
  totalWithdrawalAmount: number;
  totalBetsAmount: number;
  net: number;
  totalCasinoBetsAmount: number;
  totalStockBetsAmount: number;
}

interface FinancialReportData {
  topReport: {
    topDepositors: TopUser[];
    topWithdrawers: TopUser[];
    topBetters: TopUser[];
  };
  financialReport: {
    totalDepositor: number;
    totalDepositAmount: number;
    totalWithdrawers: number;
    totalWithdrawalAmount: number;
    totalBets: number;
    totalBonusAmount: number;
    totalCasinoBets: number;
    totalStockBets: number;
    ftdUsers: number;
    ftdAmount: number;
    refilledUsers: number;
    refilledAmount: number;
    net: number;
    signUps: number;
    dailyData: DailyData[];
  };
}

const COLORS = {
  signups: "#8884d8",
  ftd: "#82ca9d",
  deposit: "#0088FE",
  withdrawal: "#FF8042",
  net: "#00C49F",
  bets: "#FFBB28",
  ggr: "#FF5733",
  casino: "#00C49F",
  stock: "#00C49F"
};

const formatRupees = (amount: number) => {
  return `₹${amount.toLocaleString('en-IN')}`;
};

const ReportsPage = () => {
  const [dateRange, setDateRange] = useState<DateRange>({
    startDate: dayjs().startOf('month').format('YYYY-MM-DD'),
    endDate: dayjs().endOf('month').format('YYYY-MM-DD'),
    selectedMonth: dayjs().format('YYYY-MM')
  });

  const { data, isLoading, error } = useFinancialReport(dateRange);
  const financialData: FinancialReportData | undefined = data;

  const handleDateChange = (field: keyof DateRange, value: string) => {
    if (field === 'selectedMonth') {
      const startDate = dayjs(value).startOf('month').format('YYYY-MM-DD');
      const endDate = dayjs(value).endOf('month').format('YYYY-MM-DD');
      setDateRange(prev => ({
        ...prev,
        startDate,
        endDate,
        selectedMonth: value
      }));
    } else {
      setDateRange(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  if (isLoading) return <div className="flex items-center justify-center h-screen">Loading financial data...</div>;
  if (error) return <div className="text-red-500">Error loading financial data</div>;
  if (!financialData) return <div>No data available</div>;

  const { topReport, financialReport } = financialData;

  // Filter daily data for selected month
  const selectedMonthData = financialReport.dailyData.filter(day =>
    dayjs(day.date).format('YYYY-MM') === dateRange.selectedMonth
  );

  // Format daily data for charts
  const dailyDataFormatted = selectedMonthData.map(item => ({
    name: dayjs(item.date).format('DD/MM'),
    signUps: item.signUps,
    deposits: item.totalDepositAmount,
    withdrawals: item.totalWithdrawalAmount,
    bets: item.totalBetsAmount,
    net: item.net,
    ftd: item.ftdCount,
    casino: item.totalCasinoBetsAmount,
    stock: item.totalStockBetsAmount
  }));

  return (
    <div className="p-4 bg-gray-50 min-h-screen">
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-4">Financial Dashboard</h1>

        {/* Date Filter */}
        <div className="flex flex-wrap gap-4 mb-6 p-4 bg-white rounded-lg shadow">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Select Month</label>
            <input
              type="month"
              value={dateRange.selectedMonth}
              onChange={(e) => handleDateChange('selectedMonth', e.target.value)}
              className="border rounded p-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
            <input
              type="date"
              value={dateRange.startDate}
              onChange={(e) => handleDateChange('startDate', e.target.value)}
              className="border rounded p-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
            <input
              type="date"
              value={dateRange.endDate}
              onChange={(e) => handleDateChange('endDate', e.target.value)}
              className="border rounded p-2"
            />
          </div>
        </div>
      </div>

      {/* Key Metrics Cards - First Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-gray-500 text-sm">Total Deposits</h2>
          <p className="text-2xl font-bold">{formatRupees(financialReport.totalDepositAmount)}</p>
          <p className="text-sm text-gray-600">From {financialReport.totalDepositor} users</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-gray-500 text-sm">Total Withdrawals</h2>
          <p className="text-2xl font-bold">{formatRupees(financialReport.totalWithdrawalAmount)}</p>
          <p className="text-sm text-gray-600">From {financialReport.totalWithdrawers} users</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-gray-500 text-sm">Net Revenue</h2>
          <p className="text-2xl font-bold">{formatRupees(financialReport.net)}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-gray-500 text-sm">Total Bets</h2>
          <p className="text-2xl font-bold">{formatRupees(financialReport.totalBets)}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-gray-500 text-sm">Total Casino Bets</h2>
          <p className="text-2xl font-bold">{formatRupees(financialReport.totalCasinoBets)}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-gray-500 text-sm">Total Stock Bets</h2>
          <p className="text-2xl font-bold">{formatRupees(financialReport.totalStockBets)}</p>
        </div>
      </div>

      {/* Key Metrics Cards - Second Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-gray-500 text-sm">Sign Ups</h2>
          <p className="text-2xl font-bold">{financialReport.signUps}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-gray-500 text-sm">FTD Users</h2>
          <p className="text-2xl font-bold">{financialReport.ftdUsers}</p>
          <p className="text-sm text-gray-600">Total: {formatRupees(financialReport.ftdAmount)}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-gray-500 text-sm">Refilled Users</h2>
          <p className="text-2xl font-bold">{financialReport.refilledUsers}</p>
          <p className="text-sm text-gray-600">Total: {formatRupees(financialReport.refilledAmount)}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-gray-500 text-sm">Bonus Amount</h2>
          <p className="text-2xl font-bold">{formatRupees(financialReport.totalBonusAmount)}</p>
        </div>
      </div>



      {/* Daily Charts Section */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Daily Performance Metrics</h2>

        {/* Daily Sign Ups Chart */}
        <div className="bg-white p-4 rounded-lg shadow mb-6">
          <h3 className="text-lg font-semibold mb-4">Daily Sign Ups</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={dailyDataFormatted}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="signUps"
                  name="Sign Ups"
                  stroke={COLORS.signups}
                  fill={COLORS.signups}
                  fillOpacity={0.3}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Daily FTD Chart */}
        <div className="bg-white p-4 rounded-lg shadow mb-6">
          <h3 className="text-lg font-semibold mb-4">Daily First Time Deposits</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={dailyDataFormatted}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="ftd"
                  name="FTD Count"
                  stroke={COLORS.ftd}
                  fill={COLORS.ftd}
                  fillOpacity={0.3}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Daily Total Deposit Chart */}
        <div className="bg-white p-4 rounded-lg shadow mb-6">
          <h3 className="text-lg font-semibold mb-4">Daily Total Deposits</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={dailyDataFormatted}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip formatter={(value) => formatRupees(Number(value))} />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="deposits"
                  name="Deposits"
                  stroke={COLORS.deposit}
                  fill={COLORS.deposit}
                  fillOpacity={0.3}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Daily Total Withdrawal Chart */}
        <div className="bg-white p-4 rounded-lg shadow mb-6">
          <h3 className="text-lg font-semibold mb-4">Daily Total Withdrawals</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={dailyDataFormatted}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip formatter={(value) => formatRupees(Number(value))} />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="withdrawals"
                  name="Withdrawals"
                  stroke={COLORS.withdrawal}
                  fill={COLORS.withdrawal}
                  fillOpacity={0.3}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Daily Net (D-W) Chart */}
        <div className="bg-white p-4 rounded-lg shadow mb-6">
          <h3 className="text-lg font-semibold mb-4">Daily Net (Deposits - Withdrawals)</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={dailyDataFormatted}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip formatter={(value) => formatRupees(Number(value))} />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="net"
                  name="Net"
                  stroke={COLORS.net}
                  fill={COLORS.net}
                  fillOpacity={0.3}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Daily Bets Chart */}
        <div className="bg-white p-4 rounded-lg shadow mb-6">
          <h3 className="text-lg font-semibold mb-4">Daily Bets</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={dailyDataFormatted}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip formatter={(value) => formatRupees(Number(value))} />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="bets"
                  name="Bets"
                  stroke={COLORS.bets}
                  fill={COLORS.bets}
                  fillOpacity={0.3}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Daily Casino Bets Chart */}
        <div className="bg-white p-4 rounded-lg shadow mb-6">
          <h3 className="text-lg font-semibold mb-4">Daily Casino Bets</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={dailyDataFormatted}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip formatter={(value) => formatRupees(Number(value))} />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="casino"
                  name="Casino Bets"
                  stroke={COLORS.casino}
                  fill={COLORS.casino}
                  fillOpacity={0.3}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>


        {/* Daily Stock Bets Chart */}
        <div className="bg-white p-4 rounded-lg shadow mb-6">
          <h3 className="text-lg font-semibold mb-4">Daily Stock Bets</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={dailyDataFormatted}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip formatter={(value) => formatRupees(Number(value))} />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="stock"
                  name="Stock Bets"
                  stroke={COLORS.stock}
                  fill={COLORS.stock}
                  fillOpacity={0.3}
                />  
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* Daily Activity Chart */}
      <div className="bg-white p-4 rounded-lg shadow mb-8">
        <h2 className="text-lg font-semibold mb-4">Daily Activity Overview</h2>
        <div className="h-96">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={dailyDataFormatted}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip formatter={(value) => formatRupees(Number(value))} />
              <Legend />
              <Bar dataKey="bets" name="Bets" fill={COLORS.bets} />
              <Bar dataKey="deposits" name="Deposits" fill={COLORS.deposit} />
              <Bar dataKey="signUps" name="Sign Ups" fill={COLORS.signups} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Top Users Tables */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Top  Users</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Top Depositors */}
          <div className="bg-white p-4 rounded-lg shadow">
            <h2 className="text-lg font-semibold mb-4">Top 10 Depositors</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {topReport.topDepositors.length > 0 ? (
                    topReport.topDepositors.map((user) => (
                      <tr key={user.userId}>
                        <td className="px-4 py-2 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{user.firstName} {user.lastName}</div>
                          <div className="text-sm text-gray-500">{user.email}</div>
                          <div className="text-sm text-gray-500">{user.phone}</div>
                        </td>
                        <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">{formatRupees(user.totalAmount)}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={2} className="px-4 py-2 text-center text-sm text-gray-500">No data available</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Top Withdrawers */}
          <div className="bg-white p-4 rounded-lg shadow">
            <h2 className="text-lg font-semibold mb-4">Top 10 Withdrawers</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {topReport.topWithdrawers.length > 0 ? (
                    topReport.topWithdrawers.map((user) => (
                      <tr key={user.userId}>
                        <td className="px-4 py-2 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{user.firstName} {user.lastName}</div>
                          <div className="text-sm text-gray-500">{user.email}</div>
                          <div className="text-sm text-gray-500">{user.phone}</div>
                        </td>
                        <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">{formatRupees(user.totalAmount)}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={2} className="px-4 py-2 text-center text-sm text-gray-500">No data available</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Top Betters */}
          <div className="bg-white p-4 rounded-lg shadow">
            <h2 className="text-lg font-semibold mb-4">Top 10 Betters</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {topReport.topBetters.length > 0 ? (
                    topReport.topBetters.map((user) => (
                      <tr key={user.userId}>
                        <td className="px-4 py-2 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{user.firstName} {user.lastName}</div>
                          <div className="text-sm text-gray-500">{user.email}</div>
                          <div className="text-sm text-gray-500">{user.phone}</div>
                        </td>
                        <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">{formatRupees(user.totalAmount)}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={2} className="px-4 py-2 text-center text-sm text-gray-500">No data available</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportsPage;