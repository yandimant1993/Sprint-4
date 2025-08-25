import React, { useState, useRef, useEffect } from 'react'
import { useSelector } from 'react-redux'

export function MediaController() {
    const [isPlaying, setIsPlaying] = useState(false)
    const [currentTime, setCurrentTime] = useState(0)
    const [duration, setDuration] = useState(0)
    const [isShuffled, setIsShuffled] = useState(false)
    const [isRepeating, setIsRepeating] = useState(false)

    const audioRef = useRef(null)

    const mockDuration = 224 
    const mockCurrentTime = 101 

    useEffect(() => {
        setDuration(mockDuration)
        setCurrentTime(mockCurrentTime)
    }, [])

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60)
        const secs = Math.floor(seconds % 60)
        return `${mins}:${secs.toString().padStart(2, '0')}`
    }

    const handlePlayPause = () => {
        setIsPlaying(!isPlaying)
    }

    const handleProgressChange = (e) => {
        const newTime = (e.target.value / 100) * duration
        setCurrentTime(newTime)
    }

    const progressPercentage = duration ? (currentTime / duration) * 100 : 0

    return (
        <div className="media-controller">
            <div className="media-controls">
                <button 
                    className={`control-btn shuffle ${isShuffled ? 'active' : ''}`}
                    onClick={() => setIsShuffled(!isShuffled)}
                    title="Shuffle"
                >
                    <img src="/src/assets/spotify-icons/shuffle.svg" alt="Shuffle" />
                </button>

                <button className="control-btn previous" title="Previous">
                    <img src="/src/assets/spotify-icons/previous.svg" alt="Previous" />
                </button>

                <button 
                    className="control-btn play-pause"
                    onClick={handlePlayPause}
                    title={isPlaying ? 'Pause' : 'Play'}
                >
                    {isPlaying ? (
                        <img src="/src/assets/spotify-icons/pause.svg" alt="Pause" />
                    ) : (
                        <img src="/src/assets/spotify-icons/play.svg" alt="Play" />
                    )}
                </button>

                <button className="control-btn next" title="Next">
                    <img src="/src/assets/spotify-icons/next.svg" alt="Next" />
                </button>

                <button 
                    className={`control-btn repeat ${isRepeating ? 'active' : ''}`}
                    onClick={() => setIsRepeating(!isRepeating)}
                    title="Repeat"
                >
                    <img src="/src/assets/spotify-icons/repeat.svg" alt="Repeat" />
                </button>
            </div>

            <div className="progress-container">
                <span className="time current">{formatTime(currentTime)}</span>
                <div className="progress-bar">
                    <input
                        type="range"
                        className="progress-slider"
                        min="0"
                        max="100"
                        value={progressPercentage}
                        onChange={handleProgressChange}
                    />
                    <div 
                        className="progress-fill"
                        style={{ width: `${progressPercentage}%` }}
                    ></div>
                </div>
                <span className="time total">{formatTime(duration)}</span>
            </div>
        </div>
    )
}

export function RightControls() {
    const [volume, setVolume] = useState(50)
    const [isMuted, setIsMuted] = useState(false)

    const handleVolumeChange = (e) => {
        const newVolume = parseInt(e.target.value)
        setVolume(newVolume)
        setIsMuted(newVolume === 0)
    }

    const toggleMute = () => {
        if (isMuted) {
            setIsMuted(false)
            setVolume(50)
        } else {
            setIsMuted(true)
            setVolume(0)
        }
    }

    return (
        <div className="right-controls">
            <button className="control-btn microphone" title="Microphone">
                <img src="/src/assets/spotify-icons/now-playing.svg" alt="Microphone" />
                <div className="active-dot"></div>
            </button>

            <button className="control-btn video-lyrics" title="Video/Lyrics">
                <img src="/src/assets/spotify-icons/lyrics.svg" alt="Video/Lyrics" />
            </button>

            <button className="control-btn queue" title="Queue">
                <img src="/src/assets/spotify-icons/queue.svg" alt="Queue" />
            </button>

            <button className="control-btn connect-device" title="Connect to Device">
                <img src="/src/assets/spotify-icons/connect-to-device.svg" alt="Connect" />
            </button>

            <div className="volume-control">
                <button 
                    className="control-btn volume-btn" 
                    onClick={toggleMute}
                    title={isMuted ? 'Unmute' : 'Mute'}
                >
                    <img 
                        src={isMuted ? "/src/assets/spotify-icons/mute.svg" : "/src/assets/spotify-icons/volume-high.svg"} 
                        alt="Volume" 
                    />
                </button>

                <div className="volume-slider">
                    <input
                        type="range"
                        className="volume-range"
                        min="0"
                        max="100"
                        value={isMuted ? 0 : volume}
                        onChange={handleVolumeChange}
                    />
                    <div 
                        className="volume-fill"
                        style={{ width: `${isMuted ? 0 : volume}%` }}
                    ></div>
                </div>
            </div>

            <button className="control-btn fullscreen" title="Full Screen">
                <img src="/src/assets/spotify-icons/full-screen.svg" alt="Full Screen" />
            </button>
        </div>
    )
}

// Backward-compatible Controller that renders both parts stacked
export function Controller() {
    return (
        <div className="media-controller">
            <MediaController />
            <RightControls />
        </div>
    )
}