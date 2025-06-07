import React, { useEffect, useRef, useState, useMemo } from 'react';
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis, ReferenceLine, TooltipProps } from 'recharts';
import { useGameState } from "@/hooks/use-current-game";
import { useLeaderboard } from "@/hooks/use-leadboard";
import { useSinglePlayerGameStore } from "@/store/single-player-game-store";
import { useGetCurrentRoundPlacements } from "@/react-query/game-record-queries";
import { useLeaderboardAggregation } from "@/hooks/use-mini-mutual-fund-aggrigation";
import MiniMutualFundPlacement from "@/models/mini-mutual-fund";
import { cn } from "@/lib/utils";
import dayjs from 'dayjs';

interface ChartDataPoint {
    time: number;
    value: number;
}

const StockProgressChart = () => {
    const { roundRecord } = useSinglePlayerGameStore();
    const { stocks: leaderboardData } = useLeaderboard(roundRecord!);
    const { isGameOver } = useGameState(roundRecord);
    const { data: placementsData, isSuccess } = useGetCurrentRoundPlacements(roundRecord?.id.toString());
    
    const [chartData, setChartData] = useState<ChartDataPoint[]>([]);

    const [highestValue, setHighestValue] = useState(0);
    const [lowestValue, setLowestValue] = useState(0);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);
    
    const placements = useMemo<MiniMutualFundPlacement[]>(() => {
        return isSuccess ? placementsData?.data.placements : [];
    }, [isSuccess, placementsData]);

    const userPlacements = useLeaderboardAggregation(placements, leaderboardData, false);
    
    const totalPotentialReturn = useMemo(() => {
        if (!userPlacements || userPlacements.length === 0) return 0;
        return userPlacements.reduce((sum, placement) => sum + placement.potentialReturn, 0);
    }, [userPlacements]);
    
    const totalBettedAmount = useMemo(() => {
        if (!userPlacements || userPlacements.length === 0) return 0;
        return userPlacements.reduce((sum, placement) => sum + placement.bettedAmount, 0);
    }, [userPlacements]);

    
    useEffect(() => {
        if (!roundRecord || isGameOver) return;
        
        const initialData: ChartDataPoint[] = [{
            time: Date.now(),
            value: totalPotentialReturn
        }];
        
        setChartData(initialData);
        setHighestValue(totalPotentialReturn);
        setLowestValue(totalPotentialReturn);
        
        intervalRef.current = setInterval(() => {
            setChartData(prevData => {
                const newValue = totalPotentialReturn;
                
                setHighestValue(prev => Math.max(prev, newValue));
                
                const newPoint: ChartDataPoint = {
                    time: Date.now(),
                    value: newValue
                };
                
                const updatedData = [...prevData, newPoint];
                return updatedData.length > 20 ? updatedData.slice(-20) : updatedData;
            });
        }, 3000);
        
        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, [roundRecord, isGameOver, totalPotentialReturn, totalBettedAmount]);

    console.log(chartData);
    
    const CustomTooltip = ({ active, payload, label }: TooltipProps<number, string>) => {
        if (active && payload && payload.length) {
            const data = payload[0].payload as ChartDataPoint;
            const profit = data.value - totalBettedAmount;
            return (
                <div className="bg-gray-900 border border-gray-600 p-3 rounded-lg shadow-xl">
                    <p className="text-gray-300 text-sm">
                        {new Date(label).toLocaleTimeString()}
                    </p>
                    <p className="text-white font-bold text-lg">
                        ₹{data.value.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                    </p>
                    <p className={cn("text-sm", profit >= 0 ? "text-green-400" : "text-red-400")}>
                        P/L: ₹{profit.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                    </p>
                </div>
            );
        }
        return null;
    };
    
    const percentageChange = useMemo(() => {
        if (chartData.length < 2) return 0;
        const first = chartData[0].value;
        const last = chartData[chartData.length - 1].value;
        return ((last - first) / first) * 100;
    }, [chartData]);
    
    if (!roundRecord) return null;
    
    return (
        <div className="h-full w-full bg-gradient-to-br from-[#122146] to-[#1a2f5c] border border-gray-700 rounded-lg p-4">
            <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                    <defs>
                        <linearGradient id="portfolioGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#10B981" stopOpacity={0.8}/>
                            <stop offset="95%" stopColor="#10B981" stopOpacity={0.1}/>
                        </linearGradient>
                        <linearGradient id="portfolioGradientRed" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#EF4444" stopOpacity={0.8}/>
                            <stop offset="95%" stopColor="#EF4444" stopOpacity={0.1}/>
                        </linearGradient>
                    </defs>
                    
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(107, 114, 128, 0.2)" />
                    
                    <XAxis
                        dataKey="time"
                        tickFormatter={(time) =>dayjs(time).format('hh:mm:ss A')}
                        stroke="#6B7280"
                        tick={{ fill: "#9CA3AF", fontSize: 12 }}
                    />
                    
                    <YAxis
                        tickFormatter={(value) => `₹${(value / 1000).toFixed(0)}K`}
                        stroke="#6B7280"
                        tick={{ fill: "#9CA3AF", fontSize: 12 }}
                    />
                    
                    <Tooltip active content={<CustomTooltip />} />
                    
                    <ReferenceLine 
                        y={highestValue} 
                        stroke="rgba(16, 185, 129, 0.5)" 
                        strokeDasharray="2 2" 
                    />
                    <ReferenceLine 
                        y={lowestValue} 
                        stroke="rgba(239, 68, 68, 0.5)" 
                        strokeDasharray="2 2" 
                    />
                    <ReferenceLine 
                        y={totalBettedAmount} 
                        stroke="rgba(59, 130, 246, 0.5)" 
                        strokeDasharray="2 2" 
                        label={{ value: 'Total Bet', position: 'right', fill: '#9CA3AF' }}
                    />
                    
                    <Area
                        type="monotone"
                        dataKey="value"
                        stroke={percentageChange >= 0 ? "#10B981" : "#EF4444"}
                        strokeWidth={3}
                        fill={percentageChange >= 0 ? "url(#portfolioGradient)" : "url(#portfolioGradientRed)"}
                        isAnimationActive={true}
                        animationDuration={800}
                        activeDot={{
                            stroke: percentageChange >= 0 ? "#10B981" : "#EF4444",
                            strokeWidth: 2,
                            r: 6,
                            fill: "#fff",
                        }}
                    />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
};

export default StockProgressChart;