export function UserStationList({ stations, isCollapsed }) {
    const loggedinUser = userService.getLoggedinUser()
    if (!loggedinUser) return
    const filteredUserStations = stations.filter(station => station.createdBy?._id === loggedinUser._id)

    return (
        <ul className="user-list">
            {filteredUserStations.map(userStation => (
                <li className={`user-station ${isCollapsed ? 'collapsed' : ''}`} key={userStation._id}>
                    <img src={userStation.stationImgUrl} alt={userStation.name} className="station-picture" />
                    {!isCollapsed && (
                        <>
                            <div className="station-name">{userStation.name}</div>
                            <div className="station-playlist">{userStation.songs?.[0]?.performer}</div>
                        </>
                    )}
                </li>
            ))}
        </ul>
    )
}
