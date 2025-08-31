export const SET_PLAYER = 'SET_PLAYER'
export const SET_PLAYING = 'SET_PLAYING'
export const SET_CURRENT_TIME = 'SET_CURRENT_TIME'
export const SET_DURATION = 'SET_DURATION'
export const SET_VOLUME = 'SET_VOLUME'
export const TOGGLE_MUTE = 'TOGGLE_MUTE'
export const SET_CURRENT_STATION = 'SET_CURRENT_STATION'
export const SET_IS_PLAYING = 'SET_IS_PLAYING'
export const ADD_SONG = 'ADD_SONG'
export const REMOVE_SONG = 'REMOVE_SONG'

const initialState = {
  isPlaying: false,
  currentTime: 0,
  duration: 0,
  volume: 50,
  isMuted: false,
  player: null,
  currentStation: null,
  songs: []
}

export function playerReducer(state = initialState, action = {}) {
  switch (action.type) {
    case SET_PLAYER:
      return { ...state, player: action.player }

    case SET_PLAYING:
      if (state.player) action.isPlaying ? state.player.playVideo() : state.player.pauseVideo()
      return { ...state, isPlaying: action.isPlaying }

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

    case SET_CURRENT_STATION:
      return { ...state, currentStation: action.station }

    case SET_IS_PLAYING:
      return { ...state, isPlaying: action.isPlaying }

    case ADD_SONG:
      if (state.songs.some(s => s.id === action.song.id)) return state
      return { ...state, songs: [...state.songs, action.song] }

    case REMOVE_SONG:
      return { ...state, songs: state.songs.filter(s => s.id !== action.songId) }

    default:
      return state
  }
}



// export const SET_PLAYER = 'SET_PLAYER'
// export const SET_PLAYING = 'SET_PLAYING'
// export const SET_CURRENT_TIME = 'SET_CURRENT_TIME'
// export const SET_DURATION = 'SET_DURATION'
// export const SET_VOLUME = 'SET_VOLUME'
// export const TOGGLE_MUTE = 'TOGGLE_MUTE'
// export const SET_CURRENT_STATION = 'SET_CURRENT_STATION'
// export const SET_IS_PLAYING = 'SET_IS_PLAYING'
// export const ADD_SONG = 'ADD_SONG'
// export const REMOVE_SONG = 'REMOVE_SONG'


// const initialState = {
//     isPlaying: false,
//     currentTime: 0,
//     duration: 0,
//     volume: 50,
//     isMuted: false,
//     player: null,
//     currentStation: null,
//     songs: []
// }


// export function playerReducer(state = initialState, action = {}) {
//     switch (action.type) {
//         case SET_PLAYER:
//             return { ...state, player: action.player }

//         case SET_PLAYING:
//             if (state.player) {
//                 if (action.isPlaying) state.player.playVideo()
//                 else state.player.pauseVideo()
//             }
//             return { ...state, isPlaying: action.isPlaying }

//         case SET_CURRENT_TIME:
//             if (state.player) state.player.seekTo(action.time, true)
//             return { ...state, currentTime: action.time }

//         case SET_DURATION:
//             return { ...state, duration: action.duration }

//         case SET_VOLUME:
//             if (state.player) state.player.setVolume(action.volume)
//             return { ...state, volume: action.volume, isMuted: action.volume === 0 }

//         case TOGGLE_MUTE:
//             if (state.player) {
//                 if (state.isMuted) state.player.setVolume(state.volume || 50)
//                 else state.player.setVolume(0)
//             }
//             return { ...state, isMuted: !state.isMuted }

//         case SET_CURRENT_STATION:
//             return { ...state, currentStation: action.station }

//         case SET_IS_PLAYING:
//             return { ...state, isPlaying: action.isPlaying }

//         case ADD_SONG:
//             if (state.songs.some(s => s.id === action.song.id)) return state
//             return { ...state, songs: [...state.songs, action.song] }

//         case REMOVE_SONG:
//             return { ...state, songs: state.songs.filter(s => s.id !== action.songId) }

//         default:
//             return state
//     }
// }
