"use client";
import {
    ColumnDef,
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
import { ReactNode } from "react";
import { cn } from "@/lib/utils";
import ErrorBoundary from "@/components/ui/error-boundary";
import { Skeleton } from "./skeleton";

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[];
    data: TData[];
    showOptions?: boolean;
    hideFilterButton?: boolean;
    hideColumnsInMobile?: boolean;
    loading?: boolean;
    showSearch?: boolean;
    showHeader?: boolean;
    children?: ReactNode;
    className?: string;
    rowClassName?: string;
}

export default function DataTable<TData, TValue>({
    columns,
    data,
    rowClassName,
    className,
    showHeader = true,
    loading = false,
}: DataTableProps<TData, TValue>) {


    const table = useReactTable({
        data,
        columns,
        manualPagination: true,
        enableGlobalFilter: true,
        manualFiltering: true,
        getCoreRowModel: getCoreRowModel(),
    });


    return (
        <div>
            <div className={cn("dark:bg-dark-primary border rounded-xl overflow-hidden bg-white", className)}>
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

            </div>
        </div>
    );
}
