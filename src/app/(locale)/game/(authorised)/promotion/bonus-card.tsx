"use client";

import { useState } from 'react';
import Image from 'next/image';
import { Calendar, Clock, Coins, Info, Percent, Sparkles, Zap } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import Bonus, { BonusCategory, BonusFrequency } from '@/models/bonus';
import dayjs from 'dayjs';
import { cn } from '@/lib/utils';
interface BonusCardProps {
    bonus: Bonus;
    className?: string;
}

const getCategoryIcon = (category: BonusCategory) => {
    switch (category) {
        case BonusCategory.JOINING:
            return <Zap className="w-5 h-5" />;
        case BonusCategory.SIGNUP:
            return <Sparkles className="w-5 h-5" />;
        case BonusCategory.REFERRAL:
            return <Zap className="w-5 h-5" />;
        case BonusCategory.DEPOSIT:
            return <Coins className="w-5 h-5" />;
        case BonusCategory.LOSEBACK:
            return <Zap className="w-5 h-5" />;
        default:
            return <Coins className="w-5 h-5" />;
    }
};

const getFrequencyText = (frequency?: BonusFrequency) => {
    if (!frequency) return null;

    const texts = {
        [BonusFrequency.DAILY]: "Daily",
        [BonusFrequency.WEEKLY]: "Weekly",
        [BonusFrequency.MONTHLY]: "Monthly",
        [BonusFrequency.EVERY]: "Every deposit",
    };

    return texts[frequency];
};

const BonusCard = ({ bonus, className }: BonusCardProps) => {
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const isActive = bonus.isActive();
    const formattedAmount = bonus.percentage ? `${bonus.amount}%` : `Rs. ${bonus.amount}`;
    const formattedLimits = bonus.minAmount || bonus.maxAmount
        ? `${bonus.minAmount ? `Min: Rs.${bonus.minAmount}` : ''} ${bonus.minAmount && bonus.maxAmount ? '|' : ''} ${bonus.maxAmount ? `Max: Rs.${bonus.maxAmount}` : ''}`
        : null;

    const categoryLabel = bonus.category.charAt(0).toUpperCase() + bonus.category.slice(1);
    const frequencyText = getFrequencyText(bonus.frequency);

    return (
        // animated gradient background
        <div className="p-1  animate-gradient-bg rounded-xl">
            <div className={cn("relative w-full overflow-hidden rounded-lg bg-gradient-to-br from-gray-900 to-gray-800 shadow-xl border border-gray-700", className)}>
                {/* Status badge */}
                <div className="absolute top-3 right-3 z-10">
                    <Badge variant={isActive ? "success" : "destructive"} className="px-2 py-1">
                        {isActive ? "Active" : "Inactive"}
                    </Badge>
                </div>

                {/* Bonus Image */}
                <div className="relative h-48 w-full overflow-hidden">
                    {bonus.imageUrl ? (
                        <Image
                            src={bonus.imageUrl}
                            alt={bonus.name || "Bonus"}
                            fill
                            className="object-cover"
                        />
                    ) : (
                        <div className="flex h-full w-full items-center justify-center bg-gradient-to-r from-purple-800 to-blue-800">
                            <div className="flex flex-col items-center justify-center text-white">
                                {getCategoryIcon(bonus.category)}
                                <span className="mt-2 text-xl font-bold">{categoryLabel} Bonus</span>
                            </div>
                        </div>
                    )}
                </div>

                {/* Content */}
                <div className="p-5">
                    <h3 className="text-xl font-bold text-white mb-2">{bonus.name || `${categoryLabel} Bonus`}</h3>

                    <div className="space-y-3 mb-4">
                        {/* Amount with icon */}
                        <div className="flex items-center space-x-2">
                            {bonus.percentage ? (
                                <Percent className="w-5 h-5 text-green-400" />
                            ) : (
                                <Coins className="w-5 h-5 text-yellow-400" />
                            )}
                            <span className="text-2xl font-bold text-white">{formattedAmount}</span>
                        </div>

                        {/* Limits if available */}
                        {formattedLimits && (
                            <div className="flex items-center space-x-2 text-gray-300">
                                <span className="text-sm">{formattedLimits}</span>
                            </div>
                        )}

                        {/* Category */}
                        <div className="flex items-center space-x-2 text-gray-300">
                            {getCategoryIcon(bonus.category)}
                            <span>{categoryLabel} Bonus</span>
                        </div>

                        {/* Frequency if available */}
                        {frequencyText && (
                            <div className="flex items-center space-x-2 text-gray-300">
                                <Clock className="w-4 h-4 text-blue-400" />
                                <span>{frequencyText}</span>
                            </div>
                        )}

                        {/* Dates if available */}
                        {(bonus.startDate || bonus.endDate) && (
                            <div className="flex items-center space-x-2 text-gray-300">
                                <Calendar className="w-4 h-4 text-purple-400" />
                                <span className="text-sm">
                                    {bonus.startDate ? dayjs(bonus.startDate).format("MMM DD") : "Always"}
                                    {" - "}
                                    {bonus.endDate ? dayjs(bonus.endDate).format("MMM DD, YYYY") : "No end"}
                                </span>
                            </div>
                        )}
                    </div>

                    {/* Actions */}
                    <div className="flex justify-center">
                        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                            <DialogTrigger asChild>
                                <Button variant="default" size="sm" className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500">
                                    <Info className="w-4 h-4 mr-2" />
                                    Know More
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="bg-gray-900 text-white border-gray-700">
                                <DialogHeader>
                                    <DialogTitle className="text-xl">{bonus.name || `${categoryLabel} Bonus`}</DialogTitle>
                                </DialogHeader>
                                <DialogDescription className="text-gray-300">
                                    {bonus.description || "No description available for this bonus."}
                                </DialogDescription>
                                <div className="mt-4 space-y-3">
                                    <div className="flex justify-between">
                                        <span className="text-gray-400">Amount:</span>
                                        <span className="font-medium">{formattedAmount}</span>
                                    </div>
                                    {formattedLimits && (
                                        <div className="flex justify-between">
                                            <span className="text-gray-400">Limits:</span>
                                            <span className="font-medium">{formattedLimits}</span>
                                        </div>
                                    )}
                                    {frequencyText && (
                                        <div className="flex justify-between">
                                            <span className="text-gray-400">Frequency:</span>
                                            <span className="font-medium">{frequencyText}</span>
                                        </div>
                                    )}
                                    {bonus.maxCount && (
                                        <div className="flex justify-between">
                                            <span className="text-gray-400">Max Claims:</span>
                                            <span className="font-medium">{bonus.maxCount}</span>
                                        </div>
                                    )}
                                    {(bonus.startDate || bonus.endDate) && (
                                        <div className="flex justify-between">
                                            <span className="text-gray-400">Valid Period:</span>
                                            <span className="font-medium">
                                                {bonus.startDate ? dayjs(bonus.startDate).format("MMM DD, YYYY") : "Always"}
                                                {" to "}
                                                {bonus.endDate ? dayjs(bonus.endDate).format("MMM DD, YYYY") : "No end"}
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </DialogContent>
                        </Dialog>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BonusCard;