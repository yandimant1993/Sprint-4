
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

        stations.push(
            {
                _id: 'st001',
                name: 'Love Yourself: Answer',
                description: "BTS's global K-pop phenomenon with hits like 'Idol' and 'Euphoria'.",
                tags: ['K-pop', 'Pop', 'International'],
                createdBy: {
                    _id: 'u301',
                    fullname: 'Music Curator',
                    imgUrl: 'https://randomuser.me/api/portraits/women/45.jpg',
                },
                addedAt: 1734476800000,
                type: 'system',
                likedByUsers: [],
                stationImgUrl: 'https://upload.wikimedia.org/wikipedia/en/0/0a/Love_Yourself_Answer_Cover.jpg',
                songs: [
                    { id: 's001', artist: 'BTS', title: 'Euphoria', album: 'Love Yourself: Answer', duration: '3:49', dateAdded: '2025-08-01T12:30:00Z', imgUrl: 'https://upload.wikimedia.org/wikipedia/en/0/0a/Love_Yourself_Answer_Cover.jpg' },
                    { id: 's002', artist: 'BTS', title: 'Trivia 起: Just Dance', album: 'Love Yourself: Answer', duration: '3:45', dateAdded: '2025-08-01T12:31:00Z', imgUrl: 'https://upload.wikimedia.org/wikipedia/en/0/0a/Love_Yourself_Answer_Cover.jpg' },
                    { id: 's003', artist: 'BTS', title: 'Serendipity (Full Length Edition)', album: 'Love Yourself: Answer', duration: '4:36', dateAdded: '2025-08-01T12:32:00Z', imgUrl: 'https://upload.wikimedia.org/wikipedia/en/0/0a/Love_Yourself_Answer_Cover.jpg' },
                    { id: 's004', artist: 'BTS', title: 'DNA', album: 'Love Yourself: Answer', duration: '3:43', dateAdded: '2025-08-01T12:33:00Z', imgUrl: 'https://upload.wikimedia.org/wikipedia/en/0/0a/Love_Yourself_Answer_Cover.jpg' },
                    { id: 's005', artist: 'BTS', title: 'Idol', album: 'Love Yourself: Answer', duration: '3:42', dateAdded: '2025-08-01T12:34:00Z', imgUrl: 'https://upload.wikimedia.org/wikipedia/en/0/0a/Love_Yourself_Answer_Cover.jpg' },
                ]
            },
            {
                _id: 'st002',
                name: 'Greatest Hits',
                description: "Arik Einstein’s timeless Israeli classics that defined a generation.",
                tags: ['Israeli', 'Rock', 'Classics'],
                createdBy: {
                    _id: 'u302',
                    fullname: 'Noa Levi',
                    imgUrl: 'https://randomuser.me/api/portraits/men/21.jpg',
                },
                addedAt: 1734476800000,
                type: 'system',
                likedByUsers: [],
                stationImgUrl: 'https://upload.wikimedia.org/wikipedia/he/3/38/ArikEinstein_GreatestHits.jpg',
                songs: [
                    { id: 's006', artist: 'Arik Einstein', title: 'Ani VeAta', album: 'Greatest Hits', duration: '3:30', dateAdded: '2025-08-02T12:30:00Z', imgUrl: 'https://upload.wikimedia.org/wikipedia/he/3/38/ArikEinstein_GreatestHits.jpg' },
                    { id: 's007', artist: 'Arik Einstein', title: 'Uf Gozal', album: 'Greatest Hits', duration: '3:40', dateAdded: '2025-08-02T12:31:00Z', imgUrl: 'https://upload.wikimedia.org/wikipedia/he/3/38/ArikEinstein_GreatestHits.jpg' },
                    { id: 's008', artist: 'Arik Einstein', title: 'Sa Leat', album: 'Greatest Hits', duration: '3:50', dateAdded: '2025-08-02T12:32:00Z', imgUrl: 'https://upload.wikimedia.org/wikipedia/he/3/38/ArikEinstein_GreatestHits.jpg' },
                    { id: 's009', artist: 'Arik Einstein', title: 'Mechaka Lach', album: 'Greatest Hits', duration: '4:10', dateAdded: '2025-08-02T12:33:00Z', imgUrl: 'https://upload.wikimedia.org/wikipedia/he/3/38/ArikEinstein_GreatestHits.jpg' },
                ]
            },
            {
                _id: 'st003',
                name: 'First Love',
                description: "Hikaru Utada’s record-breaking J-pop debut album, a cornerstone of Japanese pop.",
                tags: ['J-pop', 'Pop', 'Japanese'],
                createdBy: {
                    _id: 'u303',
                    fullname: 'Aiko Tanaka',
                    imgUrl: 'https://randomuser.me/api/portraits/women/55.jpg',
                },
                addedAt: 1734476800000,
                type: 'system',
                likedByUsers: [],
                stationImgUrl: 'https://upload.wikimedia.org/wikipedia/en/d/d0/Utada_Hikaru_First_Love.jpg',
                songs: [
                    { id: 's010', artist: 'Hikaru Utada', title: 'Automatic', album: 'First Love', duration: '4:28', dateAdded: '2025-08-03T12:30:00Z', imgUrl: 'https://upload.wikimedia.org/wikipedia/en/d/d0/Utada_Hikaru_First_Love.jpg' },
                    { id: 's011', artist: 'Hikaru Utada', title: 'First Love', album: 'First Love', duration: '4:20', dateAdded: '2025-08-03T12:31:00Z', imgUrl: 'https://upload.wikimedia.org/wikipedia/en/d/d0/Utada_Hikaru_First_Love.jpg' },
                    { id: 's012', artist: 'Hikaru Utada', title: 'Time Will Tell', album: 'First Love', duration: '5:26', dateAdded: '2025-08-03T12:32:00Z', imgUrl: 'https://upload.wikimedia.org/wikipedia/en/d/d0/Utada_Hikaru_First_Love.jpg' },
                ]
            },
            {
                _id: 'st004',
                name: 'Thriller',
                description: "Michael Jackson’s legendary pop masterpiece with global hits.",
                tags: ['Pop', 'International', 'Classic'],
                createdBy: {
                    _id: 'u304',
                    fullname: 'Daniel Green',
                    imgUrl: 'https://randomuser.me/api/portraits/men/12.jpg',
                },
                addedAt: 1734476800000,
                type: 'system',
                likedByUsers: [],
                stationImgUrl: 'https://upload.wikimedia.org/wikipedia/en/5/55/Michael_Jackson_-_Thriller.png',
                songs: [
                    { id: 's013', artist: 'Michael Jackson', title: 'Wanna Be Startin\' Somethin\'', album: 'Thriller', duration: '6:03', dateAdded: '2025-08-04T12:30:00Z', imgUrl: 'https://upload.wikimedia.org/wikipedia/en/5/55/Michael_Jackson_-_Thriller.png' },
                    { id: 's014', artist: 'Michael Jackson', title: 'Thriller', album: 'Thriller', duration: '5:57', dateAdded: '2025-08-04T12:31:00Z', imgUrl: 'https://upload.wikimedia.org/wikipedia/en/5/55/Michael_Jackson_-_Thriller.png' },
                    { id: 's015', artist: 'Michael Jackson', title: 'Beat It', album: 'Thriller', duration: '4:18', dateAdded: '2025-08-04T12:32:00Z', imgUrl: 'https://upload.wikimedia.org/wikipedia/en/5/55/Michael_Jackson_-_Thriller.png' },
                    { id: 's016', artist: 'Michael Jackson', title: 'Billie Jean', album: 'Thriller', duration: '4:54', dateAdded: '2025-08-04T12:33:00Z', imgUrl: 'https://upload.wikimedia.org/wikipedia/en/5/55/Michael_Jackson_-_Thriller.png' },
                ]
            },
            {
                _id: 'st005',
                name: 'Transa',
                description: "Caetano Veloso’s Brazilian classic blending tropicalia with folk and rock.",
                tags: ['Brazilian', 'Tropicalia', 'Folk'],
                createdBy: {
                    _id: 'u305',
                    fullname: 'Marcos Silva',
                    imgUrl: 'https://randomuser.me/api/portraits/men/44.jpg',
                },
                addedAt: 1734476800000,
                type: 'system',
                likedByUsers: [],
                stationImgUrl: 'https://upload.wikimedia.org/wikipedia/en/8/8c/Caetano_Veloso_-_Transa.jpg',
                songs: [
                    { id: 's017', artist: 'Caetano Veloso', title: 'You Don’t Know Me', album: 'Transa', duration: '3:45', dateAdded: '2025-08-05T12:30:00Z', imgUrl: 'https://upload.wikimedia.org/wikipedia/en/8/8c/Caetano_Veloso_-_Transa.jpg' },
                    { id: 's018', artist: 'Caetano Veloso', title: 'Nine Out of Ten', album: 'Transa', duration: '4:36', dateAdded: '2025-08-05T12:31:00Z', imgUrl: 'https://upload.wikimedia.org/wikipedia/en/8/8c/Caetano_Veloso_-_Transa.jpg' },
                    { id: 's019', artist: 'Caetano Veloso', title: 'It’s a Long Way', album: 'Transa', duration: '7:14', dateAdded: '2025-08-05T12:32:00Z', imgUrl: 'https://upload.wikimedia.org/wikipedia/en/8/8c/Caetano_Veloso_-_Transa.jpg' },
                ]
            },
            {
                _id: 'st006',
                name: 'The Dark Side of the Moon',
                description: "Pink Floyd’s psychedelic masterpiece blending rock and progressive soundscapes.",
                tags: ['Rock', 'Progressive', 'Classic'],
                createdBy: {
                    _id: 'u306',
                    fullname: 'Ethan Wells',
                    imgUrl: 'https://randomuser.me/api/portraits/men/61.jpg',
                },
                addedAt: 1734476800000,
                type: 'system',
                likedByUsers: [],
                stationImgUrl: 'https://upload.wikimedia.org/wikipedia/en/3/3b/Dark_Side_of_the_Moon.png',
                songs: [
                    { id: 's020', artist: 'Pink Floyd', title: 'Speak to Me', album: 'The Dark Side of the Moon', duration: '1:30', dateAdded: '2025-08-06T12:30:00Z', imgUrl: 'https://upload.wikimedia.org/wikipedia/en/3/3b/Dark_Side_of_the_Moon.png' },
                    { id: 's021', artist: 'Pink Floyd', title: 'Breathe', album: 'The Dark Side of the Moon', duration: '2:43', dateAdded: '2025-08-06T12:31:00Z', imgUrl: 'https://upload.wikimedia.org/wikipedia/en/3/3b/Dark_Side_of_the_Moon.png' },
                    { id: 's022', artist: 'Pink Floyd', title: 'Time', album: 'The Dark Side of the Moon', duration: '6:53', dateAdded: '2025-08-06T12:32:00Z', imgUrl: 'https://upload.wikimedia.org/wikipedia/en/3/3b/Dark_Side_of_the_Moon.png' },
                    { id: 's023', artist: 'Pink Floyd', title: 'Money', album: 'The Dark Side of the Moon', duration: '6:22', dateAdded: '2025-08-06T12:33:00Z', imgUrl: 'https://upload.wikimedia.org/wikipedia/en/3/3b/Dark_Side_of_the_Moon.png' },
                ]
            },
            {
                _id: 'st007',
                name: 'HaOlam HaMufla',
                description: "Shlomo Artzi’s beloved Israeli album filled with poetic rock ballads.",
                tags: ['Israeli', 'Rock', 'Singer-Songwriter'],
                createdBy: {
                    _id: 'u307',
                    fullname: 'Yael Cohen',
                    imgUrl: 'https://randomuser.me/api/portraits/women/27.jpg',
                },
                addedAt: 1734476800000,
                type: 'system',
                likedByUsers: [],
                stationImgUrl: 'https://upload.wikimedia.org/wikipedia/he/b/b0/HaOlam_HaMufla.jpg',
                songs: [
                    { id: 's024', artist: 'Shlomo Artzi', title: 'Tirkod', album: 'HaOlam HaMufla', duration: '4:22', dateAdded: '2025-08-07T12:30:00Z', imgUrl: 'https://upload.wikimedia.org/wikipedia/he/b/b0/HaOlam_HaMufla.jpg' },
                    { id: 's025', artist: 'Shlomo Artzi', title: 'Shnayim', album: 'HaOlam HaMufla', duration: '4:15', dateAdded: '2025-08-07T12:31:00Z', imgUrl: 'https://upload.wikimedia.org/wikipedia/he/b/b0/HaOlam_HaMufla.jpg' },
                    { id: 's026', artist: 'Shlomo Artzi', title: 'Yareach', album: 'HaOlam HaMufla', duration: '5:02', dateAdded: '2025-08-07T12:32:00Z', imgUrl: 'https://upload.wikimedia.org/wikipedia/he/b/b0/HaOlam_HaMufla.jpg' },
                ]
            },
            {
                _id: 'st008',
                name: 'OK Computer',
                description: "Radiohead’s groundbreaking alternative rock album full of atmosphere and angst.",
                tags: ['Alternative', 'Rock', 'International'],
                createdBy: {
                    _id: 'u308',
                    fullname: 'Leo Martinez',
                    imgUrl: 'https://randomuser.me/api/portraits/men/37.jpg',
                },
                addedAt: 1734476800000,
                type: 'system',
                likedByUsers: [],
                stationImgUrl: 'https://upload.wikimedia.org/wikipedia/en/b/ba/Radiohead.okcomputer.albumart.jpg',
                songs: [
                    { id: 's027', artist: 'Radiohead', title: 'Paranoid Android', album: 'OK Computer', duration: '6:23', dateAdded: '2025-08-08T12:30:00Z', imgUrl: 'https://upload.wikimedia.org/wikipedia/en/b/ba/Radiohead.okcomputer.albumart.jpg' },
                    { id: 's028', artist: 'Radiohead', title: 'Karma Police', album: 'OK Computer', duration: '4:21', dateAdded: '2025-08-08T12:31:00Z', imgUrl: 'https://upload.wikimedia.org/wikipedia/en/b/ba/Radiohead.okcomputer.albumart.jpg' },
                    { id: 's029', artist: 'Radiohead', title: 'No Surprises', album: 'OK Computer', duration: '3:48', dateAdded: '2025-08-08T12:32:00Z', imgUrl: 'https://upload.wikimedia.org/wikipedia/en/b/ba/Radiohead.okcomputer.albumart.jpg' },
                ]
            },
            {
                _id: 'st009',
                name: 'אם ננעלו',
                description: "Ofra Haza’s iconic album blending Yemenite tradition with Israeli pop.",
                tags: ['Israeli', 'World Music', 'Pop'],
                createdBy: {
                    _id: 'u309',
                    fullname: 'Tamar Shalev',
                    imgUrl: 'https://randomuser.me/api/portraits/women/31.jpg',
                },
                addedAt: 1734476800000,
                type: 'system',
                likedByUsers: [],
                stationImgUrl: 'https://upload.wikimedia.org/wikipedia/he/9/9e/OfraHaza_YemeniteSongs.jpg',
                songs: [
                    { id: 's030', artist: 'Ofra Haza', title: 'Im Nin’alu', album: 'אם ננעלו', duration: '4:05', dateAdded: '2025-08-09T12:30:00Z', imgUrl: 'https://upload.wikimedia.org/wikipedia/he/9/9e/OfraHaza_YemeniteSongs.jpg' },
                    { id: 's031', artist: 'Ofra Haza', title: 'Galbi', album: 'אם ננעלו', duration: '4:15', dateAdded: '2025-08-09T12:31:00Z', imgUrl: 'https://upload.wikimedia.org/wikipedia/he/9/9e/OfraHaza_YemeniteSongs.jpg' },
                    { id: 's032', artist: 'Ofra Haza', title: 'Shaday', album: 'אם ננעלו', duration: '3:58', dateAdded: '2025-08-09T12:32:00Z', imgUrl: 'https://upload.wikimedia.org/wikipedia/he/9/9e/OfraHaza_YemeniteSongs.jpg' },
                ]
            },
            {
                _id: 'st010',
                name: 'Nevermind',
                description: "Nirvana’s grunge-defining album that changed the sound of the 90s.",
                tags: ['Grunge', 'Rock', 'International'],
                createdBy: {
                    _id: 'u310',
                    fullname: 'Maya Ross',
                    imgUrl: 'https://randomuser.me/api/portraits/women/12.jpg',
                },
                addedAt: 1734476800000,
                type: 'system',
                likedByUsers: [],
                stationImgUrl: 'https://upload.wikimedia.org/wikipedia/en/b/b7/NirvanaNevermindalbumcover.jpg',
                songs: [
                    { id: 's033', artist: 'Nirvana', title: 'Smells Like Teen Spirit', album: 'Nevermind', duration: '5:01', dateAdded: '2025-08-10T12:30:00Z', imgUrl: 'https://upload.wikimedia.org/wikipedia/en/b/b7/NirvanaNevermindalbumcover.jpg' },
                    { id: 's034', artist: 'Nirvana', title: 'In Bloom', album: 'Nevermind', duration: '4:15', dateAdded: '2025-08-10T12:31:00Z', imgUrl: 'https://upload.wikimedia.org/wikipedia/en/b/b7/NirvanaNevermindalbumcover.jpg' },
                    { id: 's035', artist: 'Nirvana', title: 'Come As You Are', album: 'Nevermind', duration: '3:38', dateAdded: '2025-08-10T12:32:00Z', imgUrl: 'https://upload.wikimedia.org/wikipedia/en/b/b7/NirvanaNevermindalbumcover.jpg' },
                ]
            },
            {
                _id: 'st011',
                name: 'The Wall',
                description: "Pink Floyd’s monumental rock opera exploring isolation and rebellion.",
                tags: ['Rock', 'Classic', 'Concept Album'],
                createdBy: {
                    _id: 'u311',
                    fullname: 'Daniel Frost',
                    imgUrl: 'https://randomuser.me/api/portraits/men/47.jpg',
                },
                addedAt: 1734553200000,
                type: 'system',
                likedByUsers: [],
                stationImgUrl: 'https://upload.wikimedia.org/wikipedia/en/1/13/PinkFloydWallCoverOriginalNoText.jpg',
                songs: [
                    { id: 's036', artist: 'Pink Floyd', title: 'Another Brick in the Wall, Pt. 2', album: 'The Wall', duration: '3:59', dateAdded: '2025-08-11T12:30:00Z', imgUrl: 'https://upload.wikimedia.org/wikipedia/en/1/13/PinkFloydWallCoverOriginalNoText.jpg' },
                    { id: 's037', artist: 'Pink Floyd', title: 'Comfortably Numb', album: 'The Wall', duration: '6:21', dateAdded: '2025-08-11T12:31:00Z', imgUrl: 'https://upload.wikimedia.org/wikipedia/en/1/13/PinkFloydWallCoverOriginalNoText.jpg' },
                    { id: 's038', artist: 'Pink Floyd', title: 'Hey You', album: 'The Wall', duration: '4:40', dateAdded: '2025-08-11T12:32:00Z', imgUrl: 'https://upload.wikimedia.org/wikipedia/en/1/13/PinkFloydWallCoverOriginalNoText.jpg' },
                    { id: 's039', artist: 'Pink Floyd', title: 'Run Like Hell', album: 'The Wall', duration: '4:24', dateAdded: '2025-08-11T12:33:00Z', imgUrl: 'https://upload.wikimedia.org/wikipedia/en/1/13/PinkFloydWallCoverOriginalNoText.jpg' },
                ]
            },
            {
                _id: 'st012',
                name: 'שלום חנוך – מחכים למשיח',
                description: "Shalom Hanoch’s legendary Israeli rock album that shaped a generation.",
                tags: ['Israeli Rock', 'Classic', 'Singer-Songwriter'],
                createdBy: {
                    _id: 'u312',
                    fullname: 'Shira Lev',
                    imgUrl: 'https://randomuser.me/api/portraits/women/55.jpg',
                },
                addedAt: 1734556800000,
                type: 'system',
                likedByUsers: [],
                stationImgUrl: 'https://upload.wikimedia.org/wikipedia/he/6/65/Shalom_Hanoch.jpg',
                songs: [
                    { id: 's040', artist: 'Shalom Hanoch', title: 'מחכים למשיח', album: 'מחכים למשיח', duration: '4:28', dateAdded: '2025-08-12T12:30:00Z', imgUrl: 'https://upload.wikimedia.org/wikipedia/he/6/65/Shalom_Hanoch.jpg' },
                    { id: 's041', artist: 'Shalom Hanoch', title: 'מאיה', album: 'מחכים למשיח', duration: '3:46', dateAdded: '2025-08-12T12:31:00Z', imgUrl: 'https://upload.wikimedia.org/wikipedia/he/6/65/Shalom_Hanoch.jpg' },
                    { id: 's042', artist: 'Shalom Hanoch', title: 'ניגע ונלך', album: 'מחכים למשיח', duration: '4:09', dateAdded: '2025-08-12T12:32:00Z', imgUrl: 'https://upload.wikimedia.org/wikipedia/he/6/65/Shalom_Hanoch.jpg' },
                ]
            },
            {
                _id: 'st013',
                name: 'Back to Black',
                description: "Amy Winehouse’s soulful and tragic masterpiece of jazz-infused pop.",
                tags: ['Soul', 'Jazz Pop', 'International'],
                createdBy: {
                    _id: 'u313',
                    fullname: 'Elena Rivers',
                    imgUrl: 'https://randomuser.me/api/portraits/women/43.jpg',
                },
                addedAt: 1734560400000,
                type: 'system',
                likedByUsers: [],
                stationImgUrl: 'https://upload.wikimedia.org/wikipedia/en/2/20/Amy_Winehouse_-_Back_to_Black_%28album%29.png',
                songs: [
                    { id: 's043', artist: 'Amy Winehouse', title: 'Rehab', album: 'Back to Black', duration: '3:35', dateAdded: '2025-08-13T12:30:00Z', imgUrl: 'https://upload.wikimedia.org/wikipedia/en/2/20/Amy_Winehouse_-_Back_to_Black_%28album%29.png' },
                    { id: 's044', artist: 'Amy Winehouse', title: 'Back to Black', album: 'Back to Black', duration: '4:01', dateAdded: '2025-08-13T12:31:00Z', imgUrl: 'https://upload.wikimedia.org/wikipedia/en/2/20/Amy_Winehouse_-_Back_to_Black_%28album%29.png' },
                    { id: 's045', artist: 'Amy Winehouse', title: 'Love Is a Losing Game', album: 'Back to Black', duration: '2:35', dateAdded: '2025-08-13T12:32:00Z', imgUrl: 'https://upload.wikimedia.org/wikipedia/en/2/20/Amy_Winehouse_-_Back_to_Black_%28album%29.png' },
                    { id: 's046', artist: 'Amy Winehouse', title: 'You Know I’m No Good', album: 'Back to Black', duration: '4:17', dateAdded: '2025-08-13T12:33:00Z', imgUrl: 'https://upload.wikimedia.org/wikipedia/en/2/20/Amy_Winehouse_-_Back_to_Black_%28album%29.png' },
                ]
            },
            {
                _id: 'st014',
                name: 'מוזיקה מזרחית – אייל גולן',
                description: "Eyal Golan’s iconic Mizrahi hits that defined Israeli mainstream pop.",
                tags: ['Israeli', 'Mizrahi', 'Pop'],
                createdBy: {
                    _id: 'u314',
                    fullname: 'Omer Ben-Ami',
                    imgUrl: 'https://randomuser.me/api/portraits/men/23.jpg',
                },
                addedAt: 1734564000000,
                type: 'system',
                likedByUsers: [],
                stationImgUrl: 'https://upload.wikimedia.org/wikipedia/he/e/e1/Eyal_Golan.jpg',
                songs: [
                    { id: 's047', artist: 'Eyal Golan', title: 'מציאות אחרת', album: 'מציאות אחרת', duration: '3:42', dateAdded: '2025-08-14T12:30:00Z', imgUrl: 'https://upload.wikimedia.org/wikipedia/he/e/e1/Eyal_Golan.jpg' },
                    { id: 's048', artist: 'Eyal Golan', title: 'בלעדייך', album: 'מציאות אחרת', duration: '3:57', dateAdded: '2025-08-14T12:31:00Z', imgUrl: 'https://upload.wikimedia.org/wikipedia/he/e/e1/Eyal_Golan.jpg' },
                    { id: 's049', artist: 'Eyal Golan', title: 'הכל יסתדר', album: 'מציאות אחרת', duration: '4:15', dateAdded: '2025-08-14T12:32:00Z', imgUrl: 'https://upload.wikimedia.org/wikipedia/he/e/e1/Eyal_Golan.jpg' },
                    { id: 's050', artist: 'Eyal Golan', title: 'אשא עיני', album: 'מציאות אחרת', duration: '4:04', dateAdded: '2025-08-14T12:33:00Z', imgUrl: 'https://upload.wikimedia.org/wikipedia/he/e/e1/Eyal_Golan.jpg' },
                ]
            },
            {
                _id: 'st015',
                name: 'Thriller',
                description: "Michael Jackson’s record-breaking pop album that defined the 80s.",
                tags: ['Pop', 'International', 'Classic'],
                createdBy: {
                    _id: 'u315',
                    fullname: 'Chris Johnson',
                    imgUrl: 'https://randomuser.me/api/portraits/men/14.jpg',
                },
                addedAt: 1734567600000,
                type: 'system',
                likedByUsers: [],
                stationImgUrl: 'https://upload.wikimedia.org/wikipedia/en/5/55/Michael_Jackson_-_Thriller.png',
                songs: [
                    { id: 's051', artist: 'Michael Jackson', title: 'Thriller', album: 'Thriller', duration: '5:57', dateAdded: '2025-08-15T12:30:00Z', imgUrl: 'https://upload.wikimedia.org/wikipedia/en/5/55/Michael_Jackson_-_Thriller.png' },
                    { id: 's052', artist: 'Michael Jackson', title: 'Beat It', album: 'Thriller', duration: '4:18', dateAdded: '2025-08-15T12:31:00Z', imgUrl: 'https://upload.wikimedia.org/wikipedia/en/5/55/Michael_Jackson_-_Thriller.png' },
                    { id: 's053', artist: 'Michael Jackson', title: 'Billie Jean', album: 'Thriller', duration: '4:54', dateAdded: '2025-08-15T12:32:00Z', imgUrl: 'https://upload.wikimedia.org/wikipedia/en/5/55/Michael_Jackson_-_Thriller.png' },
                    { id: 's054', artist: 'Michael Jackson', title: 'Wanna Be Startin’ Somethin’', album: 'Thriller', duration: '6:03', dateAdded: '2025-08-15T12:33:00Z', imgUrl: 'https://upload.wikimedia.org/wikipedia/en/5/55/Michael_Jackson_-_Thriller.png' },
                    { id: 's055', artist: 'Michael Jackson', title: 'Human Nature', album: 'Thriller', duration: '4:06', dateAdded: '2025-08-15T12:34:00Z', imgUrl: 'https://upload.wikimedia.org/wikipedia/en/5/55/Michael_Jackson_-_Thriller.png' },
                ]
            },
            {
                _id: 'st016',
                name: 'Abbey Road',
                description: "The Beatles’ timeless 1969 masterpiece with iconic harmonies and riffs.",
                tags: ['Rock', 'Classic', 'International'],
                createdBy: {
                    _id: 'u316',
                    fullname: 'George Miles',
                    imgUrl: 'https://randomuser.me/api/portraits/men/61.jpg',
                },
                addedAt: 1734571200000,
                type: 'system',
                likedByUsers: [],
                stationImgUrl: 'https://upload.wikimedia.org/wikipedia/en/4/42/Beatles_-_Abbey_Road.jpg',
                songs: [
                    { id: 's056', artist: 'The Beatles', title: 'Come Together', album: 'Abbey Road', duration: '4:20', dateAdded: '2025-08-16T12:30:00Z', imgUrl: 'https://upload.wikimedia.org/wikipedia/en/4/42/Beatles_-_Abbey_Road.jpg' },
                    { id: 's057', artist: 'The Beatles', title: 'Something', album: 'Abbey Road', duration: '3:03', dateAdded: '2025-08-16T12:31:00Z', imgUrl: 'https://upload.wikimedia.org/wikipedia/en/4/42/Beatles_-_Abbey_Road.jpg' },
                    { id: 's058', artist: 'The Beatles', title: 'Here Comes the Sun', album: 'Abbey Road', duration: '3:05', dateAdded: '2025-08-16T12:32:00Z', imgUrl: 'https://upload.wikimedia.org/wikipedia/en/4/42/Beatles_-_Abbey_Road.jpg' },
                    { id: 's059', artist: 'The Beatles', title: 'Oh! Darling', album: 'Abbey Road', duration: '3:27', dateAdded: '2025-08-16T12:33:00Z', imgUrl: 'https://upload.wikimedia.org/wikipedia/en/4/42/Beatles_-_Abbey_Road.jpg' },
                ]
            },
            {
                _id: 'st017',
                name: 'מאשינה – Mashina',
                description: "Debut Israeli rock album that defined the 1980s local sound.",
                tags: ['Israeli Rock', '80s', 'Classic'],
                createdBy: {
                    _id: 'u317',
                    fullname: 'Yael Ben-Hur',
                    imgUrl: 'https://randomuser.me/api/portraits/women/77.jpg',
                },
                addedAt: 1734574800000,
                type: 'system',
                likedByUsers: [],
                stationImgUrl: 'https://upload.wikimedia.org/wikipedia/he/9/9f/Mashina_album.jpg',
                songs: [
                    { id: 's060', artist: 'Mashina', title: 'אין מקום אחר', album: 'מאשינה', duration: '3:56', dateAdded: '2025-08-17T12:30:00Z', imgUrl: 'https://upload.wikimedia.org/wikipedia/he/9/9f/Mashina_album.jpg' },
                    { id: 's061', artist: 'Mashina', title: 'רכבת לילה לקהיר', album: 'מאשינה', duration: '4:11', dateAdded: '2025-08-17T12:31:00Z', imgUrl: 'https://upload.wikimedia.org/wikipedia/he/9/9f/Mashina_album.jpg' },
                    { id: 's062', artist: 'Mashina', title: 'הכוכבים דולקים על אש קטנה', album: 'מאשינה', duration: '3:45', dateAdded: '2025-08-17T12:32:00Z', imgUrl: 'https://upload.wikimedia.org/wikipedia/he/9/9f/Mashina_album.jpg' },
                ]
            },
            {
                _id: 'st018',
                name: 'Random Access Memories',
                description: "Daft Punk’s Grammy-winning fusion of electronic and live instrumentation.",
                tags: ['Electronic', 'Funk', 'Dance'],
                createdBy: {
                    _id: 'u318',
                    fullname: 'Lucas Grant',
                    imgUrl: 'https://randomuser.me/api/portraits/men/36.jpg',
                },
                addedAt: 1734578400000,
                type: 'system',
                likedByUsers: [],
                stationImgUrl: 'https://upload.wikimedia.org/wikipedia/en/a/a7/Random_Access_Memories.jpg',
                songs: [
                    { id: 's063', artist: 'Daft Punk', title: 'Give Life Back to Music', album: 'Random Access Memories', duration: '4:35', dateAdded: '2025-08-18T12:30:00Z', imgUrl: 'https://upload.wikimedia.org/wikipedia/en/a/a7/Random_Access_Memories.jpg' },
                    { id: 's064', artist: 'Daft Punk', title: 'Instant Crush', album: 'Random Access Memories', duration: '5:37', dateAdded: '2025-08-18T12:31:00Z', imgUrl: 'https://upload.wikimedia.org/wikipedia/en/a/a7/Random_Access_Memories.jpg' },
                    { id: 's065', artist: 'Daft Punk', title: 'Get Lucky', album: 'Random Access Memories', duration: '6:09', dateAdded: '2025-08-18T12:32:00Z', imgUrl: 'https://upload.wikimedia.org/wikipedia/en/a/a7/Random_Access_Memories.jpg' },
                ]
            },
            {
                _id: 'st019',
                name: 'עפרה חזה – גבריאל',
                description: "Ofra Haza’s moving Mizrahi-inspired pop album.",
                tags: ['Israeli', 'Mizrahi Pop', '80s'],
                createdBy: {
                    _id: 'u319',
                    fullname: 'Noa Levi',
                    imgUrl: 'https://randomuser.me/api/portraits/women/80.jpg',
                },
                addedAt: 1734582000000,
                type: 'system',
                likedByUsers: [],
                stationImgUrl: 'https://upload.wikimedia.org/wikipedia/he/1/1f/Ofra_Haza_Album.jpg',
                songs: [
                    { id: 's066', artist: 'Ofra Haza', title: 'גבריאל', album: 'גבריאל', duration: '3:58', dateAdded: '2025-08-19T12:30:00Z', imgUrl: 'https://upload.wikimedia.org/wikipedia/he/1/1f/Ofra_Haza_Album.jpg' },
                    { id: 's067', artist: 'Ofra Haza', title: 'הנשמה צועקת', album: 'גבריאל', duration: '4:10', dateAdded: '2025-08-19T12:31:00Z', imgUrl: 'https://upload.wikimedia.org/wikipedia/he/1/1f/Ofra_Haza_Album.jpg' },
                    { id: 's068', artist: 'Ofra Haza', title: 'תפילה', album: 'גבריאל', duration: '3:47', dateAdded: '2025-08-19T12:32:00Z', imgUrl: 'https://upload.wikimedia.org/wikipedia/he/1/1f/Ofra_Haza_Album.jpg' },
                ]
            },
            {
                _id: 'st020',
                name: 'The Marshall Mathers LP',
                description: "Eminem’s groundbreaking rap album with raw lyricism and impact.",
                tags: ['Hip-Hop', 'Rap', 'International'],
                createdBy: {
                    _id: 'u320',
                    fullname: 'Maya Thompson',
                    imgUrl: 'https://randomuser.me/api/portraits/women/29.jpg',
                },
                addedAt: 1734585600000,
                type: 'system',
                likedByUsers: [],
                stationImgUrl: 'https://upload.wikimedia.org/wikipedia/en/3/35/The_Marshall_Mathers_LP.jpg',
                songs: [
                    { id: 's069', artist: 'Eminem', title: 'Stan', album: 'The Marshall Mathers LP', duration: '6:44', dateAdded: '2025-08-20T12:30:00Z', imgUrl: 'https://upload.wikimedia.org/wikipedia/en/3/35/The_Marshall_Mathers_LP.jpg' },
                    { id: 's070', artist: 'Eminem', title: 'The Real Slim Shady', album: 'The Marshall Mathers LP', duration: '4:44', dateAdded: '2025-08-20T12:31:00Z', imgUrl: 'https://upload.wikimedia.org/wikipedia/en/3/35/The_Marshall_Mathers_LP.jpg' },
                    { id: 's071', artist: 'Eminem', title: 'The Way I Am', album: 'The Marshall Mathers LP', duration: '4:50', dateAdded: '2025-08-20T12:32:00Z', imgUrl: 'https://upload.wikimedia.org/wikipedia/en/3/35/The_Marshall_Mathers_LP.jpg' },
                    { id: 's072', artist: 'Eminem', title: 'Kim', album: 'The Marshall Mathers LP', duration: '6:17', dateAdded: '2025-08-20T12:33:00Z', imgUrl: 'https://upload.wikimedia.org/wikipedia/en/3/35/The_Marshall_Mathers_LP.jpg' },
                ]
            },
            {
                _id: 'st021',
                name: 'חיים משה – שובי',
                description: "A cornerstone of Mizrahi music from the early 80s by Chaim Moshe.",
                tags: ['Israeli', 'Mizrahi', 'Classic'],
                createdBy: {
                    _id: 'u321',
                    fullname: 'Eli Shahar',
                    imgUrl: 'https://randomuser.me/api/portraits/men/73.jpg',
                },
                addedAt: 1734589200000,
                type: 'system',
                likedByUsers: [],
                stationImgUrl: 'https://upload.wikimedia.org/wikipedia/he/0/0a/Chaim_Moshe_album.jpg',
                songs: [
                    { id: 's073', artist: 'חיים משה', title: 'שובי שובי', album: 'שובי', duration: '3:59', dateAdded: '2025-08-21T12:30:00Z', imgUrl: 'https://upload.wikimedia.org/wikipedia/he/0/0a/Chaim_Moshe_album.jpg' },
                    { id: 's074', artist: 'חיים משה', title: 'לילה של נשיקות', album: 'שובי', duration: '4:12', dateAdded: '2025-08-21T12:31:00Z', imgUrl: 'https://upload.wikimedia.org/wikipedia/he/0/0a/Chaim_Moshe_album.jpg' },
                    { id: 's075', artist: 'חיים משה', title: 'אהבת חיי', album: 'שובי', duration: '3:41', dateAdded: '2025-08-21T12:32:00Z', imgUrl: 'https://upload.wikimedia.org/wikipedia/he/0/0a/Chaim_Moshe_album.jpg' },
                ]
            },
            {
                _id: 'st022',
                name: 'Back to Black',
                description: "Amy Winehouse’s soulful and tragic masterpiece.",
                tags: ['Soul', 'Jazz', 'International'],
                createdBy: {
                    _id: 'u322',
                    fullname: 'Daria Levin',
                    imgUrl: 'https://randomuser.me/api/portraits/women/52.jpg',
                },
                addedAt: 1734592800000,
                type: 'system',
                likedByUsers: [],
                stationImgUrl: 'https://upload.wikimedia.org/wikipedia/en/2/22/Amy_Winehouse_-_Back_to_Black_%28album%29.png',
                songs: [
                    { id: 's076', artist: 'Amy Winehouse', title: 'Rehab', album: 'Back to Black', duration: '3:35', dateAdded: '2025-08-22T12:30:00Z', imgUrl: 'https://upload.wikimedia.org/wikipedia/en/2/22/Amy_Winehouse_-_Back_to_Black_%28album%29.png' },
                    { id: 's077', artist: 'Amy Winehouse', title: 'Back to Black', album: 'Back to Black', duration: '4:00', dateAdded: '2025-08-22T12:31:00Z', imgUrl: 'https://upload.wikimedia.org/wikipedia/en/2/22/Amy_Winehouse_-_Back_to_Black_%28album%29.png' },
                    { id: 's078', artist: 'Amy Winehouse', title: 'You Know I’m No Good', album: 'Back to Black', duration: '4:17', dateAdded: '2025-08-22T12:32:00Z', imgUrl: 'https://upload.wikimedia.org/wikipedia/en/2/22/Amy_Winehouse_-_Back_to_Black_%28album%29.png' },
                ]
            },
            {
                _id: 'st023',
                name: 'שלום חנוך – מחכים למשיח',
                description: "Shalom Hanoch’s iconic Israeli rock album, raw and political.",
                tags: ['Israeli Rock', '80s'],
                createdBy: {
                    _id: 'u323',
                    fullname: 'Amir Dekel',
                    imgUrl: 'https://randomuser.me/api/portraits/men/50.jpg',
                },
                addedAt: 1734596400000,
                type: 'system',
                likedByUsers: [],
                stationImgUrl: 'https://upload.wikimedia.org/wikipedia/he/d/d1/Makim_lemashiach.jpg',
                songs: [
                    { id: 's079', artist: 'שלום חנוך', title: 'מחכים למשיח', album: 'מחכים למשיח', duration: '3:56', dateAdded: '2025-08-23T12:30:00Z', imgUrl: 'https://upload.wikimedia.org/wikipedia/he/d/d1/Makim_lemashiach.jpg' },
                    { id: 's080', artist: 'שלום חנוך', title: 'עכשיו לא בא לי', album: 'מחכים למשיח', duration: '3:42', dateAdded: '2025-08-23T12:31:00Z', imgUrl: 'https://upload.wikimedia.org/wikipedia/he/d/d1/Makim_lemashiach.jpg' },
                    { id: 's081', artist: 'שלום חנוך', title: 'רכבת לילה', album: 'מחכים למשיח', duration: '3:49', dateAdded: '2025-08-23T12:32:00Z', imgUrl: 'https://upload.wikimedia.org/wikipedia/he/d/d1/Makim_lemashiach.jpg' },
                ]
            },
            {
                _id: 'st024',
                name: 'Thriller',
                description: "Michael Jackson’s legendary pop album that changed music forever.",
                tags: ['Pop', 'International', 'Classic'],
                createdBy: {
                    _id: 'u324',
                    fullname: 'Carla Reed',
                    imgUrl: 'https://randomuser.me/api/portraits/women/59.jpg',
                },
                addedAt: 1734600000000,
                type: 'system',
                likedByUsers: [],
                stationImgUrl: 'https://upload.wikimedia.org/wikipedia/en/5/55/Michael_Jackson_-_Thriller.png',
                songs: [
                    { id: 's082', artist: 'Michael Jackson', title: 'Thriller', album: 'Thriller', duration: '5:57', dateAdded: '2025-08-24T12:30:00Z', imgUrl: 'https://upload.wikimedia.org/wikipedia/en/5/55/Michael_Jackson_-_Thriller.png' },
                    { id: 's083', artist: 'Michael Jackson', title: 'Beat It', album: 'Thriller', duration: '4:18', dateAdded: '2025-08-24T12:31:00Z', imgUrl: 'https://upload.wikimedia.org/wikipedia/en/5/55/Michael_Jackson_-_Thriller.png' },
                    { id: 's084', artist: 'Michael Jackson', title: 'Billie Jean', album: 'Thriller', duration: '4:54', dateAdded: '2025-08-24T12:32:00Z', imgUrl: 'https://upload.wikimedia.org/wikipedia/en/5/55/Michael_Jackson_-_Thriller.png' },
                ]
            },
            {
                _id: 'st025',
                name: 'אתניקס – אהבת חיי',
                description: "Ethnix blends Mizrahi, pop, and rock in this beloved Israeli album.",
                tags: ['Israeli Pop', '90s'],
                createdBy: {
                    _id: 'u325',
                    fullname: 'Dana Azulay',
                    imgUrl: 'https://randomuser.me/api/portraits/women/60.jpg',
                },
                addedAt: 1734603600000,
                type: 'system',
                likedByUsers: [],
                stationImgUrl: 'https://upload.wikimedia.org/wikipedia/he/b/b8/Ahavat_Hayai.jpg',
                songs: [
                    { id: 's085', artist: 'אתניקס', title: 'עוף קדימה', album: 'אהבת חיי', duration: '3:47', dateAdded: '2025-08-25T12:30:00Z', imgUrl: 'https://upload.wikimedia.org/wikipedia/he/b/b8/Ahavat_Hayai.jpg' },
                    { id: 's086', artist: 'אתניקס', title: 'שירים יפים', album: 'אהבת חיי', duration: '3:53', dateAdded: '2025-08-25T12:31:00Z', imgUrl: 'https://upload.wikimedia.org/wikipedia/he/b/b8/Ahavat_Hayai.jpg' },
                    { id: 's087', artist: 'אתניקס', title: 'אהבת חיי', album: 'אהבת חיי', duration: '4:02', dateAdded: '2025-08-25T12:32:00Z', imgUrl: 'https://upload.wikimedia.org/wikipedia/he/b/b8/Ahavat_Hayai.jpg' },
                ]
            },
            {
                _id: 'st026',
                name: 'Radiohead – OK Computer',
                description: "A groundbreaking alternative rock album that redefined the 90s sound.",
                tags: ['Alternative', 'Rock', 'International'],
                createdBy: {
                    _id: 'u326',
                    fullname: 'Ethan Moore',
                    imgUrl: 'https://randomuser.me/api/portraits/men/64.jpg',
                },
                addedAt: 1734607200000,
                type: 'system',
                likedByUsers: [],
                stationImgUrl: 'https://upload.wikimedia.org/wikipedia/en/b/ba/Radiohead.okcomputer.albumart.jpg',
                songs: [
                    { id: 's088', artist: 'Radiohead', title: 'Airbag', album: 'OK Computer', duration: '4:44', dateAdded: '2025-08-26T12:30:00Z', imgUrl: 'https://upload.wikimedia.org/wikipedia/en/b/ba/Radiohead.okcomputer.albumart.jpg' },
                    { id: 's089', artist: 'Radiohead', title: 'Paranoid Android', album: 'OK Computer', duration: '6:23', dateAdded: '2025-08-26T12:31:00Z', imgUrl: 'https://upload.wikimedia.org/wikipedia/en/b/ba/Radiohead.okcomputer.albumart.jpg' },
                    { id: 's090', artist: 'Radiohead', title: 'No Surprises', album: 'OK Computer', duration: '3:49', dateAdded: '2025-08-26T12:32:00Z', imgUrl: 'https://upload.wikimedia.org/wikipedia/en/b/ba/Radiohead.okcomputer.albumart.jpg' },
                ]
            },
            {
                _id: 'st027',
                name: 'עפרה חזה – גבריאלה',
                description: "The voice of Israel, Ofra Haza’s legendary blend of pop and Yemenite roots.",
                tags: ['Israeli', 'Pop', 'Classic'],
                createdBy: {
                    _id: 'u327',
                    fullname: 'Tamar Ron',
                    imgUrl: 'https://randomuser.me/api/portraits/women/66.jpg',
                },
                addedAt: 1734610800000,
                type: 'system',
                likedByUsers: [],
                stationImgUrl: 'https://upload.wikimedia.org/wikipedia/he/e/ee/Ofra_Haza_Gabriela.jpg',
                songs: [
                    { id: 's091', artist: 'עפרה חזה', title: 'גבריאלה', album: 'גבריאלה', duration: '4:07', dateAdded: '2025-08-27T12:30:00Z', imgUrl: 'https://upload.wikimedia.org/wikipedia/he/e/ee/Ofra_Haza_Gabriela.jpg' },
                    { id: 's092', artist: 'עפרה חזה', title: 'תפילה', album: 'גבריאלה', duration: '3:58', dateAdded: '2025-08-27T12:31:00Z', imgUrl: 'https://upload.wikimedia.org/wikipedia/he/e/ee/Ofra_Haza_Gabriela.jpg' },
                    { id: 's093', artist: 'עפרה חזה', title: 'יום הולדת', album: 'גבריאלה', duration: '4:12', dateAdded: '2025-08-27T12:32:00Z', imgUrl: 'https://upload.wikimedia.org/wikipedia/he/e/ee/Ofra_Haza_Gabriela.jpg' },
                ]
            },
            {
                _id: 'st028',
                name: 'The Beatles – Abbey Road',
                description: "A legendary classic by The Beatles, with some of their most iconic tracks.",
                tags: ['Classic Rock', 'International'],
                createdBy: {
                    _id: 'u328',
                    fullname: 'Lucas Graham',
                    imgUrl: 'https://randomuser.me/api/portraits/men/68.jpg',
                },
                addedAt: 1734614400000,
                type: 'system',
                likedByUsers: [],
                stationImgUrl: 'https://upload.wikimedia.org/wikipedia/en/4/42/Beatles_-_Abbey_Road.jpg',
                songs: [
                    { id: 's094', artist: 'The Beatles', title: 'Come Together', album: 'Abbey Road', duration: '4:20', dateAdded: '2025-08-28T12:30:00Z', imgUrl: 'https://upload.wikimedia.org/wikipedia/en/4/42/Beatles_-_Abbey_Road.jpg' },
                    { id: 's095', artist: 'The Beatles', title: 'Something', album: 'Abbey Road', duration: '3:03', dateAdded: '2025-08-28T12:31:00Z', imgUrl: 'https://upload.wikimedia.org/wikipedia/en/4/42/Beatles_-_Abbey_Road.jpg' },
                    { id: 's096', artist: 'The Beatles', title: 'Here Comes the Sun', album: 'Abbey Road', duration: '3:06', dateAdded: '2025-08-28T12:32:00Z', imgUrl: 'https://upload.wikimedia.org/wikipedia/en/4/42/Beatles_-_Abbey_Road.jpg' },
                ]
            },
            {
                _id: 'st029',
                name: 'משינה – משינה',
                description: "Mashina’s debut album, marking the start of one of Israel’s greatest rock bands.",
                tags: ['Israeli Rock', '80s'],
                createdBy: {
                    _id: 'u329',
                    fullname: 'Yonatan Weiss',
                    imgUrl: 'https://randomuser.me/api/portraits/men/74.jpg',
                },
                addedAt: 1734618000000,
                type: 'system',
                likedByUsers: [],
                stationImgUrl: 'https://upload.wikimedia.org/wikipedia/he/a/a8/Mashina_album_cover.jpg',
                songs: [
                    { id: 's097', artist: 'משינה', title: 'רכבת לילה לקהיר', album: 'משינה', duration: '4:10', dateAdded: '2025-08-29T12:30:00Z', imgUrl: 'https://upload.wikimedia.org/wikipedia/he/a/a8/Mashina_album_cover.jpg' },
                    { id: 's098', artist: 'משינה', title: 'מי בא עם מי', album: 'משינה', duration: '3:35', dateAdded: '2025-08-29T12:31:00Z', imgUrl: 'https://upload.wikimedia.org/wikipedia/he/a/a8/Mashina_album_cover.jpg' },
                    { id: 's099', artist: 'משינה', title: 'אחכה לך בשדות', album: 'משינה', duration: '3:48', dateAdded: '2025-08-29T12:32:00Z', imgUrl: 'https://upload.wikimedia.org/wikipedia/he/a/a8/Mashina_album_cover.jpg' },
                ]
            },
            {
                _id: 'st030',
                name: 'Beyoncé – Lemonade',
                description: "Beyoncé’s genre-bending visual album exploring themes of infidelity and empowerment.",
                tags: ['Pop', 'R&B', 'International'],
                createdBy: {
                    _id: 'u330',
                    fullname: 'Sophia Martinez',
                    imgUrl: 'https://randomuser.me/api/portraits/women/74.jpg',
                },
                addedAt: 1734621600000,
                type: 'system',
                likedByUsers: [],
                stationImgUrl: 'https://upload.wikimedia.org/wikipedia/en/4/4a/Beyonce_-_Lemonade_%28Official_Album_Cover%29.png',
                songs: [
                    { id: 's100', artist: 'Beyoncé', title: 'Hold Up', album: 'Lemonade', duration: '3:41', dateAdded: '2025-08-30T12:30:00Z', imgUrl: 'https://upload.wikimedia.org/wikipedia/en/4/4a/Beyonce_-_Lemonade_%28Official_Album_Cover%29.png' },
                    { id: 's101', artist: 'Beyoncé', title: 'Sorry', album: 'Lemonade', duration: '3:53', dateAdded: '2025-08-30T12:31:00Z', imgUrl: 'https://upload.wikimedia.org/wikipedia/en/4/4a/Beyonce_-_Lemonade_%28Official_Album_Cover%29.png' },
                    { id: 's102', artist: 'Beyoncé', title: 'Formation', album: 'Lemonade', duration: '3:26', dateAdded: '2025-08-30T12:32:00Z', imgUrl: 'https://upload.wikimedia.org/wikipedia/en/4/4a/Beyonce_-_Lemonade_%28Official_Album_Cover%29.png' },
                ]
            }





        )
        await storageService.saveAll(STORAGE_KEY, stations)
        console.log('stations successfully added to localStorage')
    } catch (err) {
        console.error('Failed to create demo stations:', err)
    }
}


