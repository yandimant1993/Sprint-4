import { useState } from 'react'
import { useNavigate } from "react-router"
import { userService } from "../services/user"
import { Svgs } from "./Svgs"

export function UserStationList({ stations, isExpanded, likedStation }) {
    const navigate = useNavigate()
    const [isPinned, setIsPinned] = useState(false)
    const [isHovered, setIsHovered] = useState(false)

    const loggedinUser = userService.getLoggedinUser()
    if (!loggedinUser) return null
    const filteredUserStations = stations.filter(station => station.createdBy?._id === loggedinUser._id)

    function onNavigate(userStation) {
        navigate(`/station/${userStation._id}`)
    }

    console.log('likedStation: ', likedStation)
    return (
        <ul className="user-list">
            {likedStation && (
                <li
                    className={`user-station ${isExpanded ? 'collapsed' : ''}`}
                    key={likedStation._id}
                    onClick={() => onNavigate(likedStation)}
                >
                    <img
                        src={likedStation.stationImgUrl || './assets/img/liked-songs.jpg'}
                        alt={likedStation.name || 'Playlist image'}
                        className="user-station-img"
                    />
                    {isExpanded && (
                        <div className="user-station-details flex">
                            <div className="user-station-name">{likedStation.name || 'Liked Songs'}</div>
                            <div className="user-station-playlist flex">
                                <div>{/* WIP {Svgs?.isPinned} */}</div>
                                <div>
                                    <p className="user-station-playlist-info">
                                        Playlist&nbsp;•&nbsp;{loggedinUser.fullname}
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}
                </li>
            )}

            {filteredUserStations.map(userStation => (
                <li
                    className={`user-station ${isExpanded ? 'collapsed' : ''}`}
                    key={userStation._id}
                    onClick={() => onNavigate(userStation)}
                >
                    <img
                        src={userStation.stationImgUrl || './assets/img/default-station.jpg'}
                        alt={userStation.name || 'Playlist Image'}
                        className="user-station-img"
                    />
                    {isExpanded && (
                        <div className="user-station-details flex">
                            <div className="user-station-name">{userStation.name || 'Untitled Station'}</div>
                            <div className="user-station-playlist flex">
                                <div>{/* WIP {Svgs?.isPinned} */}</div>
                                <div>
                                    <p className="user-station-playlist-info">
                                        Playlist&nbsp;•&nbsp;{loggedinUser.fullname}
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}
                </li>
            ))}
        </ul>
    )
}
