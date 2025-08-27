import React, { useRef, useEffect, useState } from 'react'
import { useSelector } from "react-redux"
import YouTube from 'react-youtube'
import { setPlaying, setCurrentTime, setDuration } from "../store/actions/player.actions"

export function MediaPlayer({ videoId: propVideoId, onReady, onTimeUpdate, onDurationChange }) {

    const { currentStation, isPlaying } = useSelector(store => store.playerModule)
    const playerRef = useRef(null)
    const [currentTimeLocal, setCurrentTimeLocal] = useState(0)
    const [durationLocal, setDurationLocal] = useState(0)

    const videoId = propVideoId || currentStation?.youtubeVideoId


    useEffect(() => {
        if (!playerRef.current) return
        if (isPlaying && currentStation) {
            playerRef.current.playVideo()
        } else {
            playerRef.current.pauseVideo()
        }
    }, [currentStation, isPlaying])

    useEffect(() => {
        setCurrentTime(currentTimeLocal)
        if (onTimeUpdate) onTimeUpdate(currentTimeLocal)
    }, [currentTimeLocal])

    useEffect(() => {
        setDuration(durationLocal)
        if (onDurationChange) onDurationChange(durationLocal)
    }, [durationLocal])

    const handleReady = (event) => {
        playerRef.current = event.target
        if (onReady) onReady(event.target)

        const videoDuration = event.target.getDuration()
        setDurationLocal(videoDuration)
    }

    const handleStateChange = (event) => {
        if (event.data === 1) {
            const interval = setInterval(() => {
                if (playerRef.current?.getCurrentTime) {
                    const time = playerRef.current.getCurrentTime()
                    setCurrentTimeLocal(time)
                }
            }, 500)
            playerRef.current._timeInterval = interval
        } else {
            if (playerRef.current?._timeInterval) {
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
            if (playerRef.current?._timeInterval) clearInterval(playerRef.current._timeInterval)
        }
    }, [])

    if (!videoId) return <p>No video available</p>

    return (
        <div className="media-player">
            <YouTube
                videoId={videoId}
                opts={opts}
                onReady={handleReady}
                onStateChange={handleStateChange}
            />
            <div className="player-placeholder"></div>
            {currentStation && <h3>Playing: {currentStation.name}</h3>}
        </div>
    )
}


