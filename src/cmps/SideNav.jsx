import { useEffect, useState } from "react"
import { useSelector } from 'react-redux'

import { setFilter } from '../store/actions/station.actions'
import { SideNavHeader } from "./SideNavHeader"
import { StationList } from "./StationList"
import { SortStation } from "./SortStation"
import { StationFilter } from "./StationFilter"
import { UserStationList } from "./UserStationList"
import { stationService } from "../services/station"
import { useNavigate } from "react-router"

export function SideNav() {
    // const stations = useSelector(storeState => storeState.stationModule.stations)
    // const filterBy = useSelector(storeState => storeState.stationModule.filterBy)
    const [isExpanded, setIsExpanded] = useState(true)
    const [userStations, setUserStations] = useState(null)
    // console.log('userStations', userStations)

    useEffect(() => {
        loadUserStations()
    }, [])

    const navigate = useNavigate()

    async function onCreateStation() {
        try {
            const newStation = stationService.getEmptyStation()
            const savedStation = await stationService.save(newStation)
            setUserStations(prevStations => [...prevStations, savedStation])
            navigate(`/station/${savedStation._id}`)
        } catch (err) {
            console.error('Failed to create and navigate to station:', err)
        }
    }
    
    async function loadUserStations() {
        const stations = await stationService.getUserStations()
        setUserStations(stations)
    }

    if (!userStations) return <span>Loading...</span>

    return (
        <section className={`sidenav-container ${isExpanded ? 'expanded' : 'collapsed'}`}>
            <SideNavHeader createStation={onCreateStation} setIsExpanded={setIsExpanded} isExpanded={isExpanded} />
            <div className="sidenav-filter-sort flex">
                {/* <StationFilter filterBy={filterBy} onSetFilter={setFilter} /> */}
                {/* <SortStation /> */}
            </div>
            {userStations.length && <UserStationList stations={userStations} isExpanded={isExpanded}/>}
        </section>
    )
}