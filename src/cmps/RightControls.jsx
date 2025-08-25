import React, { useState, useEffect } from 'react'


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
