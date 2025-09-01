import { store } from '../store'
import { stationService } from '../../services/station/station.service.local'
import { storageService } from '../../services/async-storage.service'
import { showErrorMsg } from '../../services/event-bus.service'

export const SET_CURRENT_STATION = 'SET_CURRENT_STATION'
export const SET_CURRENT_SONG = 'SET_CURRENT_SONG'
export const SET_IS_PLAYING = 'SET_IS_PLAYING'
export const ADD_SONG = 'ADD_SONG'
export const REMOVE_SONG = 'REMOVE_SONG'

export function setPlayer(player) {
    store.dispatch({ type: 'SET_PLAYER', player })
}
export function setCurrentTime(time) {
    store.dispatch({ type: 'SET_CURRENT_TIME', time })
}
export function setDuration(duration) {
    store.dispatch({ type: 'SET_DURATION', duration })
}
export function setVolume(volume) {
    store.dispatch({ type: 'SET_VOLUME', volume })
}

export async function setCurrentStation(station) {
    try {
        store.dispatch({ type: SET_CURRENT_STATION, station })
        await storageService.saveAll('player', { currentStation: station })
    } catch (err) {
        showErrorMsg('Cannot set current station')
        console.error('player.actions: err in setCurrentStation', err)
    }
}

// export async function setIsPlaying(isPlaying) {
//     try {
//         if (store.getState().playerModule.player) {
//             isPlaying
//                 ? store.getState().playerModule.player.playVideo()
//                 : store.getState().playerModule.player.pauseVideo()
//         }
//         store.dispatch({ type: SET_IS_PLAYING, isPlaying })
//         await storageService.saveAll('player', { isPlaying })
//     } catch (err) {
//         showErrorMsg('Cannot set playing state')
//         console.error('player.actions: err in setIsPlaying', err)
//     }
// }

export async function setIsPlaying(isPlaying) {
    try {
        const state = store.getState()
        const current = state.playerModule.isPlaying
        const next = typeof isPlaying === 'boolean' ? isPlaying : !current

        store.dispatch({ type: SET_IS_PLAYING, isPlaying: next })

        const player = state.playerModule.player
        if (player) next ? player.playVideo() : player.pauseVideo()

        await storageService.saveAll('player', { isPlaying: next })
    } catch (err) {
        showErrorMsg('Cannot set playing state')
        console.error('player.actions: err in setIsPlaying', err)
    }
}

export async function setCurrentSong(song) {
    try {
        store.dispatch({ type: SET_CURRENT_SONG, song })
        // Optional: persist song if desired
    } catch (err) {
        showErrorMsg('Cannot set current song')
        console.error('player.actions: err in setCurrentSong', err)
    }
}

export async function addSong(song, stationId) {
    try {
        const updatedStation = await stationService.addSong(song, stationId)
        store.dispatch({ type: ADD_SONG, song })
        return updatedStation
    } catch (err) {
        showErrorMsg('Cannot add song')
        console.error('player.actions: err in addSong', err)
        throw err
    }
}

export async function removeSong(songId, stationId) {
    try {
        const updatedStation = await stationService.removeSong(songId, stationId)
        store.dispatch({ type: REMOVE_SONG, songId })
        return updatedStation
    } catch (err) {
        showErrorMsg('Cannot remove song')
        console.error('player.actions: err in removeSong', err)
        throw err
    }
}

// export async function setPlaying(isPlaying) {
//     try {
//         store.dispatch({ type: 'SET_PLAYING', isPlaying })
//         await storageService.saveAll('player', { isPlaying })
//     } catch (err) {
//         showErrorMsg('Cannot change play state')
//         console.error('player.actions: err in setPlaying', err)
//     }
// }

export async function toggleMute() {
    try {
        store.dispatch({ type: 'TOGGLE_MUTE' })
    } catch (err) {
        showErrorMsg('Cannot toggle mute')
        console.error('player.actions: err in toggleMute', err)
    }
}

// import { store } from '../store'


// export const SET_CURRENT_STATION = 'SET_CURRENT_STATION'
// export const SET_IS_PLAYING = 'SET_IS_PLAYING'

// export function setPlayer(player) {
//     store.dispatch({ type: 'SET_PLAYER', player })
// }

// export function setPlaying(isPlaying) {
//     store.dispatch({ type: 'SET_PLAYING', isPlaying })
// }

// export function setCurrentTime(time) {
//     store.dispatch({ type: 'SET_CURRENT_TIME', time })
// }

// export function setDuration(duration) {
//     store.dispatch({ type: 'SET_DURATION', duration })
// }

// export function setVolume(volume) {
//     store.dispatch({ type: 'SET_VOLUME', volume })
// }

// export function toggleMute() {
//     store.dispatch({ type: 'TOGGLE_MUTE' })
// }


// export function setCurrentStation(station) {
//     store.dispatch({ type: SET_CURRENT_STATION, station })
// }

// export function setIsPlaying(isPlaying) {
//     store.dispatch({ type: SET_IS_PLAYING, isPlaying })
// }
// export function addSong(song) {
//     store.dispatch({ type: ADD_SONG, song })
// }
// export function removeSong(songId) {
//     store.dispatch({ type: REMOVE_SONG, songId })
// }
// export function setCurrentSong(song) {
//     return { type: SET_CURRENT_SONG, song }
// }