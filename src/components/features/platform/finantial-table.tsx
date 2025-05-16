"use client"

import { useRef, useEffect, useState } from "react"
import { motion, AnimatePresence } from "motion/react"
import { cn } from "@/lib/utils"

type TableProps = {
  data: any[],
  className?: string
}

export function FinancialTable({ data, className }: TableProps) {
  const tableRef = useRef<HTMLDivElement>(null)
  const [hoveredRow, setHoveredRow] = useState<string | null>(null)

  // Scroll to top when new data arrives
  useEffect(() => {
    if (tableRef.current && data.length > 0) {
      tableRef.current.scrollTop = 0
    }
  }, [data])

  const headers = ["Game", "User", "Time", "Amount (Rs.)"]

  // Enhanced row animation variants
  const rowVariants = {
    hidden: { opacity: 0, x: -20, scale: 0.98 },
    visible: (i: number) => ({
      opacity: 1,
      x: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 280,
        damping: 20,
        mass: 0.5,
        delay: i * 0.03,
      }
    }),
    exit: { 
      opacity: 0, 
      x: 20, 
      scale: 0.96,
      transition: { duration: 0.2 }
    },
    hover: {
      scale: 1.01,
      backgroundColor: "#0f2045",
      boxShadow: "0 0 15px rgba(74,158,255,0.15)",
      transition: { duration: 0.15 }
    }
  }

  // Header glow animation
  const glowVariants = {
    initial: { textShadow: "0 0 0px rgba(74,158,255,0)" },
    animate: {
      textShadow: ["0 0 0px rgba(74,158,255,0)", "0 0 8px rgba(74,158,255,0.7)", "0 0 0px rgba(74,158,255,0)"],
      transition: {
        duration: 2,
        repeat: Infinity,
        repeatType: "reverse" as const
      }
    }
  }

  // Amount value animation
  const amountVariants = {
    initial: { scale: 1 },
    animate: { scale: 1 },
    highlight: {
      scale: [1, 1.15, 1],
      transition: { duration: 0.4 }
    }
  }

  return (
    <div className={cn("relative rounded-xl overflow-hidden border border-[#1a2747] ", className)}>
      <div
        ref={tableRef}
        className="overflow-x-auto w-full scrollbar-thin scrollbar-thumb-[#1a2747] scrollbar-track-transparent"
      >
        <table className="w-full border-collapse">
          <thead className="bg-[#0a1631] sticky top-0 z-10">
            <tr className="border-b border-[#243868]">
              {headers.map((header, index) => (
                <motion.th 
                  key={index} 
                  className="py-4 px-6 text-left font-medium text-gray-300 hover:text-[#4a9eff] transition-colors"
                  variants={glowVariants}
                  initial="initial"
                  animate="animate"
                  custom={index}
                >
                  {header}
                </motion.th>
              ))}
            </tr>
          </thead>
          <tbody>
            <AnimatePresence initial={false}>
              {data.map((item, index) => (
                <motion.tr
                  key={item.id}
                  variants={rowVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  whileHover="hover"
                  custom={index}
                  onMouseEnter={() => setHoveredRow(item.id)}
                  onMouseLeave={() => setHoveredRow(null)}
                  className={`border-b border-[#1a2747] ${
                    index % 2 === 0 ? "bg-[#051029]" : "bg-[#030b1c]"
                  }`}
                >
                  <td className="py-4 px-6 text-left">
                    <motion.span 
                      className="font-medium text-[#4a9eff]"
                      animate={{
                        color: hoveredRow === item.id ? "#5eadff" : "#4a9eff"
                      }}
                      transition={{ duration: 0.2 }}
                    >
                      Casino
                    </motion.span>
                  </td>
                  <td className="py-4 px-6 text-left">
                    <span className="text-gray-300">{item.user}</span>
                  </td>
                  <td className="py-4 px-6 text-left text-gray-400">{item.time}</td>
                  <td className="py-4 px-6 text-left">
                    <motion.span
                      className="text-green-400"
                      variants={amountVariants}
                      initial="initial"
                      animate={hoveredRow === item.id ? "highlight" : "animate"}
                    >
                      ₹{item.amount}
                    </motion.span>
                  </td>
                </motion.tr>
              ))}
            </AnimatePresence>
          </tbody>
        </table>
      </div>
      
      {/* Enhanced gradient effect at the bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#030b1c] to-transparent pointer-events-none"></div>
      
      {/* Subtle scan line effect */}
      <motion.div 
        className="absolute inset-0 pointer-events-none opacity-5 bg-gradient-to-b from-transparent via-[#4a9eff]/5 to-transparent"
        animate={{
          backgroundPosition: ["0% 0%", "0% 100%"],
        }}
        transition={{
          duration: 2.5,
          repeat: Infinity,
          ease: "linear"
        }}
      />
      
      {/* Accent line at the top */}
      <div className="absolute top-12 left-0 right-0 h-px bg-[#243868]"></div>
    </div>
  )
}