
import { storageService } from '../async-storage.service'
import { makeId } from '../util.service'
import { userService } from '../user'

const STORAGE_KEY = 'station'
// const USER_STATION_KEY = 'user'

export const stationService = {
    query,
    getById,
    save,
    remove,
    addStationMsg,
    getUserStations,
    removeSong,
    addSong,
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

// async function getById(stationId) {
//     if (!stationId) throw new Error('Station ID is required')
//     try {
//         const station = await storageService.get(STORAGE_KEY, stationId)
//         if (station) return station
//     } catch { }
//     try {
//         const station = await storageService.get(USER_STATION_KEY, stationId)
//         if (station) return station
//     } catch { }

//     throw new Error(`Station with ID ${stationId} not found in system or user stations`)
// }

async function getUserStations() {
    const { _id: userId } = userService.getLoggedinUser()
    try {
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

// async function remove(stationId, type = 'system') {
//     const key = type === 'system' ? STORAGE_KEY : USER_STATION_KEY
//     try {
//         await storageService.remove(key, stationId)
//     } catch (err) {
//         throw new Error(`Remove failed, cannot find entity with id: ${stationId} in: ${key}`)
//     }
// }

async function removeSong(songId, stationId) {
    const station = await getById(stationId) // get all the stations
    console.log('station', station)
    station.songs = station.songs.filter(song => song.id !== songId)
    const savedStation = await save(station)
    return savedStation
}

async function addSong(song, stationId) {
    const station = await getById(stationId)
    console.log('station', station)
    // if (!station) throw new Error('Station not found!')
    station.songs.push(song)
    const savedStation = await save(station)
    return savedStation
}

async function save(station) {
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

async function addStationMsg(stationId, txt) {
    // Later, this is all done by the backend
    const station = await getById(stationId)

    const msg = {
        id: makeId(),
        by: userService.getLoggedinUser(),
        txt
    }
    station.msgs.push(msg)
    await storageService.put(STORAGE_KEY, station)

    return msg
}

async function _createStations() {
    try {
        let stations = await storageService.query(STORAGE_KEY)
        if (stations.length > 0) return

        stations = [
            {
                _id: '64f1cdd298b8c2a1d4a12f3a',
                name: 'Late Night Loops',
                description: "Ed Sheeran and acoustic guitars on the beach. Songs that feel like vacation",
                tags: ['Chill', 'Lofi', 'Beats'],
                createdBy: {
                    _id: 'u103',
                    fullname: 'Ava Stone',
                    imgUrl: 'https://randomuser.me/api/portraits/women/70.jpg',
                },
                addedAt: 1724476800000,
                type: 'system',
                likedByUsers: [],
                stationImgUrl: 'https://placebear.com/80/80',
                songs: [
                    {
                        id: 's001',
                        artist: 'Luffi',
                        title: 'Sunset Drive',
                        album: 'Lofi Nights',
                        dateAdded: '2025-08-01T12:30:00Z',
                        duration: '3:24',
                        imgUrl: 'https://placehold.co/40x40',
                    },
                    {
                        id: 's002',
                        artist: 'Kyortush',
                        title: 'Rainy Nights',
                        album: 'Quiet Storm',
                        dateAdded: '2025-08-05T09:15:00Z',
                        duration: '4:12',
                        imgUrl: 'https://placehold.co/40x40',
                    },
                    {
                        id: 's003',
                        artist: 'Leeroy Jenkins',
                        title: 'Electric Feel',
                        album: 'Indie Classics',
                        dateAdded: '2025-08-10T14:05:00Z',
                        duration: '3:49',
                        imgUrl: 'https://placehold.co/40x40'
                    }
                ]
            },
            {
                _id: '64f1cdd298b8c2a1d4a12f3b',
                name: 'Indie Vibes',
                description: "High-energy beats with Drake and David Guetta. Perfect pump for your workout",
                tags: ['Indie Rock', 'New Releases'],
                createdBy: {
                    _id: 'u102',
                    fullname: 'Jasper Ray',
                    imgUrl: 'https://randomuser.me/api/portraits/men/42.jpg',
                },
                addedAt: 1756012500000,
                likedByUsers: [],
                type: 'system',
                stationImgUrl: 'https://placebear.com/80/80',
                songs: [
                    {
                        id: 's004',
                        artist: 'Leeroy Jenkins',
                        title: 'Youth',
                        album: 'Acoustic Moods',
                        dateAdded: '2025-08-15T18:22:00Z',
                        duration: '4:01',
                        imgUrl: 'https://placehold.co/40x40'
                    },
                    {
                        id: 's005',
                        artist: 'Leeroy Jenkins',
                        title: 'Nightcall',
                        album: 'Synthwave Drive',
                        dateAdded: '2025-08-20T11:00:00Z',
                        duration: '5:05',
                        imgUrl: 'https://placehold.co/40x40'
                    }
                ]
            },
            {
                _id: '64f1cdd298b8c2a1d4a12f3c',
                name: 'Loved Songs',
                description: "Soft piano with Ludovico Einaudi and Lo-Fi beats. Relax and stay concentrated",
                tags: ['Synthwave', 'Retro', 'Instrumental'],
                createdBy: {
                    _id: 'u101',
                    username: 'aaa',
                    fullname: 'Ava V',
                    imgUrl: 'https://randomuser.me/api/portraits/women/65.jpg',
                },
                addedAt: 1754198400000,
                likedByUsers: [],
                type: 'user',
                stationImgUrl: 'https://placebear.com/80/80',
                songs: [
                    {
                        id: 's001',
                        artist: 'Leeroy Jenkins',
                        title: 'Sunset Drive',
                        album: 'Lofi Nights',
                        dateAdded: '2025-08-01T12:30:00Z',
                        duration: '3:24',
                        imgUrl: 'https://placehold.co/40x40'
                    },
                    {
                        id: 's002',
                        artist: 'Leeroy Jenkins',
                        title: 'Rainy Nights',
                        album: 'Quiet Storm',
                        dateAdded: '2025-08-05T09:15:00Z',
                        duration: '4:12',
                        imgUrl: 'https://placehold.co/40x40'
                    }
                ]
            },
        ]
        await storageService.saveAll(STORAGE_KEY, stations)
        console.log('stations successfully added to localStorage')
    } catch (err) {
        console.error('Failed to create demo stations:', err)
    }
}


