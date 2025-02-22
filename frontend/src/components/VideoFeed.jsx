const VideoFeed = ({ videoRef, isRunning }) => {
  return (
    <div className="video-container">
      <video 
        ref={videoRef} 
        autoPlay 
        playsInline 
        className={`webcam-video ${isRunning ? 'active' : ''}`}
      />
      {!isRunning && (
        <div className="video-overlay">
          <span>Camera Off</span>
        </div>
      )}
    </div>
  );
};

export default VideoFeed;
