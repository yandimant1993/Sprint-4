import { useState } from "react"
import { useSelector } from 'react-redux'

import { setFilter } from '../store/actions/station.actions'
import { SideNavHeader } from "./SideNavHeader"
import { StationList } from "./StationList"
import { SortStation } from "./SortStation"
import { StationFilter } from "./StationFilter"

export function SideNav() {
    const stations = useSelector(storeState => storeState.stationModule.stations)
    const filterBy = useSelector(storeState => storeState.stationModule.filterBy)
    const [isExpanded, setIsExpanded] = useState(true)
    return (
        <section className={`sidenav-container ${isExpanded ? 'expanded' : 'collapsed'}`}>
            <SideNavHeader setIsExpanded={setIsExpanded} isExpanded={isExpanded} />
            <div className="sidenav-filter-sort flex">
                <StationFilter filterBy={filterBy} onSetFilter={setFilter} />
                <SortStation />
            </div>
            {stations?.length ? <StationList stations={stations} /> : <p>Loading stations...</p>}
        </section>
    )
}