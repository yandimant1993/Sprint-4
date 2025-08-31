import { useEffect, useState } from "react"
import { useSelector } from 'react-redux'

import { addStation, setFilter } from '../store/actions/station.actions'
import { SideNavHeader } from "./SideNavHeader"
import { StationList } from "./StationList"
import { SortStation } from "./SortStation"
import { StationFilter } from "./StationFilter"
import { UserStationList } from "./UserStationList"
import { stationService } from "../services/station"
import { useNavigate } from "react-router"
import { userService } from "../services/user"

export function SideNav() {
    const stations = useSelector(storeState => storeState.stationModule.stations)
    // const filterBy = useSelector(storeState => storeState.stationModule.filterBy)
    const [isExpanded, setIsExpanded] = useState(true)

    // console.log('userStations', userStations)

    const loggedInUser = userService.getLoggedinUser()
    if (!loggedInUser) return <span>Loading...</span>
    const { _id: userId } = loggedInUser
    const userStations = stations.filter(station => station.createdBy._id === userId)

    const navigate = useNavigate()


    async function onCreateStation() {
        try {
            const newStation = stationService.getEmptyStation()
            const savedStation = await addStation(newStation)
            navigate(`/station/${savedStation._id}`)
        } catch (err) {
            console.error('Failed to create and navigate to station:', err)
        }
    }

    if (!userStations) return <span>Loading...</span>

    return (
        <section className={`sidenav-container ${isExpanded ? 'expanded' : 'collapsed'}`}>
            <SideNavHeader createStation={onCreateStation} setIsExpanded={setIsExpanded} isExpanded={isExpanded} />
            <div className="sidenav-filter-sort flex">
                {/* <StationFilter filterBy={filterBy} onSetFilter={setFilter} /> */}
                {/* <SortStation /> */}
            </div>
            {userStations.length && <UserStationList stations={userStations} isExpanded={isExpanded} />}
        </section>
    )
}