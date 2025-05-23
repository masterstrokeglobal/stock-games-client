"use client"

import dayjs from "dayjs"
import { Triangle } from "lucide-react"
import { useEffect, useRef, useState } from "react"
import { Area, AreaChart, CartesianGrid, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

export default function GradientCryptoChart({ latestValue, show, id }: { latestValue: number, show: boolean, id: string }) {
  const [data, setData] = useState([
    { time: Date.now(), value: 0 },
  ])
  const [highValue, setHighValue] = useState(0)
  const [direction, setDirection] = useState("neutral")
  const prevIdRef = useRef(id)
  const lastUpdateTimeRef = useRef(Date.now())

  // Reset chart when id changes
  useEffect(() => {
    if (prevIdRef.current !== id) {
      // Reset data when id changes
      setData([{ time: Date.now(), value: latestValue || 0 }])
      setHighValue(latestValue || 0)
      setDirection("neutral")
      prevIdRef.current = id
      lastUpdateTimeRef.current = Date.now()
    }
  }, [id, latestValue])

  // Update data when component mounts or latestValue changes
  useEffect(() => {
    if (!show) return

    const updateInterval = setInterval(() => {
      const currentTime = Date.now()
      
      setData((currentData) => {
        // Create a copy of the current data
        const newData = [...currentData]
        const lastPoint = newData[newData.length - 1]
        
        // If more than 2 seconds passed since last update, add intermediate point
        if (currentTime - lastUpdateTimeRef.current >= 2000) {
          // If we have 60 points already, remove the oldest
          if (newData.length >= 60) {
            newData.shift()
          }

          newData.push({
            time: currentTime,
            value: lastPoint.value // Use same value to create flat line
          })
          
          lastUpdateTimeRef.current = currentTime
        }
        
        return newData
      })
    }, 2000)

    return () => clearInterval(updateInterval)
  }, [show])

  useEffect(() => {
    if (!show) return

    setData((currentData) => {
      // Create a copy of the current data
      const newData = [...currentData]

      // If we have 60 points already, remove the oldest
      if (newData.length >= 60) {
        newData.shift()
      }

      // Round to integer
      const roundedValue = Math.round(latestValue)

      // Add the new integer value
      newData.push({
        time: Date.now(),
        value: roundedValue,
      })

      lastUpdateTimeRef.current = Date.now()

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
  const CustomTooltip = ({ active, payload, label }: { active: boolean, payload: any[], label: string }) => {
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
    <div className="w-full h-64 bg-primary-game overflow-hidden  relative  p-2 ">
      {/* Direction indicator */}
      <div className="flex justify-between absolute top-2 right-2 z-10 items-center mb-1 px-2">
        <div className="flex items-center">
          <span className="text-gray-300 text-sm mr-1">Trend:</span>
          {direction === "up" && <span className="text-green-500 font-bold">
            <Triangle className="size-3 fill-green-500" />
          </span>}
          {direction === "down" && <span className="text-red-500 font-bold">
            <Triangle className="size-3 fill-red-500 transform rotate-180" />
          </span>}
          {direction === "neutral" && <span className="text-gray-400 font-bold">
            <Triangle className="size-3 fill-gray-400" />
          </span>}
        </div>
      </div>

      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 15 }}>
          <defs>
            <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#D97706" stopOpacity={0.1}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(107, 114, 128, 0.1)" />
          <XAxis
            dataKey="time"
            tickFormatter={(time) => dayjs(time).format("mm:ss")}
            stroke="#6B7280"
            tick={{ fill: "#9CA3AF", fontSize: 10 }}
            tickMargin={5}
          />
          <YAxis
            domain={[0, 12]}
            ticks={[0,1,2,3,4,5,6,7,8,9,10,11,12]}
            axisLine={{ stroke: "#6B7280" }}
            tickLine={{ stroke: "#6B7280" }}
            tick={{ fill: "#9CA3AF", fontSize: 10 }}
            width={30}
          />
          <Tooltip content={<CustomTooltip active={true} payload={[]} label={""} />} />
          <ReferenceLine y={highValue} stroke="rgba(200, 200, 200, 0.3)" strokeDasharray="3 3" />
          <Area
            type="monotone"
            dataKey="value"
            stroke="#F59E0B"
            strokeWidth={2}
            fill="url(#colorValue)"
            isAnimationActive={true}
            animationDuration={300}
            activeDot={{
              stroke: "#F59E0B",
              strokeWidth: 2,
              r: 4,
              fill: "#fff",
            }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}