
import { NavLink } from 'react-router-dom'
import { StationPreview } from './StationPreview'


export function StationSection({ title, stations, shouldShowActionBtns }) {
    return (
        <>
            <span className="your-mixes">{title}</span>
            <ul className="station-list">
                {stations.map(station => (
                    <li key={station._id}>
                        <NavLink to={`/station/${station._id}`}>
                            <StationPreview station={station} />
                            {shouldShowActionBtns(station) && <div className="actions"></div>}
                        </NavLink>
                    </li>
                ))}
            </ul>
        </>
    )
}