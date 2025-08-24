import { Link } from 'react-router-dom'

export function StationPreview({ station }) {
    return (
        <article className="station-preview">
            <p className="station-picture">{}</p>
            {/* <Link to={`/station/${station._id}`}>{station.name}</Link> */}


        </article>

    )
}