import { useEffect, useRef, useState } from "react"

interface BlastVideoProps {
  isPlaying: boolean
  setIsBlastPlaying: (isPlaying: boolean) => void
}

export default function BlastVideo({ isPlaying, setIsBlastPlaying }: BlastVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [opacity, setOpacity] = useState(0)
  const [isVideoReady, setIsVideoReady] = useState(false)
  const [hasError, setHasError] = useState(false)

  // Preload and prepare video
  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const handleCanPlay = () => {
      console.log("🎬 Blast video is ready to play")
      setIsVideoReady(true)
      setHasError(false)
    }

    const handleLoadStart = () => {
      console.log("🎬 Blast video started loading")
    }

    const handleError = (e: Event) => {
      console.error("🎬 Blast video error:", e)
      setHasError(true)
    }

    video.addEventListener('canplay', handleCanPlay)
    video.addEventListener('loadstart', handleLoadStart)
    video.addEventListener('error', handleError)

    // Force load the video
    video.load()

    return () => {
      video.removeEventListener('canplay', handleCanPlay)
      video.removeEventListener('loadstart', handleLoadStart)
      video.removeEventListener('error', handleError)
    }
  }, [])

  useEffect(() => {
    const video = videoRef.current
    
    if (isPlaying) {
      console.log("🎬 Starting blast video playback, videoReady:", isVideoReady, "hasError:", hasError)
      
      // Fade in (0.1 seconds)
      setTimeout(() => {
        setOpacity(1)
      }, 100)

      // If video isn't ready, wait for it to load
      if (!video || !isVideoReady) {
        console.log("🎬 Video not ready yet, waiting...")
        return
      }

      if (hasError) {
        console.log("🎬 Video has error, cannot play")
        return
      }

      // Set playback rate and reset video
      video.playbackRate = 3
      video.currentTime = 0

      // Play video with promise handling
      const playPromise = video.play()
      
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            console.log("🎬 Blast video playing successfully")
          })
          .catch((error) => {
            console.error("🎬 Blast video play failed:", error)
            // Try to play without sound as fallback
            video.muted = true
            return video.play()
          })
          .catch((error) => {
            console.error("🎬 Blast video play failed even when muted:", error)
          })
      }

      // When video ends, fade out
      const handleVideoEnd = () => {
        console.log("🎬 Blast video ended")
        setOpacity(0)
        setIsBlastPlaying(false)
      }

      video.addEventListener('ended', handleVideoEnd)

      return () => {
        video.removeEventListener('ended', handleVideoEnd)
      }
    } else {
      // Fade out immediately when not playing
      setOpacity(0)
      if (video) {
        video.pause()
        video.currentTime = 0
      }
    }
  }, [isPlaying, setIsBlastPlaying, isVideoReady, hasError])

  return (
    <div 
      className="absolute inset-0 transition-opacity duration-100 ease-in-out z-50"
      style={{ opacity }}
    >
      {/* Video element */}
      <video 
        ref={videoRef}
        src="/videos/Blast.webm" 
        muted 
        preload="auto"
        playsInline
        className="w-full h-full object-cover"
      />
    </div>
  )
}