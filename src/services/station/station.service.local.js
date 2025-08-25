
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
        stations = stations.filter(station => station.addedat >= minAddedAt)
    }
    if (sortField === 'name') {
        stations.sort((station1, station2) =>
            station1[sortField].localeCompare(station2[sortField]) * +sortDir)
    }
    if (sortField === 'addedat') {
        stations.sort((station1, station2) =>
            (station1[sortField] - station2[sortField]) * +sortDir)
    }

    // stations = stations.map(({ _id, name, addedat, owner }) => ({ _id, name, addedat, owner }))
    return stations
}

function getById(stationId) {
    return storageService.get(STORAGE_KEY, stationId)
}

async function remove(stationId) {
    // throw new Error('Nope')
    await storageService.remove(STORAGE_KEY, stationId)
}

async function save(station) {
    var savedStation
    if (station._id) {
        const stationToSave = {
            _id: station._id,
            addedat: station.addedat
        }
        savedStation = await storageService.put(STORAGE_KEY, stationToSave)
    } else {
        const stationToSave = {
            name: station.name,
            addedat: station.addedat,
            // Later, owner is set by the backend
            owner: userService.getLoggedinUser(),
            msgs: []
        }
        savedStation = await storageService.post(STORAGE_KEY, stationToSave)
    }
    return savedStation
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
                addedat: 1724476800000,
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
                addedat: 1756012500000,
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
                    fullname: 'Ava Stone',
                    imgUrl: 'https://randomuser.me/api/portraits/women/65.jpg',
                },
                addedat: 1754198400000,
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
