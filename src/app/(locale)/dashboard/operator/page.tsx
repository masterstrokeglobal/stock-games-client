"use client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Input } from "@/components/ui/input";
import { OperatorRole } from "@/models/operator";
import { useGetAllOperators, useGetBelowOperators } from "@/react-query/operator-queries";
import { ChevronDown, ChevronRight, Pencil, Search, Wallet } from "lucide-react";
import Link from "next/link";
import React, { useMemo, useState } from "react";

type Operator = {
    id: number;
    name: string;
    email: string;
    role: OperatorRole;
    percentage: number;
    companyId: number;
    balance: number;
    maxBalance: number;
    bettingStatus: boolean;
    transferStatus: boolean;
    status: string;
    createdAt: string;
    updatedAt: string;
}

const OperatorRow = ({ operator, level = 0, isLast = false }: { operator: Operator; level?: number; isLast?: boolean }) => {
    const [isOpen, setIsOpen] = useState(false);
    
    // Only fetch when collapsible is open
    const { data: subOperators, isFetching: isLoadingSubOperators } = useGetBelowOperators(
        {
            operatorId: operator.id,
            page: 1,
            limit: 100
        },
        { enabled: isOpen } // Only fetch when expanded
    );

    const roleColors = {
        super_duper_master: "bg-purple-100 text-purple-800 border-purple-200",
        duper_master: "bg-blue-100 text-blue-800 border-blue-200",
        master: "bg-green-100 text-green-800 border-green-200",
        agent: "bg-yellow-100 text-yellow-800 border-yellow-200",
    };
    
    const roleLabels = {
        super_duper_master: "Super Duper Master",
        duper_master: "Duper Master",
        master: "Master",
        agent: "Agent",
    };

    const statusColors = {
        active: "bg-green-100 text-green-800 border-green-200",
        inactive: "bg-red-100 text-red-800 border-red-200",
        suspended: "bg-yellow-100 text-yellow-800 border-yellow-200",
    };

    const hasSubOperators = subOperators?.data && subOperators.data.length > 0;
    
    // Enhanced visual hierarchy
    const paddingLeft = 12; // Reduced from 24px to 16px per level
    const treeLineClass = level > 0 ? "relative" : "";
    const backgroundClass = level === 0 ? "bg-white" : level === 1 ? "bg-gray-50" : "bg-gray-100";
    const borderClass = level === 0 ? "border border-gray-200" : "border-l-2 border-gray-300";
    const textSizeClass = level === 0 ? "text-sm" : level === 1 ? "text-xs" : "text-xs";
    const iconSizeClass = level === 0 ? "w-4 h-4" : "w-4 h-4"; // Keep icons same size for visibility

    return (
        <Collapsible open={isOpen} onOpenChange={setIsOpen}>
            <div className={`${borderClass} rounded-lg mb-1 ${treeLineClass}`} style={{ marginLeft: `${paddingLeft}px` }}>
                {/* Tree line visualization */}
                {level > 0 && (
                    <>
                        {/* Horizontal line */}
                        <div 
                            className="absolute top-4 bg-gray-300" 
                            style={{ 
                                left: '-16px', 
                                width: '12px', 
                                height: '1px' 
                            }} 
                        />
                        {/* Vertical line */}
                        {!isLast && (
                            <div 
                                className="absolute bg-gray-300" 
                                style={{ 
                                    left: '-16px', 
                                    top: '0px', 
                                    width: '1px', 
                                    height: '100%' 
                                }} 
                            />
                        )}
                    </>
                )}

                <CollapsibleTrigger asChild>
                    <div className={`w-full p-2 hover:bg-gray-100 cursor-pointer transition-colors ${backgroundClass} rounded-lg`}>
                        <div className="grid grid-cols-12 gap-4 items-center">
                            <div className="col-span-1 flex items-center space-x-2">
                                {/* Tree node indicator */}
                                {level > 0 && (
                                    <div className={`w-2 h-2 rounded-full ${
                                        operator.role === 'super_duper_master' ? 'bg-purple-400' :
                                        operator.role === 'duper_master' ? 'bg-blue-400' :
                                        operator.role === 'master' ? 'bg-green-400' : 'bg-yellow-400'
                                    }`} />
                                )}
                                
                                {/* Expand/collapse icon */}
                                {hasSubOperators || isLoadingSubOperators ? (
                                    isOpen ? <ChevronDown className={iconSizeClass} /> : <ChevronRight className={iconSizeClass} />
                                ) : (
                                    <div className={iconSizeClass} />
                                )}
                            </div>
                            
                            <div className="col-span-2">
                                <div className={`font-semibold truncate ${textSizeClass} ${level > 0 ? 'text-gray-700' : 'text-gray-900'}`}>
                                    {operator.name}
                                </div>
                            </div>
                            
                            <div className="col-span-2">
                                <div className={`text-gray-600 truncate ${textSizeClass}`}>
                                    {operator.email}
                                </div>
                            </div>
                            
                            <div className="col-span-1">
                                <Badge className={`whitespace-nowrap border ${textSizeClass} ${roleColors[operator.role]}`}>
                                    {roleLabels[operator.role]}
                                </Badge>
                            </div>
                            
                            <div className={`col-span-1 text-center font-medium ${textSizeClass}`}>
                                {operator.percentage}%
                            </div>
                            
                            <div className={`col-span-1 text-center font-medium ${textSizeClass}`}>
                                ₹{operator.balance?.toLocaleString() || 0}
                            </div>
                            
                            <div className={`col-span-1 text-center font-medium ${textSizeClass}`}>
                                ₹{operator.maxBalance?.toLocaleString() || 0}
                            </div>
                            
                            <div className="col-span-1">
                                <Badge className={`border ${textSizeClass} ${statusColors[operator.status as keyof typeof statusColors] || "bg-gray-100 text-gray-800 border-gray-200"}`}>
                                    {operator.status}
                                </Badge>
                            </div>
                            
                            <div className="col-span-2 flex justify-end space-x-2">
                                <Link href={`/dashboard/operator/${operator.id}`}>
                                    <Button size="sm" variant="ghost" aria-label="View Operator" className="h-9 w-9 p-0">
                                        <Pencil className="w-4 h-4" />
                                    </Button>
                                </Link>
                                <Link href={`/dashboard/operator/${operator.id}/deposit`}>
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
                                        <OperatorRow 
                                            key={subOperator.id} 
                                            operator={subOperator} 
                                            level={level + 1}
                                            isLast={index === subOperators.data.length - 1}
                                        />
                                    ))}
                                </div>
                            ) : null}
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

    const { data, isFetching } = useGetAllOperators({
        page,
        search,
    });

    const totalPages = useMemo(() => {
        return Math.ceil(data?.data?.count / 10) || 1;
    }, [data]);

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(e.target.value);
        setPage(1);
    };

    const changePage = (newPage: number) => {
        setPage(newPage);
    };

    console.log(data);

    return (
        <section className="container-main min-h-[60vh] my-12">
            <header className="flex flex-col md:flex-row gap-4 flex-wrap md:items-center mt-20 justify-between">
                <h2 className="text-xl font-semibold">Operators</h2>
                <div className="flex gap-4 flex-wrap items-center">
                    <div className="relative min-w-60 flex-1">
                        <Search size={18} className="absolute top-2.5 left-2.5" />
                        <Input
                            placeholder="Search operators"
                            onChange={handleSearch}
                            className="pl-10"
                        />
                    </div>
                </div>
            </header>

            <main className="mt-4">
                {/* Table Header */}
                <div className="bg-gray-100 rounded-t-lg p-4 border">
                    <div className="grid grid-cols-12 gap-4 items-center font-semibold text-sm text-gray-700">
                        <div className="col-span-1"></div>
                        <div className="col-span-2">NAME</div>
                        <div className="col-span-2">EMAIL</div>
                        <div className="col-span-1">ROLE</div>
                        <div className="col-span-1 text-center">PERCENTAGE</div>
                        <div className="col-span-1 text-center">BALANCE</div>
                        <div className="col-span-1 text-center">MAX BALANCE</div>
                        <div className="col-span-1">STATUS</div>
                        <div className="col-span-2 text-center">ACTIONS</div>
                    </div>
                </div>

                {/* Operators List */}
                <div className="border-x border-b rounded-b-lg">
                    {isFetching ? (
                        <div className="p-8 text-center text-gray-500">
                            Loading operators...
                        </div>
                    ) : data?.data?.length > 0 ? (
                        <div className="p-2">
                            {data.data.map((operator: Operator) => (
                                <OperatorRow key={operator.id} operator={operator} />
                            ))}
                        </div>
                    ) : (
                        <div className="p-8 text-center text-gray-500">
                            No operators found
                        </div>
                    )}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="flex justify-center mt-4 space-x-2">
                        <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => changePage(page - 1)}
                            disabled={page <= 1}
                        >
                            Previous
                        </Button>
                        <span className="flex items-center px-3 text-sm">
                            Page {page} of {totalPages}
                        </span>
                        <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => changePage(page + 1)}
                            disabled={page >= totalPages}
                        >
                            Next
                        </Button>
                    </div>
                )}
            </main>
        </section>
    );
};

export default OperatorTable;