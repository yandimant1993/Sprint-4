import { stationService } from '../../services/station'
import { store } from '../store'
import { ADD_STATION, REMOVE_STATION, SET_STATIONS, SET_STATION, UPDATE_STATION, SET_FILTER_BY, ADD_STATION_SONG, REMOVE_STATION_SONG } from '../reducers/station.reducer'

// plural
export async function loadStations() {
    try {
        const { filterBy } = store.getState().stationModule
        const stations = await stationService.query(filterBy)
        store.dispatch(getCmdSetStations(stations))
    } catch (err) {
        console.log('Cannot load stations', err)
        throw err
    }
}

// singular
export async function loadStation(stationId) {
    try {
        const station = await stationService.getById(stationId)
        store.dispatch(getCmdSetStation(station))
    } catch (err) {
        console.log('Cannot load station', err)
        throw err
    }
}

export async function removeStation(stationId, type) {
    try {
        await stationService.remove(stationId, type)
        store.dispatch(getCmdRemoveStation(stationId, type))
    } catch (err) {
        console.log('Cannot remove station', err)
        throw err
    }
}

export async function addStation(station) {
    try {
        const savedStation = await stationService.save(station)
        store.dispatch(getCmdAddStation(savedStation))
        return savedStation
    } catch (err) {
        console.log('Cannot add station', err)
        throw err
    }
}

export async function updateStation(station) {
    try {
        // const savedStation = await stationService.save(station)
        store.dispatch(getCmdUpdateStation(station))
        console.log('savedStation: ',station)
        return station
    } catch (err) {
        console.log('Cannot save station', err)
        throw err
    }
}

export async function addStationSong(stationId, song) {
    try {
        const addedSong = await stationService.addSong(stationId, song)
        store.dispatch(getCmdAddStationSong(addedSong))
        return addedSong
    } catch (err) {
        console.log('Cannot add station msg', err)
        throw err
    }
}

export async function removeStationSong(stationId, songId) {
    try {
        const removedSongId = await stationService.removeSong(stationId, songId)
        store.dispatch(getCmdRemoveStationSong(removedSongId))
        return removedSongId
    } catch (err) {
        console.log('Cannot add station msg', err)
        throw err
    }
}

export function setFilter(filterBy) {
    store.dispatch({ type: SET_FILTER_BY, filterBy })
}

// Command Creators:
function getCmdSetStations(stations) {
    return {
        type: SET_STATIONS,
        stations
    }
}
function getCmdSetStation(station) {
    return {
        type: SET_STATION,
        station
    }
}
function getCmdRemoveStation(stationId) {
    return {
        type: REMOVE_STATION,
        stationId
    }
}
function getCmdAddStation(station) {
    return {
        type: ADD_STATION,
        station
    }
}
function getCmdUpdateStation(station) {
    return {
        type: UPDATE_STATION,
        station
    }
}
function getCmdAddStationSong(song) {
    return {
        type: ADD_STATION_SONG,
        song
    }
}
function getCmdRemoveStationSong(songId) {
    return {
        type: REMOVE_STATION_SONG,
        songId
    }
}

// unitTestActions()
async function unitTestActions() {
    await loadStations()
    await addStation(stationService.getEmptyStation())
    await updateStation({
        _id: 'm1oC7',
        name: 'Station-Good',
    })
    await removeStation('m1oC7')
    // TODO unit test addStationMsg
}
