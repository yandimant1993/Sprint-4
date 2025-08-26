
import { storageService } from '../async-storage.service'
import { makeId } from '../util.service'
import { userService } from '../user'

const STORAGE_KEY = 'station'

export const stationService = {
    query,
    getById,
    save,
    remove,
    addStationMsg
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

async function getById(stationId) {
    try {
        const station = await storageService.get(STORAGE_KEY, stationId).catch(() => null)
        if (station) return station

        const loggedInUser = userService.getLoggedinUser()
        if (!loggedInUser) throw new Error('No logged-in user')

        const user = await userService.getById(loggedInUser._id)
        const userStation = user.stations?.find(station => station._id === stationId)

        if (userStation) return userStation

        throw new Error(`Station with ID "${stationId}" not found in global or user scope.`)
    } catch (err) {
        console.error(`getById failed:`, err)
        throw err
    }
}


async function remove(stationId) {
    await storageService.remove(STORAGE_KEY, stationId)
}

async function save(station) {
    try {
        const loggedInUser = userService.getLoggedinUser()
        if (!loggedInUser) throw new Error('No logged-in user')

        if (!station._id) station._id = makeId()

        const existingGlobal = await storageService.get(STORAGE_KEY, station._id).catch(() => null)

        if (existingGlobal) {
            return await storageService.put(STORAGE_KEY, station)
        }

        const user = await userService.getById(loggedInUser._id)
        user.stations = user.stations || []

        const idx = user.stations.findIndex(s => s._id === station._id)

        if (idx !== -1) {
            user.stations[idx] = station
        } else {
            const newStation = {
                ...station,
                addedAt: Date.now(),
                createdBy: {
                    _id: user._id,
                    fullname: user.fullname,
                    imgUrl: user.imgUrl,
                },
                stationImgUrl: station.stationImgUrl || 'https://placebear.com/80/80',
                likedByUsers: [],
            }
            user.stations.push(newStation)
            station = newStation
        }
        await storageService.put('user', user)

        if (loggedInUser._id === user._id) {
            userService.saveLoggedinUser(user)
        }

        return station
    } catch (err) {
        console.error('Failed to save station:', err)
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
                tags: ['Chill', 'Lofi', 'Beats'],
                createdBy: {
                    _id: 'u101',
                    fullname: 'Ava Stone',
                    imgUrl: 'https://randomuser.me/api/portraits/women/65.jpg',
                },
                addedAt: 1724476800000,
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
                tags: ['Indie Rock', 'New Releases'],
                createdBy: {
                    _id: 'u102',
                    fullname: 'Jasper Ray',
                    imgUrl: 'https://randomuser.me/api/portraits/men/42.jpg',
                },
                addedAt: 1756012500000,
                likedByUsers: [],
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
                tags: ['Synthwave', 'Retro', 'Instrumental'],
                createdBy: {
                    _id: 'u101',
                    username: 'aaa',
                    fullname: 'Ava V',
                    imgUrl: 'https://randomuser.me/api/portraits/women/65.jpg',
                },
                addedAt: 1754198400000,
                likedByUsers: [],
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
                        performer: 'Carpenter Brut',
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
