import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { setIsPlaying } from '../store/actions/player.actions'

export function MediaController({ currentTime, onProgressChange, onNext, onPrev }) {
    const isPlaying = useSelector(state => state.playerModule.isPlaying)
    const player = useSelector(state => state.playerModule.player)
    const duration = useSelector(state => state.playerModule.duration)

    const [isShuffled, setIsShuffled] = useState(false)
    const [isRepeating, setIsRepeating] = useState(false)

    function handlePlayPause() {
        setIsPlaying(!isPlaying)
    }

    const formatTime = (seconds) => {
        if (!seconds && seconds !== 0) return "0:00"
        const mins = Math.floor(seconds / 60)
        const secs = Math.floor(seconds % 60)
        return `${mins}:${secs.toString().padStart(2, '0')}`
    }

    // function handleProgressChange(e) {
    //     if (!player || !duration) return
    //     const newTime = (e.target.value / 100) * duration
    //     player.seekTo(newTime, true)
    //     if (onProgressChange) onProgressChange(newTime)
    // }

    function handleProgressChange(e) {
        if (!player || !duration) return
        const newTime = (e.target.value / 100) * duration
        player.seekTo(newTime, true)
        if (onProgressChange) onProgressChange(newTime)
    }

    const progressPercentage = duration ? (currentTime / duration) * 100 : 0
    return (
        <div className="media-controller">
            <div className="media-controls">
                <button className="control-btn previous" onClick={onPrev}>
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

                <button className="control-btn next" onClick={onNext}>
                    <img src="/src/assets/spotify-icons/next.svg" alt="Next" />
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
                        disabled={!player}
                    />
                    <div className="progress-fill" style={{ width: `${progressPercentage}%` }} />
                </div>
                <span className="time total">{formatTime(duration)}</span>
            </div>
        </div>
    )
}
