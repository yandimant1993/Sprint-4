import { stationService } from "../../services/station"

export const SET_STATIONS = 'SET_STATIONS'
export const SET_STATION = 'SET_STATION'
export const REMOVE_STATION = 'REMOVE_STATION'
export const ADD_STATION = 'ADD_STATION'
export const UPDATE_STATION = 'UPDATE_STATION'
export const ADD_STATION_MSG = 'ADD_STATION_MSG'
export const SET_FILTER_BY = 'SET_FILTER_BY'

const initialState = {
    stations: [],
    filterBy: stationService.getDefaultFilter(),
    station: null
}

export function stationReducer(state = initialState, action) {
    var newState = state
    var stations
    switch (action.type) {
        case SET_STATIONS:
            newState = { ...state, stations: action.stations }
            break
        case SET_STATION:
            newState = { ...state, station: action.station }
            break
        case REMOVE_STATION:
            const lastRemovedStation = state.stations.find(station => station._id === action.stationId)
            stations = state.stations.filter(station => station._id !== action.stationId)
            newState = { ...state, stations, lastRemovedStation }
            break
        case ADD_STATION:
            newState = { ...state, stations: [...state.stations, action.station] }
            break
        // case UPDATE_STATION:
        //     stations = state.stations.map(station => (station._id === action.station._id) ? action.station : station)
        //     newState = { ...state, stations }
        //     break
        case UPDATE_STATION:
            const updatedStation = action.station
            stations = state.stations.map(station => station._id === updatedStation._id ? updatedStation : station)
            newState = {
                ...state, stations, station: state.station && state.station._id === updatedStation._id
                    ? updatedStation : state.station
            }
            break
        case ADD_STATION_MSG:
            if (action.msg && state.station) {
                newState = { ...state, station: { ...state.station, msgs: [...state.station.msgs || [], action.msg] } }
                break
            }
        case SET_FILTER_BY:
            return {
                ...state,
                filterBy: { ...state.filterBy, ...action.filterBy },
            }
        default:
    }
    return newState
}

// unitTestReducer()

function unitTestReducer() {
    var state = initialState
    const station1 = { _id: 'b101', name: 'Station ' + parseInt('' + Math.random() * 10), addedAt: 12, owner: null, msgs: [] }
    const station2 = { _id: 'b102', name: 'Station ' + parseInt('' + Math.random() * 10), addedAt: 13, owner: null, msgs: [] }

    state = stationReducer(state, { type: SET_STATIONS, stations: [station1] })
    console.log('After SET_STATIONS:', state)

    state = stationReducer(state, { type: ADD_STATION, station: station2 })
    console.log('After ADD_STATION:', state)

    state = stationReducer(state, { type: UPDATE_STATION, station: { ...station2, name: 'Good' } })
    console.log('After UPDATE_STATION:', state)

    state = stationReducer(state, { type: REMOVE_STATION, stationId: station2._id })
    console.log('After REMOVE_STATION:', state)

    state = stationReducer(state, { type: SET_STATION, station: station1 })
    console.log('After SET_STATION:', state)

    const msg = { id: 'm' + parseInt('' + Math.random() * 100), txt: 'Some msg', by: { _id: 'u123', fullname: 'test' } }
    state = stationReducer(state, { type: ADD_STATION_MSG, stationId: station1._id, msg })
    console.log('After ADD_STATION_MSG:', state)
}

