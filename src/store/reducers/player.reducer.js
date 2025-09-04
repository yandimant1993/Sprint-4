import { parseDuration } from "../../services/util.service"

export const SET_PLAYER = 'SET_PLAYER'
export const SET_PLAYING = 'SET_PLAYING'
export const SET_CURRENT_TIME = 'SET_CURRENT_TIME'
export const SET_DURATION = 'SET_DURATION'
export const SET_VOLUME = 'SET_VOLUME'
export const TOGGLE_MUTE = 'TOGGLE_MUTE'
export const SET_CURRENT_STATION = 'SET_CURRENT_STATION'
export const SET_CURRENT_SONG = 'SET_CURRENT_SONG'
export const SET_IS_PLAYING = 'SET_IS_PLAYING'
export const SET_IS_ACTIVE = 'SET_IS_ACTIVE'
export const ADD_SONG = 'ADD_SONG'
export const REMOVE_SONG = 'REMOVE_SONG'
export const NEXT_SONG = 'NEXT_SONG'
export const PREV_SONG = 'PREV_SONG'

const initialState = {
    isPlaying: false,
    isActive: false,
    currentStationId: null,
    currentStationSongs: [],
    currentSong: {},
    currentIndex: 0,
    duration: 0,
    currentTime: 0,
}

export function playerReducer(state = initialState, action = {}) {
    switch (action.type) {
        case SET_PLAYER:
            return { ...state, player: action.player }

        // case SET_CURRENT_STATION:
        //     return { ...state, currentStationSongs: action.station }

        case SET_CURRENT_STATION:
            return {
                ...state,
                currentStationId: action.station._id,
                currentStationSongs: action.station.songs
            }

        case SET_CURRENT_SONG:
            return {
                ...state,
                currentSong: action.song,
                duration: parseDuration(action.song.duration)
            }

        case SET_IS_PLAYING:
            return { ...state, isPlaying: action.isPlaying }


        ///////////////////////////////////////////////////////
        case SET_CURRENT_TIME:
            if (state.player) state.player.seekTo(action.time, true)
            return { ...state, currentTime: action.time }

        case SET_DURATION:
            return { ...state, duration: action.duration }

        case SET_VOLUME:
            if (state.player) state.player.setVolume(action.volume)
            return { ...state, volume: action.volume, isMuted: action.volume === 0 }

        case TOGGLE_MUTE:
            if (state.player) state.isMuted ? state.player.setVolume(state.volume || 50) : state.player.setVolume(0)
            return { ...state, isMuted: !state.isMuted }

        case SET_IS_ACTIVE:
            return { ...state, isActive: action.isActive }

        case ADD_SONG:
            if (state.songs.some(s => s.id === action.song.id)) return state;
            const newSongs = [...state.songs, action.song];
            localStorage.setItem('songs', JSON.stringify(newSongs));
            return { ...state, songs: newSongs };

        case REMOVE_SONG:
            const filteredSongs = state.songs.filter(song => song.id !== action.songId);
            localStorage.setItem('songs', JSON.stringify(filteredSongs));
            return { ...state, songs: filteredSongs };

        case NEXT_SONG:
            return {
                ...state,
                currentIndex: action.index,
                activeSong: state.currentSongs[action.index] || {},
                isActive: true,
            }

        case PREV_SONG:
            return {
                ...state,
                currentIndex: action.index,
                activeSong: state.currentSongs[action.index] || {},
                isActive: true,
            }
        default:
            return state
    }
}