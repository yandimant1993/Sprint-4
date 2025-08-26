import { useNavigate } from 'react-router-dom'
import { stationService } from "../services/station"
import { Svgs } from './Svgs.jsx'

export function SideNavHeader({ setIsExpanded, isExpanded }) {
	const navigate = useNavigate()

	async function onCreateStation() {
		try {
			const emptyStation = stationService.getEmptyStation()
			const savedStation = await stationService.save(emptyStation)
			navigate(`/station/${savedStation._id}`)
		} catch (err) {
			console.error('Failed to create and navigate to station:', err)
		}
	}

	function toggleExpand() {
		setIsExpanded(prev => !prev)
	}

	return (
		<section className="sidenav-header flex">
			<button className="btn-sidenav-toggle" onClick={toggleExpand}>
				{isExpanded ? 'Your Library' : 'Expand'}
			</button>
			<button className="btn-create-station flex" onClick={onCreateStation}>
				{Svgs.addIcon} Create
			</button>
		</section>
	)
}
