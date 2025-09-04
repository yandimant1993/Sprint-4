import { useEffect, useState } from "react"
import { useSelector } from 'react-redux'
import { useNavigate } from "react-router-dom"

import { addStation, setFilter } from '../store/actions/station.actions'
import { SideNavHeader } from "./SideNavHeader"
import { StationList } from "./StationList"
import { SortStation } from "./SortStation"
import { StationFilter } from "./StationFilter"
import { UserStationList } from "./UserStationList"
import { stationService } from "../services/station"
import { userService } from "../services/user"

export function SideNav() {
    const navigate = useNavigate()
    const stations = useSelector(storeState => storeState.stationModule.stations)
    // const filterBy = useSelector(storeState => storeState.stationModule.filterBy)
    const [isExpanded, setIsExpanded] = useState(true)

    const loggedinUser = userService.getLoggedinUser() || {}
    // if (!loggedinUser) return (
    //     <section className={`sidenav-container ${isExpanded ? 'expanded' : 'collapsed'}`}>
    //         <SideNavHeader createStation={onCreateStation} setIsExpanded={setIsExpanded} isExpanded={isExpanded} />
    //     </section>
    // )
    const { _id: userId, likedStationId: userLikedStation } = loggedinUser
    const userStations = stations.filter(station => station.type !== 'liked' && station.createdBy._id === userId)
    console.log('userStations',userStations)
    const likedStation = stations.find(station => station._id === userLikedStation)

    async function onCreateStation() {
        try {
            const newStation = stationService.getEmptyStation()
            const savedStation = await addStation(newStation)
            navigate(`/station/${savedStation._id}`)
        } catch (err) {
            console.error('Failed to create and navigate to station:', err)
        }
    }


    return (
        <section className={`sidenav-container ${isExpanded ? 'expanded' : 'collapsed'}`}>
            <SideNavHeader createStation={onCreateStation} setIsExpanded={setIsExpanded} isExpanded={isExpanded} />
            <div className="sidenav-filter-sort flex">
                {/* <StationFilter filterBy={filterBy} onSetFilter={setFilter} /> */}
                {/* <SortStation /> */}
            </div>
            {(!userStations.length && !likedStation) ? <span className="sidenav-no-stations">No playlists found</span> : <UserStationList stations={userStations} likedStation={likedStation} isExpanded={isExpanded} />}
        </section>
    )
}