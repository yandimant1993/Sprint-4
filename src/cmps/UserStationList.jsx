import { useState } from 'react'
import { useNavigate } from "react-router"
import { Svgs } from "./Svgs"

export function UserStationList({ stations, isExpanded, likedStation }) {
    const [isHovered, setIsHovered] = useState(false)
    const [isPinned, setIsPinned] = useState(false)
    const navigate = useNavigate()

    const loggedinUser = userService.getLoggedinUser()
    if (!loggedinUser) return
    const filteredUserStations = stations.filter(station => station.createdBy?._id === loggedinUser._id)

    function onNavigate(userStation) {
        navigate(`/station/${userStation._id}`)
    }

    console.log('likedStation: ',likedStation)
    return (
        <ul className="user-list">
            <li className={`user-station ${isExpanded ? 'collapsed' : ''}`} key={likedStation._id} onClick={() => onNavigate(likedStation)}>
                <img src={likedStation.stationImgUrl || './assets/img/liked-songs.jpg'} alt={likedStation.name || 'Playlist image'} className="user-station-img" />
                {isExpanded && likedStation && (
                    <div className="user-station-details flex">

                        <div className="user-station-name">{likedStation.name}</div>
                        <div className="user-station-playlist flex">
                            <div>

                                {/* WIP {Svgs?.isPinned} */}
                            </div>
                            <div>
                                <p className="user-station-playlist-info">Playlist&nbsp;•&nbsp;{loggedinUser.fullname}</p></div>
                        </div>
                    </div>
                )}
            </li>

            {filteredUserStations.map(userStation => (
                <li className={`user-station ${isExpanded ? 'collapsed' : ''}`} key={userStation._id} onClick={() => onNavigate(userStation)}>
                    <img src={userStation.stationImgUrl} alt={userStation.name} className="user-station-img" />
                    {isExpanded && userStation && (
                        <div className="user-station-details flex">

                            <div className="user-station-name">{userStation.name}</div>
                            <div className="user-station-playlist flex">
                                <div>

                                    {/* WIP {Svgs?.isPinned} */}
                                </div>
                                <div>
                                    <p className="user-station-playlist-info">Playlist&nbsp;•&nbsp;{loggedinUser.fullname}</p></div>
                            </div>
                        </div>
                    )}
                </li>
            ))}
        </ul>
    )
}
