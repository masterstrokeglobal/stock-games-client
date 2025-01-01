import { ColumnDef } from "@tanstack/react-table";
import dayjs from "dayjs";
import Link from "next/link";
import { RoundRecord } from "@/models/round-record"; // Import the RoundRecord model
import { Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SchedulerType } from "@/models/market-item"; // Import SchedulerType if needed
import { Badge } from "@/components/ui/badge";

const roundRecordColumns: ColumnDef<RoundRecord>[] = [
    {
        header: "ID",
        accessorKey: "id",
        cell: ({ row }) => (
            <div className="text-[#6B7280]">{row.original.id}</div>
        ),
    },
    {
        header: "START DATE",
        accessorKey: "startTime",
        cell: ({ row }) => (
            <div className="text-[#6B7280]">
                {dayjs(row.original.startTime).format("DD-MM-YYYY")}
            </div>
        ),
    },
    {
        header: "END DATE",
        accessorKey: "endTime",
        cell: ({ row }) => (
            <div className="text-[#6B7280]">
                {dayjs(row.original.endTime).format("DD-MM-YYYY")}
            </div>
        ),
    },
    {
        header: "START TIME",
        accessorKey: "startTime",
        cell: ({ row }) => (
            <div className="text-[#6B7280]">
                {dayjs(row.original.startTime).format("hh:mm A")}
            </div>
        ),
    },
    {
        header: "END TIME",
        accessorKey: "endTime",
        cell: ({ row }) => (
            <div className="text-[#6B7280]">
                {dayjs(row.original.endTime).format("hh:mm A")}
            </div>
        ),
    },
    {
        header: "TYPE",
        accessorKey: "type",
        cell: ({ row }) => (
            row.original.type == SchedulerType.CRYPTO ? (
                <Badge variant="outline">
                    Crypto
                </Badge>) :
                <Badge variant="success">
                    NSE
                </Badge>
        ),
    },
    {
        header: "CREATED ON",
        accessorKey: "createdAt",
        cell: ({ row }) => (
            <span className="text-[#6B7280]">
                {dayjs(row.original.createdAt).format("DD-MM-YYYY")}
            </span>
        ),
    },
    {
        header: "",
        accessorKey: "actions",
        cell: ({ row }) => <ActionColumn roundRecord={row.original} />,
    },
];

// Action column for managing round record actions
const ActionColumn = ({ roundRecord }: { roundRecord: RoundRecord }) => {
    return (
        <div className="flex space-x-4 w-36 justify-end">
            <Link href={`/dashboard/round-records/${roundRecord.id}`}>
                <Button variant="ghost" size="icon" aria-label="View Round Record">
                    <Eye className="w-5 h-5" />
                </Button>
            </Link>
        </div>
    );
};

export default roundRecordColumns;
