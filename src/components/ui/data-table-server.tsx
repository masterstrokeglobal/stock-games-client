"use client";
import {
  ColumnDef,
  PaginationState,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ReactNode, useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import ErrorBoundary from "@/components/ui/error-boundary";
import Pagination from "./pagination";
import { Skeleton } from "./skeleton";
import { ScrollArea, ScrollBar } from "./scroll-area";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  showOptions?: boolean;
  hideFilterButton?: boolean;
  hideColumnsInMobile?: boolean;
  totalPage: number;
  page?: number;
  loading?: boolean;
  showSearch?: boolean;
  changePage: (page: number) => void;
  showHeader?: boolean;
  children?: ReactNode;
  className?: string;
  rowClassName?: string;
  setSelectedRows?: (data: any) => void;
}

export default function DataTable<TData, TValue>({
  columns,
  totalPage,
  data,
  page = 0,
  rowClassName,
  className,
  showHeader = true,
  changePage,
  loading = false,
}: DataTableProps<TData, TValue>) {
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: page - 1,
    pageSize: 25,
  });

  useEffect(() => {
    changePage(pagination.pageIndex + 1);
  }, [pagination]);

  const table = useReactTable({
    data,
    columns,
    manualPagination: true,
    enableGlobalFilter: true,
    state: { pagination: pagination },
    pageCount: totalPage,
    onPaginationChange: setPagination,
    manualFiltering: true,
    getCoreRowModel: getCoreRowModel(),
  });


  return (
    <div>
      <div className={cn("dark:bg-dark-primary border rounded-xl  bg-white", className)}>
        <ScrollArea type="always" className="w-full">
          <Table>
            {showHeader && (
              <TableHeader className="px-4">
                {table?.getHeaderGroups().map((headerGroup) => (
                  <TableRow
                    key={headerGroup.id}                >
                    {headerGroup.headers.map((header) => (
                      <TableHead key={header.id} className="text-sm  text-gray-800 dark-border  border-b font-medium whitespace-nowrap" >
                        <span className="flex font-semibold">
                          {header.isPlaceholder
                            ? null
                            : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                        </span>
                      </TableHead>
                    ))}
                  </TableRow>
                ))}
              </TableHeader>
            )}
            <TableBody className="px-4">
              {!loading &&
                (table?.getRowModel().rows?.length ? (
                  table?.getRowModel().rows.map((row) => (
                    <TableRow
                      className={cn("h-14", rowClassName)}
                      key={row.id}
                      data-state={row.getIsSelected() && "selected"}
                    >
                      {row?.getVisibleCells().map((cell) => (
                        <ErrorBoundary key={cell.id}>
                          <TableCell>
                            {flexRender(
                              cell?.column.columnDef.cell,
                              cell.getContext()
                            )}
                          </TableCell>
                        </ErrorBoundary>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={columns.length}
                      className="h-24 text-center"
                    >
                      No results.
                    </TableCell>
                  </TableRow>
                ))}

              {loading && (
                <>
                  {Array(10)
                    .fill(0)
                    .map((_, i) => (
                      <TableRow key={i} className=" p-1">
                        {columns.map((column, j) => (
                          <TableCell key={j}>
                            <Skeleton className="h-6 w-full" />
                          </TableCell>
                        ))}
                      </TableRow>
                    ))}
                </>
              )}
            </TableBody>
          </Table>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
        <div className="flex md:items-center flex-wrap border-t py-2 px-4 bg-white w-full justify-between">
          <div className="py-1 min-h-[60px]   md:px-4 items-center flex flex-row w-fit  justify-between gap-2">
            <p className="text-[#6B7280]">Showing</p>
            <div className="flex flex-col items-center gap-3">
              {page}-{totalPage}
            </div>
            <div>
              <span className="text-[#6B7280]">of</span>
              &nbsp; {totalPage}
            </div>
          </div>
          <Pagination
            page={page}
            changePage={changePage}
            totalPage={totalPage}
            className="md:ml-auto"
          />
        </div>
      </div>
    </div>
  );
}
