import { useState, useRef, useEffect } from 'react'
import Header from './components/Header'
import VideoFeed from './components/VideoFeed'
import Controls from './components/Controls'
import Footer from './components/Footer'
import './App.css'

function App() {
  const [isRunning, setIsRunning] = useState(false)
  const [mode, setMode] = useState('cursor') // 'cursor' or 'wheel'
  const [sensitivity, setSensitivity] = useState(5)
  const videoRef = useRef(null)
  const streamRef = useRef(null)
  const wsRef = useRef(null)

  // Add WebSocket connection
  const connectWebSocket = () => {
    wsRef.current = new WebSocket('ws://localhost:8000/ws')
    
    wsRef.current.onopen = () => {
      console.log('WebSocket Connected')
    }
    
    wsRef.current.onclose = () => {
      console.log('WebSocket Disconnected')
    }
    
    wsRef.current.onerror = (error) => {
      console.error('WebSocket Error:', error)
    }
  }

  // Function to send movement data to backend
  const sendMovementData = (dx, dy) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      const data = {
        mode,
        dx,
        dy,
        sensitivity
      }
      wsRef.current.send(JSON.stringify(data))
    }
  }

  const startWebcam = async () => {
    try {
      const constraints = {
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: "user", // Use front camera on mobile devices
          aspectRatio: { ideal: 16/9 }
        }
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints)
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        streamRef.current = stream
      }
    } catch (err) {
      console.error("Error accessing webcam:", err)
      alert("Unable to access webcam. Please ensure you have granted permission.")
    }
  }

  const stopWebcam = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop())
      if (videoRef.current) {
        videoRef.current.srcObject = null
      }
    }
  }

  const toggleTracking = () => {
    if (!isRunning) {
      startWebcam()
      connectWebSocket() // Connect WebSocket when starting
    } else {
      stopWebcam()
      if (wsRef.current) {
        wsRef.current.close() // Close WebSocket when stopping
      }
    }
    setIsRunning(!isRunning)
  }

  // Clean up WebSocket and webcam on unmount
  useEffect(() => {
    return () => {
      stopWebcam()
      if (wsRef.current) {
        wsRef.current.close()
      }
    }
  }, [])

  return (
    <div className="container">
      {/* Video Feed */}
      <VideoFeed 
        videoRef={videoRef}
        isRunning={isRunning}
        onMovement={sendMovementData}
      />

      {/* Controls */}
      <Controls 
        isRunning={isRunning}
        toggleTracking={toggleTracking}
        mode={mode}
        setMode={setMode}
        sensitivity={sensitivity}
        setSensitivity={setSensitivity}
      />

      {/* Status Footer */}
      <Footer 
        isRunning={isRunning}
        mode={mode}
      />
    </div>
  )
}

export default App
