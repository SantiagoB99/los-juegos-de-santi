import { useStore } from '../../../lib/store'

export function usePlays() {
  const { plays, addPlay, removePlay } = useStore()
  const sorted = [...plays].sort((a, b) => new Date(b.playedAt) - new Date(a.playedAt))
  return { plays: sorted, addPlay, removePlay }
}
