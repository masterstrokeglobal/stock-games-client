"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { motion, type PanInfo } from "framer-motion"
import { Input } from "@/components/ui/input"
import { StockSlotJackpotPlacementType } from "@/models/stock-slot-jackpot"
interface DigitPickerProps {
  betType: StockSlotJackpotPlacementType
  onChange: (digits: string) => void
  value?: string
}

export function DigitPicker({ betType, onChange, value = betType === "both" ? "00" : "0" }: DigitPickerProps) {
  const digitCount = betType === "both" ? 2 : 1

  // Store the previous value to compare
  const prevValueRef = useRef(value)

  // Temporary input state for handling backspace and editing
  const [inputValue, setInputValue] = useState(value)

  // Parse initial value
  const parseValue = (val: string) => {
    return val
      .padStart(digitCount, "0")
      .slice(-digitCount)
      .split("")
      .map((d) => Number.parseInt(d, 10))
  }

  // State for selected digits
  const [selectedDigits, setSelectedDigits] = useState<number[]>(parseValue(value))

  // Update internal state when value prop changes
  useEffect(() => {
    if (value !== prevValueRef.current) {
      setSelectedDigits(parseValue(value))
      setInputValue(value)
      prevValueRef.current = value
    }
  }, [value, digitCount])

  // Handle digit selection from the reel
  const handleDigitChange = (index: number, digit: number) => {
    const newDigits = [...selectedDigits]
    newDigits[index] = digit
    setSelectedDigits(newDigits)

    const digitString = newDigits.map((d) => d.toString()).join("")
    setInputValue(digitString)
    prevValueRef.current = digitString
    onChange(digitString)
  }

  // Handle input field change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newInputValue = e.target.value

    // Only allow digits and respect max length
    if (!/^\d*$/.test(newInputValue) || newInputValue.length > digitCount) {
      return
    }

    // Update the temporary input value
    setInputValue(newInputValue)

    // If input is not empty, update the digit picker
    if (newInputValue.length > 0) {
      const paddedValue = newInputValue.padStart(digitCount, "0")
      setSelectedDigits(parseValue(paddedValue))
      prevValueRef.current = paddedValue
      onChange(paddedValue)
    }
  }

  // Handle input field blur
  const handleInputBlur = () => {
    // If input is empty when blurred, reset to default value
    if (inputValue === "") {
      const defaultValue = betType === "zeroth" ? "0" : "00"
      setInputValue(defaultValue)
      setSelectedDigits(parseValue(defaultValue))
      prevValueRef.current = defaultValue
      onChange(defaultValue)
    } else {
      // Ensure the value is properly padded
      const paddedValue = inputValue.padStart(digitCount, "0")
      setInputValue(paddedValue)
      setSelectedDigits(parseValue(paddedValue))
      prevValueRef.current = paddedValue
      onChange(paddedValue)
    }
  }

  // Handle input field focus
  const handleInputFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    // Select all text when focused
    e.target.select()
  }

  return (
    <div className="flex flex-col h-full justify-between  items-center">
      <div className="flex justify-center items-center mb-4">
        {Array(digitCount)
          .fill(0)
          .map((_, index) => (
            <DigitReel
              key={index}
              selectedDigit={selectedDigits[index] || 0}
              onChange={(digit) => handleDigitChange(index, digit)}
            />
          ))}
      </div>

      <div className="w-full mt-2">
        <Input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onBlur={handleInputBlur}
          onFocus={handleInputFocus}
          className="w-full bg-[#2A2F42] border border-[#3A3F52] rounded-md px-3 py-2 text-center text-white text-xl font-semibold focus:border-amber-500 focus:ring-1 focus:ring-amber-500 focus:outline-none"
          placeholder={betType === "zeroth" ? "0-9" : "00-99"}
          inputMode="numeric"
          maxLength={digitCount}
        />
      </div>
    </div>
  )
}

// Separate component for each digit reel
function DigitReel({ selectedDigit, onChange }: { selectedDigit: number; onChange: (digit: number) => void }) {
  const [isDragging, setIsDragging] = useState(false)
  const reelRef = useRef<HTMLDivElement>(null)

  // Constants
  const DIGIT_HEIGHT = 60
  const VISIBLE_DIGITS = 3 // Number of visible digits in the reel

  // Handle click on a specific digit
  const handleDigitClick = (digit: number) => {
    onChange(digit)
  }

  // Handle drag start
  const handleDragStart = () => {
    setIsDragging(true)
  }

  // Handle drag end
  const handleDragEnd = (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    setIsDragging(false)

    // Calculate which digit was dragged to based on the drag distance
    const dragDistance = info.offset.y
    const draggedDigits = Math.round(dragDistance / DIGIT_HEIGHT)

    // Calculate new digit (with wrapping)
    let newDigit = (selectedDigit - draggedDigits) % 10
    if (newDigit < 0) newDigit += 10

    onChange(newDigit)
  }

  // Generate digits for the reel (0-9)
  const digits = Array(10)
    .fill(0)
    .map((_, i) => i)

  // Calculate the position for the selected digit to be centered
  const yPosition = -selectedDigit * DIGIT_HEIGHT + DIGIT_HEIGHT * Math.floor(VISIBLE_DIGITS / 2)

  return (
    <div
      className="relative w-16 h-[180px] overflow-hidden bg-[#0F1221] border border-[#3A3F52] rounded-md mx-1"
      ref={reelRef}
    >
      {/* Highlight for the selected digit */}
      <div className="absolute top-1/2 left-0 right-0 h-[60px] transform -translate-y-1/2 bg-[#2A2F42]/50 border-y-2 border-amber-500 z-10"></div>

      {/* The reel with all digits */}
      <motion.div
        className="absolute left-0 right-0"
        style={{ y: yPosition }}
        animate={{ y: yPosition }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        drag="y"
        dragConstraints={{ top: -DIGIT_HEIGHT * 9, bottom: DIGIT_HEIGHT }}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        whileTap={{ cursor: "grabbing" }}
      >
        {digits.map((digit) => (
          <div
            key={digit}
            className={`h-[60px] flex items-center justify-center text-2xl font-bold cursor-pointer
              ${digit === selectedDigit && !isDragging ? "text-amber-500 glow text-3xl" : "text-white"}`}
            onClick={() => handleDigitClick(digit)}
          >
            {digit}
          </div>
        ))}
      </motion.div>

      {/* Gradient overlays for fade effect */}
      <div className="absolute top-0 left-0 right-0 h-[60px] bg-gradient-to-b from-[#0F1221] to-transparent pointer-events-none z-20"></div>
      <div className="absolute bottom-0 left-0 right-0 h-[60px] bg-gradient-to-t from-[#0F1221] to-transparent pointer-events-none z-20"></div>
    </div>
  )
}
