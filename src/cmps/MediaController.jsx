import React, { useState } from 'react'

export function MediaController({ player }) {
    const [isPlaying, setIsPlaying] = useState(false)
    const [isShuffled, setIsShuffled] = useState(false)
    const [isRepeating, setIsRepeating] = useState(false)

    const handlePlayPause = () => {
        if (!player) return
        if (isPlaying) {
            player.pauseVideo()
        } else {
            player.playVideo()
        }
        setIsPlaying(!isPlaying)
    }

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
                </button>
            </div>
        </div>
    )
}