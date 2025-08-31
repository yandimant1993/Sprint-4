const { DEV, VITE_LOCAL } = import.meta.env

import { userService as local } from './user.service.local'
import { userService as remote } from './user.service.remote'

function getEmptyUser() {
    return {
        username: '',
        password: '',
        fullname: '',
        likedSongs: [],
        stations: []
    }
}

function getTotalSongsDuration(station) {
    const totalSeconds = station.songs.reduce((total, song) => {
        if (!song.duration) return total

        const [min, sec] = song.duration.split(':').map(Number)
        return total + (min * 60 + sec)
    }, 0)

    const minutes = Math.floor(totalSeconds / 60)
    const seconds = totalSeconds % 60

    return `${minutes} min ${seconds} sec`
}

const service = (VITE_LOCAL === 'true') ? local : remote
export const userService = { ...service, getEmptyUser, getTotalSongsDuration }

// Easy access to this service from the dev tools console
// when using script - dev / dev:local

if (DEV) window.userService = userService