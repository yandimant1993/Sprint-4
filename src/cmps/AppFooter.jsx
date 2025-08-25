import { useSelector } from 'react-redux'
import { SongPreview } from './SongPreview'
import { MediaPlayer } from './MediaPlayer'
import { MediaController, RightControls } from './Controller'

export function AppFooter() {
	const count = useSelector(storeState => storeState.userModule.count)

	return (
		<footer className="app-footer full">
			{/* {import.meta.env.VITE_LOCAL ?
				<span className="local-services">Local Services</span> :
				<span className="remote-services">Remote Services</span>} */}

			<div className="footer-content">
				<div className="footer-left"><SongPreview /></div>
				<div className="footer-center"><MediaController /></div>
				<div className="footer-right"><RightControls /></div>
			</div>
		</footer>
	)
}