# Los Juegos de Santi — Project Playbook

Personal board game tracker SPA. React 18 + Vite 5, no backend, localStorage persistence, BGG API integration, deployed to GitHub Pages at `/los-juegos-de-santi/`.

---

## Project Context

- **Owner**: Santiago (non-technical user — explain without jargon)
- **No tests required** for this MVP. User explicitly chose speed over test coverage.
- **No backend** — all data lives in browser: Zustand (localStorage) + IndexedDB (photos).
- **Public repo** on GitHub — never commit API keys, tokens, or sensitive personal data.

---

## Architecture Decisions

### Folder Structure (feature-based)
```
src/
  features/
    dashboard/
    collection/
    plays/
    friends/
    bgg-search/
  lib/
    bgg.js       # BGG API client
    store.js     # Zustand store
    db.js        # IndexedDB photos wrapper
    utils.js     # generateId, formatDate, generateColor, truncate
```

### Routing
- **HashRouter** (not BrowserRouter) — required for GitHub Pages (no server-side routing). Routes look like `/#/coleccion`.
- Base path: `/los-juegos-de-santi/` in `vite.config.js`.

### State
- **Zustand + persist** middleware → localStorage key `ludo-store`.
- Store shape: `{ me, games, plays, friends }`. `me` is null until onboarding.
- `addGame` upserts by `bggId` — safe to call multiple times for same game.
- `addFriend` returns the new friend object with generated color.

### Photo Storage
- Photos stored in **IndexedDB** via `src/lib/db.js` (`savePhoto`, `getPhoto`, `deletePhoto`).
- Never stored in Zustand/localStorage (too large).

---

## BGG API Integration

### CORS Strategy

BGG's XML API has no CORS headers, so browser apps need a proxy.

**Dev mode** (Vite proxy — always reliable):
```js
// vite.config.js
server: {
  proxy: {
    '/bgg-api': {
      target: 'https://boardgamegeek.com',
      changeOrigin: true,
      rewrite: (path) => path.replace(/^\/bgg-api/, '/xmlapi2'),
    },
  },
}
```
In dev, `bgg.js` fetches `/bgg-api/search?...` — Vite forwards it from Node.js (no CORS).

**Prod mode** (CORS proxy fallback):
- `https://api.allorigins.win/raw?url=<encoded>` — first try
- `https://corsproxy.io/?url=<encoded>` — second try
- Both can be intermittent. They work in real browsers even when assistant testing tools (WebFetch) get blocked.

**Detection**: Use `import.meta.env.DEV` to split dev vs prod paths in `bgg.js`.

### BGG 202 Response
BGG queues expensive requests and returns HTTP 202 (not data yet). Always implement retry with delay:
```js
if (res.status === 202) {
  if (attempt < retries) { await sleep(delayMs); continue }
  throw new Error('BGG sigue procesando...')
}
```

### Testing Proxies
Do **not** trust WebFetch tool results for proxy validation — the tool is blocked by BGG and most proxies. Real browser requests work differently (different IP, proper User-Agent). Test proxy changes in the actual browser.

---

## Stats / Business Logic

### "Yo" exclusion rule
The user (`isMe: true`) always plays in every game, so including them in friend-based stats is meaningless.

- **Always filter**: `players.filter(p => !p.isMe)` for any friend ranking, rival favorito, etc.
- The user gets their own "Tu rendimiento" widget (myWins, myWinRate).
- `friendsRanking` and `favoriteRival` must exclude `isMe: true` players.

### Stats calculations (useStats.js)
- `favoriteRival`: friend with most plays (not wins) — excludes isMe
- `friendsRanking`: sorted by wins, excludes isMe
- `playsPerMonth`: last 6 months via date-fns
- `recentPlays`: last 5 plays

---

## Design System

### Color Tokens (tailwind.config.js)
Custom `ludo.*` palette: `ludo.beige`, `ludo.brown`, `ludo.orange`, `ludo.olive`, `ludo.cream`. Use these, not Tailwind defaults.

### CSS Classes (index.css)
Shared utility classes: `.card`, `.input`, `.badge`, `.badge-owned`, `.badge-wishlist`, `.badge-played`, `.page-title`, `.section-title`.

### Fonts
`font-display` (headings), `font-body` (body text). Defined in tailwind config.

### Spring Animation
Enter + transform only (not exit or opacity). Durations: panels 280–320ms, modals 240ms, micro-interactions 120ms.

---

## Deployment (GitHub Pages)

```yaml
# .github/workflows/deploy.yml
# Push to master/main → npm ci → npm run build → peaceiris/actions-gh-pages → gh-pages branch
```

- Repo **must be public** for free GitHub Pages. User data stays in browser localStorage — repo being public only exposes code, not user data.
- `public/404.html` handles SPA redirect edge case for HashRouter.

---

## Git Hygiene

- Add planning docs, prompts, and internal specs to `.gitignore` **before** the first commit.
- To untrack already-committed files without deleting them locally: `git rm --cached <file>`
- Files remain in git history after untracking — acceptable for non-sensitive content. For sensitive content, use BFG Repo Cleaner.
- Current `.gitignore` excludes: `boardgame-tracker-prompt.md`, `docs/superpowers/`

---

## Security

### Content Security Policy
`index.html` has a CSP `<meta>` tag restricting:
- `script-src 'self'` — no external scripts
- `img-src 'self' data: https://*.geekdo-images.com` — only BGG images + local data URIs (photos)
- `connect-src 'self' https://boardgamegeek.com ws: wss:` — only BGG API + Vite HMR

### BGG Token
`VITE_BGG_TOKEN` is embedded in the production bundle (BGG's acknowledged tradeoff for client-side apps). Never commit `.env.local`. The token grants read-only BGG API access only.

### Known safe patterns
- No `dangerouslySetInnerHTML`, no `eval`, no `Function()` constructor
- BGG image URLs validated as `https://` before storing (`safeHttpsUrl()` in `bgg.js`)
- Photo uploads validate MIME type (jpeg/png/gif/webp only) before reading
- Zustand store has `version: 1` for future schema migrations

### Remaining low-priority items
- GitHub Actions workflow uses floating `@v4` tags — pin to commit SHAs for supply chain hardening (see `deploy.yml`)

---

## Verification Checklist

Before considering a feature complete:
- [ ] Works in local dev (`npm run dev`) — BGG proxy via Vite
- [ ] `isMe` filter applied in all friend/rival stats
- [ ] Photos use IndexedDB, not Zustand
- [ ] No direct `boardgamegeek.com` fetch in browser (always through `/bgg-api` in dev or prod direct with token)
- [ ] HashRouter paths all start with `/#/`
- [ ] No secrets committed to git
- [ ] New image URLs from external APIs pass through `safeHttpsUrl()`
