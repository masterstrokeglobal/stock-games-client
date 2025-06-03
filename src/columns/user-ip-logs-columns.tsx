import { ColumnDef } from "@tanstack/react-table";
import UserIpLog from "@/models/user-ip-logs";
import dayjs from "dayjs";

export const userIpLogsColumns: ColumnDef<UserIpLog>[] = [
    {
        header: "IP V4",
        accessorKey: "ipv4",
        cell: ({ row }) => <div>{row.original.ipv4 || "-"}</div>
    },
    {
        header: "IP V6",
        accessorKey: "ipv6",
        cell: ({ row }) => <div>{row.original.ipv6 || "-"}</div>
    },
    {
        header: "CREATED AT",
        accessorKey: "createdAt",
        cell: ({ row }) => <div>{dayjs(row.original.createdAt).format("YYYY-MM-DD HH:mm:ss")}</div>
    },
    {
        header: "UPDATED AT",
        accessorKey: "updatedAt",
        cell: ({ row }) => <div>{dayjs(row.original.updatedAt).format("YYYY-MM-DD HH:mm:ss")}</div>
    }
];
