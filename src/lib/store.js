import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { generateId, generateColor } from './utils'

export const useStore = create(
  persist(
    (set, get) => ({
      // State
      me: null,
      games: [],
      plays: [],
      friends: [],

      // Me
      setMe: (me) => set({ me }),

      // Games
      addGame: (game) => {
        const existing = get().games.find(g => g.bggId === game.bggId)
        if (existing) {
          set((s) => ({
            games: s.games.map(g =>
              g.bggId === game.bggId ? { ...g, status: game.status } : g
            ),
          }))
        } else {
          set((s) => ({
            games: [...s.games, { ...game, addedAt: new Date().toISOString() }],
          }))
        }
      },

      updateGameStatus: (bggId, status) =>
        set((s) => ({
          games: s.games.map(g => g.bggId === bggId ? { ...g, status } : g),
        })),

      removeGame: (bggId) =>
        set((s) => ({ games: s.games.filter(g => g.bggId !== bggId) })),

      // Plays
      addPlay: (play) =>
        set((s) => ({
          plays: [...s.plays, { ...play, id: generateId() }],
        })),

      removePlay: (id) =>
        set((s) => ({ plays: s.plays.filter(p => p.id !== id) })),

      // Friends
      addFriend: (name) => {
        const id = generateId()
        const friend = {
          id,
          name,
          color: generateColor(id),
          createdAt: new Date().toISOString(),
        }
        set((s) => ({ friends: [...s.friends, friend] }))
        return friend
      },

      removeFriend: (id) =>
        set((s) => ({ friends: s.friends.filter(f => f.id !== id) })),
    }),
    {
      name: 'ludo_store',
      version: 1,
    }
  )
)
