import { useRef, useEffect, useState } from 'react'
import { useSelector } from "react-redux"
import YouTube from 'react-youtube'
import { setPlayer, setIsPlaying, setDuration } from "../store/actions/player.actions"

export function MediaPlayer({ onReady, onTimeUpdate, setCurrentTime, setDuration }) {
    const playerRef = useRef(null)

    const isPlaying = useSelector(store => store.playerModule.isPlaying)
    const currentSong = useSelector(store => store.playerModule.currentSong)

    // const [currentTimeLocal, setCurrentTimeLocal] = useState(0)
    // const [durationLocal, setDurationLocal] = useState(0)

    useEffect(() => {
        if (!playerRef.current || !currentSong) return
        playerRef.current.loadVideoById(currentSong.id)
    }, [currentSong])

    useEffect(() => {
        if (!playerRef.current) return
        const interval = setInterval(() => {
            const time = playerRef.current.getCurrentTime?.()
            if (time !== undefined && onTimeUpdate) onTimeUpdate(time)
        }, 1000)
        return () => clearInterval(interval)
    }, [onTimeUpdate])

    // useEffect(() => {
    //     return () => {
    //         if (playerRef.current?._timeInterval) clearInterval(playerRef.current._timeInterval)
    //     }
    // }, [])

    // const handleReady = (event) => {
    //     playerRef.current = event.target
    //     if (onReady) onReady(event.target)
    //     setDurationLocal(currentSong.duration)
    // }

    // const handleStateChange = (event) => {
    //     if (event.data === 1) {
    //         const interval = setInterval(() => {
    //             if (playerRef.current?.getCurrentTime) {
    //                 const time = playerRef.current.getCurrentTime()
    //                 setCurrentTimeLocal(time)
    //             }
    //         }, 500)
    //         playerRef.current._timeInterval = interval
    //     } else {
    //         if (playerRef.current?._timeInterval) {
    //             clearInterval(playerRef.current._timeInterval)
    //         }
    //     }
    // }

    function onReady(event) {
        setPlayer(event.target)
    }

    // function onReady(event) {
    //     playerRef.current = event.target
    //     setPlayer(event.target)

    function onReady(event) {
        playerRef.current = event.target
        setPlayer(event.target)

        const videoDuration = event.target.getDuration()
        if (videoDuration) {
            setPlayer(event.target)
            setDuration(videoDuration)
        }
    }

    function onStateChange(event) {
        const state = event.data
        if (state === 1) {
            setIsPlaying(true)
        } else if (state === 2 || state === 0) {
            setIsPlaying(false)
        }
    }

    const opts = {
        height: '0',
        width: '0',
        playerVars: {
            autoplay: 1,
            controls: 0,
            disablekb: 1,
            fs: 0,
            iv_load_policy: 3,
            modestbranding: 1,
            rel: 0,
            showinfo: 0,
        },
    }

    // if (!propVideoId) return <p>No video available</p>

    return (
        <div className="media-player">
            <YouTube
                videoId={currentSong?.id}
                opts={opts}
                onReady={onReady}
                onStateChange={onStateChange}
            />
            <div className="player-placeholder"></div>
        </div>
    )
}


