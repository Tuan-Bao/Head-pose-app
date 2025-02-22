import { useEffect, useRef } from 'react'

function VideoFeed({ videoRef, isRunning, onMovement }) {
  const lastPosition = useRef({ x: 0, y: 0 })
  const smoothedDelta = useRef({ x: 0, y: 0 })
  
  useEffect(() => {
    const SMOOTHING_FACTOR = 0.5 // Adjust between 0 and 1 (higher = smoother)
    const DEADZONE = 2 // Minimum movement threshold
    const UPDATE_INTERVAL = 16 // ~60fps
    let intervalId

    const handleMouseMove = (event) => {
      if (!isRunning) return

      const dx = event.clientX - lastPosition.current.x
      const dy = event.clientY - lastPosition.current.y

      // Apply smoothing
      smoothedDelta.current.x = smoothedDelta.current.x * SMOOTHING_FACTOR + dx * (1 - SMOOTHING_FACTOR)
      smoothedDelta.current.y = smoothedDelta.current.y * SMOOTHING_FACTOR + dy * (1 - SMOOTHING_FACTOR)

      lastPosition.current = {
        x: event.clientX,
        y: event.clientY
      }
    }

    const sendMovement = () => {
      if (!isRunning) return

      // Apply deadzone
      const dx = Math.abs(smoothedDelta.current.x) > DEADZONE ? smoothedDelta.current.x : 0
      const dy = Math.abs(smoothedDelta.current.y) > DEADZONE ? smoothedDelta.current.y : 0

      // Only send if there's significant movement
      if (dx !== 0 || dy !== 0) {
        onMovement(dx, dy)
      }
    }

    if (isRunning) {
      window.addEventListener('mousemove', handleMouseMove)
      intervalId = setInterval(sendMovement, UPDATE_INTERVAL)
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      if (intervalId) {
        clearInterval(intervalId)
      }
      // Reset smoothed values
      smoothedDelta.current = { x: 0, y: 0 }
    }
  }, [isRunning, onMovement])

  return (
    <div className="video-container">
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className="video-feed"
      />
    </div>
  )
}

export default VideoFeed
