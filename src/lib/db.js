const DB_NAME = 'ludo_photos'
const STORE_NAME = 'photos'
const VERSION = 1

function openDB() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, VERSION)
    req.onupgradeneeded = (e) => {
      e.target.result.createObjectStore(STORE_NAME, { keyPath: 'id' })
    }
    req.onsuccess = (e) => resolve(e.target.result)
    req.onerror = (e) => reject(e.target.error)
  })
}

export async function savePhoto(base64) {
  const db = await openDB()
  const id = `photo_${Date.now()}_${Math.random().toString(36).slice(2)}`
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite')
    tx.objectStore(STORE_NAME).add({ id, data: base64 })
    tx.oncomplete = () => resolve(id)
    tx.onerror = (e) => reject(e.target.error)
  })
}

export async function getPhoto(id) {
  if (!id) return null
  const db = await openDB()
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readonly')
    const req = tx.objectStore(STORE_NAME).get(id)
    req.onsuccess = (e) => resolve(e.target.result?.data || null)
    req.onerror = (e) => reject(e.target.error)
  })
}

export async function deletePhoto(id) {
  if (!id) return
  const db = await openDB()
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite')
    tx.objectStore(STORE_NAME).delete(id)
    tx.oncomplete = () => resolve()
    tx.onerror = (e) => reject(e.target.error)
  })
}
