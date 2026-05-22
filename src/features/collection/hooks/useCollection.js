import { useState, useMemo } from 'react'
import { useStore } from '../../../lib/store'

export function useCollection() {
  const { games, updateGameStatus, removeGame } = useStore()
  const [search, setSearch]           = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [sortBy, setSortBy]           = useState('rank')

  const filtered = useMemo(() => {
    let list = [...games]
    if (statusFilter !== 'all') list = list.filter(g => g.status === statusFilter)
    if (search.trim()) {
      const q = search.toLowerCase()
      list = list.filter(g => g.name.toLowerCase().includes(q))
    }
    list.sort((a, b) => {
      if (sortBy === 'rank') {
        if (!a.bggRank && !b.bggRank) return 0
        if (!a.bggRank) return 1
        if (!b.bggRank) return -1
        return a.bggRank - b.bggRank
      }
      if (sortBy === 'name')  return a.name.localeCompare(b.name)
      if (sortBy === 'added') return new Date(b.addedAt) - new Date(a.addedAt)
      return 0
    })
    return list
  }, [games, search, statusFilter, sortBy])

  return { filtered, search, setSearch, statusFilter, setStatusFilter, sortBy, setSortBy, updateGameStatus, removeGame }
}
