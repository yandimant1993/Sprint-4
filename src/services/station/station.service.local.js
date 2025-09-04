
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
    await save(station)
    return songId
}

async function addSong(stationId, song) {
    const station = await getById(stationId)
    // if (!station) throw new Error('Station not found!')
    station.songs.push(song)
    await save(station)
    return song
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
                "stationImgUrl": "public/img/spotifly-albums-images/ab67616d0000e1a34527df178b5b5172e7c4711c.png",
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
                "stationImgUrl": "public/img/spotifly-albums-images/ab67616d00001e02726d48d93d02e1271774f023.png",
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
                "description": "תחנה עם הלהיטים הגדולים של Coldplay, כולל A Sky Full of Stars.",
                "tags": ["Coldplay", "Rock", "Pop", "Hits"],
                "createdBy": {
                    "_id": "u200",
                    "fullname": "Music Bot",
                    "imgUrl": "https://randomuser.me/api/portraits/lego/2.jpg"
                },
                "addedAt": 1693843200000,
                "type": "system",
                "likedByUsers": [],
                "stationImgUrl": "https://img.youtube.com/vi/VPRjCeoBqrI/hqdefault.jpg",
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
                "stationImgUrl": "public/img/spotifly-albums-images/ab67616d000048514718e2b124f79258be7bc452.png",
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
                "stationImgUrl": "public/img/spotifly-albums-images/ab67616d00004851f84e1700d7b6ba0d479205a4.png",
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
                "stationImgUrl": "public/img/spotifly-albums-images/ab67616d00004851b5d4b4ed17ec86c4b3944af2.png",
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
                "stationImgUrl": "public/img/spotifly-albums-images/ab67616d00004851ee07023115f822012390d2a0.png",
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
                "stationImgUrl": "public/img/spotifly-albums-images/ab67616d000048519b19c107109de740bad72df5.png",
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
                "stationImgUrl": "public/img/spotifly-albums-images/ab67616d000048513e082d95832d0ee56241b8ce.png",
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
            }


        ]
        stations.push(...stationJson)
        await storageService.saveAll(STORAGE_KEY, stations)
        console.log('stations successfully added to localStorage')
    } catch (err) {
        console.error('Failed to create demo stations:', err)
    }
}


