"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useGetExternalUserTransactions } from "@/react-query/external-user-analytics-queries";
import { ExternalUserTransaction } from "@/lib/axios/external-user-analytics-API";
import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Search } from "lucide-react";
import { INR } from "@/lib/utils";
import dayjs from "dayjs";

interface ExternalUserTransactionsTableProps {
  startDate?: string;
  endDate?: string;
}

export default function ExternalUserTransactionsTable({ 
  startDate, 
  endDate 
}: ExternalUserTransactionsTableProps) {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [companyId, setCompanyId] = useState("");
  const [limit, setLimit] = useState(10);
  const [goToPage, setGoToPage] = useState("");

  const { data, isLoading, error } = useGetExternalUserTransactions({
    page,
    limit,
    search: search || undefined,
    companyId: companyId || undefined,
    startDate,
    endDate,
  });


  // Reset page when search or filters change
  useEffect(() => {
    setPage(1);
  }, [search, companyId, limit]);

  // Use API data only - no mock data fallback
  const apiData = data?.data;
  
  let transactions, pagination;
  
  if (apiData?.success && apiData?.data?.transactions) {
    // Use API data
    transactions = apiData.data.transactions;
    pagination = apiData.data.pagination;
  } else {
    // No data available - show empty state
    transactions = [];
    pagination = {
      page: 1,
      limit: limit,
      total: 0,
      pages: 0
    };
  }


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

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>External User Transactions</CardTitle>
          <CardDescription>Loading transactions...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-32">
            <div className="text-sm text-muted-foreground">Loading...</div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>External User Transactions</CardTitle>
          <CardDescription>
            Error loading transactions. Using mock data for demonstration.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-32">
            <div className="text-sm text-red-600">
              API Error: {error.message || 'Failed to load transactions'}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>External User Transactions</CardTitle>
          <CardDescription>
            View all transactions from external users
            {error ? (
              <span className="ml-2 text-red-600 text-sm">• API Error</span>
            ) : data?.data?.success && data?.data?.data?.transactions ? (
              <span className="ml-2 text-green-600 text-sm">• Live Data ({data.data.data.transactions.length} transactions)</span>
            ) : (
              <span className="ml-2 text-gray-600 text-sm">• No Data Available</span>
            )}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Search and Filters */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search by user name or external ID..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
            <Input
              placeholder="Company ID (optional)"
              value={companyId}
              onChange={(e) => setCompanyId(e.target.value)}
              className="w-full sm:w-48"
            />
            <Select
              value={limit.toString()}
              onValueChange={(value) => {
                setLimit(parseInt(value));
                setPage(1); // Reset to first page when changing limit
              }}
            >
              <SelectTrigger className="w-full sm:w-32">
                <SelectValue placeholder="Per page" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="5">5 per page</SelectItem>
                <SelectItem value="10">10 per page</SelectItem>
                <SelectItem value="25">25 per page</SelectItem>
                <SelectItem value="50">50 per page</SelectItem>
                <SelectItem value="100">100 per page</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Transactions Table */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">Transaction ID</TableHead>
                  <TableHead className="w-[200px]">External User</TableHead>
                  <TableHead className="w-[100px]">Amount</TableHead>
                  <TableHead className="w-[120px]">Type</TableHead>
                  <TableHead className="w-[120px]">Status</TableHead>
                  <TableHead className="w-[150px]">Created At</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactions && transactions.length > 0 ? transactions.map((transaction: ExternalUserTransaction) => (
                  <TableRow key={transaction.id}>
                    <TableCell className="font-medium">
                      #{transaction.id}
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{transaction.externalUser.name}</div>
                        <div className="text-sm text-muted-foreground">
                          ID: {transaction.externalUser.externalId}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {transaction.externalUser.company}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">
                      {INR(transaction.amount)}
                    </TableCell>
                    <TableCell>
                      {getTypeBadge(transaction.type)}
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(transaction.status)}
                    </TableCell>
                    <TableCell>
                      {dayjs(transaction.createdAt).format('DD MMM YYYY, hh:mm A')}
                    </TableCell>
                  </TableRow>
                )) : (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8">
                      <div className="text-muted-foreground">No transactions found</div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          {/* Enhanced Pagination */}
          {pagination && pagination.pages > 1 && (
            <div className="flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0 py-4 border-t">
              <div className="text-sm text-muted-foreground">
                Showing {((pagination.page - 1) * pagination.limit) + 1} to {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} transactions
              </div>
              
              <div className="flex items-center space-x-2">
                {/* First Page */}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage(1)}
                  disabled={page === 1}
                  className="hidden sm:flex"
                >
                  First
                </Button>
                
                {/* Previous Page */}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage(Math.max(1, page - 1))}
                  disabled={page === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                  Previous
                </Button>
                
                {/* Page Numbers */}
                <div className="flex items-center space-x-1">
                  {(() => {
                    const currentPage = pagination.page;
                    const totalPages = pagination.pages;
                    const pages = [];
                    
                    // Always show first page
                    if (currentPage > 3) {
                      pages.push(
                        <Button
                          key={1}
                          variant={1 === currentPage ? "default" : "outline"}
                          size="sm"
                          onClick={() => setPage(1)}
                          className="w-8 h-8 p-0"
                        >
                          1
                        </Button>
                      );
                      if (currentPage > 4) {
                        pages.push(
                          <span key="ellipsis1" className="px-2 text-muted-foreground">
                            ...
                          </span>
                        );
                      }
                    }
                    
                    // Show pages around current page
                    for (let i = Math.max(1, currentPage - 2); i <= Math.min(totalPages, currentPage + 2); i++) {
                      if (i !== 1 || currentPage <= 3) {
                        pages.push(
                          <Button
                            key={i}
                            variant={i === currentPage ? "default" : "outline"}
                            size="sm"
                            onClick={() => setPage(i)}
                            className="w-8 h-8 p-0"
                          >
                            {i}
                          </Button>
                        );
                      }
                    }
                    
                    // Always show last page
                    if (currentPage < totalPages - 2) {
                      if (currentPage < totalPages - 3) {
                        pages.push(
                          <span key="ellipsis2" className="px-2 text-muted-foreground">
                            ...
                          </span>
                        );
                      }
                      pages.push(
                        <Button
                          key={totalPages}
                          variant={totalPages === currentPage ? "default" : "outline"}
                          size="sm"
                          onClick={() => setPage(totalPages)}
                          className="w-8 h-8 p-0"
                        >
                          {totalPages}
                        </Button>
                      );
                    }
                    
                    return pages;
                  })()}
                </div>
                
                {/* Next Page */}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage(Math.min(pagination.pages, page + 1))}
                  disabled={page === pagination.pages}
                >
                  Next
                  <ChevronRight className="h-4 w-4" />
                </Button>
                
                {/* Last Page */}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage(pagination.pages)}
                  disabled={page === pagination.pages}
                  className="hidden sm:flex"
                >
                  Last
                </Button>
              </div>
              
              {/* Go to Page */}
              <div className="flex items-center space-x-2">
                <span className="text-sm text-muted-foreground">Go to:</span>
                <Input
                  type="number"
                  min="1"
                  max={pagination.pages}
                  value={goToPage}
                  onChange={(e) => setGoToPage(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      const pageNum = parseInt(goToPage);
                      if (pageNum >= 1 && pageNum <= pagination.pages) {
                        setPage(pageNum);
                        setGoToPage("");
                      }
                    }
                  }}
                  className="w-16 h-8 text-center"
                  placeholder="Page"
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const pageNum = parseInt(goToPage);
                    if (pageNum >= 1 && pageNum <= pagination.pages) {
                      setPage(pageNum);
                      setGoToPage("");
                    }
                  }}
                  disabled={!goToPage || parseInt(goToPage) < 1 || parseInt(goToPage) > pagination.pages}
                  className="h-8"
                >
                  Go
                </Button>
              </div>
              
              {/* Page Info */}
              <div className="text-sm text-muted-foreground sm:hidden">
                Page {page} of {pagination.pages}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

    </div>
  );
}
