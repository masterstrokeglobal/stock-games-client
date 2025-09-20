"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { mockExternalUserTransactions } from "@/components/features/external-user-analytics/mock-data";
import ApiConnectionTest from "@/components/features/external-user-analytics/api-connection-test";
import { INR } from "@/lib/utils";
import { BarChart3 } from "lucide-react";
import dayjs from "dayjs";

export default function ExternalUserTransactionsTestPage() {
  const getStatusBadge = (status: string) => {
    const statusConfig = {
      'COMPLETED': { variant: 'default' as const, color: 'bg-green-100 text-green-800' },
      'PENDING': { variant: 'secondary' as const, color: 'bg-yellow-100 text-yellow-800' },
      'FAILED': { variant: 'destructive' as const, color: 'bg-red-100 text-red-800' },
      'CANCELLED': { variant: 'outline' as const, color: 'bg-gray-100 text-gray-800' },
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.PENDING;
    
    return (
      <Badge variant={config.variant} className={config.color}>
        {status}
      </Badge>
    );
  };

  const getTypeBadge = (type: string) => {
    const typeConfig = {
      'BET': { variant: 'default' as const, color: 'bg-blue-100 text-blue-800' },
      'WIN': { variant: 'default' as const, color: 'bg-green-100 text-green-800' },
      'DEPOSIT': { variant: 'secondary' as const, color: 'bg-purple-100 text-purple-800' },
      'WITHDRAWAL': { variant: 'outline' as const, color: 'bg-orange-100 text-orange-800' },
    };
    
    const config = typeConfig[type as keyof typeof typeConfig] || typeConfig.BET;
    
    return (
      <Badge variant={config.variant} className={config.color}>
        {type}
      </Badge>
    );
  };

  return (
    <div className="container-main min-h-[60vh] my-12">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">External User Transactions - Test Page</h1>
          <p className="text-muted-foreground">
            This page shows the mock transaction data that will be used when the backend APIs are not available.
          </p>
        </div>

        {/* API Connection Test */}
        <ApiConnectionTest />

        {/* Transaction Summary */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Transactions</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mockExternalUserTransactions.length}</div>
              <p className="text-xs text-muted-foreground">
                External user transactions
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Amount</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {INR(mockExternalUserTransactions.reduce((sum, tx) => sum + tx.amount, 0))}
              </div>
              <p className="text-xs text-muted-foreground">
                Across all transactions
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completed</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {mockExternalUserTransactions.filter(tx => tx.status === 'COMPLETED').length}
              </div>
              <p className="text-xs text-muted-foreground">
                Successful transactions
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Unique Users</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {new Set(mockExternalUserTransactions.map(tx => tx.externalUser.id)).size}
              </div>
              <p className="text-xs text-muted-foreground">
                External users
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Transactions Table */}
        <Card>
          <CardHeader>
            <CardTitle>External User Transactions (Mock Data)</CardTitle>
            <CardDescription>Sample transaction data for testing</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockExternalUserTransactions.map((transaction) => (
                <div key={transaction.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className="w-8 h-8 bg-blue-100 text-blue-800 rounded-full flex items-center justify-center font-bold">
                      {transaction.id}
                    </div>
                    <div>
                      <div className="font-medium">{transaction.externalUser.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {transaction.externalUser.externalId} • {transaction.externalUser.company}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold">{INR(transaction.amount)}</div>
                    <div className="text-sm text-muted-foreground">
                      {dayjs(transaction.createdAt).format('DD MMM YYYY, hh:mm A')}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {getTypeBadge(transaction.type)}
                    {getStatusBadge(transaction.status)}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>API Status</CardTitle>
            <CardDescription>Current status of the external user transactions API</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">External User Transactions API</span>
                <span className="text-sm text-red-600">Not Available</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Mock Data</span>
                <span className="text-sm text-green-600">Active</span>
              </div>
              <div className="text-xs text-muted-foreground mt-4">
                The dashboard is currently using mock data. Once the backend API is implemented, 
                the component will automatically switch to using real data from the server.
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
