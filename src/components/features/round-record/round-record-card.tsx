"use client";

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import dayjs from "dayjs";
import { FC } from "react";
import RoundRecord from "@/models/round-record";

interface RoundRecordCardProps {
    roundRecord: RoundRecord;
}

const formatDateTime = (date?: Date) => (date ? dayjs(date).format("MMM DD, YYYY [at] hh:mm A") : "N/A");

const RoundRecordCard: FC<RoundRecordCardProps> = ({ roundRecord }) => {
    return (
        <Card className="shadow-md">
            <CardHeader>
                <CardTitle className="text-xl font-semibold">Round Record Details</CardTitle>
                <CardDescription>Information about the round and its lifecycle</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <span className="block font-medium">ID</span>
                        <p>{roundRecord.id ?? "N/A"}</p>
                    </div>
                    <div>
                        <span className="block font-medium">Company ID</span>
                        <p>{roundRecord.companyId ?? "N/A"}</p>
                    </div>
                    <div>
                        <span className="block font-medium">Start Time</span>
                        <p>{formatDateTime(roundRecord.startTime)}</p>
                    </div>
                    <div>
                        <span className="block font-medium">End Time</span>
                        <p>{formatDateTime(roundRecord.endTime)}</p>
                    </div>
                    <div>
                        <span className="block font-medium">Placement Start Time</span>
                        <p>{formatDateTime(roundRecord.placementStartTime)}</p>
                    </div>
                    <div>
                        <span className="block font-medium">Placement End Time</span>
                        <p>{formatDateTime(roundRecord.placementEndTime)}</p>
                    </div>
                    <div>
                        <span className="block font-medium">Type</span>
                        <Badge variant="outline">{roundRecord.type ?? "N/A"}</Badge>
                    </div>
                    <div>
                        <span className="block font-medium">Winning ID</span>
                        <p>{roundRecord.winningId ?? "N/A"}</p>
                    </div>
                    <div>
                        <span className="block font-medium">Created At</span>
                        <p>{formatDateTime(roundRecord.createdAt)}</p>
                    </div>
                    <div>
                        <span className="block font-medium">Updated At</span>
                        <p>{formatDateTime(roundRecord.updatedAt)}</p>
                    </div>
                    <div>
                        <span className="block font-medium">Deleted At</span>
                        <p>{formatDateTime(roundRecord.deletedAt)}</p>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

export default RoundRecordCard;
