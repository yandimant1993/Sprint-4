import React, { useState, useEffect } from 'react'

export function MediaController({ player, currentTime, duration, onTimeUpdate, onProgressChange }) {
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
        if (player) {
            const handleStateChange = (event) => {

                setIsPlaying(event.data === 1)
            }

            player.addEventListener('onStateChange', handleStateChange)
            return () => {
                player.removeEventListener('onStateChange', handleStateChange)
            }
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
                    <div className="active-dot "></div>
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
                    <div className="active-dot"></div>
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

export function RightControls({ player }) {
    const [volume, setVolume] = useState(50)
    const [isMuted, setIsMuted] = useState(false)

    const handleVolumeChange = (e) => {
        if (!player) return
        const newVolume = parseInt(e.target.value)
        setVolume(newVolume)
        player.setVolume(newVolume)
        setIsMuted(newVolume === 0)
    }

    const toggleMute = () => {
        if (!player) return
        if (isMuted) {
            setIsMuted(false)
            setVolume(50)
            player.setVolume(50)
        } else {
            setIsMuted(true)
            setVolume(0)
            player.setVolume(0)
        }
    }

    useEffect(() => {
        if (player) {
            player.setVolume(volume)
        }
    }, [player, volume])


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

export function Controller({ player, currentTime, duration, onTimeUpdate, onProgressChange }) {
    return (
        <div className="media-controller">
            <MediaController
                player={player}
                currentTime={currentTime}
                duration={duration}
                onTimeUpdate={onTimeUpdate}
                onProgressChange={onProgressChange}
            />
            <RightControls player={player} />
        </div>
    )
}

