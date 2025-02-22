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

  const startWebcam = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true })
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
    } else {
      stopWebcam()
    }
    setIsRunning(!isRunning)
  }

  useEffect(() => {
    return () => {
      stopWebcam()
    }
  }, [])

  return (
    <div className="container">
      {/* <Header /> */}
      
      <main>
        <VideoFeed 
          videoRef={videoRef}
          isRunning={isRunning}
        />

        <Controls 
          isRunning={isRunning}
          toggleTracking={toggleTracking}
          mode={mode}
          setMode={setMode}
          sensitivity={sensitivity}
          setSensitivity={setSensitivity}
        />
      </main>

      <Footer 
        isRunning={isRunning}
        mode={mode}
      />
    </div>
  )
}

export default App
