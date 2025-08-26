import { store } from '../store'


export const SET_CURRENT_STATION = 'SET_CURRENT_STATION'
export const SET_IS_PLAYING = 'SET_IS_PLAYING'

export function setPlayer(player) {
    store.dispatch({ type: 'SET_PLAYER', player })
}

export function setPlaying(isPlaying) {
    store.dispatch({ type: 'SET_PLAYING', isPlaying })
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

export function toggleMute() {
    store.dispatch({ type: 'TOGGLE_MUTE' })
}


export function setCurrentStation(station) {
    store.dispatch({ type: SET_CURRENT_STATION, station })
}

export function setIsPlaying(isPlaying) {
    store.dispatch({ type: SET_IS_PLAYING, isPlaying })
}
