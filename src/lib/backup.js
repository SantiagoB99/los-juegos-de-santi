import { useStore } from './store'
import { getPhoto, putPhoto, clearPhotos } from './db'
import { fixUtcMidnight } from './utils'

export const BACKUP_SCHEMA_VERSION = 2
const APP_MARKER = 'los-juegos-de-santi'

export async function buildBackup(state) {
  const photos = {}
  for (const play of state.plays) {
    if (play.photoId) {
      const data = await getPhoto(play.photoId)
      if (data) photos[play.photoId] = data
    }
  }
  return {
    app: APP_MARKER,
    schemaVersion: BACKUP_SCHEMA_VERSION,
    exportedAt: new Date().toISOString(),
    data: {
      me: state.me,
      games: state.games,
      plays: state.plays,
      friends: state.friends,
    },
    photos,
  }
}

export function downloadBackup(backup) {
  const blob = new Blob([JSON.stringify(backup)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `${APP_MARKER}-backup-${backup.exportedAt.slice(0, 10)}.json`
  a.click()
  URL.revokeObjectURL(url)
}

// Returns the backup object if valid, or null
export function validateBackup(json) {
  if (!json || typeof json !== 'object') return null
  if (json.app !== APP_MARKER) return null
  if (typeof json.schemaVersion !== 'number' || json.schemaVersion < 1 || json.schemaVersion > BACKUP_SCHEMA_VERSION) return null
  const d = json.data
  if (!d || typeof d !== 'object') return null
  if (!Array.isArray(d.games) || !Array.isArray(d.plays) || !Array.isArray(d.friends)) return null
  return json
}

// Write photos FIRST, then store — if IDB fails, current state stays intact
export async function applyBackup(backup) {
  let plays = backup.data.plays
  if (backup.schemaVersion < 2) {
    plays = plays.map(p => ({ ...p, playedAt: fixUtcMidnight(p.playedAt) }))
  }
  await clearPhotos()
  for (const [id, data] of Object.entries(backup.photos || {})) {
    if (id) await putPhoto(id, data)
  }
  useStore.getState().replaceAll({
    me: backup.data.me,
    games: backup.data.games,
    plays,
    friends: backup.data.friends,
  })
}

// One-step export: build + download + record in store
export async function exportNow() {
  const backup = await buildBackup(useStore.getState())
  downloadBackup(backup)
  useStore.getState().recordExport()
}
