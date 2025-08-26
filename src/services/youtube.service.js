async function getVideos(term) {
    const cache = storageService.load(STORAGE_KEY) || {}

    if (cache[term]) return cache[term]

    try {
        const { data } = await axios.get('https://www.googleapis.com/youtube/v3/search', {
            params: {
                part: 'snippet',
                videoEmbeddable: true,
                videoSyndicated: true,
                type: 'video',
                key: YOUTUBE_KEY,
                q: term,
                maxResults: 10
            }
        })

        console.log('data', data)

        const videos = data.items.map(item => ({
            id: item.id.videoId,
            title: item.snippet.title,
            thumbnail: item.snippet.thumbnails.default.url
        }))

        cache[term] = videos
        storageService.save(STORAGE_KEY, cache)

        return videos
    } catch (err) {
        console.error('Error fetching videos', err)
        return []
    }
}
