const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

const PROD_PROXIES = [
  (url) => `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`,
  (url) => `https://corsproxy.io/?url=${encodeURIComponent(url)}`,
]

async function bggFetch(path, { retries = 4, delayMs = 1500 } = {}) {
  const tryUrl = async (url) => {
    for (let attempt = 0; attempt <= retries; attempt++) {
      const res = await fetch(url)
      // BGG returns 202 when queuing data server-side — retry after delay
      if (res.status === 202) {
        if (attempt < retries) { await sleep(delayMs); continue }
        throw new Error('BGG sigue procesando la solicitud. Intentá de nuevo en unos segundos.')
      }
      if (!res.ok) throw new Error(`BGG request failed: ${res.status}`)
      const text = await res.text()
      const xml = new DOMParser().parseFromString(text, 'text/xml')
      if (xml.querySelector('parsererror')) throw new Error('Invalid XML response')
      return xml
    }
  }

  if (import.meta.env.DEV) {
    return tryUrl(`/bgg-api${path}`)
  }

  const bggUrl = `https://boardgamegeek.com/xmlapi2${path}`
  let lastError
  for (const makeProxy of PROD_PROXIES) {
    try {
      return await tryUrl(makeProxy(bggUrl))
    } catch (err) {
      lastError = err
    }
  }
  throw lastError
}

export async function searchBGG(query) {
  const xml = await bggFetch(`/search?query=${encodeURIComponent(query)}&type=boardgame`)
  return Array.from(xml.querySelectorAll('item')).map(item => ({
    bggId: item.getAttribute('id'),
    name:
      item.querySelector('name[type="primary"]')?.getAttribute('value') ||
      item.querySelector('name')?.getAttribute('value') ||
      'Unknown',
    yearPublished: item.querySelector('yearpublished')?.getAttribute('value') || null,
  }))
}

export async function getBGGGame(id) {
  const xml = await bggFetch(`/thing?id=${id}&stats=1`)
  const item = xml.querySelector('item')
  if (!item) throw new Error('Game not found')

  const ratings = item.querySelector('ratings')
  const rankEl = ratings?.querySelector('rank[name="boardgame"]')
  const rankVal = rankEl?.getAttribute('value')

  return {
    bggId: item.getAttribute('id'),
    name:
      item.querySelector('name[type="primary"]')?.getAttribute('value') ||
      item.querySelector('name')?.getAttribute('value') ||
      'Unknown',
    yearPublished:
      parseInt(item.querySelector('yearpublished')?.getAttribute('value')) || null,
    thumbnail: item.querySelector('thumbnail')?.textContent?.trim() || null,
    image:     item.querySelector('image')?.textContent?.trim() || null,
    description: item.querySelector('description')?.textContent?.trim() || '',
    minPlayers: parseInt(item.querySelector('minplayers')?.getAttribute('value')) || 1,
    maxPlayers: parseInt(item.querySelector('maxplayers')?.getAttribute('value')) || 4,
    playingTime: parseInt(item.querySelector('playingtime')?.getAttribute('value')) || 0,
    bggRating:
      Math.round(
        parseFloat(ratings?.querySelector('bayesaverage')?.getAttribute('value') || '0') * 10
      ) / 10,
    bggRank:
      rankVal && rankVal !== 'Not Ranked' ? parseInt(rankVal) : null,
  }
}
