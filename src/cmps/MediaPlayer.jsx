import React, { useRef, useEffect, useState } from 'react'
import YouTube from 'react-youtube'

export function MediaPlayer({ videoId, onReady, onTimeUpdate, onDurationChange }) {
    const playerRef = useRef(null)
    const [currentTime, setCurrentTime] = useState(0)
    const [duration, setDuration] = useState(0)

    const handleReady = (event) => {
        playerRef.current = event.target
        if (onReady) onReady(event.target)


        const videoDuration = event.target.getDuration()
        setDuration(videoDuration)
        if (onDurationChange) onDurationChange(videoDuration)
    }

    const handleStateChange = (event) => {

        if (event.data === 1) {
            const interval = setInterval(() => {
                if (playerRef.current && playerRef.current.getCurrentTime) {
                    const time = playerRef.current.getCurrentTime()
                    setCurrentTime(time)
                    if (onTimeUpdate) onTimeUpdate(time)
                }
            }, 1000)


            playerRef.current._timeInterval = interval
        } else {

            if (playerRef.current && playerRef.current._timeInterval) {
                clearInterval(playerRef.current._timeInterval)
            }
        }
    }

    const opts = {
        height: '0',
        width: '0',
        playerVars: {
            autoplay: 0,
            controls: 0,
            disablekb: 1,
            fs: 0,
            iv_load_policy: 3,
            modestbranding: 1,
            rel: 0,
            showinfo: 0,
        },
    }


    useEffect(() => {
        return () => {
            if (playerRef.current && playerRef.current._timeInterval) {
                clearInterval(playerRef.current._timeInterval)
            }
        }
    }, [])

    return (
        <div className="media-player">
            <YouTube
                videoId={videoId}
                opts={opts}
                onReady={handleReady}
                onStateChange={handleStateChange}
            />
            <div className="player-placeholder"></div>
        </div>
    )
}