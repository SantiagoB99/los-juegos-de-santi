import { useMemo } from 'react'
import { useStore } from '../../../lib/store'

export function useFriends() {
  const { friends, plays, addFriend, removeFriend } = useStore()

  const friendStats = useMemo(() => {
    return friends.map(friend => {
      const friendPlays = plays.filter(p =>
        p.players.some(pl => pl.friendId === friend.id)
      )
      const wins = friendPlays.filter(p =>
        p.players.some(pl => pl.friendId === friend.id && pl.winner)
      ).length

      const gameCounts = {}
      friendPlays.forEach(p => {
        gameCounts[p.gameName] = (gameCounts[p.gameName] || 0) + 1
      })
      const topGames = Object.entries(gameCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3)
        .map(([name, count]) => ({ name, count }))

      return { ...friend, playCount: friendPlays.length, wins, topGames }
    }).sort((a, b) => b.playCount - a.playCount)
  }, [friends, plays])

  return { friendStats, addFriend, removeFriend }
}
