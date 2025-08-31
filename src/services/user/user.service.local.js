import { storageService } from '../async-storage.service'
import { stationService } from '../station'
const STORAGE_KEY_LOGGEDIN_USER = 'loggedinUser'

export const userService = {
    login,
    logout,
    signup,
    getUsers,
    getById,
    remove,
    update,
    getLoggedinUser,
    saveLoggedinUser,
    getUserStations,
    toggleLikedSongs
}

async function getUsers() {
    let users = await storageService.query('user')
    if (!users.length) {
        users = await _createUsers()
    }
    return users.map(user => {
        delete user.password
        return user
    })
}

async function getById(userId) {
    return await storageService.get('user', userId)
}

function remove(userId) {
    return storageService.remove('user', userId)
}

async function update({ _id, score }) {
    const user = await storageService.get('user', _id)
    user.score = score
    await storageService.put('user', user)

    // When admin updates other user's details, do not update loggedinUser
    const loggedinUser = getLoggedinUser()
    if (loggedinUser._id === user._id) saveLoggedinUser(user)

    return user
}

async function login(userCred) {
    const users = await storageService.query('user')
    const user = users.find(user => user.username === userCred.username)

    if (user) return saveLoggedinUser(user)
}

async function signup(userCred) {
    if (!userCred.imgUrl) userCred.imgUrl = 'https://cdn.pixabay.com/photo/2020/07/01/12/58/icon-5359553_1280.png'
    userCred.score = 10000
    const {_id: stationId} = await stationService.save(stationService.getEmptyStation())
    userCred.likedStationId = stationId

    const user = await storageService.post('user', userCred)
    return saveLoggedinUser(user)
}

async function logout() {
    sessionStorage.removeItem(STORAGE_KEY_LOGGEDIN_USER)
}

function getLoggedinUser() {
    return JSON.parse(sessionStorage.getItem(STORAGE_KEY_LOGGEDIN_USER))
}

function saveLoggedinUser(user) {
    user = {
        _id: user._id,
        fullname: user.fullname,
        imgUrl: user.imgUrl,
        score: user.score,
        isAdmin: user.isAdmin,
        likedSongIds: user.likedSongIds || [],
        likedStationId: user.likedStationId || ''
    }
    sessionStorage.setItem(STORAGE_KEY_LOGGEDIN_USER, JSON.stringify(user))
    return user
}

function getUserStations(userId) {
    return getById(userId).then(user => user.stations || [])
}

async function toggleLikedSongs(song) {
    const loggedinUser = getLoggedinUser()
    console.log('loggedinUser: ',loggedinUser)
    if (!loggedinUser) throw new Error('No logged-in user found')

    const user = await storageService.get('user', loggedinUser._id)
    if (!user.likedSongIds) user.likedSongIds = []

    // const songIdx = user.likedSongIds.findIndex(likedSong => likedSong.id === song.id)
    const isLiked = user.likedSongIds.includes(song.id)
    console.log('isLiked: ',isLiked)

    if (isLiked) {
        user.likedSongIds = user.likedSongIds.filter(sId => sId !== song.id)
        console.log(`Removed "${song.title}" from likedSongIds`)
    } else {
        user.likedSongIds.push(song.id)
        console.log(`Added "${song.title}" to likedSongIds`)
    }

    console.log('user: ',user)

    const updatedUser = await storageService.put('user', user)
    const method = isLiked ? 'removeSong' : 'addSong'
    const savedStation = await stationService[method](song, loggedinUser.likedStationId)
    saveLoggedinUser(updatedUser)

    return savedStation
}

// To quickly create an admin user, uncomment the next line
// _createAdmin()
async function _createAdmin() {
    const user = {
        username: 'admin',
        password: 'admin',
        fullname: 'Mustafa Adminsky',
        imgUrl: 'https://cdn.pixabay.com/photo/2020/07/01/12/58/icon-5359553_1280.png',
        score: 10000,
    }

    const newUser = await storageService.post('user', userCred)
    console.log('newUser: ', newUser)
}

async function _createUsers() {
    const station = await stationService.save({...stationService.getEmptyStation(), type: 'liked'})
    const likedStationId = station._id
    const users = [
        {
            _id: 'u101',
            username: 'aaa',
            password: '123',
            fullname: 'Ava V',
            imgUrl: 'https://randomuser.me/api/portraits/women/65.jpg',
            stations: [],
            likedSongIds: [],
            likedStationId
        },
        {
            _id: 'u102',
            username: 'bbb',
            password: '123',
            fullname: 'Baba B',
            imgUrl: 'https://randomuser.me/api/portraits/men/42.jpg',
            stations: [],
            likedSongIds: [],
            likedStationId: ''
        }
    ]
    await storageService.saveAll('user', users)
    return users
}

// temp debug tool
window.userService = userService