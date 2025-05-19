"use client"
import { useState, useEffect, useRef } from "react"
import { motion, type PanInfo, useAnimationControls } from "framer-motion"
import { cn } from "@/lib/utils"

type PlacementType = "zeroth" | "both"

interface DigitPickerProps {
  betType: PlacementType
  onChange: (digits: string) => void
  disabled?: boolean
  value?: string
}

export function SlotMachine({
  betType,
  onChange,
  value = betType === "both" ? "000" : "0",
  disabled = false,
}: DigitPickerProps) {
  const digitCount = betType === "both" ? 3 : 1
  const prevValueRef = useRef(value)
  const [isSpinning, setIsSpinning] = useState(false)

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
      prevValueRef.current = value
    }
  }, [value, digitCount])

  // Handle digit selection from the reel
  const handleDigitChange = (index: number, digit: number) => {
    const newDigits = [...selectedDigits]
    newDigits[index] = digit
    setSelectedDigits(newDigits)

    const digitString = newDigits.map((d) => d.toString()).join("")
    prevValueRef.current = digitString
    onChange(digitString)
  }

  // Handle spin action
  const handleSpin = () => {
    if (disabled || isSpinning) return

    setIsSpinning(true)

    // Generate random digits
    const randomDigits = Array(digitCount)
      .fill(0)
      .map(() => Math.floor(Math.random() * 10))

    // Stagger the stopping of each reel
    setTimeout(() => {
      handleDigitChange(0, randomDigits[0])

      setTimeout(() => {
        if (digitCount > 1) handleDigitChange(1, randomDigits[1])

        setTimeout(() => {
          if (digitCount > 2) handleDigitChange(2, randomDigits[2])

          setTimeout(() => {
            setIsSpinning(false)
          }, 300)
        }, 300)
      }, 300)
    }, 1200)
  }

  return (
    <div className="relative flex justify-center items-center">
      {/* Main slot machine container */}
      <div className="relative bg-black rounded-xl overflow-hidden">
        {/* Reels container */}
        <div className="flex justify-center items-center p-4 space-x-4">
          {Array(digitCount)
            .fill(0)
            .map((_, index) => (
              <DigitReel
                key={index}
                selectedDigit={selectedDigits[index] || 0}
                onChange={(digit) => handleDigitChange(index, digit)}
                disabled={disabled}
                isSpinning={isSpinning}
                spinDelay={index * 200}
              />
            ))}
        </div>

        {/* Cyan neon outlines */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute left-[33.33%] top-0 bottom-0 w-[3px] bg-[#00ffff] shadow-[0_0_10px_#00ffff,0_0_15px_#00ffff] opacity-80"></div>
          <div className="absolute right-[33.33%] top-0 bottom-0 w-[3px] bg-[#00ffff] shadow-[0_0_10px_#00ffff,0_0_15px_#00ffff] opacity-80"></div>
        </div>
      </div>

      {/* Spin button - hidden but functional */}
      <button
        onClick={handleSpin}
        disabled={disabled || isSpinning}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        aria-label="Spin"
      />
    </div>
  )
}

// Separate component for each digit reel
function DigitReel({
  selectedDigit,
  onChange,
  disabled,
  isSpinning,
  spinDelay = 0,
}: {
  selectedDigit: number
  onChange: (digit: number) => void
  disabled: boolean
  isSpinning: boolean
  spinDelay?: number
}) {
  const [isDragging, setIsDragging] = useState(false)
  const reelRef = useRef<HTMLDivElement>(null)
  const controls = useAnimationControls()

  // Constants
  const DIGIT_HEIGHT = 70
  const VISIBLE_DIGITS = 3 // Number of visible digits in the reel
  const DIGITS_TO_SHOW = 12 // Show more digits to create a more realistic reel

  // Handle click on a specific digit
  const handleDigitClick = (digit: number) => {
    if (disabled) return
    onChange(digit)
  }

  // Handle drag start
  const handleDragStart = () => {
    if (disabled) return
    setIsDragging(true)
  }

  // Handle drag end
  const handleDragEnd = (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    if (disabled) return
    setIsDragging(false)

    // Calculate which digit was dragged to based on the drag distance
    const dragDistance = info.offset.y
    const draggedDigits = Math.round(dragDistance / DIGIT_HEIGHT)

    // Calculate new digit (with wrapping)
    let newDigit = (selectedDigit - draggedDigits) % 10
    if (newDigit < 0) newDigit += 10

    onChange(newDigit)
  }

  // Generate extended digits for the reel to create a more realistic slot machine effect
  const digits = []
  for (let i = 0; i < DIGITS_TO_SHOW; i++) {
    digits.push(i % 10)
  }

  // Calculate the position for the selected digit to be centered
  const yPosition = -selectedDigit * DIGIT_HEIGHT + DIGIT_HEIGHT * Math.floor(VISIBLE_DIGITS / 2)

  // Set up spinning animation
  useEffect(() => {
    if (isSpinning) {
      const spinAnimation = async () => {
        await controls.start({
          y: [yPosition, yPosition - 1000, yPosition - 2000],
          transition: {
            duration: 2,
            ease: "linear",
            delay: spinDelay / 1000,
          },
        })
        controls.set({ y: yPosition })
      }

      spinAnimation()
    } else {
      controls.start({ y: yPosition, transition: { type: "spring", stiffness: 300, damping: 30 } })
    }
  }, [isSpinning, yPosition, controls, spinDelay])

  return (
    <div className="relative w-20 h-[210px] overflow-hidden bg-black" ref={reelRef}>
      {/* The reel with all digits */}
      <motion.div
        className="absolute left-0 right-0"
        animate={controls}
        drag={!disabled && !isSpinning ? "y" : false}
        dragConstraints={{ top: -DIGIT_HEIGHT * 9, bottom: DIGIT_HEIGHT }}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        whileTap={{ cursor: "grabbing" }}
      >
        {digits.map((digit, index) => (
          <div
            key={`${digit}-${index}`}
            className={cn(
              "h-[70px] flex items-center justify-center font-bold cursor-pointer",
              "text-[#ff3366] text-5xl",
            )}
            onClick={() => handleDigitClick(digit)}
            style={{
              textShadow:
                "0 0 5px #ff3366, 0 0 10px #ff3366, 0 0 15px #ff3366, 0 1px 0 #999, 0 2px 0 #888, 0 3px 0 #777, 0 4px 0 #666, 0 5px 0 #555, 0 6px 0 #444, 0 7px 0 #333, 0 8px 7px rgba(0,0,0,0.7)",
            }}
          >
            {digit}
          </div>
        ))}
      </motion.div>

      {/* Gradient overlays for fade effect */}
      <div className="absolute top-0 left-0 right-0 h-[70px] bg-gradient-to-b from-black to-transparent pointer-events-none z-20"></div>
      <div className="absolute bottom-0 left-0 right-0 h-[70px] bg-gradient-to-t from-black to-transparent pointer-events-none z-20"></div>
    </div>
  )
}
