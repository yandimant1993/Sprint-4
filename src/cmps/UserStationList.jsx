import { useState } from 'react'
import { useSelector } from "react-redux"
import { Svgs } from "./Svgs"

export function UserStationList({ stations, isCollapsed }) {
    const [isHovered, setIsHovered] = useState(false)
    const [isPinned, setIsPinned] = useState(false)

    const loggedinUser = userService.getLoggedinUser()
    if (!loggedinUser) return
    const filteredUserStations = stations.filter(station => station.createdBy?._id === loggedinUser._id)

    return (
        <ul className="user-list">
            {filteredUserStations.map(userStation => (
                <li className={`user-station ${isCollapsed ? 'collapsed' : ''}`} key={userStation._id}>
                    <img src={userStation.stationImgUrl} alt={userStation.name} className="user-station-img" />
                    {!isCollapsed && (
                        <div className="user-station-details flex">

                            <div className="user-station-name">{userStation.name}</div>
                            <div className="user-station-playlist flex">
                                <div>
                                    {/* {Svgs?.isPinned} */}
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
