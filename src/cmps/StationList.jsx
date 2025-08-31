import { userService } from '../services/user'
import { StationPreview } from './StationPreview'
import { NavLink } from 'react-router-dom'

export function StationList({ stations }) {

    function shouldShowActionBtns(station) {
        const user = userService.getLoggedinUser()

        if (!user) return false
        if (user.isAdmin) return true
        return station.owner?._id === user._id
    }

    const filteredUserStations = stations.filter(station => station.type === 'system')

    if (!stations) return <p>Loading...</p>
    return (
        <>
            <span className='your-mixes'>Your Top Mixes</span>
            <ul className="station-list">
                {filteredUserStations.map(station =>
                    <li key={station._id}>
                        <NavLink
                            to={`/station/${station._id}`}
                            key={station._id}>
                            <StationPreview station={station} />
                            {shouldShowActionBtns(station) && <div className="actions">
                            </div>}
                        </NavLink>
                    </li>
                )}
            </ul>
        </>
    )
}