// import { loadFromStorage, saveToStorage } from "../util.service.js"
// import axios from "axios"

// const YT_API_KEY = 'AIzaSyDyMCSjBIjpOulqFGvOBM5QVlyLq-DP_3s'
// const VIDEO_STORAGE_KEY = 'videosDB'


// export async function getVideos(term, maxResults = 10) {
//     const searchVideosMap = loadFromStorage(VIDEO_STORAGE_KEY) || {}

//     if (searchVideosMap[term]) {
//         return Promise.resolve(searchVideosMap[term]);
//     }

//     try {
//         const { data } = await axios.get(`https://www.googleapis.com/youtube/v3/search?&key=${YT_API_KEY}&q=${term}`, {
//             params: {
//                 part: 'snippet',
//                 videoEmbeddable: true,
//                 videoSyndicated: true,
//                 type: 'video',
//                 key: YT_API_KEY,
//                 q: term,
//                 maxResults,
//             },
//         })

//         const { data: detailsData } = await axios.get(
//             `https://www.googleapis.com/youtube/v3/videos`, {
//             params: {
//                 part: 'snippet,contentDetails',
//                 id: videoIds,
//                 key: YT_API_KEY,
//             },
//         })

//         console.log('data:', data)

//         const videos = data.items
//             .filter(item => item.id.videoId)
//             .map(item => ({
//                 id: item.id.videoId,
//                 title: item.snippet.title,
//                 thumbnail: item.snippet.thumbnails.default.url,
//             }))

//         searchVideosMap[term] = videos;
//         saveToStorage(VIDEO_STORAGE_KEY, searchVideosMap)

//         return videos
//     } catch (err) {
//         console.error('Error fetching videos', err)
//         return []
//     }
// }

// // const videos = getVideos('react tutorials', 15)
// // console.log(videos)
// // console.log('params:', data)

import { loadFromStorage, saveToStorage } from "../util.service.js"
import axios from "axios"

const YT_API_KEY = 'AIzaSyDyMCSjBIjpOulqFGvOBM5QVlyLq-DP_3s'
const VIDEO_STORAGE_KEY = 'videosDB'

export async function getVideos(term, maxResults = 10) {
    const searchVideosMap = loadFromStorage(VIDEO_STORAGE_KEY) || {}

    if (searchVideosMap[term]) {
        return Promise.resolve(searchVideosMap[term]);
    }

    try {
        const { data } = await axios.get(`https://www.googleapis.com/youtube/v3/search?&key=${YT_API_KEY}&q=${term}`, {
            params: {
                part: 'snippet',
                videoEmbeddable: true,
                videoSyndicated: true,
                type: 'video',
                key: YT_API_KEY,
                q: term,
                maxResults,
            },
        })

        const videoIds = data.items.map(item => item.id.videoId).join(',')

        // קריאה נוספת כדי להביא את ה־duration
        const { data: detailsData } = await axios.get(
            `https://www.googleapis.com/youtube/v3/videos?&key=${YT_API_KEY}&q=${term}`, {
            params: {
                part: 'snippet,contentDetails',
                id: videoIds,
                key: YT_API_KEY,
            },
        })
console.log('data: list',data)
        const videos = detailsData.items.map((item, idx) => {
            const durationISO = item.contentDetails.duration
            const duration = formatDuration(durationISO)

            return {
                id: item.id,
                title: item.snippet.title,
                artist: item.snippet.channelTitle || "Unknown Artist",
                album: `Album ${idx + 1}`, // mock – אין ב־API
                dateAdded: new Date().toISOString(), // עכשיו
                duration,
                imgUrl: item.snippet.thumbnails.medium.url,
            }
        })

        searchVideosMap[term] = videos
        saveToStorage(VIDEO_STORAGE_KEY, searchVideosMap)

        return videos
    } catch (err) {
        console.error('Error fetching videos', err)
        return []
    }
}

// פונקציה להמרת ISO8601 ל־MM:SS
function formatDuration(duration) {
    const match = duration.match(/PT(?:(\d+)M)?(?:(\d+)S)?/)
    const minutes = match?.[1] ? parseInt(match[1]) : 0
    const seconds = match?.[2] ? parseInt(match[2]) : 0
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
}
