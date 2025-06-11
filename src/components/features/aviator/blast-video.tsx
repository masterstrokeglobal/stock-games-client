import { useEffect, useRef, useState } from "react"

interface BlastVideoProps {
  isPlaying: boolean
  setIsBlastPlaying: (isPlaying: boolean) => void
}

export default function BlastVideo({ isPlaying, setIsBlastPlaying }: BlastVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [opacity, setOpacity] = useState(0)

  useEffect(() => {
    if (isPlaying && videoRef.current) {
      // Fade in (0.1 seconds)
      setTimeout(() => {
        setOpacity(1)
      }, 100)

      // Set playback rate to 3x and play
      videoRef.current.playbackRate = 2
      videoRef.current.currentTime = 0
      videoRef.current.play()

      // When video ends, fade out
      const handleVideoEnd = () => {
          setOpacity(0)
          setIsBlastPlaying(false)
      }

      videoRef.current.addEventListener('ended', handleVideoEnd)

      return () => {
        if (videoRef.current) {
          videoRef.current.removeEventListener('ended', handleVideoEnd)
        }
      }
    } else {
      // Fade out immediately when not playing
      setOpacity(0)
      if (videoRef.current) {
        videoRef.current.pause()
      }
    }
  }, [isPlaying, setIsBlastPlaying])

  return (
    <div 
      className="absolute inset-0 transition-opacity duration-100 ease-in-out"
      style={{ opacity }}
    >
      <video 
        ref={videoRef}
        src="/videos/Blast.webm" 
        muted 
        className="w-full h-full object-cover"
      />
    </div>
  )
}