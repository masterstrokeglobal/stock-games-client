"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Input } from "@/components/ui/input";
import { OperatorRole } from "@/models/operator";
import { useGetAllOperators, useGetBelowOperators, useGetCurrentOperator } from "@/react-query/operator-queries";
import { ChevronDown, ChevronRight, Pencil, Search, Wallet, Plus, Users } from "lucide-react";
import Link from "next/link";
import React, { useMemo, useState } from "react";

type Operator = {
    id: number;
    name: string;
    email: string;
    role: OperatorRole | 'super_duper_master' | 'duper_master' | 'master' | 'agent';
    percentage: number;
    companyId: number;
    balance: number;
    bettingStatus: boolean;
    transferStatus: boolean;
    status: string;
    createdAt: string;
    updatedAt: string;
};

const OperatorRow = ({ operator, level = 0, isLast = false }: { operator: Operator; level?: number; isLast?: boolean }) => {
    const [isOpen, setIsOpen] = useState(false);

    // Fetch children when expanded
    const { data: subOperators, isFetching: isLoadingSubOperators } = useGetBelowOperators(
        {
            operatorId: operator.id,
            page: 1,
            limit: 100,
        },
        { enabled: isOpen }
    );

    const roleColors: Record<string, string> = {
        super_duper_master: "bg-purple-100 text-purple-800 border-purple-200",
        duper_master: "bg-blue-100 text-blue-800 border-blue-200",
        master: "bg-green-100 text-green-800 border-green-200",
        agent: "bg-yellow-100 text-yellow-800 border-yellow-200",
    };

    const roleLabels: Record<string, string> = {
        super_duper_master: "Super Duper Master",
        duper_master: "Duper Master",
        master: "Master",
        agent: "Agent",
    };

    const statusColors: Record<string, string> = {
        active: "bg-green-100 text-green-800 border-green-200",
        inactive: "bg-red-100 text-red-800 border-red-200",
        suspended: "bg-yellow-100 text-yellow-800 border-yellow-200",
    };

    const hasSubOperators = subOperators?.data && subOperators.data.length > 0;

    const paddingLeft = 12;
    const treeLineClass = level > 0 ? "relative" : "";
    const backgroundClass = level === 0 ? "bg-white" : level === 1 ? "bg-gray-50" : "bg-gray-100";
    const borderClass = level === 0 ? "border border-gray-200" : "border-l-2 border-gray-300";
    const textSizeClass = level === 0 ? "text-sm" : "text-xs";
    const iconSizeClass = "w-4 h-4";

    return (
        <Collapsible open={isOpen} onOpenChange={setIsOpen}>
            <div className={`${borderClass} rounded-lg mb-1 ${treeLineClass}`} style={{ marginLeft: `${paddingLeft}px` }}>
                {level > 0 && (
                    <>
                        <div className="absolute top-4 bg-gray-300" style={{ left: '-16px', width: '12px', height: '1px' }} />
                        {!isLast && (
                            <div className="absolute bg-gray-300" style={{ left: '-16px', top: '0px', width: '1px', height: '100%' }} />
                        )}
                    </>
                )}

                <CollapsibleTrigger asChild>
                    <div className={`w-full p-2 hover:bg-gray-100 cursor-pointer transition-colors ${backgroundClass} rounded-lg`}>
                        <div className="grid grid-cols-12 gap-2 sm:gap-4 items-center">
                            <div className="col-span-1 flex items-center space-x-2">
                                {level > 0 && (
                                    <div className={`w-2 h-2 rounded-full ${operator.role === 'super_duper_master' ? 'bg-purple-400' : operator.role === 'duper_master' ? 'bg-blue-400' : operator.role === 'master' ? 'bg-green-400' : 'bg-yellow-400'}`} />
                                )}
                                {hasSubOperators || isLoadingSubOperators ? (
                                    isOpen ? <ChevronDown className={iconSizeClass} /> : <ChevronRight className={iconSizeClass} />
                                ) : (
                                    <div className={iconSizeClass} />
                                )}
                            </div>

                            <div className="col-span-2">
                                <div className={`font-semibold truncate ${textSizeClass} ${level > 0 ? 'text-gray-700' : 'text-gray-900'}`}>{operator.name}</div>
                            </div>

                            <div className="col-span-2 hidden sm:block">
                                <div className={`text-gray-600 truncate ${textSizeClass}`}>{operator.email}</div>
                            </div>

                            <div className="col-span-2 flex flex-col items-center gap-1">
                                <Badge className={`text-xs px-2 py-1 border ${roleColors[operator.role as string]}`}>
                                    {operator.role === 'super_duper_master' ? 'SDM' : operator.role === 'duper_master' ? 'DM' : roleLabels[operator.role as string]}
                                </Badge>
                                <div className={`text-xs text-gray-600 font-medium ${textSizeClass}`}>{operator.percentage}%</div>
                            </div>

                            <div className={`col-span-1 text-center font-medium ${textSizeClass} hidden md:block`}>
                                ₹{operator.balance?.toLocaleString() || 0}
                            </div>

                            <div className="col-span-1">
                                <Badge className={`border ${textSizeClass} ${statusColors[operator.status as keyof typeof statusColors] || 'bg-gray-100 text-gray-800 border-gray-200'}`}>{operator.status}</Badge>
                            </div>

                            <div className="col-span-2 flex justify-end space-x-2">
                                <Link href={`/operator-dashboard/operator/${operator.id}`}>
                                    <Button size="sm" variant="ghost" aria-label="View Operator" className="h-9 w-9 p-0">
                                        <Pencil className="w-4 h-4" />
                                    </Button>
                                </Link>
                                <Link href={`/operator-dashboard/operator/${operator.id}/users`}>
                                    <Button size="sm" variant="ghost" aria-label="View Users" className="h-9 w-9 p-0">
                                        <Users className="w-4 h-4" />
                                    </Button>
                                </Link>
                                <Link href={`/operator-dashboard/operator/${operator.id}/deposit`}>
                                    <Button size="sm" variant="ghost" aria-label="View Wallet" className="h-9 w-9 p-0">
                                        <Wallet className="w-4 h-4" />
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </div>
                </CollapsibleTrigger>

                {isOpen && (
                    <CollapsibleContent>
                        <div className="border-t border-gray-200">
                            {isLoadingSubOperators ? (
                                <div className="p-4 text-center text-gray-500 text-sm">Loading sub-operators...</div>
                            ) : hasSubOperators ? (
                                <div className="py-2">
                                    {subOperators?.data?.map((subOperator: Operator, index: number) => (
                                        <OperatorRow key={subOperator.id} operator={subOperator} level={level + 1} isLast={index === subOperators.data.length - 1} />
                                    ))}
                                </div>
                            ) : (
                                <div className="p-4 text-center text-gray-500 text-sm">{operator.role === 'agent' ? 'No sub-operators found for this agent' : 'No sub-operators found'}</div>
                            )}
                        </div>
                    </CollapsibleContent>
                )}
            </div>
        </Collapsible>
    );
};

const OperatorTable = () => {
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState("");
    const { data: currentOperator } = useGetCurrentOperator();

    const { data, isFetching } = useGetAllOperators({
        page,
        search,
        limit: 10,
        companyId: currentOperator?.company?.id,
    });

    const { listAll, rootOperators } = useMemo(() => {
        const list = ((data as any)?.data ?? data) as any[] | undefined;
        if (!Array.isArray(list)) return { listAll: [], rootOperators: [] };
        const hasSDM = list.some((op: any) => op.role === 'super_duper_master');
        const hasRoot = list.some((op: any) => op.parentId == null);
        const roots = hasSDM ? list.filter((op: any) => op.role === 'super_duper_master') : (hasRoot ? list.filter((op: any) => op.parentId == null) : list);
        return { listAll: list, rootOperators: roots };
    }, [data]);

    const totalPages = useMemo(() => {
        const total = (data as any)?.count ?? (data as any)?.total ?? (data as any)?.data?.count ?? (data as any)?.data?.total;
        if (typeof total === 'number' && total > 0) {
            return Math.max(1, Math.ceil(total / 10));
        }
        // Fallback: derive from current page list if API does not return a count
        return Math.max(1, Math.ceil((rootOperators?.length ?? 0) / 10));
    }, [data, rootOperators]);

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(e.target.value);
        setPage(1);
    };

    const changePage = (newPage: number) => {
        setPage(newPage);
    };

    return (
        <section className="container-main min-h-[60vh] my-12">
            <header className="flex flex-col md:flex-row gap-4 flex-wrap md:items-center mt-20 justify-between">
                <h2 className="text-xl font-semibold">Operators</h2>
                <div className="flex gap-4 flex-wrap items-center">
                    <div className="relative min-w-60 flex-1">
                        <Search size={18} className="absolute top-2.5 left-2.5" />
                        <Input placeholder="Search operators" onChange={handleSearch} className="pl-10" />
                    </div>
                    <Link href="/operator-dashboard/operator/create" className="flex items-center gap-2">
                        <Button>
                            <Plus size={18} className="mr-2" />
                            Create Operator
                        </Button>
                    </Link>
                </div>
            </header>

            <main className="mt-4">
                {/* Header */}
                <div className="bg-gray-100 rounded-t-lg p-4 border">
                    <div className="grid grid-cols-12 gap-2 sm:gap-4 items-center font-semibold text-sm text-gray-700">
                        <div className="col-span-1"></div>
                        <div className="col-span-2">NAME</div>
                        <div className="col-span-2 hidden sm:block">EMAIL</div>
                        <div className="col-span-2 text-center">ROLE & %</div>
                        <div className="col-span-1 text-center hidden md:block">BALANCE</div>
                        <div className="col-span-1">STATUS</div>
                        <div className="col-span-2 text-center">ACTIONS</div>
                    </div>
                </div>

                {/* List */}
                <div className="border-x border-b rounded-b-lg">
                    {isFetching ? (
                        <div className="p-8 text-center text-gray-500">Loading operators...</div>
                    ) : (listAll?.length ?? 0) > 0 ? (
                        <div className="p-2">
                            {rootOperators.map((operator: Operator) => (
                                <OperatorRow key={operator.id} operator={operator} />
                            ))}
                        </div>
                    ) : (
                        <div className="p-8 text-center text-gray-500">No operators found</div>
                    )}
                </div>

                {/* Pagination (always visible) */}
                <div className="flex justify-center mt-4 space-x-2">
                    <Button variant="outline" size="sm" onClick={() => changePage(page - 1)} disabled={page <= 1}>
                        Previous
                    </Button>
                    <span className="flex items-center px-3 text-sm">Page {page} of {totalPages}</span>
                    <Button variant="outline" size="sm" onClick={() => changePage(page + 1)} disabled={page >= totalPages}>
                        Next
                    </Button>
                </div>
            </main>
        </section>
    );
};

export default OperatorTable;