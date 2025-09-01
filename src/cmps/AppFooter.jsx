import { useState, useEffect, useRef } from 'react'
import { SongPreview } from './SongPreview'
import { MediaPlayer } from './MediaPlayer'
import { Controller } from './Controller'
import { RightControls } from './RightControls'

export function AppFooter({ searchedVideoId }) {
	const playlist = [
		{ _id: '1', name: 'Song 1', youtubeVideoId: 'JCcwNwmxu44' },
		{ _id: '2', name: 'Song 2', youtubeVideoId: 'dGy04XN9Spw' },
		{ _id: '3', name: 'Song 3', youtubeVideoId: 'lP0EWIkQl1w' },
	]

	const [currentIndex, setCurrentIndex] = useState(0)
	const [videoToPlay, setVideoToPlay] = useState(searchedVideoId || playlist[0].youtubeVideoId)
	const playerRef = useRef(null)
	const [currentTime, setCurrentTime] = useState(0)
	const [duration, setDuration] = useState(0)

	const currentSong = playlist[currentIndex]


	useEffect(() => {
		const newVideo = searchedVideoId || currentSong.youtubeVideoId
		if (newVideo !== videoToPlay) {
			setVideoToPlay(newVideo)
		}
	}, [searchedVideoId, currentIndex])

	const handlePlayerReady = (playerInstance) => {
		playerRef.current = playerInstance
	}

	useEffect(() => {
		if (playerRef.current && videoToPlay) {
			const currentPlayerVideoId = playerRef.current.getVideoData()?.video_id
			if (currentPlayerVideoId !== videoToPlay) {
				playerRef.current.loadVideoById(videoToPlay)
				playerRef.current.playVideo()
			}
		}
	}, [videoToPlay])

	const handleTimeUpdate = (time) => setCurrentTime(time)
	const handleDurationChange = (videoDuration) => setDuration(videoDuration)
	const handleProgressChange = (newTime) => setCurrentTime(newTime)

	const playNext = () => setCurrentIndex((currentIndex + 1) % playlist.length)
	const playPrev = () => setCurrentIndex((currentIndex - 1 + playlist.length) % playlist.length)

	return (
		<footer className="app-footer full">
			<div className="footer-content">
				<div className="footer-left grid"><SongPreview /></div>
				<div className="footer-center">
					<Controller
						player={playerRef.current}
						currentTime={currentTime}
						duration={duration}
						onTimeUpdate={handleTimeUpdate}
						onProgressChange={handleProgressChange}
						onNext={playNext}
						onPrev={playPrev}
					/>
				</div>
				<div className="footer-right">
					<RightControls player={playerRef.current} />
				</div>
			</div>

			<MediaPlayer
				videoId={videoToPlay}
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
