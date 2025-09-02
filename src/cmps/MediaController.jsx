// import React, { useState, useEffect } from 'react'

// export function MediaController({ player, currentTime, duration, onProgressChange, onNext, onPrev }) {
//     const [isPlaying, setIsPlaying] = useState(false)
//     const [isShuffled, setIsShuffled] = useState(false)
//     const [isRepeating, setIsRepeating] = useState(false)

//     const formatTime = (seconds) => {
//         if (!seconds && seconds !== 0) return "0:00"
//         const mins = Math.floor(seconds / 60)
//         const secs = Math.floor(seconds % 60)
//         return `${mins}:${secs.toString().padStart(2, '0')}`
//     }

//     const handlePlayPause = () => {
//         if (!player) return
//         if (isPlaying) {
//             player.pauseVideo()
//         } else {
//             player.playVideo()
//         }
//         setIsPlaying(!isPlaying)
//     }

//     const handleProgressChange = (e) => {
//         if (!player || !duration) return
//         const newTime = (e.target.value / 100) * duration
//         player.seekTo(newTime, true)
//         if (onProgressChange) onProgressChange(newTime)
//     }

//     const progressPercentage = duration ? (currentTime / duration) * 100 : 0

//     useEffect(() => {
//         if (!player) return
//         const interval = setInterval(() => {
//             const state = player.getPlayerState?.()
//             setIsPlaying(state === 1)
//         }, 500)
//         return () => clearInterval(interval)
//     }, [player])

//     return (
//         <div className="media-controller">
//             <div className="media-controls">
//                 <button
//                     className={`control-btn shuffle ${isShuffled ? 'active' : ''}`}
//                     onClick={() => setIsShuffled(!isShuffled)}
//                     title="Shuffle"
//                 >
//                     <img src="/src/assets/spotify-icons/shuffle.svg" alt="Shuffle" />
//                 </button>

//                 <button className="control-btn previous" title="Previous" onClick={onPrev}>
//                     <img src="/src/assets/spotify-icons/previous.svg" alt="Previous" />
//                 </button>

//                 <button
//                     className="control-btn play-pause"
//                     onClick={handlePlayPause}
//                     title={isPlaying ? 'Pause' : 'Play'}
//                     disabled={!player}
//                 >
//                     {isPlaying ? (
//                         <img src="/src/assets/spotify-icons/pause.svg" alt="Pause" />
//                     ) : (
//                         <img src="/src/assets/spotify-icons/play.svg" alt="Play" />
//                     )}
//                 </button>

//                 <button className="control-btn next" title="Next" onClick={onNext}>
//                     <img src="/src/assets/spotify-icons/next.svg" alt="Next" />
//                 </button>

//                 <button
//                     className={`control-btn repeat ${isRepeating ? 'active' : ''}`}
//                     onClick={() => setIsRepeating(!isRepeating)}
//                     title="Repeat"
//                 >
//                     <img src="/src/assets/spotify-icons/repeat.svg" alt="Repeat" />
//                 </button>
//             </div>

//             <div className="progress-container">
//                 <span className="time current">{formatTime(currentTime)}</span>
//                 <div className="progress-bar">
//                     <input
//                         type="range"
//                         className="progress-slider"
//                         min="0"
//                         max="100"
//                         value={progressPercentage}
//                         onChange={handleProgressChange}
//                         disabled={!player}
//                     />
//                     <div
//                         className="progress-fill"
//                         style={{ width: `${progressPercentage}%` }}
//                     ></div>
//                 </div>
//                 <span className="time total">{formatTime(duration)}</span>
//             </div>
//         </div>
//     )
// }


import { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { setIsPlaying, setCurrentTime } from '../store/actions/player.actions'

export function MediaController({ onNext, onPrev }) {
    // const player = useSelector(state => state.playerModule.player)
    // const isPlaying = useSelector(state => state.playerModule.isPlaying)
    // const currentStation = useSelector(state => state.playerModule.currentStation)
    // const currentTime = useSelector(state => state.playerModule.currentTime)
    // const duration = useSelector(state => state.playerModule.duration)

    const { player, currentSong, isPlaying, currentTime, duration } = useSelector(
        state => ({
            player: state.playerModule.player,
            currentSong: state.playerModule.currentSong,
            isPlaying: state.playerModule.isPlaying,
            currentTime: state.playerModule.currentTime,
            duration: state.playerModule.duration,
        }))
    const [isShuffled, setIsShuffled] = useState(false)
    const [isRepeating, setIsRepeating] = useState(false)
// console.log('player: ',player)
    useEffect(() => {
        if (!player) return
        if (isPlaying) player.playVideo()
        else player.pauseVideo()
    }, [isPlaying, player])

    useEffect(() => {
        if (!player || !currentSong) return
        player.loadVideoById(currentSong.videoId)
    }, [currentSong, player])

    function formatTime(seconds) {
        if (!seconds && seconds !== 0) return "0:00"
        const mins = Math.floor(seconds / 60)
        const secs = Math.floor(seconds % 60)
        return `${mins}:${secs.toString().padStart(2, '0')}`
    }

    function handlePlayPause() {
        console.log('hi');
        setIsPlaying(!isPlaying)
    }

    function handleProgressChange(e) {
        if (!player || !duration) return
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

                <button className="control-btn previous" title="Previous" onClick={onPrev}>
                    <img src="/src/assets/spotify-icons/previous.svg" alt="Previous" />
                </button>

                <button
                    className="control-btn play-pause"
                    onClick={handlePlayPause}
                    title={isPlaying ? 'Pause' : 'Play'}
                    // disabled={!player || !currentSong}
                >
                    {isPlaying ? (
                        <img src="/src/assets/spotify-icons/pause.svg" alt="Pause" />
                    ) : (
                        <img src="/src/assets/spotify-icons/play.svg" alt="Play" />
                    )}
                </button>

                <button className="control-btn next" title="Next" onClick={onNext}>
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
                        disabled={!player}
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


