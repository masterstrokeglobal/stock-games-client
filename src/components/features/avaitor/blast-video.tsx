import { useEffect, useRef } from "react"

interface BlastVideoProps {
  isBlastPlaying: boolean
  setIsBlastPlaying: (isPlaying: boolean) => void

  blastOpacity: number
  setBlastOpacity: (opacity: number) => void
}

export default function BlastVideo({ isBlastPlaying, setIsBlastPlaying, blastOpacity, setBlastOpacity }: BlastVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    if (isBlastPlaying) {
      setBlastOpacity(1)
      video.currentTime = 0
      video.playbackRate = 2
      video.play()

      const handleVideoEnd = () => {
        setBlastOpacity(0)
        setIsBlastPlaying(false)
      }

      video.addEventListener('ended', handleVideoEnd)
      return () => video.removeEventListener('ended', handleVideoEnd)
    } else {
      setBlastOpacity(0)
      video.pause()
      video.currentTime = 0
    }
  }, [isBlastPlaying])

  return (
    <div 
      className="absolute inset-0 transition-opacity duration-100 ease-in-out z-50"
      style={{ opacity: blastOpacity }}
    >
      <video 
        ref={videoRef}
        src="/videos/aviator/Blast.webm" 
        muted 
        preload="auto"
        playsInline
        className="w-full h-full object-cover"
      />
    </div>
  )
}