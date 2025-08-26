import { useState } from 'react'
import { SongPreview } from './SongPreview'
import { MediaPlayer } from './MediaPlayer'
import { Controller } from './Controller'
import { RightControls } from './RightControls'

export function AppFooter() {

	const playlist = [
		{ _id: '1', name: 'Song 1', youtubeVideoId: 'dGy04XN9Spw' },
		{ _id: '2', name: 'Song 2', youtubeVideoId: 'lP0EWIkQl1w' },
		{ _id: '3', name: 'Song 3', youtubeVideoId: 'JCcwNwmxu44' },
	];

	const [player, setPlayer] = useState(null)
	const [currentTime, setCurrentTime] = useState(0)
	const [duration, setDuration] = useState(0)
	const [currentIndex, setCurrentIndex] = useState(0);
	const currentSong = playlist[currentIndex];

	const handlePlayerReady = (playerInstance) => {
		setPlayer(playerInstance)
	}

	const handleTimeUpdate = (time) => {
		setCurrentTime(time)
	}

	const handleDurationChange = (videoDuration) => {
		setDuration(videoDuration)
	}

	const handleProgressChange = (newTime) => {
		setCurrentTime(newTime)
	}

	const playNext = () => setCurrentIndex((currentIndex + 1) % playlist.length);
	const playPrev = () => setCurrentIndex((currentIndex - 1 + playlist.length) % playlist.length);


	return (
		<footer className="app-footer full">
			<div className="footer-content">
				<div className="footer-left"><SongPreview /></div>
				<div className="footer-center">
					<Controller
						player={player}
						currentTime={currentTime}
						duration={duration}
						onTimeUpdate={handleTimeUpdate}
						onProgressChange={handleProgressChange}
						onNext={playNext}
						onPrev={playPrev}
					/>
				</div>
				<div className="footer-right">
					<RightControls player={player} />

				</div>
			</div>

			<MediaPlayer
				videoId={currentSong.youtubeVideoId}
				onReady={handlePlayerReady}
				onTimeUpdate={handleTimeUpdate}
				onDurationChange={handleDurationChange}

			/>
		</footer>
	)
}

