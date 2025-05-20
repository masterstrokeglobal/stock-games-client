"use client"

import { ArrowDownIcon, ArrowRightIcon, ArrowUpIcon } from "@radix-ui/react-icons"
import { useEffect, useState } from "react"
import dayjs from "dayjs"
import { Line, LineChart, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid, ReferenceLine } from "recharts"
import { Triangle } from "lucide-react"

interface CryptoStockChartProps {
    latestValue: number
    show: boolean
}

export default function CryptoStockChart({ latestValue, show }: CryptoStockChartProps) {
    const [data, setData] = useState<{ time: number; value: number }[]>([
        { time: Date.now(), value: 0 },
    ])
    const [highValue, setHighValue] = useState(0)
    const [direction, setDirection] = useState<"up" | "down" | "neutral">("neutral")

    // Initialize or update data when component mounts or latestValue changes
    useEffect(() => {
        if (!show) return

        setData((currentData) => {
            // Create a copy of the current data
            const newData = [...currentData]

            // If we have 12 points already, remove the oldest
            if (newData.length >= 12) {
                newData.shift()
            }

            // Round to integer
            const roundedValue = Math.round(latestValue)

            // Add the new integer value
            newData.push({
                time: Date.now(),
                value: roundedValue,
            })

            // Update direction
            if (newData.length > 1) {
                const prevValue = newData[newData.length - 2].value
                if (roundedValue > prevValue) {
                    setDirection("up")
                } else if (roundedValue < prevValue) {
                    setDirection("down")
                } else {
                    setDirection("neutral")
                }
            }

            // Update high value
            if (roundedValue > highValue) {
                setHighValue(roundedValue)
            }

            return newData
        })
    }, [latestValue, show, highValue])

    // Custom tooltip component
    const CustomTooltip = ({ active, payload, label }: any) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-gray-900 border border-gray-700 p-2 rounded shadow-lg">
                    <p className="text-gray-200 font-bold">{dayjs(label).format("hh:mm:ss A")}</p>
                    <p className="text-gray-300">
                        Value: <span className="text-white font-bold">{payload[0].value}</span>
                    </p>
                </div>
            )
        }
        return null
    }

    // Don't render anything if show is false
    if (!show) return null;


    return (
        <div className="w-full h-48 bg-primary-game overflow-hidden border relative border-gray-700 p-2">
            {/* Direction indicator */}
            <div className="flex justify-between absolute top-2 right-2 z-10 items-center mb-1 px-2">
                <div className="flex items-center">
                    <span className="text-gray-300 text-sm mr-1">Trend:</span>
                    {direction === "up" && <span className="text-green-500 font-bold">
                        <Triangle className="size-3 fill-green-500" />
                    </span>}
                    {direction === "down" && <span className="text-red-500 font-bold">
                        <Triangle className="size-3 fill-red-500" />
                    </span>}
                    {direction === "neutral" && <span className="text-gray-400 font-bold">
                        <Triangle className="size-3 fill-gray-400" />
                    </span>}
                </div>
            </div>

            <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 15 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(107, 114, 128, 0.1)" />
                    <XAxis
                        dataKey="time"
                        tickFormatter={(time) => dayjs(time).format("hh:mm:ss A")}
                        stroke="#6B7280"
                        tick={{ fill: "#9CA3AF", fontSize: 10 }}
                        tickMargin={5}
                    />
                    <YAxis
                        domain={[0, 12]}
                        axisLine={{ stroke: "#6B7280" }}
                        tickLine={{ stroke: "#6B7280" }}
                        tick={{ fill: "#9CA3AF", fontSize: 10 }}
                        width={25}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <ReferenceLine y={highValue} stroke="rgba(107, 114, 128, 0.5)" strokeDasharray="3 3" />
                    <Line
                        type="linear"
                        dataKey="value"
                        stroke="#2563EB"
                        strokeWidth={2}
                        dot={{
                            stroke: "#2563EB",
                            strokeWidth: 2,
                            r: 3,
                            fill: "#1F2937",
                        }}
                        activeDot={{
                            stroke: "#2563EB",
                            strokeWidth: 2,
                            r: 5,
                            fill: "#fff",
                        }}
                        isAnimationActive={true}
                        animationDuration={300}
                        label={({ x, y, value }) => (
                            <text
                                x={x}
                                y={y - 10}
                                fill="#9CA3AF"
                                textAnchor="middle"
                                dominantBaseline="middle"
                                style={{ fontWeight: "bold", fontSize: 10 }}
                            >
                                {value}
                            </text>
                        )}
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    )
}
