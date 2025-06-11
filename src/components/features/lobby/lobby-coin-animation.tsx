"use client"

import type React from "react"

import { useEffect, useState, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"
import type Lobby from "@/models/lobby"
import { Badge } from "@/components/ui/badge"

type CoinProps = {
  x: number
  y: number
  delay: number
  targetX: number
  targetY: number
}

const Coin = ({ x, y, delay, targetX, targetY }: CoinProps) => {
  return (
    <motion.div
      className="absolute w-6 h-6 rounded-full bg-yellow-400 shadow-lg z-10 flex items-center justify-center text-yellow-800 font-bold text-xs"
      initial={{ x, y, opacity: 0, scale: 0 }}
      animate={{
        x: [x, x + (Math.random() * 40 - 20), targetX],
        y: [y, y + (Math.random() * 40 - 20), targetY],
        opacity: [0, 1, 1, 0],
        scale: [0, 1, 1, 0.5],
      }}
      transition={{
        duration: 2,
        delay: delay,
        times: [0, 0.2, 0.8, 1],
      }}
    >
      $
    </motion.div>
  )
}

type LobbyCoinsAnimationProps = {
  lobby: Lobby
  onSuccess: () => void
}

export default function LobbyCoinsAnimation({ lobby, onSuccess }: LobbyCoinsAnimationProps) {
  const [isAnimating, setIsAnimating] = useState(true)
  const [isReady, setIsReady] = useState(false)
  const [centerPoint, setCenterPoint] = useState({ x: 0, y: 0 })
  const coinsPerPlayer = 8
  const animationDuration = 2000  // Match the coin animation duration
  const animationBuffer = 1500    // Buffer time after last coin animation
  const playerCount = lobby.lobbyUsers?.length || 0
  const maxCoinDelay = useRef(0)
  
  // Initialize center point and prepare animations
  useEffect(() => {
    const handleResize = () => {
      setCenterPoint({
        x: window.innerWidth / 2,
        y: window.innerHeight / 2,
      })
    }
    
    // Set initial center point
    handleResize()
    
    // Add resize listener
    window.addEventListener('resize', handleResize)
    
    // Calculate the maximum delay for any coin
    let maxDelay = 0
    lobby.lobbyUsers?.forEach((_, playerIndex) => {
      const delay = 0.1 + 0.5 + playerIndex * 0.1 // Match the max possible delay in generateCoins
      if (delay > maxDelay) maxDelay = delay
    })
    
    maxCoinDelay.current = maxDelay
    
    // Set ready after a short delay to ensure centerPoint is set
    setTimeout(() => setIsReady(true), 100)
    
    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [lobby.lobbyUsers])
  
  // Handle animation completion
  useEffect(() => {
    if (!isReady) return
    
    // Total animation time = longest coin delay + coin animation duration + buffer
    const totalAnimationTime = (maxCoinDelay.current * 1000) + animationDuration + animationBuffer
    
    const timer = setTimeout(() => {
      setIsAnimating(false)
      setTimeout(() => {
        onSuccess()
      }, 500) // Fade-out duration
    }, totalAnimationTime)
    
    return () => clearTimeout(timer)
  }, [isReady, onSuccess])

  // Position players in a circle around the center
  const getPlayerPosition = (index: number, total: number) => {
    const minDimension = Math.min(window.innerWidth, window.innerHeight)
    const radius = minDimension * 0.35
    const angle = (index / total) * Math.PI * 2 - Math.PI / 2 // Start from top
    return {
      x: centerPoint.x + radius * Math.cos(angle) - 30, // 30 is half the avatar size
      y: centerPoint.y + radius * Math.sin(angle) - 30,
    }
  }

  // Generate coins for each player
  const generateCoins = () => {
    if (!isReady) return []
    
    const coins: React.ReactNode[] = []

    lobby.lobbyUsers?.forEach((player, playerIndex) => {
      const position = getPlayerPosition(playerIndex, playerCount)

      for (let i = 0; i < coinsPerPlayer; i++) {
        const spreadFactor = 40
        const offsetX = (Math.random() - 0.5) * spreadFactor
        const offsetY = (Math.random() - 0.5) * spreadFactor
        const delay = 0.1 + Math.random() * 0.5 + playerIndex * 0.1

        coins.push(
          <Coin
            key={`${player.id}-coin-${i}`}
            x={position.x + offsetX}
            y={position.y + offsetY}
            delay={delay}
            targetX={centerPoint.x}
            targetY={centerPoint.y}
          />,
        )
      }
    })

    return coins
  }

  // Don't render anything until we're ready with proper measurements
  if (!isReady) {
    return null
  }

  return (
    <AnimatePresence>
      {isAnimating && (
        <motion.div
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Center pot/treasure */}
          <motion.div
            className="absolute w-24 h-24 bg-yellow-600 rounded-full z-0 flex items-center justify-center"
            style={{
              left: centerPoint.x - 48, // Half the width
              top: centerPoint.y - 48,  // Half the height
            }}
            initial={{ scale: 0 }}
            animate={{ scale: [0, 1, 1.1, 1] }}
            transition={{ duration: 1 }}
          >
            <div className="text-yellow-200 text-xl font-bold">POT</div>
          </motion.div>

          {/* Player avatars */}
          {lobby.lobbyUsers?.map((player, index) => {
            const position = getPlayerPosition(index, playerCount)

            return (
              <motion.div
                key={player.id}
                className="absolute"
                style={{
                  left: position.x,
                  top: position.y,
                }}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 * index, duration: 0.5 }}
              >
                <div className="relative">
                  <div className="w-16 h-16 rounded-full overflow-hidden">
                    <img
                      src={player.user?.profileImage || "/placeholder.svg"}
                      alt={player.user?.name || "Player"}
                      className={cn(
                        "w-full h-full object-cover",
                        lobby.isLeader(player.user?.id || "") ? "border-2 border-yellow-500" : "border-2 border-gray-700",
                      )}
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = "/placeholder.svg"
                      }}
                    />
                  </div>
                  {lobby.isLeader(player.user?.id || "") && (
                    <Badge className="absolute -bottom-2 -right-2 bg-yellow-500 text-white text-xs rounded-full">
                      Host
                    </Badge>
                  )}
                  <motion.div
                    className="absolute -bottom-6 w-full text-center text-white text-sm font-medium"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 * index, duration: 0.5 }}
                  >
                    {player.user?.name || "Player"}
                  </motion.div>
                </div>
              </motion.div>
            )
          })}

          {/* Coins */}
          {generateCoins()}

          {/* Title */}
          <motion.div
            className="absolute top-10 left-0 right-0 text-center"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h1 className="text-4xl font-bold text-white">Game Starting</h1>
            <p className="text-xl text-gray-300 mt-2">Collecting player contributions...</p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}