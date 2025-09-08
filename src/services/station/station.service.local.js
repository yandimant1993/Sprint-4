
import { storageService } from '../async-storage.service'
import { makeId } from '../util.service'
import { userService } from '../user'

const STORAGE_KEY = 'station'

export const stationService = {
    query,
    getById,
    save,
    remove,
    getUserStations,
    removeSong,
    addSong,
    toggleLikedSongs,
    getSongFromStation
}
window.cs = stationService

_createStations()

async function query(filterBy = { txt: '' }) {
    var stations = await storageService.query(STORAGE_KEY)
    const { txt, minAddedAt, sortField, sortDir } = filterBy

    if (txt) {
        const regex = new RegExp(filterBy.txt, 'i')
        stations = stations.filter(station => regex.test(station.name) || regex.test(station.description))
    }
    if (minAddedAt) {
        stations = stations.filter(station => station.addedAt >= minAddedAt)
    }
    if (sortField === 'name') {
        stations.sort((station1, station2) =>
            station1[sortField].localeCompare(station2[sortField]) * +sortDir)
    }
    if (sortField === 'addedAt') {
        stations.sort((station1, station2) =>
            (station1[sortField] - station2[sortField]) * +sortDir)
    }

    // stations = stations.map(({ _id, name, addedAt, owner }) => ({ _id, name, addedAt, owner }))
    return stations
}

async function getById(stationId) {
    try {
        return await storageService.get(STORAGE_KEY, stationId)
    } catch (err) {
        throw new Error(`Get failed, cannot find entity with id: ${stationId} in: ${STORAGE_KEY}`)
    }
}

async function getUserStations() {
    try {
        const { _id: userId } = userService.getLoggedinUser()
        const stations = await query()
        const userStations = stations.filter(station => station.createdBy._id === userId)
        return userStations
    } catch (error) {

    }
}

async function remove(stationId) {
    try {
        return await storageService.remove(STORAGE_KEY, stationId)
    } catch (err) {
        throw new Error(`Remove failed, cannot find entity with id: ${stationId} in: ${STORAGE_KEY}`)
    }
}

async function toggleLikedSongs(song) {
    const loggedinUser = userService.getLoggedinUser()
    if (!loggedinUser) throw new Error('No logged-in user found')
    const user = await storageService.get('user', loggedinUser._id)
    if (!user.likedSongIds) user.likedSongIds = []
    // console.log('song: ', song)
    // console.log('song.id: ', song.id)
    // const songIdx = user.likedSongIds.findIndex(likedSong => likedSong.id === song.id)
    const isLiked = user.likedSongIds.includes(song.id)
    if (isLiked) {
        user.likedSongIds = user.likedSongIds.filter(sId => sId !== song.id)
        console.log(`Removed "${song.title}" from likedSongIds`)
    } else {
        user.likedSongIds.push(song.id)
        console.log(`Added "${song.title}" to likedSongIds`)
    }

    const updatedUser = await storageService.put('user', user)
    const method = isLiked ? 'removeSong' : 'addSong'
    song = isLiked ? song.id : song
    const savedStation = await stationService[method](loggedinUser.likedStationId, song)
    console.log('savedStation: ',savedStation)
    userService.saveLoggedinUser(updatedUser)

    return savedStation
}

// async function toggleLikedSongs(song) {
//     const loggedinUser = userService.getLoggedinUser()
//     if (!loggedinUser) throw new Error('No logged-in user found')
//     const user = await storageService.get('user', loggedinUser._id)
//     if (!user.likedSongIds) user.likedSongIds = []
//     // console.log('song: ', song)
//     // console.log('song.id: ', song.id)
//     // const songIdx = user.likedSongIds.findIndex(likedSong => likedSong.id === song.id)
//     const isLiked = user.likedSongIds.includes(song.id)
//     if (isLiked) {
//         user.likedSongIds = user.likedSongIds.filter(sId => sId !== song.id)
//         console.log(`Removed "${song.title}" from likedSongIds`)
//     } else {
//         user.likedSongIds.push(song.id)
//         console.log(`Added "${song.title}" to likedSongIds`)
//     }

//     const updatedUser = await storageService.put('user', user)
//     userService.saveLoggedinUser(updatedUser)

//     const method = isLiked ? 'removeSong' : 'addSong'
//     song = isLiked ? song.id : song
//     const savedStation = await stationService[method](loggedinUser.likedStationId, song)

//     return savedStation
// }

async function removeSong(stationId, songId) {
    const station = await getById(stationId)
    station.songs = station.songs.filter(s => s.id !== songId)
    const savedStation = await save(station)
    return savedStation
}

async function addSong(stationId, song) {
    const station = await getById(stationId)
    // if (!station) throw new Error('Station not found!')
    station.songs.push(song)
    const savedStation = await save(station)
    return savedStation
}

async function save(station) {
    console.log('station', station)
    const { _id, fullname, imgUrl } = userService.getLoggedinUser()

    try {
        if (station._id) {

            return await storageService.put(STORAGE_KEY, station)
        } else {
            station.createdBy = { _id, fullname, imgUrl }
            return await storageService.post(STORAGE_KEY, station)
        }
    } catch (err) {
        console.log('Error saving station:', err)
        throw err
    }
}

async function getSongFromStation(stationId, songId) {
    try {
        const station = await getById(stationId)
        if (!station) throw new Error('Station not found')

        const songs = station.songs || []
        const song = songs.find(s => s.id === songId)
        if (!song) throw new Error('Song not found')
        return { song, songs }
    } catch (err) {
        console.log('Error getting songs from station', err)
        throw err
    }
}

// async function addStationMsg(stationId, txt) {
//     // Later, this is all done by the backend
//     const station = await getById(stationId)

//     const msg = {
//         id: makeId(),
//         by: userService.getLoggedinUser(),
//         txt
//     }
//     station.msgs.push(msg)
//     await storageService.put(STORAGE_KEY, station)

//     return msg
// }

async function _createStations() {
    try {
        let stations = await storageService.query(STORAGE_KEY) || []
        if (stations.filter(({ type }) => type !== 'liked').length > 0) return
        const stationJson = [

            {
                "_id": "64f1cdd298b8c2a1d4a12f3a",
                "name": "Late Night Loops",
                "description": "Ed Sheeran and acoustic guitars on the beach. Songs that feel like vacation",
                "tags": [
                    "Chill",
                    "Lofi",
                    "Beats"
                ],
                "createdBy": {
                    "_id": "u103",
                    "fullname": "Ava Stone",
                    "imgUrl": "https://randomuser.me/api/portraits/women/70.jpg"
                },
                "addedAt": 1724476800000,
                "type": "system",
                "likedByUsers": [],
                "stationImgUrl": "/img/spotifly-albums-images/ab67616d0000e1a3c5649add07ed3720be9d5526.png",
                "songs": [
                    {
                        "id": "UzeWZQnlYWA",
                        "artist": "גזוז",
                        "title": "רוני",
                        "album": "גלגול שני",
                        "dateAdded": "2025-08-01T12:30:00Z",
                        "duration": "4:09",
                        "imgUrl": "https://placehold.co/40x40"
                    },
                    {
                        "id": "d0laE_Sggdo",
                        "artist": "יובל דיין",
                        "title": "יד ביד",
                        "album": "יד ביד",
                        "dateAdded": "2025-08-02T14:00:00Z",
                        "duration": "3:45",
                        "imgUrl": "https://placehold.co/40x40"
                    },
                    {
                        "id": "wzaFBaxYCko",
                        "artist": "עפרה חזה",
                        "title": "יד ביד",
                        "album": "יד ביד",
                        "dateAdded": "2025-08-03T15:30:00Z",
                        "duration": "4:00",
                        "imgUrl": "https://placehold.co/40x40"
                    },
                    {
                        "id": "mVPFAWi-PtM",
                        "artist": "ילדות ישראלית",
                        "title": "יד ביד",
                        "album": "ילדות ישראלית",
                        "dateAdded": "2025-08-04T16:45:00Z",
                        "duration": "3:30",
                        "imgUrl": "https://placehold.co/40x40"
                    },
                    {
                        "id": "l3todSKMz8s",
                        "artist": "איציק קלה",
                        "title": "אבא תן לי יד",
                        "album": "אבא תן לי יד",
                        "dateAdded": "2025-08-05T17:20:00Z",
                        "duration": "3:50",
                        "imgUrl": "https://placehold.co/40x40"
                    }
                ]

            },
            {
                "_id": "64f1cee298b8c2a1d4a12f3b",
                "name": "Morning Boost",
                "description": "Energetic pop and EDM tracks to start your day",
                "tags": [
                    "Pop",
                    "EDM",
                    "Energy"
                ],
                "createdBy": {
                    "_id": "u104",
                    "fullname": "Liam Carter",
                    "imgUrl": "https://randomuser.me/api/portraits/men/12.jpg"
                },
                "addedAt": 1724576800000,
                "type": "system",
                "likedByUsers": [],
                "stationImgUrl": "/img/spotifly-albums-images/ab67616d0000e1a34527df178b5b5172e7c4711c.png",
                "songs": [
                    {
                        "id": "s004",
                        "artist": "Zara Larsson",
                        "title": "Rise Up",
                        "album": "Daylight",
                        "dateAdded": "2025-08-12T09:20:00Z",
                        "duration": "3:14",
                        "imgUrl": "https://placehold.co/40x40"
                    },
                    {
                        "id": "s005",
                        "artist": "Kygo",
                        "title": "Higher Love",
                        "album": "Cloud Nine",
                        "dateAdded": "2025-08-13T10:10:00Z",
                        "duration": "3:45",
                        "imgUrl": "https://placehold.co/40x40"
                    },
                    {
                        "id": "s006",
                        "artist": "Avicii",
                        "title": "Wake Me Up",
                        "album": "True",
                        "dateAdded": "2025-08-14T08:00:00Z",
                        "duration": "4:09",
                        "imgUrl": "https://placehold.co/40x40"
                    }
                ]
            },
            {
                "_id": "64f1cf1298b8c2a1d4a12f3c",
                "name": "Focus Beats",
                "description": "Stay productive with instrumental hip-hop and chillhop",
                "tags": [
                    "Focus",
                    "Instrumental",
                    "Chillhop"
                ],
                "createdBy": {
                    "_id": "u105",
                    "fullname": "Sophia Lee",
                    "imgUrl": "https://randomuser.me/api/portraits/women/45.jpg"
                },
                "addedAt": 1724676800000,
                "type": "system",
                "likedByUsers": [],
                "stationImgUrl": "/img/spotifly-albums-images/ab67616d00001e02726d48d93d02e1271774f023.png",
                "songs": [
                    {
                        "id": "s007",
                        "artist": "Nujabes",
                        "title": "Feather",
                        "album": "Modal Soul",
                        "dateAdded": "2025-08-15T13:00:00Z",
                        "duration": "3:50",
                        "imgUrl": "https://placehold.co/40x40"
                    },
                    {
                        "id": "s008",
                        "artist": "Jinsang",
                        "title": "Affection",
                        "album": "Life",
                        "dateAdded": "2025-08-16T14:10:00Z",
                        "duration": "2:47",
                        "imgUrl": "https://placehold.co/40x40"
                    },
                    {
                        "id": "s009",
                        "artist": "Idealism",
                        "title": "Snowfall",
                        "album": "Hiraeth",
                        "dateAdded": "2025-08-17T11:30:00Z",
                        "duration": "3:12",
                        "imgUrl": "https://placehold.co/40x40"
                    }
                ]
            },
            {
                "_id": "station_coldplay_001",
                "name": "Coldplay Essentials",
                "description": "best coldplay hits 2025",
                "tags": ["Coldplay", "Rock", "Pop", "Hits"],
                "createdBy": {
                    "_id": "u200",
                    "fullname": "Music Bot",
                    "imgUrl": "https://randomuser.me/api/portraits/lego/2.jpg"
                },
                "addedAt": 1693843200000,
                "type": "system",
                "likedByUsers": [],
                "stationImgUrl": "/img/spotifly-albums-images/ab67616100005174af59d106f14ea71effc76195.png",
                "songs": [
                    {
                        "id": "VPRjCeoBqrI",
                        "artist": "Coldplay",
                        "title": "A Sky Full of Stars",
                        "album": "Ghost Stories",
                        "dateAdded": "2025-09-04T19:30:00Z",
                        "duration": "4:28",
                        "imgUrl": "https://img.youtube.com/vi/VPRjCeoBqrI/hqdefault.jpg"
                    },
                    {
                        "id": "dvgZkm1xWPE",
                        "artist": "Coldplay",
                        "title": "Viva La Vida",
                        "album": "Viva La Vida or Death and All His Friends",
                        "dateAdded": "2025-09-04T19:30:00Z",
                        "duration": "4:02",
                        "imgUrl": "https://img.youtube.com/vi/dvgZkm1xWPE/hqdefault.jpg"
                    },
                    {
                        "id": "yKNxeF4KMsY",
                        "artist": "Coldplay",
                        "title": "Yellow",
                        "album": "Parachutes",
                        "dateAdded": "2025-09-04T19:30:00Z",
                        "duration": "4:26",
                        "imgUrl": "https://img.youtube.com/vi/yKNxeF4KMsY/hqdefault.jpg"
                    },
                    {
                        "id": "RB-RcX5DS5A",
                        "artist": "Coldplay",
                        "title": "Fix You",
                        "album": "X&Y",
                        "dateAdded": "2025-09-04T19:30:00Z",
                        "duration": "4:55",
                        "imgUrl": "https://img.youtube.com/vi/RB-RcX5DS5A/hqdefault.jpg"
                    },
                    {
                        "id": "k4V3Mo61fJM",
                        "artist": "Coldplay",
                        "title": "Paradise",
                        "album": "Mylo Xyloto",
                        "dateAdded": "2025-09-04T19:30:00Z",
                        "duration": "4:38",
                        "imgUrl": "https://img.youtube.com/vi/k4V3Mo61fJM/hqdefault.jpg"
                    },
                    {
                        "id": "1G4isv_Fylg",
                        "artist": "Coldplay",
                        "title": "The Scientist",
                        "album": "A Rush of Blood to the Head",
                        "dateAdded": "2025-09-04T19:30:00Z",
                        "duration": "5:09",
                        "imgUrl": "https://img.youtube.com/vi/1G4isv_Fylg/hqdefault.jpg"
                    }
                ]
            },
            {
                "_id": "64f1cf5098b8c2a1d4a12f3d",
                "name": "Rock Legends",
                "description": "Classic rock anthems from the 70s and 80s",
                "tags": [
                    "Rock",
                    "Classic",
                    "Legends"
                ],
                "createdBy": {
                    "_id": "u106",
                    "fullname": "Noah Mitchell",
                    "imgUrl": "https://randomuser.me/api/portraits/men/29.jpg"
                },
                "addedAt": 1724776800000,
                "type": "system",
                "likedByUsers": [],
                "stationImgUrl": "public/img/spotifly-albums-images/en (18).png",
                "songs": [
                    {
                        "id": "s010",
                        "artist": "Queen",
                        "title": "Bohemian Rhapsody",
                        "album": "A Night at the Opera",
                        "dateAdded": "2025-08-18T18:00:00Z",
                        "duration": "5:55",
                        "imgUrl": "https://placehold.co/40x40"
                    },
                    {
                        "id": "s011",
                        "artist": "Led Zeppelin",
                        "title": "Stairway to Heaven",
                        "album": "Led Zeppelin IV",
                        "dateAdded": "2025-08-19T20:30:00Z",
                        "duration": "8:02",
                        "imgUrl": "https://placehold.co/40x40"
                    },
                    {
                        "id": "s012",
                        "artist": "The Rolling Stones",
                        "title": "Paint It Black",
                        "album": "Aftermath",
                        "dateAdded": "2025-08-20T16:45:00Z",
                        "duration": "3:44",
                        "imgUrl": "https://placehold.co/40x40"
                    }
                ]
            },
            {
                "_id": "64f1cf9598b8c2a1d4a12f3e",
                "name": "Latin Vibes",
                "description": "Dance to reggaeton, salsa and Latin pop hits",
                "tags": [
                    "Latin",
                    "Dance",
                    "Reggaeton"
                ],
                "createdBy": {
                    "_id": "u107",
                    "fullname": "Camila Reyes",
                    "imgUrl": "https://randomuser.me/api/portraits/women/34.jpg"
                },
                "addedAt": 1724876800000,
                "type": "system",
                "likedByUsers": [],
                "stationImgUrl": "public/img/spotifly-albums-images/en (12).png",
                "songs": [
                    {
                        "id": "s013",
                        "artist": "J Balvin",
                        "title": "Mi Gente",
                        "album": "Vibras",
                        "dateAdded": "2025-08-21T21:00:00Z",
                        "duration": "3:05",
                        "imgUrl": "https://placehold.co/40x40"
                    },
                    {
                        "id": "s014",
                        "artist": "Bad Bunny",
                        "title": "Tití Me Preguntó",
                        "album": "Un Verano Sin Ti",
                        "dateAdded": "2025-08-22T19:15:00Z",
                        "duration": "4:00",
                        "imgUrl": "https://placehold.co/40x40"
                    },
                    {
                        "id": "s015",
                        "artist": "Shakira",
                        "title": "Hips Don't Lie",
                        "album": "Oral Fixation, Vol. 2",
                        "dateAdded": "2025-08-23T12:20:00Z",
                        "duration": "3:38",
                        "imgUrl": "https://placehold.co/40x40"
                    }
                ]
            },
            {
                "_id": "64f1cf9598b8c2a1d4a12f3f",
                "name": "Rock Legends",
                "description": "Classic rock hits from the 70s, 80s and 90s",
                "tags": ["Rock", "Classic", "Guitar"],
                "createdBy": {
                    "_id": "u108",
                    "fullname": "David Johnson",
                    "imgUrl": "https://randomuser.me/api/portraits/men/45.jpg"
                },
                "addedAt": 1724877800000,
                "type": "system",
                "likedByUsers": [],
                "stationImgUrl": "public/img/spotifly-albums-images/en (13).png",
                "songs": [
                    {
                        "id": "s016",
                        "artist": "Queen",
                        "title": "Bohemian Rhapsody",
                        "album": "A Night at the Opera",
                        "dateAdded": "2025-08-24T10:00:00Z",
                        "duration": "5:55",
                        "imgUrl": "https://placehold.co/40x40"
                    },
                    {
                        "id": "s017",
                        "artist": "AC/DC",
                        "title": "Back in Black",
                        "album": "Back in Black",
                        "dateAdded": "2025-08-24T12:00:00Z",
                        "duration": "4:15",
                        "imgUrl": "https://placehold.co/40x40"
                    }
                ]
            },
            {
                "_id": "64f1cf9598b8c2a1d4a12f40",
                "name": "Chill Vibes",
                "description": "Relax and unwind with chillout and lo-fi beats",
                "tags": ["Chill", "Lo-Fi", "Relax"],
                "createdBy": {
                    "_id": "u109",
                    "fullname": "Sophie Lee",
                    "imgUrl": "https://randomuser.me/api/portraits/women/12.jpg"
                },
                "addedAt": 1724878800000,
                "type": "system",
                "likedByUsers": [],
                "stationImgUrl": "public/img/spotifly-albums-images/en (14).png",
                "songs": [
                    {
                        "id": "s018",
                        "artist": "Jinsang",
                        "title": "Affection",
                        "album": "Life",
                        "dateAdded": "2025-08-24T18:00:00Z",
                        "duration": "2:45",
                        "imgUrl": "https://placehold.co/40x40"
                    },
                    {
                        "id": "s019",
                        "artist": "Nujabes",
                        "title": "Luv(sic) Part 3",
                        "album": "Modal Soul",
                        "dateAdded": "2025-08-25T09:00:00Z",
                        "duration": "4:35",
                        "imgUrl": "https://placehold.co/40x40"
                    }
                ]
            },
            {
                "_id": "64f1cf9598b8c2a1d4a12f41",
                "name": "Hip-Hop Heat",
                "description": "Fresh hip-hop bangers from the streets",
                "tags": ["Hip-Hop", "Rap", "Trap"],
                "createdBy": {
                    "_id": "u110",
                    "fullname": "Marcus Brown",
                    "imgUrl": "https://randomuser.me/api/portraits/men/28.jpg"
                },
                "addedAt": 1724879800000,
                "type": "system",
                "likedByUsers": [],
                "stationImgUrl": "public/img/spotifly-albums-images/en (15).png",
                "songs": [
                    {
                        "id": "s020",
                        "artist": "Drake",
                        "title": "God's Plan",
                        "album": "Scorpion",
                        "dateAdded": "2025-08-25T12:00:00Z",
                        "duration": "3:19",
                        "imgUrl": "https://placehold.co/40x40"
                    },
                    {
                        "id": "s021",
                        "artist": "Kendrick Lamar",
                        "title": "HUMBLE.",
                        "album": "DAMN.",
                        "dateAdded": "2025-08-25T16:00:00Z",
                        "duration": "2:57",
                        "imgUrl": "https://placehold.co/40x40"
                    }
                ]
            },
            {
                "_id": "64f1cf9598b8c2a1d4a12f42",
                "name": "EDM Festival",
                "description": "Party anthems for your next rave",
                "tags": ["EDM", "Dance", "Electronic"],
                "createdBy": {
                    "_id": "u111",
                    "fullname": "Lucas Meyer",
                    "imgUrl": "https://randomuser.me/api/portraits/men/56.jpg"
                },
                "addedAt": 1724880800000,
                "type": "system",
                "likedByUsers": [],
                "stationImgUrl": "public/img/spotifly-albums-images/en (16).png",
                "songs": [
                    {
                        "id": "s022",
                        "artist": "Calvin Harris",
                        "title": "Summer",
                        "album": "Motion",
                        "dateAdded": "2025-08-25T18:00:00Z",
                        "duration": "3:44",
                        "imgUrl": "https://placehold.co/40x40"
                    },
                    {
                        "id": "s023",
                        "artist": "Martin Garrix",
                        "title": "Animals",
                        "album": "Animals",
                        "dateAdded": "2025-08-26T09:00:00Z",
                        "duration": "5:03",
                        "imgUrl": "https://placehold.co/40x40"
                    }
                ]
            },
            {
                "_id": "64f1cf9598b8c2a1d4a12f43",
                "name": "Pop Paradise",
                "description": "All your favorite pop stars in one place",
                "tags": ["Pop", "Top Hits", "Charts"],
                "createdBy": {
                    "_id": "u112",
                    "fullname": "Emily Carter",
                    "imgUrl": "https://randomuser.me/api/portraits/women/66.jpg"
                },
                "addedAt": 1724881800000,
                "type": "system",
                "likedByUsers": [],
                "stationImgUrl": "public/img/spotifly-albums-images/en (17).png",
                "songs": [
                    {
                        "id": "s024",
                        "artist": "Taylor Swift",
                        "title": "Shake It Off",
                        "album": "1989",
                        "dateAdded": "2025-08-26T12:00:00Z",
                        "duration": "3:39",
                        "imgUrl": "https://placehold.co/40x40"
                    },
                    {
                        "id": "s025",
                        "artist": "Ariana Grande",
                        "title": "7 rings",
                        "album": "Thank U, Next",
                        "dateAdded": "2025-08-26T15:00:00Z",
                        "duration": "2:58",
                        "imgUrl": "https://placehold.co/40x40"
                    }
                ]
            },
            {
                "_id": "64f1cf9598b8c2a1d4a12f44",
                "name": "Jazz Nights",
                "description": "Smooth and classic jazz for the evenings",
                "tags": ["Jazz", "Instrumental", "Relax"],
                "createdBy": {
                    "_id": "u113",
                    "fullname": "Miles Thompson",
                    "imgUrl": "https://randomuser.me/api/portraits/men/71.jpg"
                },
                "addedAt": 1724882800000,
                "type": "system",
                "likedByUsers": [],
                "stationImgUrl": "public/img/spotifly-albums-images/en (18).png",
                "songs": [
                    {
                        "id": "s026",
                        "artist": "Miles Davis",
                        "title": "So What",
                        "album": "Kind of Blue",
                        "dateAdded": "2025-08-26T20:00:00Z",
                        "duration": "9:22",
                        "imgUrl": "https://placehold.co/40x40"
                    },
                    {
                        "id": "s027",
                        "artist": "John Coltrane",
                        "title": "Giant Steps",
                        "album": "Giant Steps",
                        "dateAdded": "2025-08-27T10:00:00Z",
                        "duration": "4:43",
                        "imgUrl": "https://placehold.co/40x40"
                    }
                ]
            },
            {
                "_id": "64f1cf9598b8c2a1d4a12f45",
                "name": "Throwback 2000s",
                "description": "Hits from the early 2000s you can’t forget",
                "tags": ["Throwback", "2000s", "Nostalgia"],
                "createdBy": {
                    "_id": "u114",
                    "fullname": "Olivia Smith",
                    "imgUrl": "https://randomuser.me/api/portraits/women/21.jpg"
                },
                "addedAt": 1724883800000,
                "type": "system",
                "likedByUsers": [],
                "stationImgUrl": "public/img/spotifly-albums-images/onboarding-card-start-playing.406d62f0.png",
                "songs": [
                    {
                        "id": "s028",
                        "artist": "Usher",
                        "title": "Yeah!",
                        "album": "Confessions",
                        "dateAdded": "2025-08-27T14:00:00Z",
                        "duration": "4:10",
                        "imgUrl": "https://placehold.co/40x40"
                    },
                    {
                        "id": "s029",
                        "artist": "Rihanna",
                        "title": "Umbrella",
                        "album": "Good Girl Gone Bad",
                        "dateAdded": "2025-08-27T16:00:00Z",
                        "duration": "4:36",
                        "imgUrl": "https://placehold.co/40x40"
                    }
                ]
            },
            {
                "_id": "64f1cf9598b8c2a1d4a12f46",
                "name": "Indie Dreams",
                "description": "Discover fresh and iconic indie sounds",
                "tags": ["Indie", "Alternative", "Dream Pop"],
                "createdBy": {
                    "_id": "u115",
                    "fullname": "Alex Green",
                    "imgUrl": "https://randomuser.me/api/portraits/men/33.jpg"
                },
                "addedAt": 1724884800000,
                "type": "system",
                "likedByUsers": [],
                "stationImgUrl": "public/img/spotifly-albums-images/ab67706f000000028908106e49cde03e6d67073e.png",
                "songs": [
                    {
                        "id": "s030",
                        "artist": "Arctic Monkeys",
                        "title": "Do I Wanna Know?",
                        "album": "AM",
                        "dateAdded": "2025-08-28T09:00:00Z",
                        "duration": "4:32",
                        "imgUrl": "https://placehold.co/40x40"
                    },
                    {
                        "id": "s031",
                        "artist": "Tame Impala",
                        "title": "The Less I Know The Better",
                        "album": "Currents",
                        "dateAdded": "2025-08-28T12:00:00Z",
                        "duration": "3:36",
                        "imgUrl": "https://placehold.co/40x40"
                    }
                ]
            },
            {
                "_id": "64f1cf9598b8c2a1d4a12f47",
                "name": "Workout Pump",
                "description": "High energy tracks to keep you moving",
                "tags": ["Workout", "Energy", "Motivation"],
                "createdBy": {
                    "_id": "u116",
                    "fullname": "Chris Evans",
                    "imgUrl": "https://randomuser.me/api/portraits/men/88.jpg"
                },
                "addedAt": 1724885800000,
                "type": "system",
                "likedByUsers": [],
                "stationImgUrl": "public/img/spotifly-albums-images/ab67706c0000d72c79fe0ce03e99ec70a66ec203 (1).png",
                "songs": [
                    {
                        "id": "s032",
                        "artist": "Eminem",
                        "title": "Lose Yourself",
                        "album": "8 Mile",
                        "dateAdded": "2025-08-28T15:00:00Z",
                        "duration": "5:26",
                        "imgUrl": "https://placehold.co/40x40"
                    },
                    {
                        "id": "s033",
                        "artist": "Linkin Park",
                        "title": "Numb",
                        "album": "Meteora",
                        "dateAdded": "2025-08-28T17:00:00Z",
                        "duration": "3:07",
                        "imgUrl": "https://placehold.co/40x40"
                    }
                ]
            },
            {
                "_id": "64f1cf9598b8c2a1d4a12f48",
                "name": "Soul Grooves",
                "description": "Smooth soul and R&B classics for the perfect vibe",
                "tags": ["Soul", "R&B", "Groove"],
                "createdBy": {
                    "_id": "u117",
                    "fullname": "Natalie Brooks",
                    "imgUrl": "https://randomuser.me/api/portraits/women/77.jpg"
                },
                "addedAt": 1724896800000,
                "type": "system",
                "likedByUsers": [],
                "stationImgUrl": "public/img/spotifly-albums-images/ab67616d0000e1a3c5649add07ed3720be9d5526.png",
                "songs": [
                    {
                        "id": "s034",
                        "artist": "Stevie Wonder",
                        "title": "Superstition",
                        "album": "Talking Book",
                        "dateAdded": "2025-08-28T19:00:00Z",
                        "duration": "4:26",
                        "imgUrl": "https://placehold.co/40x40"
                    }
                ]
            },
            {
                "_id": "64f1cf9598b8c2a1d4a12f49",
                "name": "Country Roads",
                "description": "Best of country hits old and new",
                "tags": ["Country", "Acoustic", "Folk"],
                "createdBy": {
                    "_id": "u118",
                    "fullname": "Jack Miller",
                    "imgUrl": "https://randomuser.me/api/portraits/men/58.jpg"
                },
                "addedAt": 1724897800000,
                "type": "system",
                "likedByUsers": [],
                "stationImgUrl": "public/img/spotifly-albums-images/ab67656300005f1f4588f2866266641d7d36b3f6.png",
                "songs": [
                    {
                        "id": "s035",
                        "artist": "Johnny Cash",
                        "title": "Ring of Fire",
                        "album": "Ring of Fire",
                        "dateAdded": "2025-08-29T09:00:00Z",
                        "duration": "2:37",
                        "imgUrl": "https://placehold.co/40x40"
                    }
                ]
            },
            {
                "_id": "64f1cf9598b8c2a1d4a12f4a",
                "name": "Reggae Sunshine",
                "description": "Feel the island vibes with reggae classics",
                "tags": ["Reggae", "Island", "Relax"],
                "createdBy": {
                    "_id": "u119",
                    "fullname": "Jamal King",
                    "imgUrl": "https://randomuser.me/api/portraits/men/72.jpg"
                },
                "addedAt": 1724898800000,
                "type": "system",
                "likedByUsers": [],
                "stationImgUrl": "public/img/spotifly-albums-images/ab6766630000db5bb090a1d78b87b61d3fb3f11c.png",
                "songs": [
                    {
                        "id": "s036",
                        "artist": "Bob Marley",
                        "title": "Three Little Birds",
                        "album": "Exodus",
                        "dateAdded": "2025-08-29T14:00:00Z",
                        "duration": "3:01",
                        "imgUrl": "https://placehold.co/40x40"
                    }
                ]
            },
            {
                "_id": "64f1cf9598b8c2a1d4a12f4b",
                "name": "Electronic Chill",
                "description": "Laid-back electronic beats for studying or relaxing",
                "tags": ["Electronic", "Chill", "Ambient"],
                "createdBy": {
                    "_id": "u120",
                    "fullname": "Mia White",
                    "imgUrl": "https://randomuser.me/api/portraits/women/44.jpg"
                },
                "addedAt": 1724899800000,
                "type": "system",
                "likedByUsers": [],
                "stationImgUrl": "public/img/spotifly-albums-images/ab67656300005f1fe95585764a934a57f34692a5.png",
                "songs": [
                    {
                        "id": "s037",
                        "artist": "ODESZA",
                        "title": "A Moment Apart",
                        "album": "A Moment Apart",
                        "dateAdded": "2025-08-29T18:00:00Z",
                        "duration": "5:15",
                        "imgUrl": "https://placehold.co/40x40"
                    }
                ]
            },
            {
                "_id": "64f1cf9598b8c2a1d4a12f4c",
                "name": "Piano Moods",
                "description": "Instrumental piano for focus and relaxation",
                "tags": ["Instrumental", "Piano", "Focus"],
                "createdBy": {
                    "_id": "u121",
                    "fullname": "Daniel Green",
                    "imgUrl": "https://randomuser.me/api/portraits/men/91.jpg"
                },
                "addedAt": 1724900800000,
                "type": "system",
                "likedByUsers": [],
                "stationImgUrl": "public/img/spotifly-albums-images/ab67656300005f1f71c5d1e1ef9350a805cb15e4.png",
                "songs": [
                    {
                        "id": "s038",
                        "artist": "Yiruma",
                        "title": "River Flows in You",
                        "album": "First Love",
                        "dateAdded": "2025-08-29T20:00:00Z",
                        "duration": "3:59",
                        "imgUrl": "https://placehold.co/40x40"
                    }
                ]
            },
            {
                "_id": "64f1cf9598b8c2a1d4a12f4d",
                "name": "Afro Beats",
                "description": "Dance to the hottest Afrobeat tracks",
                "tags": ["Afrobeat", "Dance", "World"],
                "createdBy": {
                    "_id": "u122",
                    "fullname": "Chinedu Okafor",
                    "imgUrl": "https://randomuser.me/api/portraits/men/37.jpg"
                },
                "addedAt": 1724901800000,
                "type": "system",
                "likedByUsers": [],
                "stationImgUrl": "public/img/spotifly-albums-images/ab6766630000db5b31af55ae628c8ec30ddc0f07.png",
                "songs": [
                    {
                        "id": "s039",
                        "artist": "Burna Boy",
                        "title": "Last Last",
                        "album": "Love, Damini",
                        "dateAdded": "2025-08-30T09:00:00Z",
                        "duration": "2:53",
                        "imgUrl": "https://placehold.co/40x40"
                    }
                ]
            },
            {
                "_id": "64f1cf9598b8c2a1d4a12f4e",
                "name": "K-Pop Stars",
                "description": "The hottest hits from K-Pop idols",
                "tags": ["K-Pop", "Pop", "Dance"],
                "createdBy": {
                    "_id": "u123",
                    "fullname": "Hana Kim",
                    "imgUrl": "https://randomuser.me/api/portraits/women/54.jpg"
                },
                "addedAt": 1724902800000,
                "type": "system",
                "likedByUsers": [],
                "stationImgUrl": "public/img/spotifly-albums-images/ab67656300005f1fe65cd30cfb9f8e0e9252930c.png",
                "songs": [
                    {
                        "id": "s040",
                        "artist": "BTS",
                        "title": "Dynamite",
                        "album": "Dynamite (Single)",
                        "dateAdded": "2025-08-30T12:00:00Z",
                        "duration": "3:19",
                        "imgUrl": "https://placehold.co/40x40"
                    }
                ]
            },
            {
                "_id": "64f1cf9598b8c2a1d4a12f4f",
                "name": "Metal Mayhem",
                "description": "Heavy riffs and loud drums for true metalheads",
                "tags": ["Metal", "Rock", "Heavy"],
                "createdBy": {
                    "_id": "u124",
                    "fullname": "Ivan Petrov",
                    "imgUrl": "https://randomuser.me/api/portraits/men/99.jpg"
                },
                "addedAt": 1724903800000,
                "type": "system",
                "likedByUsers": [],
                "stationImgUrl": "public/img/spotifly-albums-images/ab67616d00001e026d4056466fc11f6408be2566.png",
                "songs": [
                    {
                        "id": "s041",
                        "artist": "Metallica",
                        "title": "Enter Sandman",
                        "album": "Metallica",
                        "dateAdded": "2025-08-30T16:00:00Z",
                        "duration": "5:32",
                        "imgUrl": "https://placehold.co/40x40"
                    }
                ]
            },
            {
                "_id": "64f1cf9598b8c2a1d4a12f50",
                "name": "Meditation Escape",
                "description": "Soothing sounds for mindfulness and meditation",
                "tags": ["Meditation", "Calm", "Ambient"],
                "createdBy": {
                    "_id": "u125",
                    "fullname": "Sophia Turner",
                    "imgUrl": "https://randomuser.me/api/portraits/women/62.jpg"
                },
                "addedAt": 1724904800000,
                "type": "system",
                "likedByUsers": [],
                "stationImgUrl": "public/img/spotifly-albums-images/ab67616d00001e02047d6b756e8f5e3f8b50f025.png",
                "songs": [
                    {
                        "id": "s042",
                        "artist": "Deva Premal",
                        "title": "Om Mani Padme Hum",
                        "album": "Mantras for Life",
                        "dateAdded": "2025-08-30T20:00:00Z",
                        "duration": "6:40",
                        "imgUrl": "https://placehold.co/40x40"
                    }
                ]
            },
            {
                "_id": "64f1cf9598b8c2a1d4a12f51",
                "name": "Holiday Cheer",
                "description": "Festive songs to light up your holiday spirit",
                "tags": ["Holiday", "Christmas", "Festive"],
                "createdBy": {
                    "_id": "u126",
                    "fullname": "George Wilson",
                    "imgUrl": "https://randomuser.me/api/portraits/men/13.jpg"
                },
                "addedAt": 1724905800000,
                "type": "system",
                "likedByUsers": [],
                "stationImgUrl": "public/img/spotifly-albums-images/ab67616d00004851e21cc1db05580b6f2d2a3b6e.png",
                "songs": [
                    {
                        "id": "s043",
                        "artist": "Mariah Carey",
                        "title": "All I Want for Christmas Is You",
                        "album": "Merry Christmas",
                        "dateAdded": "2025-08-31T09:00:00Z",
                        "duration": "4:01",
                        "imgUrl": "https://placehold.co/40x40"
                    }
                ]
            },
            {
                "_id": "pl001",
                "name": "Morning Boost",
                "description": "Energetic pop and EDM tracks to start your day",
                "tags": ["Pop", "EDM", "Energy"],
                "createdBy": {
                    "_id": "u001",
                    "fullname": "Liam Carter",
                    "imgUrl": "https://randomuser.me/api/portraits/men/12.jpg"
                },
                "addedAt": 1724576800000,
                "type": "system",
                "likedByUsers": [],
                "stationImgUrl": "public/img/spotifly-albums-images/ab67706c0000da847a9861f10d1d9d127a3e8f7f.png",
                "songs": [
                    { "id": "aqz-KE-bpKQ", "artist": "Zedd, Maren Morris, Grey", "title": "The Middle", "album": "The Middle", "dateAdded": "2025-08-12T09:20:00Z", "duration": "3:04", "imgUrl": "https://i.scdn.co/image/ab67616d00004851b1c2d7f6e3e7a7a1e6a1a1a1a" },
                    { "id": "gocwRvLhDf8", "artist": "Calvin Harris", "title": "Summer", "album": "Motion", "dateAdded": "2025-08-13T10:10:00Z", "duration": "3:44", "imgUrl": "https://i.scdn.co/image/ab67616d00004851c2c2d7f6e3e7a7a1e6a1a1a1a" },
                    { "id": "fHI8X4OXluQ", "artist": "Dua Lipa", "title": "Don't Start Now", "album": "Future Nostalgia", "dateAdded": "2025-08-14T08:00:00Z", "duration": "3:03", "imgUrl": "https://i.scdn.co/image/ab67616d00004851d3c2d7f6e3e7a7a1e6a1a1a1a" }
                ]
            },
            {
                "_id": "pl002",
                "name": "Chill Vibes",
                "description": "Relaxing tunes for a calm afternoon",
                "tags": ["Chill", "Lo-fi", "Acoustic"],
                "createdBy": { "_id": "u002", "fullname": "Ella Smith", "imgUrl": "https://randomuser.me/api/portraits/women/34.jpg" },
                "addedAt": 1724576801000, "type": "system", "likedByUsers": [], "stationImgUrl": "public/img/spotifly-albums-images/ab67706f00000002dfd98f9d0cddbb9f43f2710a.png",
                "songs": [
                    { "id": "5qap5aO4i9A", "artist": "Lo-fi Beats", "title": "Chillhop Essentials", "album": "Chillhop", "dateAdded": "2025-08-15T10:00:00Z", "duration": "2:30", "imgUrl": "https://i.scdn.co/image/ab67616d00004851e1c2d7f6e3e7a7a1e6a1a1a1a" },
                    { "id": "DWcJFNfaw9c", "artist": "Lofi Girl", "title": "Dreaming", "album": "Lofi Dreams", "dateAdded": "2025-08-16T11:00:00Z", "duration": "2:45", "imgUrl": "https://i.scdn.co/image/ab67616d00004851f1c2d7f6e3e7a7a1e6a1a1a1a" },
                    { "id": "hHW1oY26kxQ", "artist": "Joakim Karud", "title": "Luvly", "album": "Luvly", "dateAdded": "2025-08-17T09:00:00Z", "duration": "3:10", "imgUrl": "https://i.scdn.co/image/ab67616d0000485201c2d7f6e3e7a7a1e6a1a1a1a" }
                ]
            },
            {
                "_id": "pl003",
                "name": "Rock Legends",
                "description": "Classic and modern rock hits",
                "tags": ["Rock", "Classic", "Alternative"],
                "createdBy": { "_id": "u003", "fullname": "Jack Turner", "imgUrl": "https://randomuser.me/api/portraits/men/45.jpg" },
                "addedAt": 1724576802000, "type": "system", "likedByUsers": [], "stationImgUrl": "public/img/spotifly-albums-images/ab6766630000db5b7b1d7e08068759037c202190.png",
                "songs": [
                    { "id": "fJ9rUzIMcZQ", "artist": "Queen", "title": "Bohemian Rhapsody", "album": "A Night at the Opera", "dateAdded": "2025-08-18T08:00:00Z", "duration": "5:55", "imgUrl": "https://i.scdn.co/image/ab67616d0000485211c2d7f6e3e7a7a1e6a1a1a1a" },
                    { "id": "ktvTqknDobU", "artist": "Imagine Dragons", "title": "Believer", "album": "Evolve", "dateAdded": "2025-08-19T09:00:00Z", "duration": "3:24", "imgUrl": "https://i.scdn.co/image/ab67616d0000485221c2d7f6e3e7a7a1e6a1a1a1a" },
                    { "id": "hTWKbfoikeg", "artist": "Nirvana", "title": "Smells Like Teen Spirit", "album": "Nevermind", "dateAdded": "2025-08-20T10:00:00Z", "duration": "5:01", "imgUrl": "https://i.scdn.co/image/ab67616d0000485231c2d7f6e3e7a7a1e6a1a1a1a" }
                ]
            },
            {
                "_id": "station_indie_001",
                "name": "Indie Chillwave",
                "description": "מוזיקה אינדי רגועה עם נגיעות של אלקטרוניקה, מושלמת לרגעים של רוגע.",
                "tags": ["Indie", "Chillwave", "Electronic"],
                "createdBy": {
                    "_id": "u201",
                    "fullname": "Music Bot",
                    "imgUrl": "https://randomuser.me/api/portraits/lego/3.jpg"
                },
                "addedAt": 1693843200000,
                "type": "system",
                "likedByUsers": [],
                "stationImgUrl": "public/img/spotifly-albums-images/ab6766630000db5b40df13f64e2194130e522164.png",
                "songs": [
                    {
                        "id": "7ZtUUg6BKyo",
                        "title": "Sunset Lover",
                        "artist": "Petit Biscuit",
                        "album": "Presence",
                        "imgUrl": "https://i.ytimg.com/vi/7ZtUUg6BKyo/maxresdefault.jpg",
                        "duration": "3:58",
                        "dateAdded": "2025-08-01T10:00:00Z"
                    },
                    {
                        "id": "x3tWHeWEd5s",
                        "title": "Night Owl",
                        "artist": "Galimatias",
                        "album": "Single",
                        "imgUrl": "https://i.ytimg.com/vi/x3tWHeWEd5s/maxresdefault.jpg",
                        "duration": "4:12",
                        "dateAdded": "2025-08-02T11:00:00Z"
                    },
                    {
                        "id": "nOubjLM9Cbc",
                        "title": "Cold Little Heart",
                        "artist": "Michael Kiwanuka",
                        "album": "Love & Hate",
                        "imgUrl": "https://i.ytimg.com/vi/nOubjLM9Cbc/maxresdefault.jpg",
                        "duration": "10:13",
                        "dateAdded": "2025-08-03T09:30:00Z"
                    }
                ]
            },
            {
                "_id": "station_rock_001",
                "name": "Classic Rock Revival",
                "description": "להיטים קלאסיים עם טוויסט מודרני, לחובבי הרוק של פעם.",
                "tags": ["Rock", "Classic", "Hits"],
                "createdBy": {
                    "_id": "u202",
                    "fullname": "Music Bot",
                    "imgUrl": "https://randomuser.me/api/portraits/lego/4.jpg"
                },
                "addedAt": 1693843200000,
                "type": "system",
                "likedByUsers": [],
                "stationImgUrl": "public/img/spotifly-albums-images/ab6766630000db5bb1a97e93ce07b3f6bd119c8c.png",
                "songs": [
                    {
                        "id": "bpOSxM0rNPM",
                        "title": "Do I Wanna Know?",
                        "artist": "Arctic Monkeys",
                        "album": "AM",
                        "imgUrl": "https://i.ytimg.com/vi/bpOSxM0rNPM/maxresdefault.jpg",
                        "duration": "4:32",
                        "dateAdded": "2025-08-04T12:00:00Z"
                    },
                    {
                        "id": "GhCXAiNz9Jo",
                        "title": "Take Me Out",
                        "artist": "Franz Ferdinand",
                        "album": "Franz Ferdinand",
                        "imgUrl": "https://i.ytimg.com/vi/GhCXAiNz9Jo/maxresdefault.jpg",
                        "duration": "3:57",
                        "dateAdded": "2025-08-05T10:30:00Z"
                    },
                    {
                        "id": "SBjQ9tuuTJQ",
                        "title": "The Pretender",
                        "artist": "Foo Fighters",
                        "album": "Echoes, Silence, Patience & Grace",
                        "imgUrl": "https://i.ytimg.com/vi/SBjQ9tuuTJQ/maxresdefault.jpg",
                        "duration": "4:29",
                        "dateAdded": "2025-08-06T09:00:00Z"
                    }
                ]
            },
            {
                "_id": "station_pop_001",
                "name": "Pop Hits 2025",
                "description": "הלהיטים הגדולים של השנה, מהפופ העולמי.",
                "tags": ["Pop", "Hits", "Top Charts"],
                "createdBy": {
                    "_id": "u203",
                    "fullname": "Music Bot",
                    "imgUrl": "https://randomuser.me/api/portraits/lego/5.jpg"
                },
                "addedAt": 1693843200000,
                "type": "system",
                "likedByUsers": [],
                "stationImgUrl": "public/img/spotifly-albums-images/ab6766630000db5bb090a1d78b87b61d3fb3f11c.png",
                "songs": [
                    {
                        "id": "fHI8X4OXluQ",
                        "title": "Blinding Lights",
                        "artist": "The Weeknd",
                        "album": "After Hours",
                        "imgUrl": "https://i.ytimg.com/vi/fHI8X4OXluQ/maxresdefault.jpg",
                        "duration": "3:20",
                        "dateAdded": "2025-08-07T10:00:00Z"
                    },
                    {
                        "id": "TUVcZfQe-Kw",
                        "title": "Levitating",
                        "artist": "Dua Lipa",
                        "album": "Future Nostalgia",
                        "imgUrl": "https://i.ytimg.com/vi/TUVcZfQe-Kw/maxresdefault.jpg",
                        "duration": "3:23",
                        "dateAdded": "2025-08-08T11:00:00Z"
                    },
                    {
                        "id": "gNi_6U5Pm_o",
                        "title": "Good 4 U",
                        "artist": "Olivia Rodrigo",
                        "album": "SOUR",
                        "imgUrl": "https://i.ytimg.com/vi/gNi_6U5Pm_o/maxresdefault.jpg",
                        "duration": "2:58",
                        "dateAdded": "2025-08-09T09:30:00Z"
                    }
                ]
            },
            {
                "_id": "station_jazz_001",
                "name": "Jazz & Blues Collection",
                "description": "אוסף של יצירות ג'אז ובלוז קלאסיות, לאוהבי הסגנון.",
                "tags": ["Jazz", "Blues", "Classic"],
                "createdBy": {
                    "_id": "u204",
                    "fullname": "Music Bot",
                    "imgUrl": "https://randomuser.me/api/portraits/lego/6.jpg"
                },
                "addedAt": 1693843200000,
                "type": "system",
                "likedByUsers": [],
                "stationImgUrl": "public/img/spotifly-albums-images/ab6775700000ee85149b6ea19de454d68685f039.png",
                "songs": [
                    {
                        "id": "vmDDOFXSgAs",
                        "title": "Take Five",
                        "artist": "Dave Brubeck",
                        "album": "Time Out",
                        "imgUrl": "https://i.ytimg.com/vi/vmDDOFXSgAs/maxresdefault.jpg",
                        "duration": "5:24",
                        "dateAdded": "2025-08-10T10:00:00Z"
                    },
                    {
                        "id": "OfJRX-8SXOs",
                        "title": "Feeling Good",
                        "artist": "Nina Simone",
                        "album": "I Put a Spell on You",
                        "imgUrl": "https://i.ytimg.com/vi/OfJRX-8SXOs/maxresdefault.jpg",
                        "duration": "2:54",
                        "dateAdded": "2025-08-11T11:00:00Z"
                    },
                    {
                        "id": "4fk2prKnYnI",
                        "title": "The Thrill Is Gone",
                        "artist": "B.B. King",
                        "album": "Completely Well",
                        "imgUrl": "https://i.ytimg.com/vi/4fk2prKnYnI/maxresdefault.jpg",
                        "duration": "5:24",
                        "dateAdded": "2025-08-12T09:30:00Z"
                    }
                ]
            },
            {
                "_id": "station_ed_sheeran_001",
                "name": "Ed Sheeran Hits",
                "description": "להיטים גדולים של אד שירן מכל הזמנים.",
                "tags": ["Pop", "Acoustic", "Hits"],
                "createdBy": {
                    "_id": "u201",
                    "fullname": "Music Bot",
                    "imgUrl": "https://randomuser.me/api/portraits/lego/3.jpg"
                },
                "addedAt": 1693843201000,
                "type": "system",
                "likedByUsers": [],
                "stationImgUrl": "public/img/spotifly-albums-images/ab67616d00001e02ba5db46f4b838ef6027e6f96.png",
                "songs": [
                    {
                        "id": "JGwWNGJdvx8",
                        "artist": "Ed Sheeran",
                        "title": "Shape of You",
                        "album": "÷ (Divide)",
                        "dateAdded": "2025-08-12T09:20:00Z",
                        "duration": "3:53",
                        "imgUrl": "https://i.ytimg.com/vi/JGwWNGJdvx8/hqdefault.jpg"
                    }
                ]
            },
            {
                "_id": "station_beyonce_001",
                "name": "Beyoncé Vibes",
                "description": "הלהיטים הגדולים של ביונסה.",
                "tags": ["R&B", "Pop", "Queen B"],
                "createdBy": {
                    "_id": "u202",
                    "fullname": "Music Bot",
                    "imgUrl": "https://randomuser.me/api/portraits/lego/4.jpg"
                },
                "addedAt": 1693843210000,
                "type": "system",
                "likedByUsers": [],
                "stationImgUrl": "public/img/spotifly-albums-images/en (21).png",
                "songs": [
                    {
                        "id": "WDZJPJV__bQ",
                        "artist": "Beyoncé",
                        "title": "Halo",
                        "album": "I Am... Sasha Fierce",
                        "dateAdded": "2025-08-13T09:20:00Z",
                        "duration": "3:45",
                        "imgUrl": "https://i.ytimg.com/vi/WDZJPJV__bQ/hqdefault.jpg"
                    }
                ]
            },
            {
                "_id": "station_marshmello_001",
                "name": "Marshmello EDM",
                "description": "סט לוהט של Marshmello עם הקלאסיקות הגדולות.",
                "tags": ["EDM", "Dance", "Electronic"],
                "createdBy": {
                    "_id": "u203",
                    "fullname": "Music Bot",
                    "imgUrl": "https://randomuser.me/api/portraits/lego/5.jpg"
                },
                "addedAt": 1693843220000,
                "type": "system",
                "likedByUsers": [],
                "stationImgUrl": "https://i.ytimg.com/vi/A57B7B6w3kw/maxresdefault.jpg",
                "songs": [
                    {
                        "id": "A57B7B6w3kw",
                        "artist": "Marshmello ft. Bastille",
                        "title": "Happier",
                        "album": "Joytime II",
                        "dateAdded": "2025-08-14T09:20:00Z",
                        "duration": "3:34",
                        "imgUrl": "https://i.ytimg.com/vi/A57B7B6w3kw/hqdefault.jpg"
                    }
                ]
            },
            {
                "_id": "station_weeknd_001",
                "name": "The Weeknd Essentials",
                "description": "הכי טוב של דה וויקנד.",
                "tags": ["R&B", "Pop", "Synthwave"],
                "createdBy": {
                    "_id": "u204",
                    "fullname": "Music Bot",
                    "imgUrl": "https://randomuser.me/api/portraits/lego/6.jpg"
                },
                "addedAt": 1693843230000,
                "type": "system",
                "likedByUsers": [],
                "stationImgUrl": "https://i.ytimg.com/vi/fHI8X4OXluQ/maxresdefault.jpg",
                "songs": [
                    {
                        "id": "fHI8X4OXluQ",
                        "artist": "The Weeknd",
                        "title": "Blinding Lights",
                        "album": "After Hours",
                        "dateAdded": "2025-08-15T09:20:00Z",
                        "duration": "3:22",
                        "imgUrl": "https://i.ytimg.com/vi/fHI8X4OXluQ/hqdefault.jpg"
                    }
                ]
            },
            {
                "_id": "station_billie_001",
                "name": "Billie Eilish Mood",
                "description": "שירים מובילים של בילי אייליש.",
                "tags": ["Pop", "Alternative", "Indie"],
                "createdBy": {
                    "_id": "u205",
                    "fullname": "Music Bot",
                    "imgUrl": "https://randomuser.me/api/portraits/lego/7.jpg"
                },
                "addedAt": 1693843240000,
                "type": "system",
                "likedByUsers": [],
                "stationImgUrl": "https://i.ytimg.com/vi/viimfQi_pUw/maxresdefault.jpg",
                "songs": [
                    {
                        "id": "viimfQi_pUw",
                        "artist": "Billie Eilish",
                        "title": "bad guy",
                        "album": "WHEN WE ALL FALL ASLEEP, WHERE DO WE GO?",
                        "dateAdded": "2025-08-16T09:20:00Z",
                        "duration": "3:14",
                        "imgUrl": "https://i.ytimg.com/vi/viimfQi_pUw/hqdefault.jpg"
                    }
                ]
            },
            {
                "_id": "station_postmalone_001",
                "name": "Post Malone Chill",
                "description": "הלהיטים המרגיעים של פוסט מאלון.",
                "tags": ["Hip-Hop", "Rap", "Chill"],
                "createdBy": {
                    "_id": "u206",
                    "fullname": "Music Bot",
                    "imgUrl": "https://randomuser.me/api/portraits/lego/8.jpg"
                },
                "addedAt": 1693843250000,
                "type": "system",
                "likedByUsers": [],
                "stationImgUrl": "https://i.ytimg.com/vi/au2n7VVGv_c/maxresdefault.jpg",
                "songs": [
                    {
                        "id": "au2n7VVGv_c",
                        "artist": "Post Malone, Swae Lee",
                        "title": "Sunflower",
                        "album": "Spider-Man: Into the Spider-Verse",
                        "dateAdded": "2025-08-17T09:20:00Z",
                        "duration": "2:38",
                        "imgUrl": "https://i.ytimg.com/vi/au2n7VVGv_c/hqdefault.jpg"
                    }
                ]
            },
            {
                "_id": "station_davidguetta_001",
                "name": "David Guetta Party",
                "description": "להיטי מסיבות של דיוויד גואטה.",
                "tags": ["EDM", "Dance", "Party"],
                "createdBy": {
                    "_id": "u207",
                    "fullname": "Music Bot",
                    "imgUrl": "https://randomuser.me/api/portraits/lego/9.jpg"
                },
                "addedAt": 1693843260000,
                "type": "system",
                "likedByUsers": [],
                "stationImgUrl": "public/img/spotifly-albums-images/ab67706f0000000292af799a11403259b8474500.png",
                "songs": [
                    {
                        "id": "HPUJhx-XK4o",
                        "artist": "David Guetta ft. Sia",
                        "title": "Titanium",
                        "album": "Nothing but the Beat",
                        "dateAdded": "2025-08-18T09:20:00Z",
                        "duration": "4:05",
                        "imgUrl": "https://i.ytimg.com/vi/HPUJhx-XK4o/hqdefault.jpg"
                    }
                ]
            },
            {
                "_id": "station_shakira_001",
                "name": "Shakira Dance",
                "description": "שירים קצביים של שאקירה לריקודים.",
                "tags": ["Pop", "Latin", "Dance"],
                "createdBy": {
                    "_id": "u208",
                    "fullname": "Music Bot",
                    "imgUrl": "https://randomuser.me/api/portraits/lego/10.jpg"
                },
                "addedAt": 1693843270000,
                "type": "system",
                "likedByUsers": [],
                "stationImgUrl": "https://i.ytimg.com/vi/pRpeEdMmmQ0/maxresdefault.jpg",
                "songs": [
                    {
                        "id": "pRpeEdMmmQ0",
                        "artist": "Shakira",
                        "title": "Waka Waka (This Time for Africa)",
                        "album": "Listen Up! The Official 2010 FIFA World Cup Album",
                        "dateAdded": "2025-08-19T09:20:00Z",
                        "duration": "3:31",
                        "imgUrl": "https://i.ytimg.com/vi/pRpeEdMmmQ0/hqdefault.jpg"
                    }
                ]
            },
            {
                "_id": "station_taylor_001",
                "name": "Taylor Swift Collection",
                "description": "מיטב הלהיטים של טיילור סוויפט מכל התקופות.",
                "tags": ["Pop", "Country", "Hits"],
                "createdBy": {
                    "_id": "u209",
                    "fullname": "Music Bot",
                    "imgUrl": "https://randomuser.me/api/portraits/lego/11.jpg"
                },
                "addedAt": 1693843280000,
                "type": "system",
                "likedByUsers": [],
                "stationImgUrl": "https://i.ytimg.com/vi/3tmd-ClpJxA/maxresdefault.jpg",
                "songs": [
                    {
                        "id": "3tmd-ClpJxA",
                        "artist": "Taylor Swift",
                        "title": "Shake It Off",
                        "album": "1989",
                        "dateAdded": "2025-08-20T09:20:00Z",
                        "duration": "4:02",
                        "imgUrl": "https://i.ytimg.com/vi/3tmd-ClpJxA/hqdefault.jpg"
                    }
                ]
            },
            {
                "_id": "station_drake_001",
                "name": "Drake Top Tracks",
                "description": "הראפר הקנדי עם הלהיטים הכי גדולים שלו.",
                "tags": ["Hip-Hop", "Rap", "Pop"],
                "createdBy": {
                    "_id": "u210",
                    "fullname": "Music Bot",
                    "imgUrl": "https://randomuser.me/api/portraits/lego/12.jpg"
                },
                "addedAt": 1693843290000,
                "type": "system",
                "likedByUsers": [],
                "stationImgUrl": "https://i.ytimg.com/vi/xpVfcZ0ZcFM/maxresdefault.jpg",
                "songs": [
                    {
                        "id": "xpVfcZ0ZcFM",
                        "artist": "Drake",
                        "title": "Hotline Bling",
                        "album": "Views",
                        "dateAdded": "2025-08-21T09:20:00Z",
                        "duration": "4:55",
                        "imgUrl": "https://i.ytimg.com/vi/xpVfcZ0ZcFM/hqdefault.jpg"
                    }
                ]
            },
            {
                "_id": "station_imagine_001",
                "name": "Imagine Dragons Power",
                "description": "אנרגיה מטורפת עם Imagine Dragons.",
                "tags": ["Rock", "Alternative", "Pop"],
                "createdBy": {
                    "_id": "u211",
                    "fullname": "Music Bot",
                    "imgUrl": "https://randomuser.me/api/portraits/lego/13.jpg"
                },
                "addedAt": 1693843300000,
                "type": "system",
                "likedByUsers": [],
                "stationImgUrl": "https://i.ytimg.com/vi/7wtfhZwyrcc/maxresdefault.jpg",
                "songs": [
                    {
                        "id": "7wtfhZwyrcc",
                        "artist": "Imagine Dragons",
                        "title": "Believer",
                        "album": "Evolve",
                        "dateAdded": "2025-08-22T09:20:00Z",
                        "duration": "3:24",
                        "imgUrl": "https://i.ytimg.com/vi/7wtfhZwyrcc/hqdefault.jpg"
                    }
                ]
            },
            {
                "_id": "station_ariana_001",
                "name": "Ariana Grande Hits",
                "description": "הקול של אריאנה גרנדה בלהיטים הגדולים ביותר.",
                "tags": ["Pop", "R&B", "Dance"],
                "createdBy": {
                    "_id": "u212",
                    "fullname": "Music Bot",
                    "imgUrl": "https://randomuser.me/api/portraits/lego/14.jpg"
                },
                "addedAt": 1693843310000,
                "type": "system",
                "likedByUsers": [],
                "stationImgUrl": "https://i.ytimg.com/vi/ffxKSjUwKdU/maxresdefault.jpg",
                "songs": [
                    {
                        "id": "ffxKSjUwKdU",
                        "artist": "Ariana Grande",
                        "title": "No Tears Left To Cry",
                        "album": "Sweetener",
                        "dateAdded": "2025-08-23T09:20:00Z",
                        "duration": "3:58",
                        "imgUrl": "https://i.ytimg.com/vi/ffxKSjUwKdU/hqdefault.jpg"
                    }
                ]
            },
            {
                "_id": "station_bruno_001",
                "name": "Bruno Mars Groove",
                "description": "שירי גרוב וריקודים של ברונו מארס.",
                "tags": ["Pop", "Funk", "Soul"],
                "createdBy": {
                    "_id": "u213",
                    "fullname": "Music Bot",
                    "imgUrl": "https://randomuser.me/api/portraits/lego/15.jpg"
                },
                "addedAt": 1693843320000,
                "type": "system",
                "likedByUsers": [],
                "stationImgUrl": "https://i.ytimg.com/vi/OPf0YbXqDm0/maxresdefault.jpg",
                "songs": [
                    {
                        "id": "OPf0YbXqDm0",
                        "artist": "Bruno Mars",
                        "title": "Uptown Funk",
                        "album": "Uptown Special",
                        "dateAdded": "2025-08-24T09:20:00Z",
                        "duration": "4:31",
                        "imgUrl": "https://i.ytimg.com/vi/OPf0YbXqDm0/hqdefault.jpg"
                    }
                ]
            },
            {
                "_id": "station_eminem_001",
                "name": "Eminem Classics",
                "description": "הלהיטים הכי חזקים של אמינם.",
                "tags": ["Rap", "Hip-Hop", "Classic"],
                "createdBy": {
                    "_id": "u214",
                    "fullname": "Music Bot",
                    "imgUrl": "https://randomuser.me/api/portraits/lego/16.jpg"
                },
                "addedAt": 1693843330000,
                "type": "system",
                "likedByUsers": [],
                "stationImgUrl": "https://i.ytimg.com/vi/_Yhyp-_hX2s/maxresdefault.jpg",
                "songs": [
                    {
                        "id": "_Yhyp-_hX2s",
                        "artist": "Eminem",
                        "title": "Lose Yourself",
                        "album": "8 Mile",
                        "dateAdded": "2025-08-25T09:20:00Z",
                        "duration": "5:24",
                        "imgUrl": "https://i.ytimg.com/vi/_Yhyp-_hX2s/hqdefault.jpg"
                    }
                ]
            },
            {
                "_id": "station_celine_001",
                "name": "Celine Dion Ballads",
                "description": "בלדות אגדיות של סלין דיון.",
                "tags": ["Pop", "Ballad", "Classic"],
                "createdBy": {
                    "_id": "u215",
                    "fullname": "Music Bot",
                    "imgUrl": "https://randomuser.me/api/portraits/lego/17.jpg"
                },
                "addedAt": 1693843340000,
                "type": "system",
                "likedByUsers": [],
                "stationImgUrl": "public/img/spotifly-albums-images/en (22).png",
                "songs": [
                    {
                        "id": "lYx06V1a3pk",
                        "artist": "Celine Dion",
                        "title": "My Heart Will Go On",
                        "album": "Let's Talk About Love",
                        "dateAdded": "2025-08-26T09:20:00Z",
                        "duration": "4:41",
                        "imgUrl": "https://i.ytimg.com/vi/lYx06V1a3pk/hqdefault.jpg"
                    }
                ]
            },
            {
                "_id": "station_shawn_001",
                "name": "Shawn Mendes Pop",
                "description": "הלהיטים הגדולים של שון מנדס.",
                "tags": ["Pop", "Acoustic", "Hits"],
                "createdBy": {
                    "_id": "u216",
                    "fullname": "Music Bot",
                    "imgUrl": "https://randomuser.me/api/portraits/lego/18.jpg"
                },
                "addedAt": 1693843350000,
                "type": "system",
                "likedByUsers": [],
                "stationImgUrl": "https://i.ytimg.com/vi/kJQP7kiw5Fk/maxresdefault.jpg",
                "songs": [
                    {
                        "id": "kJQP7kiw5Fk",
                        "artist": "Shawn Mendes & Camila Cabello",
                        "title": "Señorita",
                        "album": "Shawn Mendes (Deluxe)",
                        "dateAdded": "2025-08-27T09:20:00Z",
                        "duration": "3:11",
                        "imgUrl": "https://i.ytimg.com/vi/kJQP7kiw5Fk/hqdefault.jpg"
                    }
                ]
            }
        ]
        stations.push(...stationJson)
        await storageService.saveAll(STORAGE_KEY, stations)
        console.log('stations successfully added to localStorage')
    } catch (err) {
        console.error('Failed to create demo stations:', err)
    }
}


