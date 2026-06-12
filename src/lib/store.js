import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { generateId, generateColor, fixUtcMidnight } from './utils'
import { deletePhoto } from './db'

export const useStore = create(
  persist(
    (set, get) => ({
      // State
      me: null,
      games: [],
      plays: [],
      friends: [],
      // Backup metadata (local del dispositivo — no viaja en el backup)
      lastExportAt: null,
      playsAtLastExport: 0,
      reminderDismissedAt: null,

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

      removePlay: (id) => {
        const play = get().plays.find(p => p.id === id)
        if (play?.photoId) deletePhoto(play.photoId).catch(() => {})
        set((s) => ({ plays: s.plays.filter(p => p.id !== id) }))
      },

      updatePlay: (id, changes) =>
        set((s) => ({
          plays: s.plays.map(p => p.id === id ? { ...p, ...changes } : p),
        })),

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

      // Backup
      recordExport: () =>
        set((s) => ({
          lastExportAt: new Date().toISOString(),
          playsAtLastExport: s.plays.length,
        })),

      dismissBackupReminder: () =>
        set({ reminderDismissedAt: new Date().toISOString() }),

      replaceAll: ({ me, games, plays, friends }) =>
        set({ me, games, plays, friends }),
    }),
    {
      name: 'ludo_store',
      version: 2,
      migrate: (state, version) => {
        if (version < 2) {
          state.plays = (state.plays || []).map(p => ({
            ...p,
            playedAt: fixUtcMidnight(p.playedAt),
          }))
        }
        return state
      },
    }
  )
)
