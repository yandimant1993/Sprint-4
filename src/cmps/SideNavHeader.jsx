import { useSelector } from 'react-redux'
import { setFilter } from '../store/actions/station.actions'
import { stationService } from "../services/station"
import { useNavigate } from 'react-router-dom'

import { SortStation } from "./SortStation"
import { StationFilter } from "./StationFilter"

export function SideNavHeader({ setIsExpanded, isExpanded }) {
	const filterBy = useSelector(storeState => storeState.stationModule.filterBy)
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
		<section className="side-nav-header">
			<button className="btn-sidenav-toggle" onClick={toggleExpand}>
				{isExpanded ? 'Collapse' : 'Expand'}
			</button>
			<button className="btn-create-station" onClick={onCreateStation}>
				Create station
			</button>
			<SortStation />
			<StationFilter filterBy={filterBy} onSetFilter={setFilter} />
		</section>
	)
}
