import { useSelector } from 'react-redux'
import { SongPreview } from './SongPreview'
import { MediaPlayer } from './MediaPlayer'
import { Controller } from './Controller'

export function AppFooter() {
	const count = useSelector(storeState => storeState.userModule.count)

	return (
		<footer className="app-footer full">

			{import.meta.env.VITE_LOCAL ?
				<span className="local-services">Local Services</span> :
				<span className="remote-services">Remote Services</span>}
			<SongPreview />
			<MediaPlayer />
			<Controller />
		</footer>
	)
}