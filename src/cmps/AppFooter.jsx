import { useState, useEffect, useRef } from 'react'
import { useSelector } from 'react-redux'

import { setPlayer } from '../store/actions/player.actions'
import { SongPreview } from './SongPreview'
import { MediaPlayer } from './MediaPlayer'
import { Controller } from './Controller'
import { RightControls } from './RightControls'
import { MobileNav } from './MobileNav'

export function AppFooter() {
	const playerRef = useRef(null)
	const isPlaying = useSelector(state => state.playerModule.isPlaying)
	const currentSong = useSelector(state => state.playerModule.currentSong)

	const [currentIndex, setCurrentIndex] = useState(0)
	const [currentTime, setCurrentTime] = useState(0)
	// const [duration, setDuration] = useState(0)

	function handlePlayerReady(playerInstance) {
		playerRef.current = playerInstance
		setPlayer(playerInstance)
	}

	useEffect(() => {
		if (playerRef.current && currentSong) {
			const currentPlayerSongId = playerRef.current.getVideoData()?.video_id
			if (currentPlayerSongId !== currentSong) {
				playerRef.current.loadVideoById(currentSong)
				playerRef.current.playVideo()
			}
		}
	}, [currentSong])

	const handleTimeUpdate = (time) => setCurrentTime(time)

	function handleDurationChange() {
		setDuration(currentSong.duration)
		console.log('currentSong.duration: ', currentSong.duration)
	}

	// const handleProgressChange = (newTime) => setCurrentTime(newTime)
	const playNext = () => setCurrentIndex((currentIndex + 1) % playlist.length)
	const playPrev = () => setCurrentIndex((currentIndex - 1 + playlist.length) % playlist.length)

	return (
		<footer className="app-footer flex">
			<div className="footer-content grid">
				<div className="footer-left grid">
					<SongPreview
						currentSong={currentSong}
						isPlaying={isPlaying}
					/>
				</div>
				<div className="footer-center grid">
					<Controller
						player={playerRef.current}
						currentTime={currentTime}
						// duration={duration}
						onTimeUpdate={handleTimeUpdate}
						onProgressChange={setCurrentTime}
						onNext={playNext}
						onPrev={playPrev}
					// onNext={handleNext}
					// onPrev={handlePrev}
					/>
				</div>
				<div className="footer-right flex">
					<RightControls />
				</div>
				<MobileNav />
			</div>

			<MediaPlayer
				videoId={currentSong.id}
				playerRef={playerRef}
				onReady={handlePlayerReady}
				onTimeUpdate={handleTimeUpdate}
				onDurationChange={handleDurationChange}
			/>
		</footer>
	)
}



// import { useState, useEffect } from 'react'
// import { SongPreview } from './SongPreview'
// import { MediaPlayer } from './MediaPlayer'
// import { Controller } from './Controller'
// import { RightControls } from './RightControls'

// export function AppFooter({ searchedVideoId }) {

// 	const playlist = [
// 		{ _id: '1', name: 'Song 1', youtubeVideoId: 'JCcwNwmxu44' },
// 		{ _id: '2', name: 'Song 2', youtubeVideoId: 'dGy04XN9Spw' },
// 		{ _id: '3', name: 'Song 3', youtubeVideoId: 'lP0EWIkQl1w' },
// 	]

// 	const [player, setPlayer] = useState(null)
// 	const [currentTime, setCurrentTime] = useState(0)
// 	const [duration, setDuration] = useState(0)
// 	const [currentIndex, setCurrentIndex] = useState(0)
// 	const [videoToPlay, setVideoToPlay] = useState(searchedVideoId || playlist[0].youtubeVideoId)

// 	const currentSong = playlist[currentIndex]

// 	useEffect(() => {
// 		setVideoToPlay(searchedVideoId || currentSong.youtubeVideoId)
// 	}, [searchedVideoId, currentIndex])

// 	useEffect(() => {
// 		if (player && videoToPlay) {
// 			player.loadVideoById(videoToPlay)
// 			player.playVideo()
// 		}
// 	}, [player, videoToPlay])

// 	const handlePlayerReady = (playerInstance) => {
// 		setPlayer(playerInstance)
// 	}

// 	const handleTimeUpdate = (time) => {
// 		setCurrentTime(time)
// 	}

// 	const handleDurationChange = (videoDuration) => {
// 		setDuration(videoDuration)
// 	}

// 	const handleProgressChange = (newTime) => {
// 		setCurrentTime(newTime)
// 	}

// 	const playNext = () => setCurrentIndex((currentIndex + 1) % playlist.length)
// 	const playPrev = () => setCurrentIndex((currentIndex - 1 + playlist.length) % playlist.length)

// 	return (
// 		<footer className="app-footer full">
// 			<div className="footer-content">
// 				<div className="footer-left"><SongPreview /></div>
// 				<div className="footer-center">
// 					<Controller
// 						player={player}
// 						currentTime={currentTime}
// 						duration={duration}
// 						onTimeUpdate={handleTimeUpdate}
// 						onProgressChange={handleProgressChange}
// 						onNext={playNext}
// 						onPrev={playPrev}
// 					/>
// 				</div>
// 				<div className="footer-right">
// 					<RightControls player={player} />
// 				</div>
// 			</div>

// 			<MediaPlayer
// 				videoId={videoToPlay}
// 				onReady={handlePlayerReady}
// 				onTimeUpdate={handleTimeUpdate}
// 				onDurationChange={handleDurationChange}
// 			/>
// 		</footer>
// 	)
// }
