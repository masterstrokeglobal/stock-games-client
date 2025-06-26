import { Select, SelectContent, SelectItem, SelectTrigger } from "@/components/ui/select";
import dayjs from "dayjs";
import { useEffect, useState } from "react";

const BettingHistoryFilter = ({ onFilterChange }: { onFilterChange: (startTime: Date, Time: Date) => void }) => {
    const [timeRange, setTimeRange] = useState('today');

    useEffect(() => {
        const now = dayjs();
        let startTime: Date;
        let endTime: Date;

        switch (timeRange) {
            case 'today':
                startTime = now.startOf('day').toDate();
                endTime = now.endOf('day').toDate();
                break;
            case 'this-week':
                startTime = now.startOf('week').toDate();
                endTime = now.endOf('week').toDate();
                break;
            case 'this-month':
                startTime = now.startOf('month').toDate();
                endTime = now.endOf('month').toDate();
                break;
            case 'lifetime':
                startTime = dayjs('2000-01-01').toDate();
                endTime = now.endOf('day').toDate();
            default:
                startTime = dayjs('2000-01-01').toDate();
                endTime = now.endOf('day').toDate();
        }

        onFilterChange(startTime, endTime);
    }, [timeRange, onFilterChange]);

    return (
        <div className="w-full mb-4">
            <Select value={timeRange} onValueChange={setTimeRange}>
                <SelectTrigger className="w-full bg-gray-800 text-white border-gray-700">
                    {timeRange.split('-').map((word) => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="today">Today</SelectItem>
                    <SelectItem value="this-week">This Week</SelectItem>
                    <SelectItem value="this-month">This Month</SelectItem>
                    <SelectItem value="lifetime">Lifetime</SelectItem>
                </SelectContent>
            </Select>
        </div>
    );
};

export default BettingHistoryFilter;