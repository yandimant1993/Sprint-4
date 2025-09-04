export const storageService = {
    query,
    get,
    post,
    put,
    remove,
    saveAll,
}

async function query(entityType, delay = 200) {
    try {
        const entities = JSON.parse(localStorage.getItem(entityType)) || []
        return await new Promise(resolve => setTimeout(() => resolve(entities), delay))
    } catch (err) {
        console.error(`Query failed for ${entityType}:`, err)
        throw err
    }
}

async function get(entityType, entityId) {
    try {
        const entities = await query(entityType)
        const entity = entities.find(entity => entity._id === entityId)
        if (!entity) throw new Error(`Get failed, cannot find entity with id: ${entityId} in: ${entityType}`)
        return entity
    } catch (err) {
        console.error(`Get failed for ${entityType}/${entityId}:`, err)
        throw err
    }
}

async function post(entityType, newEntity) {
    try {
        newEntity._id = _makeId()
        const entities = await query(entityType)
        entities.push(newEntity)
        _save(entityType, entities)
        return newEntity
    } catch (err) {
        console.error(`Post failed for ${entityType}:`, err)
        throw err
    }
}

async function put(entityType, updatedEntity) {
    try {
        const entities = await query(entityType)
        const idx = entities.findIndex(entity => entity._id === updatedEntity._id)
        if (idx < 0) throw new Error(`Update failed, cannot find entity with id: ${updatedEntity._id} in: ${entityType}`)
        const entityToUpdate = { ...entities[idx], ...updatedEntity }
        entities.splice(idx, 1, entityToUpdate)
        _save(entityType, entities)
        return entityToUpdate
    } catch (err) {
        console.error(`Put failed for ${entityType}:`, err)
        throw err
    }
}

async function remove(entityType, entityId) {
    try {
        const entities = await query(entityType)
        const idx = entities.findIndex(entity => entity._id === entityId)
        if (idx < 0) throw new Error(`Remove failed, cannot find entity with id: ${entityId} in: ${entityType}`)
        entities.splice(idx, 1)
        _save(entityType, entities)
    } catch (err) {
        console.error(`Remove failed for ${entityType}/${entityId}:`, err)
        throw err
    }
}

// used for seeding demodata
async function saveAll(entityType, entities) {
    try {
        _save(entityType, entities)
        return entities
    } catch (err) {
        console.error(`SaveAll failed for ${entityType}:`, err)
        throw err
    }
}

// Private functions

function _save(entityType, entities) {
    localStorage.setItem(entityType, JSON.stringify(entities))
}

function _makeId(length = 5) {
    var text = ''
    var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    for (var i = 0; i < length; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length))
    }
    return text
}
