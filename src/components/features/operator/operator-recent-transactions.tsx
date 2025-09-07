"use client";
import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useGetHierarchicalTransactions } from "@/react-query/operator-queries";
import { Search } from "lucide-react";

type Props = {
    operatorId: number;
};

const OperatorRecentTransactions = ({ operatorId }: Props) => {
    const [page, setPage] = useState(1);
    const [limit] = useState(10);
    const [search, setSearch] = useState("");

    const { data } = useGetHierarchicalTransactions({ operatorId, page, limit, search });

    const totalPages = useMemo(() => Math.ceil((data?.count ?? 0) / limit) || 1, [data, limit]);

    return (
        <Card>
            <CardHeader>
                <CardTitle>Recent Transactions</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="flex items-center gap-3 mb-3">
                    <div className="relative min-w-60 max-w-sm">
                        <Search size={18} className="absolute top-2.5 left-2.5" />
                        <Input placeholder="Search" onChange={(e) => { setSearch(e.target.value); setPage(1); }} className="pl-10" />
                    </div>
                </div>

                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Type</TableHead>
                            <TableHead>Amount</TableHead>
                            <TableHead>User/Operator</TableHead>
                            <TableHead>Date</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {(data?.data ?? []).map((t: any) => (
                            <TableRow key={t.id}>
                                <TableCell className="capitalize">{t.type ?? '-'}</TableCell>
                                <TableCell>₹{Number(t.amount ?? 0).toFixed(2)}</TableCell>
                                <TableCell>{t.user?.username || t.operator?.name || '-'}</TableCell>
                                <TableCell>{t.createdAt ? new Date(t.createdAt).toLocaleString() : '-'}</TableCell>
                            </TableRow>
                        ))}
                        {((data?.data ?? []).length === 0) && (
                            <TableRow>
                                <TableCell colSpan={4} className="text-center text-sm text-muted-foreground">No recent transactions</TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>

                <div className="flex justify-between items-center mt-3 text-sm">
                    <div>Count: {data?.count ?? 0}</div>
                    <div className="flex items-center gap-2">
                        <button disabled={page <= 1} onClick={() => setPage((p) => Math.max(1, p - 1))} className="px-2 py-1 border rounded disabled:opacity-50">Prev</button>
                        <div>
                            {page} / {totalPages}
                        </div>
                        <button disabled={page >= totalPages} onClick={() => setPage((p) => Math.min(totalPages, p + 1))} className="px-2 py-1 border rounded disabled:opacity-50">Next</button>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

export default OperatorRecentTransactions;


