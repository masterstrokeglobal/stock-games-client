"use client"

import { useRef, useEffect } from "react"
import { motion, AnimatePresence } from "motion/react"
import { cn } from "@/lib/utils"
type TableProps = {
  data: any[],
  className?: string
}

export function FinancialTable({ data, className }: TableProps) {
  const tableRef = useRef<HTMLDivElement>(null)

  // Scroll to top when new data arrives
  useEffect(() => {
    if (tableRef.current && data.length > 0) {
      tableRef.current.scrollTop = 0
    }
  }, [data])

  const headers = ["Game", "User", "Time", "Amount (Rs.)"]

  return (
    <div className={cn("relative rounded-xl overflow-hidden border border-[#1a2747]", className)}>
      
      <div
        ref={tableRef}
        className="overflow-x-auto scrollbar-thin scrollbar-thumb-[#1a2747] scrollbar-track-transparent"
      >
        <table className="w-full border-collapse">
          <thead className="bg-[#0a1631] sticky top-0 z-10">
            <tr>
              {headers.map((header, index) => (
                <th key={index} className="py-4 px-6 text-left font-medium text-gray-300">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <AnimatePresence initial={false}>
              {data.map((item, index) => (
                <motion.tr
                  key={item.id}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, height: 0, overflow: "hidden" }}
                  transition={{
                    type: "spring",
                    stiffness: 300,
                    damping: 30,
                    mass: 0.8,
                    duration: 0.5,
                    delay: index * 0.03,
                  }}
                  className={`border-b border-[#1a2747] ${index % 2 === 0 ? "bg-[#051029]" : "bg-[#030b1c]"}`}
                >
                  <td className="py-4 px-6 text-left">
                    <span>Casino</span>
                  </td>
                  <td className="py-4 px-6 text-left">
                    <span>{item.user}</span>
                  </td>
                  <td className="py-4 px-6 text-left">{item.time}</td>
                  <td className="py-4 px-6 text-left">
                    <span className="text-green-400">₹{item.amount}</span>
                  </td>
                </motion.tr>
              ))}
            </AnimatePresence>
          </tbody>
        </table>
      </div>

      {/* Gradient fade effect at the bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[#030b1c] to-transparent pointer-events-none"></div>
    </div>
  )
}
