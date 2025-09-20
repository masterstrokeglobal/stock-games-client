"use client";

import { Card, CardContent, CardDescription, CardHeader } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useGetAllCompaniesProfitLoss } from "@/react-query/company-profit-loss-queries";
import { CompanyProfitLoss } from "@/lib/axios/company-profit-loss-API";
import { INR } from "@/lib/utils";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

interface CompanyProfitLossTableProps {
  startDate?: string;
  endDate?: string;
}

export default function CompanyProfitLossTable({ 
  startDate, 
  endDate 
}: CompanyProfitLossTableProps) {
  const { data, isLoading, error } = useGetAllCompaniesProfitLoss({
    startDate,
    endDate,
  });

  const companies = data?.data?.data || [];

  const getProfitLossBadge = (netProfitLoss: number) => {
    if (netProfitLoss > 0) {
      return (
        <Badge variant="default" className="bg-green-100 text-green-800">
          <TrendingUp className="h-3 w-3 mr-1" />
          Profit
        </Badge>
      );
    } else if (netProfitLoss < 0) {
      return (
        <Badge variant="destructive" className="bg-red-100 text-red-800">
          <TrendingDown className="h-3 w-3 mr-1" />
          Loss
        </Badge>
      );
    } else {
      return (
        <Badge variant="secondary" className="bg-gray-100 text-gray-800">
          <Minus className="h-3 w-3 mr-1" />
          Break-even
        </Badge>
      );
    }
  };

  const getWinRateColor = (winRate: number) => {
    if (winRate >= 50) return "text-green-600";
    if (winRate >= 25) return "text-yellow-600";
    return "text-red-600";
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent>
          <div className="text-center py-8">
            <div className="text-muted-foreground">Loading company profit/loss data...</div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent>
          <div className="text-center py-8">
            <div className="text-red-600">Error loading company profit/loss data</div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardDescription>
          {companies.length > 0 && (
            <span className="text-green-600 text-sm">• Live Data ({companies.length} companies)</span>
          )}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">Company ID</TableHead>
                <TableHead className="w-[200px]">Company Name</TableHead>
                <TableHead className="w-[120px]">Total Bets</TableHead>
                <TableHead className="w-[120px]">Total Winnings</TableHead>
                <TableHead className="w-[120px]">Net P&L</TableHead>
                <TableHead className="w-[100px]">Bet Count</TableHead>
                <TableHead className="w-[100px]">Win Count</TableHead>
                <TableHead className="w-[100px]">Win Rate</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {companies.length > 0 ? companies.map((company: CompanyProfitLoss) => (
                <TableRow key={company.companyId}>
                  <TableCell className="font-medium">
                    #{company.companyId}
                  </TableCell>
                  <TableCell className="font-medium">
                    {company.companyName}
                  </TableCell>
                  <TableCell className="font-medium">
                    {INR(company.totalBets)}
                  </TableCell>
                  <TableCell className="font-medium">
                    {INR(company.totalWinnings)}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span className={`font-medium ${
                        company.netProfitLoss > 0 ? 'text-green-600' : 
                        company.netProfitLoss < 0 ? 'text-red-600' : 'text-gray-600'
                      }`}>
                        {INR(company.netProfitLoss)}
                      </span>
                      {getProfitLossBadge(company.netProfitLoss)}
                    </div>
                  </TableCell>
                  <TableCell>
                    {company.betCount}
                  </TableCell>
                  <TableCell>
                    {company.winCount}
                  </TableCell>
                  <TableCell>
                    <span className={`font-medium ${getWinRateColor(company.winRate)}`}>
                      {company.winRate.toFixed(1)}%
                    </span>
                  </TableCell>
                </TableRow>
              )) : (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8">
                    <div className="text-muted-foreground">No company data found</div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
