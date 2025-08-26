import React, { useState, useEffect } from 'react'

export function MediaController({ player, currentTime, duration, onProgressChange }) {
    const [isPlaying, setIsPlaying] = useState(false)
    const [isShuffled, setIsShuffled] = useState(false)
    const [isRepeating, setIsRepeating] = useState(false)

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60)
        const secs = Math.floor(seconds % 60)
        return `${mins}:${secs.toString().padStart(2, '0')}`
    }

    const handlePlayPause = () => {
        if (!player) return
        if (isPlaying) {
            player.pauseVideo()
        } else {
            player.playVideo()
        }
        setIsPlaying(!isPlaying)
    }

    const handleProgressChange = (e) => {
        if (!player || !duration) return
        const newTime = (e.target.value / 100) * duration
        player.seekTo(newTime, true)
        if (onProgressChange) onProgressChange(newTime)
    }

    const progressPercentage = duration ? (currentTime / duration) * 100 : 0

    useEffect(() => {
        if (!player) return
        const handleStateChange = (event) => {
            setIsPlaying(event.data === 1)
        }
        player.addEventListener('onStateChange', handleStateChange)
        return () => {
            player.removeEventListener('onStateChange', handleStateChange)
        }
    }, [player])

    return (
        <div className="media-controller">
            <div className="media-controls">
                <button
                    className={`control-btn shuffle ${isShuffled ? 'active' : ''}`}
                    onClick={() => setIsShuffled(!isShuffled)}
                    title="Shuffle"
                >
                    <img src="/src/assets/spotify-icons/shuffle.svg" alt="Shuffle" />
                    {/* <div className="active-dot"></div> */}
                </button>

                <button className="control-btn previous" title="Previous">
                    <img src="/src/assets/spotify-icons/previous.svg" alt="Previous" />
                </button>

                <button
                    className={`control-btn play-pause`}
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
                    {/* <div className="active-dot"></div> */}
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







