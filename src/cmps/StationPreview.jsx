import { NavLink } from 'react-router-dom'

export function StationPreview({ station }) {
    return (
        <article className="station-preview">
            <NavLink to={`/station/${station._id}`}>
            {play}
            </NavLink>
            {station.stationImgUrl &&
                <img 
                src={station.stationImgUrl} 
                alt={station.name} 
                className="station-picture" />
}
            <p className="singer">{station.songs[0].performer}</p>
        </article>
    )
}