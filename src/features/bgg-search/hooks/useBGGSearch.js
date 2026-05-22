import { useState, useCallback } from 'react'
import { searchBGG, getBGGGame } from '../../../lib/bgg'

export function useBGGSearch() {
  const [results, setResults]   = useState([])
  const [selected, setSelected] = useState(null)
  const [loading, setLoading]   = useState(false)
  const [error, setError]       = useState(null)

  const search = useCallback(async (q) => {
    if (!q.trim()) return
    setLoading(true)
    setError(null)
    setSelected(null)
    try {
      const res = await searchBGG(q)
      setResults(res.slice(0, 30))
    } catch {
      setError('No se pudo conectar con BGG. Revisá tu conexión.')
      setResults([])
    } finally {
      setLoading(false)
    }
  }, [])

  const selectGame = useCallback(async (bggId) => {
    setLoading(true)
    setError(null)
    try {
      const game = await getBGGGame(bggId)
      setSelected(game)
    } catch {
      setError('No se pudo cargar el juego. Intentá de nuevo.')
    } finally {
      setLoading(false)
    }
  }, [])

  return { results, selected, setSelected, loading, error, search, selectGame }
}
