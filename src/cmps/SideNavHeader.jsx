import { SortStation } from "./SortStation"
import { StationFilter } from "./StationFilter"
import { useSelector } from 'react-redux'
import { setFilter } from '../store/actions/station.actions'

export function SideNavHeader() {
	const filterBy = useSelector(storeState => storeState.stationModule.filterBy)

	return (
		<section>
			<SortStation />
			<StationFilter filterBy={filterBy} onSetFilter={setFilter} />
		</section>
	)
}