# Los Juegos de Santi — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a personal board game collection tracker and play logger — React SPA with no backend, localStorage persistence, data from BoardGameGeek public API, deployed to GitHub Pages.

**Architecture:** HashRouter SPA (GitHub Pages compatible), Zustand single store with persist middleware, feature-based folder structure, BGG API via allorigins.win CORS proxy, photos in IndexedDB.

**Tech Stack:** React 18, Vite 5, Tailwind CSS v3, Zustand, React Router v6 (HashRouter), Recharts, lucide-react, nanoid, date-fns

**No tests required for this MVP.**

---

## File Map

```
AppBoardGame/
├── index.html
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
├── public/
│   └── 404.html
├── src/
│   ├── index.css
│   ├── main.jsx
│   ├── App.jsx
│   ├── components/
│   │   ├── Button.jsx
│   │   ├── Card.jsx
│   │   ├── Badge.jsx
│   │   ├── Modal.jsx
│   │   └── EmptyState.jsx
│   ├── lib/
│   │   ├── utils.js
│   │   ├── db.js
│   │   ├── store.js
│   │   └── bgg.js
│   ├── features/
│   │   ├── collection/
│   │   │   ├── components/GameCard.jsx
│   │   │   ├── components/GameGrid.jsx
│   │   │   ├── components/GameFilters.jsx
│   │   │   └── hooks/useCollection.js
│   │   ├── bgg-search/
│   │   │   ├── components/SearchBar.jsx
│   │   │   ├── components/SearchResultsList.jsx
│   │   │   ├── components/GamePreviewCard.jsx
│   │   │   └── hooks/useBGGSearch.js
│   │   ├── plays/
│   │   │   ├── components/PlayForm.jsx
│   │   │   ├── components/PlayerRow.jsx
│   │   │   ├── components/PlayCard.jsx
│   │   │   ├── components/PhotoUpload.jsx
│   │   │   └── hooks/usePlays.js
│   │   ├── friends/
│   │   │   ├── components/FriendAvatar.jsx
│   │   │   ├── components/FriendsList.jsx
│   │   │   ├── components/FriendStatsModal.jsx
│   │   │   └── hooks/useFriends.js
│   │   └── dashboard/
│   │       ├── components/StatWidget.jsx
│   │       ├── components/PlaysBarChart.jsx
│   │       ├── components/RecentPlaysList.jsx
│   │       ├── components/FriendsRanking.jsx
│   │       └── hooks/useStats.js
│   ├── layout/
│   │   ├── Sidebar.jsx
│   │   └── Layout.jsx
│   ├── pages/
│   │   ├── Dashboard.jsx
│   │   ├── Collection.jsx
│   │   ├── BGGSearch.jsx
│   │   ├── GameDetail.jsx
│   │   ├── Plays.jsx
│   │   ├── NewPlay.jsx
│   │   └── Friends.jsx
│   └── onboarding/
│       └── OnboardingModal.jsx
```

---

## Task 1: Project Scaffold

**Files:** `package.json`, `vite.config.js`, `tailwind.config.js`, `postcss.config.js`, `index.html`, `src/main.jsx`

- [ ] **Step 1: Scaffold Vite + React project inside AppBoardGame/**

```bash
cd f:/Claude/AppBoardGame
npm create vite@latest . -- --template react
```
Select: React → JavaScript. When asked about existing files, overwrite.

- [ ] **Step 2: Install dependencies**

```bash
npm install react-router-dom@6 zustand recharts lucide-react nanoid date-fns
npm install -D tailwindcss@3 postcss autoprefixer
npx tailwindcss init -p
```

- [ ] **Step 3: Configure vite.config.js**

```js
// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/los-juegos-de-santi/',
})
```

- [ ] **Step 4: Configure tailwind.config.js**

```js
// tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ludo: {
          beige:  '#F5ECD7',
          brown:  '#3D2B1F',
          orange: '#C4622D',
          olive:  '#6B7C45',
          cream:  '#FDF6E3',
        },
      },
      fontFamily: {
        display: ['"Fraunces"', 'serif'],
        body:    ['"DM Sans"', 'sans-serif'],
      },
      boxShadow: {
        warm:    '0 2px 12px rgba(61,43,31,0.12)',
        'warm-lg':'0 4px 24px rgba(61,43,31,0.18)',
      },
    },
  },
  plugins: [],
}
```

- [ ] **Step 5: Replace index.html**

```html
<!doctype html>
<html lang="es">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Los Juegos de Santi</title>
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="https://fonts.googleapis.com/css2?family=Fraunces:ital,wght@0,400;0,600;0,700;1,400&family=DM+Sans:wght@400;500;600&display=swap" rel="stylesheet" />
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>
```

- [ ] **Step 6: Replace src/main.jsx**

```jsx
// src/main.jsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
```

- [ ] **Step 7: Commit**

```bash
git init
git add .
git commit -m "feat: scaffold Vite + React + Tailwind project"
```

---

## Task 2: CSS Design System

**Files:** `src/index.css`

- [ ] **Step 1: Replace src/index.css**

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --color-beige:  #F5ECD7;
    --color-brown:  #3D2B1F;
    --color-orange: #C4622D;
    --color-olive:  #6B7C45;
    --color-cream:  #FDF6E3;
  }

  html {
    font-family: 'DM Sans', sans-serif;
    background-color: var(--color-cream);
    color: var(--color-brown);
  }

  h1, h2, h3, h4 {
    font-family: 'Fraunces', serif;
  }

  /* Subtle paper texture via noise SVG */
  body::before {
    content: '';
    position: fixed;
    inset: 0;
    pointer-events: none;
    z-index: 0;
    opacity: 0.025;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
    background-repeat: repeat;
    background-size: 200px 200px;
  }

  #root {
    position: relative;
    z-index: 1;
  }

  /* Scrollbar */
  ::-webkit-scrollbar { width: 6px; }
  ::-webkit-scrollbar-track { background: var(--color-beige); }
  ::-webkit-scrollbar-thumb { background: rgba(61,43,31,0.3); border-radius: 3px; }
}

@layer components {
  .card {
    @apply bg-white rounded-xl border border-ludo-brown/10 shadow-warm;
  }

  .btn-primary {
    @apply bg-ludo-orange text-white font-medium px-4 py-2 rounded-lg
           hover:bg-ludo-brown transition-colors duration-150 shadow-warm
           active:scale-95;
  }

  .btn-secondary {
    @apply bg-ludo-beige text-ludo-brown font-medium px-4 py-2 rounded-lg
           hover:bg-ludo-brown/10 transition-colors duration-150
           active:scale-95;
  }

  .btn-ghost {
    @apply text-ludo-brown/70 font-medium px-3 py-2 rounded-lg
           hover:bg-ludo-brown/8 transition-colors duration-150;
  }

  .input {
    @apply w-full bg-white border border-ludo-brown/20 rounded-lg px-3 py-2
           text-ludo-brown placeholder:text-ludo-brown/40
           focus:outline-none focus:ring-2 focus:ring-ludo-orange/40
           focus:border-ludo-orange transition-colors;
  }

  .badge {
    @apply inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium;
  }

  .badge-owned    { @apply bg-ludo-olive/15 text-ludo-olive; }
  .badge-wishlist { @apply bg-ludo-orange/15 text-ludo-orange; }
  .badge-played   { @apply bg-ludo-brown/15 text-ludo-brown; }

  .page-title {
    @apply font-display text-2xl font-bold text-ludo-brown;
  }

  .section-title {
    @apply font-display text-lg font-semibold text-ludo-brown;
  }
}
```

- [ ] **Step 2: Commit**

```bash
git add src/index.css tailwind.config.js
git commit -m "feat: add CSS design system and Tailwind tokens"
```

---

## Task 3: Base UI Components

**Files:** `src/components/Button.jsx`, `src/components/Badge.jsx`, `src/components/Modal.jsx`, `src/components/EmptyState.jsx`

- [ ] **Step 1: Create src/components/Button.jsx**

```jsx
// src/components/Button.jsx
export function Button({ children, variant = 'primary', size = 'md', className = '', ...props }) {
  const base = 'inline-flex items-center gap-2 font-medium rounded-lg transition-colors duration-150 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed'
  const variants = {
    primary:   'bg-ludo-orange text-white hover:bg-ludo-brown shadow-warm',
    secondary: 'bg-ludo-beige text-ludo-brown hover:bg-ludo-brown/10',
    ghost:     'text-ludo-brown/70 hover:bg-ludo-brown/8',
    danger:    'bg-red-500 text-white hover:bg-red-600',
  }
  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-5 py-2.5 text-base',
  }
  return (
    <button
      className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}
```

- [ ] **Step 2: Create src/components/Badge.jsx**

```jsx
// src/components/Badge.jsx
const STATUS_LABELS = {
  owned:    'Lo tengo',
  wishlist: 'Lo quiero',
  played:   'Lo jugué',
}

const STATUS_CLASSES = {
  owned:    'badge-owned',
  wishlist: 'badge-wishlist',
  played:   'badge-played',
}

export function StatusBadge({ status }) {
  return (
    <span className={`badge ${STATUS_CLASSES[status] || 'badge-played'}`}>
      {STATUS_LABELS[status] || status}
    </span>
  )
}

export function Badge({ children, className = '' }) {
  return (
    <span className={`badge bg-ludo-brown/10 text-ludo-brown ${className}`}>
      {children}
    </span>
  )
}
```

- [ ] **Step 3: Create src/components/Modal.jsx**

```jsx
// src/components/Modal.jsx
import { useEffect } from 'react'
import { X } from 'lucide-react'

export function Modal({ isOpen, onClose, title, children, size = 'md' }) {
  useEffect(() => {
    if (!isOpen) return
    const handler = (e) => e.key === 'Escape' && onClose()
    document.addEventListener('keydown', handler)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', handler)
      document.body.style.overflow = ''
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  const sizes = { sm: 'max-w-sm', md: 'max-w-md', lg: 'max-w-lg', xl: 'max-w-xl' }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-ludo-brown/40 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className={`relative bg-ludo-cream rounded-2xl shadow-warm-lg w-full ${sizes[size]} max-h-[90vh] overflow-y-auto`}>
        {title && (
          <div className="flex items-center justify-between p-5 border-b border-ludo-brown/10">
            <h2 className="font-display text-lg font-semibold text-ludo-brown">{title}</h2>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg hover:bg-ludo-brown/8 text-ludo-brown/60 transition-colors"
            >
              <X size={18} />
            </button>
          </div>
        )}
        <div className="p-5">{children}</div>
      </div>
    </div>
  )
}
```

- [ ] **Step 4: Create src/components/EmptyState.jsx**

```jsx
// src/components/EmptyState.jsx
export function EmptyState({ icon, title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
      {icon && (
        <div className="text-5xl mb-4">{icon}</div>
      )}
      <h3 className="font-display text-xl font-semibold text-ludo-brown mb-2">{title}</h3>
      {description && (
        <p className="text-ludo-brown/60 mb-6 max-w-xs">{description}</p>
      )}
      {action}
    </div>
  )
}
```

- [ ] **Step 5: Commit**

```bash
git add src/components/
git commit -m "feat: add base UI components (Button, Badge, Modal, EmptyState)"
```

---

## Task 4: Lib Layer

**Files:** `src/lib/utils.js`, `src/lib/db.js`, `src/lib/store.js`, `src/lib/bgg.js`

- [ ] **Step 1: Create src/lib/utils.js**

```js
// src/lib/utils.js
import { nanoid } from 'nanoid'
import { format, formatDistanceToNow } from 'date-fns'
import { es } from 'date-fns/locale'

export const generateId = () => nanoid()

export function formatDate(dateStr) {
  if (!dateStr) return ''
  return format(new Date(dateStr), "d 'de' MMMM 'de' yyyy", { locale: es })
}

export function formatDateShort(dateStr) {
  if (!dateStr) return ''
  return format(new Date(dateStr), 'dd/MM/yyyy')
}

export function formatRelative(dateStr) {
  if (!dateStr) return ''
  return formatDistanceToNow(new Date(dateStr), { locale: es, addSuffix: true })
}

const AVATAR_COLORS = [
  '#C4622D', '#6B7C45', '#8B5E3C', '#4A7C8E', '#9B6B9E',
  '#C4943D', '#5E8B6B', '#7C4A6B', '#8E7C4A', '#4A6B8E',
]

export function generateColor(seed) {
  let hash = 0
  for (let i = 0; i < seed.length; i++) {
    hash = seed.charCodeAt(i) + ((hash << 5) - hash)
  }
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length]
}

export function truncate(str, maxLen = 200) {
  if (!str || str.length <= maxLen) return str
  return str.slice(0, maxLen).trimEnd() + '…'
}
```

- [ ] **Step 2: Create src/lib/db.js**

```js
// src/lib/db.js
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
```

- [ ] **Step 3: Create src/lib/store.js**

```js
// src/lib/store.js
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { generateId, generateColor } from './utils'

export const useStore = create(
  persist(
    (set, get) => ({
      // State
      me: null,       // { name, color }
      games: [],      // array of game objects
      plays: [],      // array of play objects
      friends: [],    // array of friend objects

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
    }
  )
)
```

- [ ] **Step 4: Create src/lib/bgg.js**

```js
// src/lib/bgg.js
const BGG_PROXY = 'https://api.allorigins.win/raw?url='

async function bggFetch(url) {
  const proxied = BGG_PROXY + encodeURIComponent(url)
  const res = await fetch(proxied)
  if (!res.ok) throw new Error(`BGG request failed: ${res.status}`)
  const text = await res.text()
  const parser = new DOMParser()
  const xml = parser.parseFromString(text, 'text/xml')
  if (xml.querySelector('parsererror')) throw new Error('Invalid XML response')
  return xml
}

export async function searchBGG(query) {
  const url = `https://boardgamegeek.com/xmlapi2/search?query=${encodeURIComponent(query)}&type=boardgame`
  const xml = await bggFetch(url)
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
  const url = `https://boardgamegeek.com/xmlapi2/thing?id=${id}&stats=1`
  const xml = await bggFetch(url)
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
```

- [ ] **Step 5: Commit**

```bash
git add src/lib/
git commit -m "feat: add lib layer (store, bgg, db, utils)"
```

---

## Task 5: App Layout & Routing

**Files:** `src/layout/Sidebar.jsx`, `src/layout/Layout.jsx`, `src/App.jsx`

- [ ] **Step 1: Create src/layout/Sidebar.jsx**

```jsx
// src/layout/Sidebar.jsx
import { NavLink } from 'react-router-dom'
import { LayoutDashboard, Library, Dices, Users, Settings } from 'lucide-react'

const NAV = [
  { to: '/',         icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/coleccion',icon: Library,         label: 'Colección' },
  { to: '/partidas', icon: Dices,           label: 'Partidas' },
  { to: '/amigos',   icon: Users,           label: 'Amigos' },
]

export function Sidebar() {
  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden md:flex flex-col w-52 shrink-0 bg-ludo-beige border-r border-ludo-brown/10 min-h-screen">
        <div className="p-5 border-b border-ludo-brown/10">
          <h1 className="font-display text-base font-bold text-ludo-brown leading-tight">
            Los Juegos<br />de Santi
          </h1>
        </div>
        <nav className="flex-1 p-3 flex flex-col gap-1">
          {NAV.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-ludo-orange text-white'
                    : 'text-ludo-brown hover:bg-ludo-brown/8'
                }`
              }
            >
              <Icon size={18} />
              {label}
            </NavLink>
          ))}
        </nav>
      </aside>

      {/* Mobile bottom nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-ludo-beige border-t border-ludo-brown/10 flex">
        {NAV.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              `flex-1 flex flex-col items-center gap-1 py-3 text-xs font-medium transition-colors ${
                isActive ? 'text-ludo-orange' : 'text-ludo-brown/60'
              }`
            }
          >
            <Icon size={20} />
            {label}
          </NavLink>
        ))}
      </nav>
    </>
  )
}
```

- [ ] **Step 2: Create src/layout/Layout.jsx**

```jsx
// src/layout/Layout.jsx
import { Sidebar } from './Sidebar'

export function Layout({ children }) {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 min-w-0 pb-20 md:pb-0">
        {children}
      </main>
    </div>
  )
}
```

- [ ] **Step 3: Create src/App.jsx**

```jsx
// src/App.jsx
import { HashRouter, Routes, Route } from 'react-router-dom'
import { Layout } from './layout/Layout'
import { OnboardingModal } from './onboarding/OnboardingModal'
import { useStore } from './lib/store'
import Dashboard  from './pages/Dashboard'
import Collection from './pages/Collection'
import BGGSearch  from './pages/BGGSearch'
import GameDetail from './pages/GameDetail'
import Plays      from './pages/Plays'
import NewPlay    from './pages/NewPlay'
import Friends    from './pages/Friends'

export default function App() {
  const me = useStore((s) => s.me)

  return (
    <HashRouter>
      {!me && <OnboardingModal />}
      <Layout>
        <Routes>
          <Route path="/"                   element={<Dashboard />} />
          <Route path="/coleccion"          element={<Collection />} />
          <Route path="/coleccion/buscar"   element={<BGGSearch />} />
          <Route path="/juego/:bggId"       element={<GameDetail />} />
          <Route path="/partidas"           element={<Plays />} />
          <Route path="/partidas/nueva"     element={<NewPlay />} />
          <Route path="/amigos"             element={<Friends />} />
        </Routes>
      </Layout>
    </HashRouter>
  )
}
```

- [ ] **Step 4: Create placeholder pages (so routing doesn't crash)**

Create each of these with a minimal placeholder — they'll be replaced in later tasks:

```jsx
// src/pages/Dashboard.jsx
export default function Dashboard() { return <div className="p-6"><h1 className="page-title">Dashboard</h1></div> }
```
```jsx
// src/pages/Collection.jsx
export default function Collection() { return <div className="p-6"><h1 className="page-title">Colección</h1></div> }
```
```jsx
// src/pages/BGGSearch.jsx
export default function BGGSearch() { return <div className="p-6"><h1 className="page-title">Buscar en BGG</h1></div> }
```
```jsx
// src/pages/GameDetail.jsx
export default function GameDetail() { return <div className="p-6"><h1 className="page-title">Detalle</h1></div> }
```
```jsx
// src/pages/Plays.jsx
export default function Plays() { return <div className="p-6"><h1 className="page-title">Partidas</h1></div> }
```
```jsx
// src/pages/NewPlay.jsx
export default function NewPlay() { return <div className="p-6"><h1 className="page-title">Nueva Partida</h1></div> }
```
```jsx
// src/pages/Friends.jsx
export default function Friends() { return <div className="p-6"><h1 className="page-title">Amigos</h1></div> }
```

- [ ] **Step 5: Verify app runs**

```bash
npm run dev
```
Open http://localhost:5173/los-juegos-de-santi/ — should see the sidebar and "Dashboard" text. No errors in console.

- [ ] **Step 6: Commit**

```bash
git add src/
git commit -m "feat: add layout shell, routing, and placeholder pages"
```

---

## Task 6: Onboarding

**Files:** `src/onboarding/OnboardingModal.jsx`

- [ ] **Step 1: Create src/onboarding/OnboardingModal.jsx**

```jsx
// src/onboarding/OnboardingModal.jsx
import { useState } from 'react'
import { useStore } from '../lib/store'
import { Button } from '../components/Button'

export function OnboardingModal() {
  const [name, setName] = useState('')
  const setMe = useStore((s) => s.setMe)

  const handleSubmit = (e) => {
    e.preventDefault()
    const trimmed = name.trim()
    if (!trimmed) return
    setMe({ name: trimmed, color: '#C4622D' })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ludo-brown/50 backdrop-blur-sm">
      <div className="bg-ludo-cream rounded-2xl shadow-warm-lg p-8 w-full max-w-sm text-center">
        <div className="text-5xl mb-4">🎲</div>
        <h1 className="font-display text-2xl font-bold text-ludo-brown mb-2">
          ¡Bienvenido!
        </h1>
        <p className="text-ludo-brown/60 mb-6">
          Antes de empezar, ¿cómo te llamás?
        </p>
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <input
            className="input text-center text-lg"
            placeholder="Tu nombre"
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoFocus
            maxLength={30}
          />
          <Button type="submit" disabled={!name.trim()} className="w-full justify-center">
            Empezar
          </Button>
        </form>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Verify**

```bash
npm run dev
```
Clear localStorage in DevTools → refresh → onboarding modal should appear. Enter a name → modal disappears and app loads.

- [ ] **Step 3: Commit**

```bash
git add src/onboarding/
git commit -m "feat: add onboarding modal for first visit"
```

---

## Task 7: BGG Search Feature

**Files:** `src/features/bgg-search/hooks/useBGGSearch.js`, `src/features/bgg-search/components/SearchBar.jsx`, `src/features/bgg-search/components/SearchResultsList.jsx`, `src/features/bgg-search/components/GamePreviewCard.jsx`, `src/pages/BGGSearch.jsx`

- [ ] **Step 1: Create src/features/bgg-search/hooks/useBGGSearch.js**

```js
// src/features/bgg-search/hooks/useBGGSearch.js
import { useState, useCallback } from 'react'
import { searchBGG, getBGGGame } from '../../../lib/bgg'

export function useBGGSearch() {
  const [query, setQuery]       = useState('')
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

  return { query, setQuery, results, selected, setSelected, loading, error, search, selectGame }
}
```

- [ ] **Step 2: Create src/features/bgg-search/components/SearchBar.jsx**

```jsx
// src/features/bgg-search/components/SearchBar.jsx
import { useState } from 'react'
import { Search } from 'lucide-react'
import { Button } from '../../../components/Button'

export function SearchBar({ onSearch, loading }) {
  const [value, setValue] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    onSearch(value)
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <div className="relative flex-1">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-ludo-brown/40" />
        <input
          className="input pl-9"
          placeholder="Buscá un juego en BoardGameGeek…"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          autoFocus
        />
      </div>
      <Button type="submit" disabled={!value.trim() || loading}>
        {loading ? 'Buscando…' : 'Buscar'}
      </Button>
    </form>
  )
}
```

- [ ] **Step 3: Create src/features/bgg-search/components/SearchResultsList.jsx**

```jsx
// src/features/bgg-search/components/SearchResultsList.jsx
import { ChevronRight } from 'lucide-react'

export function SearchResultsList({ results, onSelect, loading }) {
  if (loading) {
    return (
      <div className="flex justify-center py-12 text-ludo-brown/40">
        Cargando resultados…
      </div>
    )
  }

  if (!results.length) return null

  return (
    <div className="card divide-y divide-ludo-brown/8 overflow-hidden">
      {results.map((r) => (
        <button
          key={r.bggId}
          onClick={() => onSelect(r.bggId)}
          className="w-full flex items-center justify-between px-4 py-3 hover:bg-ludo-beige/60 transition-colors text-left"
        >
          <div>
            <div className="font-medium text-ludo-brown text-sm">{r.name}</div>
            {r.yearPublished && (
              <div className="text-xs text-ludo-brown/50">{r.yearPublished}</div>
            )}
          </div>
          <ChevronRight size={16} className="text-ludo-brown/30 shrink-0" />
        </button>
      ))}
    </div>
  )
}
```

- [ ] **Step 4: Create src/features/bgg-search/components/GamePreviewCard.jsx**

```jsx
// src/features/bgg-search/components/GamePreviewCard.jsx
import { useState } from 'react'
import { Users, Clock, Star, Trophy, ArrowLeft } from 'lucide-react'
import { Button } from '../../../components/Button'
import { StatusBadge } from '../../../components/Badge'
import { useStore } from '../../../lib/store'
import { truncate } from '../../../lib/utils'

const STATUS_OPTIONS = [
  { value: 'owned',    label: 'Lo tengo' },
  { value: 'wishlist', label: 'Lo quiero' },
  { value: 'played',   label: 'Lo jugué' },
]

export function GamePreviewCard({ game, onBack }) {
  const [expanded, setExpanded] = useState(false)
  const { games, addGame, updateGameStatus } = useStore()
  const existing = games.find(g => g.bggId === game.bggId)

  const handleAdd = (status) => {
    addGame({ ...game, status })
  }

  const handleChangeStatus = (status) => {
    updateGameStatus(game.bggId, status)
  }

  return (
    <div className="space-y-4">
      <button
        onClick={onBack}
        className="flex items-center gap-1 text-sm text-ludo-brown/60 hover:text-ludo-brown transition-colors"
      >
        <ArrowLeft size={14} /> Volver a resultados
      </button>

      <div className="card overflow-hidden">
        {game.image && (
          <img
            src={game.image}
            alt={game.name}
            className="w-full h-56 object-contain bg-ludo-beige/50"
          />
        )}
        <div className="p-5 space-y-4">
          <div>
            <h2 className="font-display text-xl font-bold text-ludo-brown">{game.name}</h2>
            {game.yearPublished && (
              <p className="text-sm text-ludo-brown/50">{game.yearPublished}</p>
            )}
          </div>

          <div className="flex flex-wrap gap-4 text-sm text-ludo-brown/70">
            {game.minPlayers && (
              <span className="flex items-center gap-1.5">
                <Users size={14} />
                {game.minPlayers}–{game.maxPlayers} jugadores
              </span>
            )}
            {game.playingTime > 0 && (
              <span className="flex items-center gap-1.5">
                <Clock size={14} />
                {game.playingTime} min
              </span>
            )}
            {game.bggRating > 0 && (
              <span className="flex items-center gap-1.5">
                <Star size={14} />
                {game.bggRating}
              </span>
            )}
            {game.bggRank && (
              <span className="flex items-center gap-1.5">
                <Trophy size={14} />
                #{game.bggRank} BGG
              </span>
            )}
          </div>

          {game.description && (
            <div>
              <p className="text-sm text-ludo-brown/70 leading-relaxed">
                {expanded ? game.description : truncate(game.description, 250)}
              </p>
              {game.description.length > 250 && (
                <button
                  onClick={() => setExpanded(!expanded)}
                  className="text-sm text-ludo-orange hover:underline mt-1"
                >
                  {expanded ? 'Ver menos' : 'Ver más'}
                </button>
              )}
            </div>
          )}

          {existing ? (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-sm text-ludo-brown/60">Ya está en tu colección:</span>
                <StatusBadge status={existing.status} />
              </div>
              <div className="flex gap-2 flex-wrap">
                {STATUS_OPTIONS.filter(o => o.value !== existing.status).map(o => (
                  <Button key={o.value} variant="secondary" size="sm" onClick={() => handleChangeStatus(o.value)}>
                    Cambiar a "{o.label}"
                  </Button>
                ))}
              </div>
            </div>
          ) : (
            <div className="flex gap-2 flex-wrap">
              {STATUS_OPTIONS.map(o => (
                <Button key={o.value} variant={o.value === 'owned' ? 'primary' : 'secondary'} size="sm" onClick={() => handleAdd(o.value)}>
                  {o.label}
                </Button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
```

- [ ] **Step 5: Replace src/pages/BGGSearch.jsx**

```jsx
// src/pages/BGGSearch.jsx
import { useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { useBGGSearch } from '../features/bgg-search/hooks/useBGGSearch'
import { SearchBar } from '../features/bgg-search/components/SearchBar'
import { SearchResultsList } from '../features/bgg-search/components/SearchResultsList'
import { GamePreviewCard } from '../features/bgg-search/components/GamePreviewCard'

export default function BGGSearch() {
  const navigate = useNavigate()
  const { results, selected, setSelected, loading, error, search, selectGame } = useBGGSearch()

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate('/coleccion')}
          className="p-2 rounded-lg hover:bg-ludo-brown/8 text-ludo-brown/60 transition-colors"
        >
          <ArrowLeft size={18} />
        </button>
        <h1 className="page-title">Buscar juego</h1>
      </div>

      {!selected && (
        <>
          <SearchBar onSearch={search} loading={loading} />
          {error && (
            <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-3">
              {error}
            </p>
          )}
          <SearchResultsList results={results} onSelect={selectGame} loading={loading && results.length === 0} />
        </>
      )}

      {selected && (
        <GamePreviewCard
          game={selected}
          onBack={() => setSelected(null)}
        />
      )}
    </div>
  )
}
```

- [ ] **Step 6: Verify**

```bash
npm run dev
```
Navigate to Colección → click "+" FAB (not built yet, go directly to `/#/coleccion/buscar`) → search "Dune" → click a result → see game card with add buttons.

- [ ] **Step 7: Commit**

```bash
git add src/features/bgg-search/ src/pages/BGGSearch.jsx
git commit -m "feat: add BGG search feature"
```

---

## Task 8: Collection Feature

**Files:** `src/features/collection/hooks/useCollection.js`, `src/features/collection/components/GameCard.jsx`, `src/features/collection/components/GameFilters.jsx`, `src/pages/Collection.jsx`

- [ ] **Step 1: Create src/features/collection/hooks/useCollection.js**

```js
// src/features/collection/hooks/useCollection.js
import { useState, useMemo } from 'react'
import { useStore } from '../../../lib/store'

export function useCollection() {
  const { games, updateGameStatus, removeGame } = useStore()
  const [search, setSearch]     = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [sortBy, setSortBy]     = useState('rank')

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
```

- [ ] **Step 2: Create src/features/collection/components/GameCard.jsx**

```jsx
// src/features/collection/components/GameCard.jsx
import { useNavigate } from 'react-router-dom'
import { Trophy, Star } from 'lucide-react'
import { StatusBadge } from '../../../components/Badge'

export function GameCard({ game }) {
  const navigate = useNavigate()
  return (
    <div
      onClick={() => navigate(`/juego/${game.bggId}`)}
      className="card overflow-hidden cursor-pointer group transition-all duration-200 hover:-translate-y-1 hover:shadow-warm-lg"
    >
      <div className="aspect-square overflow-hidden bg-ludo-beige/50">
        {game.thumbnail ? (
          <img
            src={game.thumbnail}
            alt={game.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-4xl text-ludo-brown/20">
            🎲
          </div>
        )}
      </div>
      <div className="p-3 space-y-2">
        <h3 className="font-display font-semibold text-ludo-brown text-sm leading-tight line-clamp-2">
          {game.name}
        </h3>
        <div className="flex items-center justify-between">
          <StatusBadge status={game.status} />
          <div className="flex items-center gap-2 text-xs text-ludo-brown/50">
            {game.bggRank && (
              <span className="flex items-center gap-0.5">
                <Trophy size={10} />#{game.bggRank}
              </span>
            )}
            {game.bggRating > 0 && (
              <span className="flex items-center gap-0.5">
                <Star size={10} />{game.bggRating}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
```

- [ ] **Step 3: Create src/features/collection/components/GameFilters.jsx**

```jsx
// src/features/collection/components/GameFilters.jsx
import { Search } from 'lucide-react'

const STATUS_OPTIONS = [
  { value: 'all',      label: 'Todos' },
  { value: 'owned',    label: 'Lo tengo' },
  { value: 'wishlist', label: 'Lo quiero' },
  { value: 'played',   label: 'Lo jugué' },
]

const SORT_OPTIONS = [
  { value: 'rank',  label: 'Ranking BGG' },
  { value: 'name',  label: 'Nombre' },
  { value: 'added', label: 'Recién agregado' },
]

export function GameFilters({ search, onSearch, statusFilter, onStatusFilter, sortBy, onSort }) {
  return (
    <div className="flex flex-col sm:flex-row gap-3">
      <div className="relative flex-1">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-ludo-brown/40" />
        <input
          className="input pl-8 text-sm"
          placeholder="Buscar en mi colección…"
          value={search}
          onChange={(e) => onSearch(e.target.value)}
        />
      </div>
      <select
        className="input text-sm w-auto"
        value={statusFilter}
        onChange={(e) => onStatusFilter(e.target.value)}
      >
        {STATUS_OPTIONS.map(o => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
      <select
        className="input text-sm w-auto"
        value={sortBy}
        onChange={(e) => onSort(e.target.value)}
      >
        {SORT_OPTIONS.map(o => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
    </div>
  )
}
```

- [ ] **Step 4: Replace src/pages/Collection.jsx**

```jsx
// src/pages/Collection.jsx
import { useNavigate } from 'react-router-dom'
import { Plus } from 'lucide-react'
import { useCollection } from '../features/collection/hooks/useCollection'
import { GameCard } from '../features/collection/components/GameCard'
import { GameFilters } from '../features/collection/components/GameFilters'
import { EmptyState } from '../components/EmptyState'
import { Button } from '../components/Button'

export default function Collection() {
  const navigate = useNavigate()
  const {
    filtered, search, setSearch,
    statusFilter, setStatusFilter,
    sortBy, setSortBy,
  } = useCollection()

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="page-title">Mi colección</h1>
        <Button onClick={() => navigate('/coleccion/buscar')}>
          <Plus size={16} /> Agregar
        </Button>
      </div>

      <GameFilters
        search={search}
        onSearch={setSearch}
        statusFilter={statusFilter}
        onStatusFilter={setStatusFilter}
        sortBy={sortBy}
        onSort={setSortBy}
      />

      {filtered.length === 0 ? (
        <EmptyState
          icon="🎲"
          title="Todavía no tenés juegos"
          description="Buscá en BoardGameGeek y agregá tu primer juego."
          action={
            <Button onClick={() => navigate('/coleccion/buscar')}>
              Buscar mi primer juego
            </Button>
          }
        />
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {filtered.map(game => (
            <GameCard key={game.bggId} game={game} />
          ))}
        </div>
      )}
    </div>
  )
}
```

- [ ] **Step 5: Commit**

```bash
git add src/features/collection/ src/pages/Collection.jsx
git commit -m "feat: add collection feature with filtering and sorting"
```

---

## Task 9: Game Detail Page

**Files:** `src/pages/GameDetail.jsx`

- [ ] **Step 1: Replace src/pages/GameDetail.jsx**

```jsx
// src/pages/GameDetail.jsx
import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Users, Clock, Star, Trophy, Plus } from 'lucide-react'
import { useStore } from '../lib/store'
import { getBGGGame } from '../lib/bgg'
import { StatusBadge } from '../components/Badge'
import { Button } from '../components/Button'
import { formatDate } from '../lib/utils'

const STATUS_OPTIONS = [
  { value: 'owned',    label: 'Lo tengo' },
  { value: 'wishlist', label: 'Lo quiero' },
  { value: 'played',   label: 'Lo jugué' },
]

export default function GameDetail() {
  const { bggId } = useParams()
  const navigate  = useNavigate()
  const { games, plays, updateGameStatus } = useStore()

  const savedGame    = games.find(g => g.bggId === bggId)
  const gamePlays    = plays.filter(p => p.bggId === bggId)
    .sort((a, b) => new Date(b.playedAt) - new Date(a.playedAt))

  const [bggData, setBggData]   = useState(savedGame || null)
  const [expanded, setExpanded] = useState(false)
  const [loading, setLoading]   = useState(!savedGame)
  const [error, setError]       = useState(null)

  useEffect(() => {
    if (savedGame?.description) return
    setLoading(true)
    getBGGGame(bggId)
      .then(setBggData)
      .catch(() => setError('No se pudo cargar la info del juego.'))
      .finally(() => setLoading(false))
  }, [bggId])

  const game = bggData || savedGame
  if (!game && loading) return <div className="p-6 text-ludo-brown/50">Cargando…</div>
  if (!game) return <div className="p-6 text-ludo-brown/50">{error || 'Juego no encontrado.'}</div>

  // Stats: who won most
  const winCounts = {}
  gamePlays.forEach(p => {
    p.players.filter(pl => pl.winner).forEach(pl => {
      winCounts[pl.name] = (winCounts[pl.name] || 0) + 1
    })
  })
  const topWinner = Object.entries(winCounts).sort((a, b) => b[1] - a[1])[0]

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-1 text-sm text-ludo-brown/60 hover:text-ludo-brown"
      >
        <ArrowLeft size={14} /> Volver
      </button>

      {/* Hero */}
      <div className="card overflow-hidden">
        {game.image && (
          <img src={game.image} alt={game.name} className="w-full h-64 object-contain bg-ludo-beige/40" />
        )}
        <div className="p-5 space-y-3">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h1 className="font-display text-2xl font-bold text-ludo-brown">{game.name}</h1>
              {game.yearPublished && <p className="text-sm text-ludo-brown/50">{game.yearPublished}</p>}
            </div>
            {savedGame && <StatusBadge status={savedGame.status} />}
          </div>

          <div className="flex flex-wrap gap-4 text-sm text-ludo-brown/60">
            {game.minPlayers && <span className="flex items-center gap-1"><Users size={14}/>{game.minPlayers}–{game.maxPlayers} jugadores</span>}
            {game.playingTime > 0 && <span className="flex items-center gap-1"><Clock size={14}/>{game.playingTime} min</span>}
            {game.bggRating > 0 && <span className="flex items-center gap-1"><Star size={14}/>{game.bggRating}</span>}
            {game.bggRank && <span className="flex items-center gap-1"><Trophy size={14}/>#{game.bggRank} BGG</span>}
          </div>

          {game.description && (
            <div>
              <p className="text-sm text-ludo-brown/70 leading-relaxed whitespace-pre-line">
                {expanded ? game.description : game.description.slice(0, 300) + (game.description.length > 300 ? '…' : '')}
              </p>
              {game.description.length > 300 && (
                <button onClick={() => setExpanded(!expanded)} className="text-sm text-ludo-orange hover:underline mt-1">
                  {expanded ? 'Ver menos' : 'Ver más'}
                </button>
              )}
            </div>
          )}

          {/* Change status */}
          {savedGame && (
            <div className="flex gap-2 flex-wrap pt-1">
              {STATUS_OPTIONS.filter(o => o.value !== savedGame.status).map(o => (
                <Button key={o.value} variant="secondary" size="sm" onClick={() => updateGameStatus(bggId, o.value)}>
                  {o.label}
                </Button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Quick stats */}
      {gamePlays.length > 0 && (
        <div className="grid grid-cols-2 gap-4">
          <div className="card p-4 text-center">
            <div className="font-display text-3xl font-bold text-ludo-orange">{gamePlays.length}</div>
            <div className="text-xs text-ludo-brown/60 mt-1">veces jugado</div>
          </div>
          <div className="card p-4 text-center">
            <div className="font-display text-xl font-bold text-ludo-brown">{topWinner?.[0] || '—'}</div>
            <div className="text-xs text-ludo-brown/60 mt-1">
              {topWinner ? `ganó ${topWinner[1]} ${topWinner[1] === 1 ? 'vez' : 'veces'}` : 'sin partidas'}
            </div>
          </div>
        </div>
      )}

      {/* Play history */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="section-title">Partidas</h2>
          <Button size="sm" onClick={() => navigate(`/partidas/nueva?juego=${bggId}`)}>
            <Plus size={14} /> Registrar
          </Button>
        </div>
        {gamePlays.length === 0 ? (
          <p className="text-sm text-ludo-brown/50 text-center py-8">
            Todavía no registraste partidas de este juego.
          </p>
        ) : (
          <div className="space-y-2">
            {gamePlays.map(play => (
              <div key={play.id} className="card p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium text-ludo-brown">{formatDate(play.playedAt)}</p>
                    <p className="text-xs text-ludo-brown/50 mt-0.5">
                      {play.players.map(p => p.winner ? <strong key={p.name}>{p.name} 🏆 </strong> : `${p.name} `)}
                    </p>
                  </div>
                  {play.location && (
                    <span className="text-xs text-ludo-brown/40">{play.location}</span>
                  )}
                </div>
                {play.notes && <p className="text-xs text-ludo-brown/60 mt-2 italic">"{play.notes}"</p>}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add src/pages/GameDetail.jsx
git commit -m "feat: add game detail page with play history and stats"
```

---

## Task 10: New Play Form

**Files:** `src/features/plays/hooks/usePlays.js`, `src/features/plays/components/PlayerRow.jsx`, `src/features/plays/components/PhotoUpload.jsx`, `src/features/plays/components/PlayForm.jsx`, `src/pages/NewPlay.jsx`

- [ ] **Step 1: Create src/features/plays/hooks/usePlays.js**

```js
// src/features/plays/hooks/usePlays.js
import { useStore } from '../../../lib/store'

export function usePlays() {
  const { plays, addPlay, removePlay } = useStore()
  const sorted = [...plays].sort((a, b) => new Date(b.playedAt) - new Date(a.playedAt))
  return { plays: sorted, addPlay, removePlay }
}
```

- [ ] **Step 2: Create src/features/plays/components/PlayerRow.jsx**

```jsx
// src/features/plays/components/PlayerRow.jsx
import { Trash2, Trophy } from 'lucide-react'

export function PlayerRow({ player, index, onChange, onRemove, canRemove }) {
  return (
    <div className="flex items-start gap-3 p-3 bg-ludo-beige/40 rounded-lg">
      <div className="flex-1 space-y-2">
        <p className="text-sm font-medium text-ludo-brown">{player.name}</p>
        <div className="flex gap-2">
          <input
            type="number"
            min="1"
            placeholder="Pos."
            value={player.position}
            onChange={(e) => onChange(index, 'position', e.target.value ? parseInt(e.target.value) : '')}
            className="input text-sm w-20"
          />
          <input
            type="text"
            placeholder="Puntaje (ej: 42 puntos)"
            value={player.score}
            onChange={(e) => onChange(index, 'score', e.target.value)}
            className="input text-sm flex-1"
          />
        </div>
      </div>
      <div className="flex items-center gap-2 pt-1">
        <button
          type="button"
          onClick={() => onChange(index, 'winner', !player.winner)}
          title="Ganador"
          className={`p-2 rounded-lg transition-colors ${
            player.winner
              ? 'bg-ludo-orange text-white'
              : 'bg-ludo-brown/8 text-ludo-brown/40 hover:text-ludo-orange'
          }`}
        >
          <Trophy size={14} />
        </button>
        {canRemove && (
          <button
            type="button"
            onClick={() => onRemove(index)}
            className="p-2 rounded-lg text-ludo-brown/30 hover:text-red-500 hover:bg-red-50 transition-colors"
          >
            <Trash2 size={14} />
          </button>
        )}
      </div>
    </div>
  )
}
```

- [ ] **Step 3: Create src/features/plays/components/PhotoUpload.jsx**

```jsx
// src/features/plays/components/PhotoUpload.jsx
import { useRef } from 'react'
import { Camera, X } from 'lucide-react'

export function PhotoUpload({ preview, onSelect, onClear }) {
  const ref = useRef()

  const handleChange = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => onSelect(ev.target.result)
    reader.readAsDataURL(file)
  }

  return (
    <div>
      {preview ? (
        <div className="relative w-32 h-32">
          <img src={preview} alt="foto" className="w-32 h-32 object-cover rounded-lg border border-ludo-brown/10" />
          <button
            type="button"
            onClick={onClear}
            className="absolute -top-2 -right-2 bg-white border border-ludo-brown/20 rounded-full p-0.5 text-ludo-brown/60 hover:text-red-500"
          >
            <X size={14} />
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => ref.current.click()}
          className="flex items-center gap-2 px-4 py-2 rounded-lg border-2 border-dashed border-ludo-brown/20 text-sm text-ludo-brown/60 hover:border-ludo-orange/50 hover:text-ludo-orange transition-colors"
        >
          <Camera size={16} /> Agregar foto
        </button>
      )}
      <input ref={ref} type="file" accept="image/*" className="hidden" onChange={handleChange} />
    </div>
  )
}
```

- [ ] **Step 4: Create src/features/plays/components/PlayForm.jsx**

```jsx
// src/features/plays/components/PlayForm.jsx
import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Plus, Search } from 'lucide-react'
import { useStore } from '../../../lib/store'
import { savePhoto } from '../../../lib/db'
import { generateId } from '../../../lib/utils'
import { getBGGGame } from '../../../lib/bgg'
import { Button } from '../../../components/Button'
import { Modal } from '../../../components/Modal'
import { PlayerRow } from './PlayerRow'
import { PhotoUpload } from './PhotoUpload'

export function PlayForm() {
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const { me, games, friends, addGame, addFriend, addPlay } = useStore()

  const preselectedBggId = params.get('juego')

  const [selectedGame, setSelectedGame] = useState(
    preselectedBggId ? games.find(g => g.bggId === preselectedBggId) || null : null
  )
  const [gameSearch, setGameSearch]   = useState('')
  const [date, setDate]               = useState(new Date().toISOString().slice(0, 10))
  const [location, setLocation]       = useState('')
  const [notes, setNotes]             = useState('')
  const [photoPreview, setPhotoPreview] = useState(null)
  const [players, setPlayers]         = useState([
    { friendId: null, name: me?.name || 'Yo', isMe: true, position: '', score: '', winner: false },
  ])
  const [showFriendModal, setShowFriendModal] = useState(false)
  const [newFriendName, setNewFriendName]     = useState('')
  const [saving, setSaving]                   = useState(false)

  // If preselected game not in collection, fetch it
  useEffect(() => {
    if (preselectedBggId && !selectedGame) {
      getBGGGame(preselectedBggId).then(setSelectedGame).catch(() => {})
    }
  }, [])

  const filteredGames = games.filter(g =>
    g.name.toLowerCase().includes(gameSearch.toLowerCase())
  )

  const updatePlayer = (idx, field, value) => {
    setPlayers(prev => prev.map((p, i) => i === idx ? { ...p, [field]: value } : p))
  }

  const removePlayer = (idx) => {
    setPlayers(prev => prev.filter((_, i) => i !== idx))
  }

  const addExistingFriend = (friend) => {
    if (players.some(p => p.friendId === friend.id)) return
    setPlayers(prev => [...prev, {
      friendId: friend.id,
      name: friend.name,
      isMe: false,
      position: '',
      score: '',
      winner: false,
    }])
    setShowFriendModal(false)
  }

  const addNewFriend = () => {
    const trimmed = newFriendName.trim()
    if (!trimmed) return
    setPlayers(prev => [...prev, {
      friendId: `new_${generateId()}`,
      name: trimmed,
      isMe: false,
      position: '',
      score: '',
      winner: false,
      _isNew: true,
    }])
    setNewFriendName('')
    setShowFriendModal(false)
  }

  const handleSave = async () => {
    if (!selectedGame) return
    setSaving(true)
    try {
      // Create new friends
      const resolvedPlayers = players.map(p => {
        if (p._isNew) {
          const friend = addFriend(p.name)
          return { ...p, friendId: friend.id, _isNew: undefined }
        }
        return p
      })

      // Auto-add game if not in collection
      if (!games.find(g => g.bggId === selectedGame.bggId)) {
        addGame({ ...selectedGame, status: 'played' })
      }

      // Save photo
      let photoId = null
      if (photoPreview) {
        photoId = await savePhoto(photoPreview)
      }

      addPlay({
        bggId: selectedGame.bggId,
        gameName: selectedGame.name,
        playedAt: new Date(date).toISOString(),
        location: location.trim() || null,
        notes: notes.trim() || null,
        photoId,
        players: resolvedPlayers,
      })

      navigate('/partidas')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="max-w-xl mx-auto p-6 space-y-6">
      <h1 className="page-title">Nueva partida</h1>

      {/* Game selector */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-ludo-brown">Juego *</label>
        {selectedGame ? (
          <div className="flex items-center justify-between p-3 bg-ludo-beige/60 rounded-lg">
            <span className="font-medium text-ludo-brown text-sm">{selectedGame.name}</span>
            <button onClick={() => setSelectedGame(null)} className="text-xs text-ludo-brown/50 hover:text-ludo-orange">Cambiar</button>
          </div>
        ) : (
          <div className="space-y-2">
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-ludo-brown/40" />
              <input
                className="input pl-8 text-sm"
                placeholder="Buscar en mi colección…"
                value={gameSearch}
                onChange={(e) => setGameSearch(e.target.value)}
              />
            </div>
            {filteredGames.length > 0 && (
              <div className="card max-h-48 overflow-y-auto divide-y divide-ludo-brown/8">
                {filteredGames.map(g => (
                  <button
                    key={g.bggId}
                    type="button"
                    onClick={() => setSelectedGame(g)}
                    className="w-full text-left px-4 py-2 text-sm text-ludo-brown hover:bg-ludo-beige/60 transition-colors"
                  >
                    {g.name}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Date */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-ludo-brown">Fecha</label>
        <input type="date" className="input" value={date} onChange={(e) => setDate(e.target.value)} />
      </div>

      {/* Location */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-ludo-brown">Lugar (opcional)</label>
        <input className="input" placeholder="Casa de Santi…" value={location} onChange={(e) => setLocation(e.target.value)} />
      </div>

      {/* Players */}
      <div className="space-y-3">
        <label className="text-sm font-medium text-ludo-brown">Jugadores</label>
        <div className="space-y-2">
          {players.map((p, i) => (
            <PlayerRow
              key={i}
              player={p}
              index={i}
              onChange={updatePlayer}
              onRemove={removePlayer}
              canRemove={!p.isMe}
            />
          ))}
        </div>
        <Button type="button" variant="secondary" size="sm" onClick={() => setShowFriendModal(true)}>
          <Plus size={14} /> Agregar jugador
        </Button>
      </div>

      {/* Notes */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-ludo-brown">Notas (opcional)</label>
        <textarea
          className="input resize-none"
          rows={3}
          placeholder="Fede hizo trampa en la ronda 3…"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />
      </div>

      {/* Photo */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-ludo-brown">Foto (opcional)</label>
        <PhotoUpload
          preview={photoPreview}
          onSelect={setPhotoPreview}
          onClear={() => setPhotoPreview(null)}
        />
      </div>

      <div className="flex gap-3">
        <Button onClick={handleSave} disabled={!selectedGame || saving} className="flex-1 justify-center">
          {saving ? 'Guardando…' : 'Guardar partida'}
        </Button>
        <Button variant="secondary" onClick={() => navigate(-1)}>Cancelar</Button>
      </div>

      {/* Friend picker modal */}
      <Modal isOpen={showFriendModal} onClose={() => setShowFriendModal(false)} title="Agregar jugador">
        <div className="space-y-4">
          {friends.length > 0 && (
            <div className="space-y-1 max-h-48 overflow-y-auto">
              {friends.map(f => (
                <button
                  key={f.id}
                  onClick={() => addExistingFriend(f)}
                  disabled={players.some(p => p.friendId === f.id)}
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-ludo-beige/60 disabled:opacity-40 disabled:cursor-not-allowed transition-colors text-left"
                >
                  <span
                    className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0"
                    style={{ backgroundColor: f.color }}
                  >
                    {f.name[0].toUpperCase()}
                  </span>
                  <span className="text-sm text-ludo-brown">{f.name}</span>
                </button>
              ))}
            </div>
          )}
          <div className="border-t border-ludo-brown/10 pt-3">
            <p className="text-xs text-ludo-brown/50 mb-2">Nuevo amigo</p>
            <div className="flex gap-2">
              <input
                className="input text-sm flex-1"
                placeholder="Nombre…"
                value={newFriendName}
                onChange={(e) => setNewFriendName(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && addNewFriend()}
              />
              <Button size="sm" onClick={addNewFriend} disabled={!newFriendName.trim()}>
                Agregar
              </Button>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  )
}
```

- [ ] **Step 5: Replace src/pages/NewPlay.jsx**

```jsx
// src/pages/NewPlay.jsx
import { PlayForm } from '../features/plays/components/PlayForm'

export default function NewPlay() {
  return <PlayForm />
}
```

- [ ] **Step 6: Commit**

```bash
git add src/features/plays/ src/pages/NewPlay.jsx
git commit -m "feat: add new play form with player management and photo upload"
```

---

## Task 11: Plays List Page

**Files:** `src/features/plays/components/PlayCard.jsx`, `src/pages/Plays.jsx`

- [ ] **Step 1: Create src/features/plays/components/PlayCard.jsx**

```jsx
// src/features/plays/components/PlayCard.jsx
import { useNavigate } from 'react-router-dom'
import { MapPin, Trophy } from 'lucide-react'
import { formatDate } from '../../../lib/utils'

export function PlayCard({ play }) {
  const navigate = useNavigate()
  const winners = play.players.filter(p => p.winner)

  return (
    <div
      onClick={() => navigate(`/juego/${play.bggId}`)}
      className="card p-4 cursor-pointer hover:shadow-warm-lg hover:-translate-y-0.5 transition-all duration-200"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <h3 className="font-display font-semibold text-ludo-brown text-sm truncate">
            {play.gameName}
          </h3>
          <p className="text-xs text-ludo-brown/50 mt-0.5">{formatDate(play.playedAt)}</p>
        </div>
        {play.location && (
          <span className="flex items-center gap-1 text-xs text-ludo-brown/40 shrink-0">
            <MapPin size={11} />{play.location}
          </span>
        )}
      </div>

      <div className="mt-2 flex items-center gap-2 flex-wrap">
        {play.players.map((p, i) => (
          <span
            key={i}
            className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full ${
              p.winner
                ? 'bg-ludo-orange/15 text-ludo-orange font-medium'
                : 'bg-ludo-brown/8 text-ludo-brown/60'
            }`}
          >
            {p.winner && <Trophy size={10} />}
            {p.name}
          </span>
        ))}
      </div>

      {play.notes && (
        <p className="mt-2 text-xs text-ludo-brown/50 italic line-clamp-1">
          "{play.notes}"
        </p>
      )}
    </div>
  )
}
```

- [ ] **Step 2: Replace src/pages/Plays.jsx**

```jsx
// src/pages/Plays.jsx
import { useNavigate } from 'react-router-dom'
import { Plus } from 'lucide-react'
import { usePlays } from '../features/plays/hooks/usePlays'
import { PlayCard } from '../features/plays/components/PlayCard'
import { EmptyState } from '../components/EmptyState'
import { Button } from '../components/Button'

export default function Plays() {
  const navigate = useNavigate()
  const { plays } = usePlays()

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="page-title">Partidas</h1>
        <Button onClick={() => navigate('/partidas/nueva')}>
          <Plus size={16} /> Nueva
        </Button>
      </div>

      {plays.length === 0 ? (
        <EmptyState
          icon="🃏"
          title="Todavía no hay partidas"
          description="Registrá tu primera partida para empezar a llevar el historial."
          action={
            <Button onClick={() => navigate('/partidas/nueva')}>
              Registrar primera partida
            </Button>
          }
        />
      ) : (
        <div className="space-y-3">
          {plays.map(play => (
            <PlayCard key={play.id} play={play} />
          ))}
        </div>
      )}
    </div>
  )
}
```

- [ ] **Step 3: Commit**

```bash
git add src/features/plays/components/PlayCard.jsx src/pages/Plays.jsx
git commit -m "feat: add plays list page"
```

---

## Task 12: Friends Feature

**Files:** `src/features/friends/hooks/useFriends.js`, `src/features/friends/components/FriendAvatar.jsx`, `src/features/friends/components/FriendStatsModal.jsx`, `src/features/friends/components/FriendsList.jsx`, `src/pages/Friends.jsx`

- [ ] **Step 1: Create src/features/friends/hooks/useFriends.js**

```js
// src/features/friends/hooks/useFriends.js
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

      // Top games for this friend
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
```

- [ ] **Step 2: Create src/features/friends/components/FriendAvatar.jsx**

```jsx
// src/features/friends/components/FriendAvatar.jsx
export function FriendAvatar({ friend, size = 'md' }) {
  const sizes = { sm: 'w-7 h-7 text-xs', md: 'w-10 h-10 text-sm', lg: 'w-14 h-14 text-lg' }
  return (
    <div
      className={`${sizes[size]} rounded-full flex items-center justify-center text-white font-bold shrink-0`}
      style={{ backgroundColor: friend.color }}
    >
      {friend.name[0].toUpperCase()}
    </div>
  )
}
```

- [ ] **Step 3: Create src/features/friends/components/FriendStatsModal.jsx**

```jsx
// src/features/friends/components/FriendStatsModal.jsx
import { Modal } from '../../../components/Modal'
import { FriendAvatar } from './FriendAvatar'
import { Trophy, Dices } from 'lucide-react'

export function FriendStatsModal({ friend, isOpen, onClose }) {
  if (!friend) return null
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={friend.name} size="sm">
      <div className="space-y-4">
        <div className="flex items-center gap-4">
          <FriendAvatar friend={friend} size="lg" />
          <div className="grid grid-cols-2 gap-3 flex-1">
            <div className="text-center bg-ludo-beige/50 rounded-lg p-3">
              <div className="font-display text-2xl font-bold text-ludo-brown">{friend.playCount}</div>
              <div className="text-xs text-ludo-brown/50">partidas</div>
            </div>
            <div className="text-center bg-ludo-orange/10 rounded-lg p-3">
              <div className="font-display text-2xl font-bold text-ludo-orange">{friend.wins}</div>
              <div className="text-xs text-ludo-brown/50">victorias</div>
            </div>
          </div>
        </div>

        {friend.topGames.length > 0 && (
          <div>
            <p className="text-xs font-medium text-ludo-brown/50 mb-2">Juegos favoritos</p>
            <div className="space-y-1">
              {friend.topGames.map(g => (
                <div key={g.name} className="flex items-center justify-between text-sm">
                  <span className="text-ludo-brown">{g.name}</span>
                  <span className="text-ludo-brown/40 text-xs">{g.count} {g.count === 1 ? 'vez' : 'veces'}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </Modal>
  )
}
```

- [ ] **Step 4: Create src/features/friends/components/FriendsList.jsx**

```jsx
// src/features/friends/components/FriendsList.jsx
import { Trophy, Dices } from 'lucide-react'
import { FriendAvatar } from './FriendAvatar'

export function FriendsList({ friends, onSelect }) {
  return (
    <div className="space-y-2">
      {friends.map(friend => (
        <button
          key={friend.id}
          onClick={() => onSelect(friend)}
          className="w-full card p-4 flex items-center gap-4 hover:shadow-warm-lg hover:-translate-y-0.5 transition-all duration-200 text-left"
        >
          <FriendAvatar friend={friend} />
          <div className="flex-1 min-w-0">
            <p className="font-medium text-ludo-brown">{friend.name}</p>
            <p className="text-xs text-ludo-brown/50 mt-0.5">
              {friend.playCount} {friend.playCount === 1 ? 'partida' : 'partidas'} juntos
            </p>
          </div>
          <div className="flex items-center gap-1 text-ludo-orange text-sm font-medium">
            <Trophy size={14} />
            {friend.wins}
          </div>
        </button>
      ))}
    </div>
  )
}
```

- [ ] **Step 5: Replace src/pages/Friends.jsx**

```jsx
// src/pages/Friends.jsx
import { useState } from 'react'
import { Plus } from 'lucide-react'
import { useFriends } from '../features/friends/hooks/useFriends'
import { FriendsList } from '../features/friends/components/FriendsList'
import { FriendStatsModal } from '../features/friends/components/FriendStatsModal'
import { EmptyState } from '../components/EmptyState'
import { Button } from '../components/Button'
import { Modal } from '../components/Modal'

export default function Friends() {
  const { friendStats, addFriend } = useFriends()
  const [selected, setSelected]         = useState(null)
  const [showAdd, setShowAdd]           = useState(false)
  const [newName, setNewName]           = useState('')

  const handleAdd = () => {
    const trimmed = newName.trim()
    if (!trimmed) return
    addFriend(trimmed)
    setNewName('')
    setShowAdd(false)
  }

  return (
    <div className="max-w-xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="page-title">Amigos</h1>
        <Button onClick={() => setShowAdd(true)}>
          <Plus size={16} /> Agregar
        </Button>
      </div>

      {friendStats.length === 0 ? (
        <EmptyState
          icon="👥"
          title="Todavía no hay amigos"
          description="Agregá a tus rivales de mesa favoritos."
          action={<Button onClick={() => setShowAdd(true)}>Agregar amigo</Button>}
        />
      ) : (
        <FriendsList friends={friendStats} onSelect={setSelected} />
      )}

      <FriendStatsModal
        friend={selected}
        isOpen={!!selected}
        onClose={() => setSelected(null)}
      />

      <Modal isOpen={showAdd} onClose={() => setShowAdd(false)} title="Nuevo amigo" size="sm">
        <div className="flex gap-2">
          <input
            className="input flex-1"
            placeholder="Nombre…"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
            autoFocus
          />
          <Button onClick={handleAdd} disabled={!newName.trim()}>Agregar</Button>
        </div>
      </Modal>
    </div>
  )
}
```

- [ ] **Step 6: Commit**

```bash
git add src/features/friends/ src/pages/Friends.jsx
git commit -m "feat: add friends feature with stats modal"
```

---

## Task 13: Dashboard & Stats

**Files:** `src/features/dashboard/hooks/useStats.js`, `src/features/dashboard/components/StatWidget.jsx`, `src/features/dashboard/components/PlaysBarChart.jsx`, `src/features/dashboard/components/RecentPlaysList.jsx`, `src/features/dashboard/components/FriendsRanking.jsx`, `src/pages/Dashboard.jsx`

- [ ] **Step 1: Create src/features/dashboard/hooks/useStats.js**

```js
// src/features/dashboard/hooks/useStats.js
import { useMemo } from 'react'
import { useStore } from '../../../lib/store'
import { subMonths, startOfMonth, endOfMonth, isWithinInterval, format } from 'date-fns'
import { es } from 'date-fns/locale'

export function useStats() {
  const { me, games, plays, friends } = useStore()

  return useMemo(() => {
    // Total counts
    const totalGames = games.length
    const totalPlays = plays.length

    // My wins
    const myWins = plays.filter(p => p.players.some(pl => pl.isMe && pl.winner)).length
    const myWinRate = totalPlays > 0 ? Math.round((myWins / totalPlays) * 100) : 0

    // Favorite rival (friend I've played most — excludes "me")
    const friendPlayCounts = {}
    plays.forEach(p => {
      p.players.filter(pl => !pl.isMe && pl.friendId).forEach(pl => {
        friendPlayCounts[pl.friendId] = (friendPlayCounts[pl.friendId] || 0) + 1
      })
    })
    const topFriendId = Object.entries(friendPlayCounts).sort((a, b) => b[1] - a[1])[0]?.[0]
    const favoriteRival = topFriendId
      ? { friend: friends.find(f => f.id === topFriendId), count: friendPlayCounts[topFriendId] }
      : null

    // Top game
    const gameCounts = {}
    plays.forEach(p => { gameCounts[p.gameName] = (gameCounts[p.gameName] || 0) + 1 })
    const topGameEntry = Object.entries(gameCounts).sort((a, b) => b[1] - a[1])[0]
    const topGame = topGameEntry ? { name: topGameEntry[0], count: topGameEntry[1] } : null

    // Plays per month (last 6 months)
    const now = new Date()
    const playsPerMonth = Array.from({ length: 6 }, (_, i) => {
      const d = subMonths(now, 5 - i)
      const start = startOfMonth(d)
      const end = endOfMonth(d)
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
      me,
      totalGames,
      totalPlays,
      myWins,
      myWinRate,
      favoriteRival,
      topGame,
      playsPerMonth,
      recentPlays,
      friendsRanking,
    }
  }, [me, games, plays, friends])
}
```

- [ ] **Step 2: Create src/features/dashboard/components/StatWidget.jsx**

```jsx
// src/features/dashboard/components/StatWidget.jsx
export function StatWidget({ label, value, sub, accent = false, dark = false, olive = false }) {
  const bg = dark ? 'bg-ludo-brown text-white'
           : olive ? 'bg-ludo-olive text-white'
           : accent ? 'bg-ludo-orange text-white'
           : 'bg-white'
  const textColor = (dark || olive || accent) ? 'text-white/70' : 'text-ludo-brown/50'

  return (
    <div className={`${bg} rounded-xl p-4 shadow-warm border border-ludo-brown/8`}>
      <p className={`text-xs uppercase tracking-wide font-medium ${textColor} mb-1`}>{label}</p>
      <p className={`font-display text-2xl font-bold leading-tight ${dark || olive || accent ? 'text-white' : 'text-ludo-brown'}`}>
        {value}
      </p>
      {sub && <p className={`text-xs mt-1 ${textColor}`}>{sub}</p>}
    </div>
  )
}
```

- [ ] **Step 3: Create src/features/dashboard/components/PlaysBarChart.jsx**

```jsx
// src/features/dashboard/components/PlaysBarChart.jsx
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts'

export function PlaysBarChart({ data }) {
  return (
    <div className="bg-white rounded-xl p-4 shadow-warm border border-ludo-brown/8">
      <p className="text-xs font-medium text-ludo-brown/50 uppercase tracking-wide mb-3">
        Partidas por mes
      </p>
      <ResponsiveContainer width="100%" height={120}>
        <BarChart data={data} barSize={28}>
          <XAxis
            dataKey="month"
            tick={{ fontSize: 11, fill: '#3D2B1F', opacity: 0.5 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis hide allowDecimals={false} />
          <Tooltip
            cursor={{ fill: 'rgba(61,43,31,0.05)' }}
            contentStyle={{
              background: '#FDF6E3',
              border: '1px solid rgba(61,43,31,0.1)',
              borderRadius: 8,
              fontSize: 12,
              color: '#3D2B1F',
            }}
            formatter={(v) => [`${v} partidas`]}
          />
          <Bar dataKey="count" radius={[4, 4, 0, 0]}>
            {data.map((_, i) => (
              <Cell
                key={i}
                fill={i === data.length - 1 ? '#C4622D' : '#C4622D'}
                opacity={0.4 + (i / data.length) * 0.6}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
```

- [ ] **Step 4: Create src/features/dashboard/components/RecentPlaysList.jsx**

```jsx
// src/features/dashboard/components/RecentPlaysList.jsx
import { useNavigate } from 'react-router-dom'
import { Trophy } from 'lucide-react'
import { formatRelative } from '../../../lib/utils'

export function RecentPlaysList({ plays }) {
  const navigate = useNavigate()
  if (!plays.length) return null

  return (
    <div className="bg-white rounded-xl shadow-warm border border-ludo-brown/8 overflow-hidden">
      <p className="text-xs font-medium text-ludo-brown/50 uppercase tracking-wide px-4 pt-4 pb-2">
        Últimas partidas
      </p>
      <div className="divide-y divide-ludo-brown/6">
        {plays.map(play => {
          const winners = play.players.filter(p => p.winner).map(p => p.name).join(', ')
          return (
            <button
              key={play.id}
              onClick={() => navigate(`/juego/${play.bggId}`)}
              className="w-full flex items-center gap-3 px-4 py-3 hover:bg-ludo-beige/40 transition-colors text-left"
            >
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-ludo-brown truncate">{play.gameName}</p>
                <p className="text-xs text-ludo-brown/50 mt-0.5">
                  {play.players.map(p => p.name).join(' · ')}
                </p>
              </div>
              <div className="text-right shrink-0">
                {winners && (
                  <p className="text-xs text-ludo-orange font-medium flex items-center gap-1">
                    <Trophy size={10} />{winners}
                  </p>
                )}
                <p className="text-xs text-ludo-brown/40">{formatRelative(play.playedAt)}</p>
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
```

- [ ] **Step 5: Create src/features/dashboard/components/FriendsRanking.jsx**

```jsx
// src/features/dashboard/components/FriendsRanking.jsx
import { Trophy } from 'lucide-react'

export function FriendsRanking({ friends }) {
  if (!friends.length) return null
  const max = Math.max(...friends.map(f => f.wins), 1)

  return (
    <div className="bg-white rounded-xl p-4 shadow-warm border border-ludo-brown/8">
      <p className="text-xs font-medium text-ludo-brown/50 uppercase tracking-wide mb-3">
        Ranking de amigos
      </p>
      <div className="space-y-2.5">
        {friends.map((f, i) => (
          <div key={f.id} className="flex items-center gap-3">
            <span className="w-4 text-xs font-bold text-ludo-orange text-right">{i + 1}</span>
            <span className="text-sm font-medium text-ludo-brown w-24 truncate">{f.name}</span>
            <div className="flex-1 h-1.5 bg-ludo-brown/8 rounded-full overflow-hidden">
              <div
                className="h-full bg-ludo-olive rounded-full transition-all"
                style={{ width: `${(f.wins / max) * 100}%` }}
              />
            </div>
            <span className="text-xs text-ludo-brown/40 w-12 text-right">
              {f.wins} {f.wins === 1 ? 'vic.' : 'vics.'}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
```

- [ ] **Step 6: Replace src/pages/Dashboard.jsx**

```jsx
// src/pages/Dashboard.jsx
import { useNavigate } from 'react-router-dom'
import { useStats } from '../features/dashboard/hooks/useStats'
import { StatWidget } from '../features/dashboard/components/StatWidget'
import { PlaysBarChart } from '../features/dashboard/components/PlaysBarChart'
import { RecentPlaysList } from '../features/dashboard/components/RecentPlaysList'
import { FriendsRanking } from '../features/dashboard/components/FriendsRanking'
import { Button } from '../components/Button'
import { Plus } from 'lucide-react'

export default function Dashboard() {
  const navigate = useNavigate()
  const stats = useStats()

  if (!stats.me) return null

  const hasData = stats.totalPlays > 0

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-bold text-ludo-brown">
          Buen día, <span className="text-ludo-orange">{stats.me.name}</span> 👋
        </h1>
        <Button size="sm" onClick={() => navigate('/partidas/nueva')}>
          <Plus size={14} /> Nueva partida
        </Button>
      </div>

      {/* Stat widgets */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatWidget
          label="Colección"
          value={stats.totalGames}
          sub="juegos"
          accent
        />
        <StatWidget
          label="Partidas"
          value={stats.totalPlays}
          sub="registradas"
          dark
        />
        <StatWidget
          label="Tu rendimiento"
          value={`${stats.myWins}`}
          sub={`victorias · ${stats.myWinRate}% de ganadas`}
        />
        <StatWidget
          label="Rival favorito"
          value={stats.favoriteRival?.friend?.name || '—'}
          sub={stats.favoriteRival ? `${stats.favoriteRival.count} partidas juntos` : 'sin partidas aún'}
          olive
        />
      </div>

      {/* Chart + top game */}
      {hasData && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
          <div className="lg:col-span-2">
            <PlaysBarChart data={stats.playsPerMonth} />
          </div>
          <StatWidget
            label="Top juego"
            value={stats.topGame?.name || '—'}
            sub={stats.topGame ? `${stats.topGame.count} partidas` : ''}
          />
        </div>
      )}

      {/* Recent plays */}
      {stats.recentPlays.length > 0 && (
        <RecentPlaysList plays={stats.recentPlays} />
      )}

      {/* Friends ranking */}
      {stats.friendsRanking.length > 0 && (
        <FriendsRanking friends={stats.friendsRanking} />
      )}

      {/* Empty state */}
      {!hasData && (
        <div className="card p-8 text-center space-y-3">
          <p className="text-4xl">🎲</p>
          <p className="font-display text-lg font-semibold text-ludo-brown">
            Empezá registrando tu primera partida
          </p>
          <p className="text-sm text-ludo-brown/50">
            Las estadísticas van a aparecer una vez que tengas partidas registradas.
          </p>
          <div className="flex gap-2 justify-center pt-2">
            <Button onClick={() => navigate('/coleccion/buscar')}>Agregar juego</Button>
            <Button variant="secondary" onClick={() => navigate('/partidas/nueva')}>Registrar partida</Button>
          </div>
        </div>
      )}
    </div>
  )
}
```

- [ ] **Step 7: Commit**

```bash
git add src/features/dashboard/ src/pages/Dashboard.jsx
git commit -m "feat: add dashboard with stats, chart, and rankings"
```

---

## Task 14: GitHub Pages Config

**Files:** `public/404.html`, `.github/workflows/deploy.yml`

- [ ] **Step 1: Create public/404.html** (SPA routing fix for GitHub Pages)

```html
<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>Los Juegos de Santi</title>
    <script>
      // Redirect to index.html preserving the path as a query param
      // This works because HashRouter doesn't need server-side routing
      window.location.replace(
        '/' + window.location.pathname.split('/').slice(1, 2).join('/') +
        '/?p=' + encodeURIComponent(window.location.pathname.slice(1) + window.location.search) +
        (window.location.hash || '')
      );
    </script>
  </head>
  <body></body>
</html>
```

Note: Because we're using HashRouter (`/#/route`), GitHub Pages 404s are only triggered on direct hard refreshes without a hash. This 404.html handles that edge case.

- [ ] **Step 2: Create .github/workflows/deploy.yml**

```yaml
# .github/workflows/deploy.yml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    permissions:
      contents: write
    steps:
      - uses: actions/checkout@v4

      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm

      - name: Install
        run: npm ci

      - name: Build
        run: npm run build

      - name: Deploy
        uses: peaceiris/actions-gh-pages@v4
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./dist
```

- [ ] **Step 3: Commit**

```bash
git add public/404.html .github/
git commit -m "feat: add GitHub Pages deploy workflow and SPA routing fix"
```

---

## Task 15: Polish — Empty States, Responsive & Loading

**Files:** Minor updates across pages

- [ ] **Step 1: Add loading spinner component**

Add to `src/components/Button.jsx` a simple `Spinner` export:

```jsx
// append to src/components/Button.jsx
export function Spinner({ size = 16 }) {
  return (
    <svg
      width={size} height={size}
      viewBox="0 0 24 24"
      className="animate-spin text-current"
      fill="none"
    >
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeOpacity="0.25" />
      <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    </svg>
  )
}
```

- [ ] **Step 2: Add loading state to BGGSearch page**

In `src/pages/BGGSearch.jsx`, when `loading` is true and `selected` is being fetched (second fetch), show a spinner instead of blank:

```jsx
// Replace the `{selected && ...}` block with:
{loading && !results.length && !selected && (
  <div className="flex justify-center py-16 text-ludo-brown/30">
    <Spinner size={32} />
  </div>
)}
```

Import `Spinner` from `../components/Button`.

- [ ] **Step 3: Add hover transitions to GameCard (already in Task 8) — verify they work**

Run `npm run dev`, go to Colección with some games, hover cards — should lift with warm shadow.

- [ ] **Step 4: Verify mobile bottom nav**

Open DevTools → toggle mobile viewport (375px wide). Sidebar should disappear, bottom nav should appear with 4 icons.

- [ ] **Step 5: Build and verify no errors**

```bash
npm run build
```
Expected: build completes with no errors. Output in `dist/`.

- [ ] **Step 6: Final commit**

```bash
git add -A
git commit -m "feat: polish — loading states and responsive verification"
```

---

## Deployment

After all tasks are done:

1. Create a GitHub repo named `los-juegos-de-santi`
2. Push your local code:
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/los-juegos-de-santi.git
   git push -u origin main
   ```
3. In GitHub repo → Settings → Pages → Source: `gh-pages` branch
4. The GitHub Action will run on push and deploy automatically
5. App will be live at `https://YOUR_USERNAME.github.io/los-juegos-de-santi/`
