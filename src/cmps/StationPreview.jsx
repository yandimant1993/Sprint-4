import { Link } from 'react-router-dom'

export function StationPreview({ station }) {
    return <article className="station-preview">
        <header>
            <Link to={`/station/${station._id}`}>{station.name}</Link>
        </header>

        <p>AddedAt: <span>{station.addedat.toLocaleString()} Km/h</span></p>
        {station.owner && <p>Owner: <span>{station.owner.fullname}</span></p>}
        
    </article>
}