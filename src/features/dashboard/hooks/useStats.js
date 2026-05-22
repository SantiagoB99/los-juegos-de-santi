import { useMemo } from 'react'
import { useStore } from '../../../lib/store'
import { subMonths, startOfMonth, endOfMonth, isWithinInterval, format } from 'date-fns'
import { es } from 'date-fns/locale'

export function useStats() {
  const { me, games, plays, friends } = useStore()

  return useMemo(() => {
    const totalGames = games.length
    const totalPlays = plays.length

    const myWins = plays.filter(p =>
      p.players.some(pl => pl.isMe && pl.winner)
    ).length
    const myWinRate = totalPlays > 0 ? Math.round((myWins / totalPlays) * 100) : 0

    // Favorite rival — friend with most co-plays (exclude "me")
    const friendPlayCounts = {}
    plays.forEach(p => {
      p.players.filter(pl => !pl.isMe && pl.friendId).forEach(pl => {
        friendPlayCounts[pl.friendId] = (friendPlayCounts[pl.friendId] || 0) + 1
      })
    })
    const topFriendEntry = Object.entries(friendPlayCounts).sort((a, b) => b[1] - a[1])[0]
    const favoriteRival = topFriendEntry
      ? { friend: friends.find(f => f.id === topFriendEntry[0]), count: topFriendEntry[1] }
      : null

    // Top game
    const gameCounts = {}
    plays.forEach(p => { gameCounts[p.gameName] = (gameCounts[p.gameName] || 0) + 1 })
    const topGameEntry = Object.entries(gameCounts).sort((a, b) => b[1] - a[1])[0]
    const topGame = topGameEntry ? { name: topGameEntry[0], count: topGameEntry[1] } : null

    // Plays per month (last 6 months)
    const now = new Date()
    const playsPerMonth = Array.from({ length: 6 }, (_, i) => {
      const d     = subMonths(now, 5 - i)
      const start = startOfMonth(d)
      const end   = endOfMonth(d)
      const count = plays.filter(p =>
        isWithinInterval(new Date(p.playedAt), { start, end })
      ).length
      return { month: format(d, 'MMM', { locale: es }), count }
    })

    // Recent plays (last 5)
    const recentPlays = [...plays]
      .sort((a, b) => new Date(b.playedAt) - new Date(a.playedAt))
      .slice(0, 5)

    // Friends ranking by wins (excludes "me")
    const friendWins = {}
    plays.forEach(p => {
      p.players.filter(pl => !pl.isMe && pl.friendId && pl.winner).forEach(pl => {
        friendWins[pl.friendId] = (friendWins[pl.friendId] || 0) + 1
      })
    })
    const friendsRanking = friends
      .map(f => ({ ...f, wins: friendWins[f.id] || 0 }))
      .sort((a, b) => b.wins - a.wins)
      .slice(0, 5)

    return {
      me, totalGames, totalPlays,
      myWins, myWinRate,
      favoriteRival, topGame,
      playsPerMonth, recentPlays, friendsRanking,
    }
  }, [me, games, plays, friends])
}
