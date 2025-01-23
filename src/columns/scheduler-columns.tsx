import { ColumnDef } from "@tanstack/react-table";
import dayjs from "dayjs";
import Link from "next/link";
import { Scheduler } from "@/models/schedular"; // Import the Scheduler model
import { Edit2, Eye } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useUpdateSchedulerById } from "@/react-query/scheduler-queries";
import { Switch } from "@/components/ui/switch";

const schedulerColumns: ColumnDef<Scheduler>[] = [
    {
        header: "START DATE",
        accessorKey: "startDate",
        cell: ({ row }) => (
            <div className="text-[#6B7280]">
                {dayjs(row.original.startDate).format("DD-MM-YYYY")}
            </div>
        ),
    },
    {
        header: "END DATE",
        accessorKey: "endDate",
        cell: ({ row }) => (
            <div className="text-[#6B7280]">
                {dayjs(row.original.endDate).format("DD-MM-YYYY")}
            </div>
        ),
    },
    {

        header: "START TIME",
        accessorKey: "startTime",
        cell: ({ row }) => (
            <div className="text-[#6B7280]">
                {convertTo12HourFormat(row.original.startTime!)}
            </div>
        ),
    },
    {
        header: "END TIME",
        accessorKey: "endTime",
        cell: ({ row }) => (
            <div className="text-[#6B7280]">
                {convertTo12HourFormat(row.original.endTime!)}
            </div>
        ),
    },
    {
        header: "TYPE",
        accessorKey: "type",
        cell: ({ row }) => (
            <div className="text-[#6B7280]">{row.original.type}</div>
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
        header: "CREATE ROUND",
        accessorKey: "createRound",
        cell: ({ row }) => <CreateRoundColumn scheduler={row.original} />,
    },
    {
        header: "",
        accessorKey: "actions",
        cell: ({ row }) => <ActionColumn scheduler={row.original} />,
    },
];

// Action column for managing scheduler actions
const ActionColumn = ({ scheduler }: { scheduler: Scheduler }) => {


    return (
        <div className="flex space-x-4 w-36 justify-end">
            <Link href={`/dashboard/scheduler/${scheduler.id}`}>
                <Button variant="ghost" size="icon" aria-label="Edit Scheduler">
                    <Edit2 className="w-5 h-5" />
                </Button>
            </Link>
            <Link href={`/dashboard/scheduler/${scheduler.id}/view`}>
                <Button variant="ghost" size="icon" aria-label="View Scheduler">
                    <Eye className="w-5 h-5" />
                </Button>
            </Link>
        </div>
    );
};

export default schedulerColumns;

const convertTo12HourFormat = (time: string): string => {
    const [hour, minute] = time.split(":").map(Number);
    const period = hour >= 12 ? "PM" : "AM";
    const adjustedHour = hour % 12 || 12; // Convert 0 or 24 to 12 for AM/PM
    return `${adjustedHour}:${minute.toString().padStart(2, "0")} ${period}`;
};


const CreateRoundColumn = ({ scheduler }: { scheduler: Scheduler }) => {
    const { mutate, isPending } = useUpdateSchedulerById();

    const handleChange = () => {
        mutate({
            ...scheduler,
            createRound: !scheduler.createRound,
            id: scheduler.id?.toString(),
            companyId: scheduler.companyId?.toString(),
        });
    };
    return (
        <div className="flex space-x-4  justify-start">
            <Switch
                disabled={isPending}
                checked={scheduler.createRound}
                onCheckedChange={() => {
                    handleChange();
                }}
            />
            {}
        </div>
    );
};