
import { storageService } from '../async-storage.service'
import { makeId } from '../util.service'
import { userService } from '../user'

const STORAGE_KEY = 'station'
const USER_STATION_KEY = 'user'

export const stationService = {
    query,
    getById,
    save,
    remove,
    addStationMsg,
    getUserStations
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
    // console.log('stations',stations)
    return stations
}

// async function getById(stationId) {
//     try {
//         return await storageService.get(STORAGE_KEY, stationId)
//     } catch (err) {
//         throw new Error(`Get failed, cannot find entity with id: ${stationId} in: ${STORAGE_KEY}`)
//     }
// }

async function getById(stationId) {
    if (!stationId) throw new Error('Station ID is required')
    try {
        const station = await storageService.get(STORAGE_KEY, stationId)
        if (station) return station
    } catch { }
    try {
        const station = await storageService.get(USER_STATION_KEY, stationId)
        if (station) return station
    } catch { }

    throw new Error(`Station with ID ${stationId} not found in system or user stations`)
}

async function getUserStations() {
    const {_id: userId} = userService.getLoggedinUser()
    // console.log('userId', userId)
    try {
        const stations = await query()
        // console.log('stations', stations)
        const userStations = stations.filter(station => station.createdBy._id === userId)
        // console.log('userStations', userStations)
        return userStations
    } catch (error) {

    }
}

// async function remove(stationId) {
//     try {
//         return await storageService.remove(STORAGE_KEY, stationId)
//     } catch (err) {
//         throw new Error(`Remove failed, cannot find entity with id: ${stationId} in: ${STORAGE_KEY}`)
//     }
// }

async function remove(stationId, type = 'system') {
    const key = type === 'system' ? STORAGE_KEY : USER_STATION_KEY
    try {
        await storageService.remove(key, stationId)
    } catch (err) {
        throw new Error(`Remove failed, cannot find entity with id: ${stationId} in: ${key}`)
    }
}

async function save(station) {
    console.log('station: ', station)
    const { _id, fullname, imgUrl } = userService.getLoggedinUser()

    try {
        // const key = station.type === 'system' ? STORAGE_KEY : USER_STATION_KEY

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
                        title: 'Sunset Drive',
                        performer: 'Sleepy Fish',
                        url: 'https://youtube.com/watch?v=abc123',
                        imgUrl: 'https://i.ytimg.com/vi/abc123/mqdefault.jpg',
                    },
                    {
                        id: 's002',
                        title: 'Rainy Nights',
                        performer: 'Idealism',
                        url: 'https://youtube.com/watch?v=def456',
                        imgUrl: 'https://i.ytimg.com/vi/def456/mqdefault.jpg',
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
                        id: 's003',
                        title: 'Electric Feel',
                        performer: 'MGMT',
                        url: 'https://youtube.com/watch?v=ghi789',
                        imgUrl: 'https://i.ytimg.com/vi/ghi789/mqdefault.jpg',
                    },
                    {
                        id: 's004',
                        title: 'Youth',
                        performer: 'Daughter',
                        url: 'https://youtube.com/watch?v=jkl012',
                        imgUrl: 'https://i.ytimg.com/vi/jkl012/mqdefault.jpg',
                    }
                ]
            },
            {
                _id: '64f1cdd298b8c2a1d4a12f3c',
                name: 'Retro Synthwave',
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
                        id: 's005',
                        title: 'Nightcall',
                        performer: 'Kavinsky',
                        url: 'https://youtube.com/watch?v=mno345',
                        imgUrl: 'https://i.ytimg.com/vi/mno345/mqdefault.jpg',
                    },
                    {
                        id: 's006',
                        title: 'Turbo Killer',
                        performer: 'Stationpenter Brut',
                        url: 'https://youtube.com/watch?v=pqr678',
                        imgUrl: 'https://i.ytimg.com/vi/pqr678/mqdefault.jpg',
                    }
                ]
            }
        ]
        await storageService.saveAll(STORAGE_KEY, stations)
        console.log('stations successfully added to localStorage')
    } catch (err) {
        console.error('Failed to create demo stations:', err)
    }
}


