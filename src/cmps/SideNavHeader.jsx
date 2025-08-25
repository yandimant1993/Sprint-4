import { SortStation } from "./SortStation"
import { StationFilter } from "./StationFilter"
import { useSelector } from 'react-redux'
import { setFilter } from '../store/actions/station.actions'
import { stationService } from "../services/station"
import { useNavigate } from 'react-router-dom'

export function SideNavHeader() {
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

	return (
		<section>
			<button className="btn-create-station" onClick={onCreateStation}>
				Create station
			</button>
			<SortStation />
			<StationFilter filterBy={filterBy} onSetFilter={setFilter} />
		</section>
	)
}
