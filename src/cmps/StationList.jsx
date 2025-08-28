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
    if (!stations) return <p>Loading...</p>
    return (
        <>
            <span className='your-mixes'>Your Top Mixes</span>
            <ul className="station-list">
                {stations.map(station =>
                    <li>
                        <NavLink to={`/station/${station._id}`} key={station._id}>
                            <StationPreview station={station} />
                            {shouldShowActionBtns(station) && <div className="actions">
                                {/* <button onClick={() => onUpdateStation(station)}>Edit</button>
                        <button onClick={() => onRemoveStation(station._id)}>x</button> */}

                            </div>}
                        </NavLink>
                    </li>
                )}
            </ul>
        </>
    )
}