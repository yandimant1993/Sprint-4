import { userService } from "../services/user";



export function UserStationList({ stations }) {

    const loggedinUser = userService.getLoggedinUser()
    console.log('loggedInUser',loggedinUser)
    if(!loggedinUser) return
    const filteredUserStations = stations.filter(station => station.createdBy?._id === loggedinUser._id)

    return (

        <ul className="user-list">
            {filteredUserStations.map(userStation => (
                <li className="user-station">
                    {userStation.name}
                    {"Playlist"}
                    {userStation.songs[0].performer}
                </li>
            ))}
        </ul>
    )
}