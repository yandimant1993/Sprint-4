export function UserStationList({ stations, isCollapsed }) {
    const loggedinUser = userService.getLoggedinUser()
    if (!loggedinUser) return
    const filteredUserStations = stations.filter(station => station.createdBy?._id === loggedinUser._id)

    return (
        <ul className="user-list">
            {filteredUserStations.map(userStation => (
                <li className={`user-station ${isCollapsed ? 'collapsed' : ''}`} key={userStation._id}>
                    <img src={userStation.stationImgUrl} alt={userStation.name} className="user-station-picture" />
                    {!isCollapsed && (
                       <div className="user-station-details grid">

                            <div className="user-station-name">{userStation.name}</div>
                            <div className="user-station-playlist">{userStation.songs?.[0]?.performer}</div>
                       </div>
                    )}
                </li>
            ))}
        </ul>
    )
}
