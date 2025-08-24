import { userService } from '../services/user'
import { StationPreview } from './StationPreview'

export function StationList({ stations, onRemoveStation, onUpdateStation }) {
    
    function shouldShowActionBtns(station) {
        const user = userService.getLoggedinUser()
        
        if (!user) return false
        if (user.isAdmin) return true
        return station.owner?._id === user._id
    }


    if (!stations) return <p>Loading...</p>

    return <section>
        <ul className="station-list">
            {stations.map(station =>
                <li key={station._id}>
                    <StationPreview station={station}/>
                    {shouldShowActionBtns(station) && <div className="actions">
                        {/* <button onClick={() => onUpdateStation(station)}>Edit</button>
                        <button onClick={() => onRemoveStation(station._id)}>x</button> */}
                        <button onClick={() => playStation()(station._id)}>play</button>
                    </div>}
                </li>
                )}
        </ul>
    </section>
}