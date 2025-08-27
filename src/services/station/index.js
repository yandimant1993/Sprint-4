const { DEV, VITE_LOCAL } = import.meta.env

import { getRandomIntInclusive, makeId, makeLorem } from '../util.service'

import { stationService as local } from './station.service.local'
import { stationService as remote } from './station.service.remote'

var count = 1

function getEmptyStation() {
    const station = {
        name: `MyPlaylist #${count}`,
        addedAt: Date.now(),
        tags: [],
        songs: [],
        // createdBy: '',
        likedByUsers: [],
        type: 'user',
        stationImgUrl: 'https://placebear.com/80/80'
    }
    count++
    return station
}

function getDefaultFilter() {
    return {
        txt: '',
        minAddedAt: '',
        sortField: '',
        sortDir: 1,
    }
}

const service = (VITE_LOCAL === 'true') ? local : remote
export const stationService = { getEmptyStation, getDefaultFilter, ...service }

// Easy access to this service from the dev tools console
// when using script - dev / dev:local

if (DEV) window.stationService = stationService
