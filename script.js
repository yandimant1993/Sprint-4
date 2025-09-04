
const fetchVideos = async () => {
    const result = await getVideos(filterByToEdit.term, 10)
    setVideos(result)
}

async function onAddStationSong(song) {
    try {
        const savedSong = await addStationSong(stationId, song)
    } catch (err) {
        console.log('Cannot save song', err)
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

async function addSong(stationId, song) {
    const station = await getById(stationId)
    if (!station) throw new Error('Station not found!')
    station.songs.push(song)
    await save(station)
    return song
}

async function save(station) {
    var savedStation
    if (station._id) {
        savedStation = await httpService.put(`station/${station._id}`, station)
    } else {
        savedStation = await httpService.post('station', station)
    }
    return savedStation
}