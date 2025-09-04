import { userService } from '../services/user'
import { StationPreview } from './StationPreview'
import { NavLink } from 'react-router-dom'
import { StationSection } from './StationSection'
import { useEffect } from 'react'

export function StationList({ stations }) {

    function shouldShowActionBtns(station) {
        const user = userService.getLoggedinUser()

        if (!user) return false
        if (user.isAdmin) return true
        return station.owner?._id === user._id
    }

    const filteredUserStations = stations.filter(station => station.type === 'system')
    const sectionCount = 8

    if (!stations) return <p>Loading...</p>
    // return (
    //     <>
    //         <span className='your-mixes'>Your Top Mixes</span>
    //         <ul className="station-list">
    //             {filteredUserStations.map(station =>
    //                 <li key={station._id}>
    //                     <NavLink
    //                         to={`/station/${station._id}`}
    //                         key={station._id}>
    //                         <StationPreview station={station} />
    //                         {shouldShowActionBtns(station) && <div className="actions">
    //                         </div>}
    //                     </NavLink>
    //                 </li>
    //             )}
    //         </ul>

    //     </>
    // )

    return (
        <>
            <StationSection
                title="Your Top Mixes"
                stations={filteredUserStations.slice(0, sectionCount)}
                shouldShowActionBtns={shouldShowActionBtns}
            />
            <StationSection
                title="Recently Played"
                stations={filteredUserStations.slice(sectionCount, 2 * sectionCount)}
                shouldShowActionBtns={shouldShowActionBtns}
            />
            <StationSection
                title="Recommended"
                stations={filteredUserStations.slice(2 * sectionCount, 3 * sectionCount)}
                shouldShowActionBtns={shouldShowActionBtns}
            />
            <StationSection
                title="Episodes you might like"
                stations={filteredUserStations.slice(3 * sectionCount, 4 * sectionCount)}
                shouldShowActionBtns={shouldShowActionBtns}
            />
            <StationSection
                title="Throwback"
                stations={filteredUserStations.slice(4 * sectionCount, 5 * sectionCount)}
                shouldShowActionBtns={shouldShowActionBtns}
            />
            <StationSection
                title="Mood"
                stations={filteredUserStations.slice(5 * sectionCount, 6 * sectionCount)}
                shouldShowActionBtns={shouldShowActionBtns}
            />
        </>
    )
}