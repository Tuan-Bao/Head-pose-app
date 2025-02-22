import { useEffect, useRef } from 'react'

function VideoFeed({ videoRef, isRunning, onMovement }) {
  const lastPosition = useRef({ x: 0, y: 0 })
  const movementBuffer = useRef({ x: 0, y: 0 })
  const lastUpdateTime = useRef(0)
  const UPDATE_INTERVAL = 16 // ~60fps

  useEffect(() => {
    const handleMouseMove = (event) => {
      if (!isRunning) return

      const currentTime = Date.now()
      
      // Calculate movement
      const dx = event.clientX - lastPosition.current.x
      const dy = event.clientY - lastPosition.current.y

      // Buffer the movement
      movementBuffer.current.x += dx
      movementBuffer.current.y += dy

      // Update position
      lastPosition.current = {
        x: event.clientX,
        y: event.clientY
      }

      // Rate limiting
      if (currentTime - lastUpdateTime.current >= UPDATE_INTERVAL) {
        // Send buffered movement
        if (Math.abs(movementBuffer.current.x) > 0 || Math.abs(movementBuffer.current.y) > 0) {
          onMovement(movementBuffer.current.x, movementBuffer.current.y)
          // Reset buffer
          movementBuffer.current = { x: 0, y: 0 }
        }
        lastUpdateTime.current = currentTime
      }
    }

    if (isRunning) {
      window.addEventListener('mousemove', handleMouseMove)
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      // Reset refs
      lastPosition.current = { x: 0, y: 0 }
      movementBuffer.current = { x: 0, y: 0 }
      lastUpdateTime.current = 0
    }
  }, [isRunning, onMovement])

  return (
    <div className="video-container">
      {!isRunning && (
        <div className="video-overlay">
          <p>Click Start to enable camera</p>
        </div>
      )}
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className="webcam-video"
      />
    </div>
  )
}

export default VideoFeed
