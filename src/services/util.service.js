export function makeId(length = 6) {
    var txt = ''
    var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'

    for (var i = 0; i < length; i++) {
        txt += possible.charAt(Math.floor(Math.random() * possible.length))
    }

    return txt
}

export function makeLorem(size = 100) {
    var words = ['The sky', 'above', 'the port', 'was', 'the color of television', 'tuned', 'to', 'a dead channel', '.', 'All', 'this happened', 'more or less', '.', 'I', 'had', 'the story', 'bit by bit', 'from various people', 'and', 'as generally', 'happens', 'in such cases', 'each time', 'it', 'was', 'a different story', '.', 'It', 'was', 'a pleasure', 'to', 'burn']
    var txt = ''
    while (size > 0) {
        size--
        txt += words[Math.floor(Math.random() * words.length)] + ' '
    }
    return txt
}

export function getRandomIntInclusive(min, max) {
    min = Math.ceil(min)
    max = Math.floor(max)
    return Math.floor(Math.random() * (max - min + 1)) + min //The maximum is inclusive and the minimum is inclusive 
}


export function randomPastTime() {
    const HOUR = 1000 * 60 * 60
    const DAY = 1000 * 60 * 60 * 24
    const WEEK = 1000 * 60 * 60 * 24 * 7

    const pastTime = getRandomIntInclusive(HOUR, WEEK)
    return Date.now() - pastTime
}

export function debounce(func, timeout = 300) {
    let timer
    return (...args) => {
        clearTimeout(timer)
        timer = setTimeout(() => { func.apply(this, args) }, timeout)
    }
}

export function saveToStorage(key, value) {
    localStorage.setItem(key, JSON.stringify(value))
}

export function loadFromStorage(key) {
    const data = localStorage.getItem(key)
    return (data) ? JSON.parse(data) : undefined
}

  export function getRelativeTime(dateStr) {
      const date = new Date(dateStr)
      const diff = Date.now() - date.getTime()
      const seconds = Math.floor(diff / 1000)
      const minutes = Math.floor(seconds / 60)
      const hours = Math.floor(minutes / 60)
      const days = Math.floor(hours / 24)
      const years = Math.floor(days / 365)

      if (years > 0) return `${years} year${years > 1 ? 's' : ''} ago`
      if (days > 30) return `${Math.floor(days / 30)} month${Math.floor(days / 30) > 1 ? 's' : ''} ago`
      if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`
      if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`
      if (minutes > 0) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`
      return `just now`
   }

//    export  function getRelativeTime(dateStr) {
//       const date = new Date(dateStr)
//       const diff = Date.now() - date.getTime()
//       const minutes = Math.floor(diff / 1000 / 60)
//       if (minutes < 1) return 'just now'
//       if (minutes < 60) return `${minutes} min ago`
//       const hours = Math.floor(minutes / 60)
//       if (hours < 24) return `${hours} hours ago`
//       const days = Math.floor(hours / 24)
//       return `${days} day${days > 1 ? 's' : ''} ago`
//    }

export  function truncateWords(text, limit) {
      if (!text) return ""
      const words = text.split(" ")
      if (words.length <= limit) return text
      return words.slice(0, limit).join(" ") + "..."
   }

  export function parseDuration(str) {
  if (!str) return 0
  const parts = str.split(":").map(Number)
  if (parts.length === 2) return parts[0] * 60 + parts[1]   // mm:ss
  if (parts.length === 3) return parts[0] * 3600 + parts[1] * 60 + parts[2] // hh:mm:ss
  return 0
}