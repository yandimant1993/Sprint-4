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

        const videos = data.items
            .filter(item => item.id.videoId)
            .map(item => ({
                id: item.id.videoId,
                title: item.snippet.title,
                thumbnail: item.snippet.thumbnails.default.url,
            }))

        searchVideosMap[term] = videos;
        saveToStorage(VIDEO_STORAGE_KEY, searchVideosMap)

        return videos
    } catch (err) {
        console.error('Error fetching videos', err)
        return []
    }
}

// const videos = getVideos('react tutorials', 15)
// console.log(videos)
// console.log('params:', data)