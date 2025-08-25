import { useState } from 'react'
import { SongPreview } from './SongPreview'
import { MediaPlayer } from './MediaPlayer'
import { Controller } from './Controller'
import { RightControls } from './RightControls'

export function AppFooter() {
	const [player, setPlayer] = useState(null)
	const [currentTime, setCurrentTime] = useState(0)
	const [duration, setDuration] = useState(0)

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
					/>
				</div>
				<div className="footer-right">
					<RightControls player={player} />

				</div>
			</div>

			<MediaPlayer
				videoId="Si0roOzucDk"
				onReady={handlePlayerReady}
				onTimeUpdate={handleTimeUpdate}
				onDurationChange={handleDurationChange}
			/>
		</footer>
	)
}

