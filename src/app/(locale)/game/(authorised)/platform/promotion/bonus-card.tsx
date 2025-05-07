"use client";

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
import { cn } from '@/lib/utils';
import Bonus, { BonusCategory, BonusFrequency } from '@/models/bonus';
import dayjs from 'dayjs';
import { Calendar, Clock, Coins, Info, Percent, Sparkles } from 'lucide-react';
import Image from 'next/image';
import { useState, useEffect } from 'react';

interface BonusCardProps {
    bonus: Bonus;
    className?: string;
}

const getCategoryIcon = (category: BonusCategory) => {
    switch (category) {
        // case BonusCategory.JOINING:
        //     return <Zap className="w-5 h-5" />;
        case BonusCategory.SIGNUP:
            return <Sparkles className="w-5 h-5" />;
        // case BonusCategory.REFERRAL:
        //     return <Zap className="w-5 h-5" />;
        case BonusCategory.DEPOSIT:
            return <Coins className="w-5 h-5" />;
        // case BonusCategory.LOSEBACK:
        //     return <Zap className="w-5 h-5" />;
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
    const [timeLeft, setTimeLeft] = useState<string>('');

    useEffect(() => {
        const calculateTimeLeft = () => {
            if (!bonus.endDate) return '';
            
            const end = dayjs(bonus.endDate);
            const now = dayjs();
            const diff = end.diff(now);

            if (diff <= 0) return 'Expired';

            const days = Math.floor(diff / (1000 * 60 * 60 * 24));
            const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

            return `${days}d ${hours}h ${minutes}m`;
        };

        setTimeLeft(calculateTimeLeft());

        const timer = setInterval(() => {
            setTimeLeft(calculateTimeLeft());
        }, 60000); // Update every minute

        return () => clearInterval(timer);
    }, [bonus.endDate]);

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

                        {/* Time left counter */}
                        {timeLeft && (
                            <div className="flex items-center space-x-2 text-gray-300">
                                <Clock className="w-4 h-4 text-red-400" />
                                <span className="text-sm font-medium">Ends in: {timeLeft}</span>
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
                            <DialogContent className="bg-gray-900/95 backdrop-blur-xl text-white border border-gray-700/50 max-w-2xl">
                                <DialogHeader>
                                    <div className="flex items-center justify-between">
                                        <DialogTitle className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                                            {bonus.name || `${categoryLabel} Bonus`}
                                        </DialogTitle>
                                        {isActive && (
                                            <Badge variant="success" className="px-3 py-1 text-sm">
                                                Active
                                            </Badge>
                                        )}
                                    </div>
                                    
                                 
                                </DialogHeader>

                                <div className="mt-6 space-y-6">
                                    {/* Bonus Amount Section */}
                                    <div className="flex items-center justify-center p-6 bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-xl border border-gray-700/50">
                                        <div className="text-center">
                                            <span className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                                                {formattedAmount}
                                            </span>
                                            <p className="text-gray-400 mt-2">{categoryLabel} Bonus</p>
                                        </div>
                                    </div>

                                    {timeLeft && (
                                        <div className="mt-4 px-4 py-2 bg-red-500/10 border border-red-500/20 rounded-lg inline-flex items-center gap-2 w-full">
                                            <Clock className="w-5 h-5 text-red-400 animate-pulse" />
                                            <span className="text-base font-medium text-red-400">Ends in: {timeLeft}</span>
                                        </div>
                                    )}
                                 
                                    {/* Details Grid */}
                                    <div className="grid grid-cols-2 gap-4 bg-gray-800/30 p-6 rounded-xl border border-gray-700/50">
                                        {formattedLimits && (
                                            <div className="space-y-1">
                                                <span className="text-sm text-gray-400">Limits</span>
                                                <p className="font-medium text-white">{formattedLimits}</p>
                                            </div>
                                        )}
                                        
                                        {frequencyText && (
                                            <div className="space-y-1">
                                                <span className="text-sm text-gray-400">Frequency</span>
                                                <p className="font-medium text-white">{frequencyText}</p>
                                            </div>
                                        )}
                                        
                                        {bonus.maxCount && (
                                            <div className="space-y-1">
                                                <span className="text-sm text-gray-400">Max Claims</span>
                                                <p className="font-medium text-white">{bonus.maxCount}</p>
                                            </div>
                                        )}
                                        
                                        {(bonus.startDate || bonus.endDate) && (
                                            <div className="space-y-1">
                                                <span className="text-sm text-gray-400">Valid Period</span>
                                                <p className="font-medium text-white">
                                                    {bonus.startDate ? dayjs(bonus.startDate).format("MMM DD, YYYY") : "Always"}
                                                    {" to "}
                                                    {bonus.endDate ? dayjs(bonus.endDate).format("MMM DD, YYYY") : "No end"}
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                                   {/* Description */}
                                   <DialogDescription className="text-gray-300 text-base leading-relaxed">
                                        <h2 className='text-white font-semibold tracking-wider'>Description</h2>
                                        {bonus.description || "No description available for this bonus."}
                                    </DialogDescription>

                            </DialogContent>
                        </Dialog>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BonusCard;