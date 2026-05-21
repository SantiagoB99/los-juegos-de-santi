# Los Juegos de Santi — Diseño

**Fecha:** 2026-05-21  
**Estado:** Aprobado

---

## Resumen

App web personal (sin login, sin backend) para catalogar juegos de mesa y registrar partidas con amigos. Usa BoardGameGeek (BGG) como fuente de datos. Todo el estado persiste en `localStorage` / IndexedDB en el browser del usuario.

**Nombre:** Los Juegos de Santi  
**Deploy:** GitHub Pages (repo público; los datos del usuario nunca salen del browser)  
**Alcance:** MVP completo — todas las pantallas en una sola fase

---

## Stack

| Tecnología | Versión | Rol |
|---|---|---|
| React | 18 | UI |
| Vite | 5 | Build |
| Tailwind CSS | v3 | Estilos + variables CSS custom |
| React Router | v6 + HashRouter | Routing (HashRouter para GitHub Pages) |
| Zustand | última | Estado global con `persist` middleware |
| Recharts | última | Gráficos del dashboard |
| lucide-react | última | Iconografía |
| nanoid | última | Generación de UUIDs en cliente |
| date-fns | última | Formateo de fechas |
| Google Fonts | — | Fraunces (títulos) + DM Sans (cuerpo) |

**HashRouter** en lugar de BrowserRouter porque GitHub Pages no soporta server-side routing para SPAs. Las URLs quedan tipo `/#/coleccion`.

---

## Diseño visual

**Dirección:** cálida, artesanal, evocadora de mesa de juegos real.

**Paleta:**
- `--color-beige: #F5ECD7`
- `--color-brown: #3D2B1F`
- `--color-orange: #C4622D`
- `--color-olive: #6B7C45`
- `--color-cream: #FDF6E3`

**Tipografía:**
- Títulos: `Fraunces` (serif expresivo)
- Cuerpo: `DM Sans`

**Detalles:** sutil textura de papel/grano en el fondo, bordes redondeados, sombras cálidas (no negro frío), cards con efecto hover de elevación.

---

## Arquitectura de carpetas (feature-based)

```
src/
├── features/
│   ├── collection/
│   │   ├── components/     ← GameCard, GameGrid, GameFilters, StatusBadge
│   │   └── hooks/          ← useCollection.js
│   ├── plays/
│   │   ├── components/     ← PlayForm, PlayerRow, PlayCard, PhotoUpload
│   │   └── hooks/          ← usePlays.js
│   ├── friends/
│   │   ├── components/     ← FriendsList, FriendAvatar, FriendStatsModal
│   │   └── hooks/          ← useFriends.js
│   ├── dashboard/
│   │   ├── components/     ← StatWidget, PlaysBarChart, TopGamesWidget, RecentPlaysList, FriendsRanking
│   │   └── hooks/          ← useStats.js
│   └── bgg-search/
│       ├── components/     ← SearchBar, SearchResultsList, GamePreviewCard
│       └── hooks/          ← useBGGSearch.js
├── components/             ← UI compartida
│   ├── Button.jsx
│   ├── Card.jsx
│   ├── Badge.jsx
│   ├── Modal.jsx
│   └── EmptyState.jsx
├── lib/
│   ├── bgg.js              ← fetch + XML parsing de BGG API
│   ├── db.js               ← wrapper IndexedDB (fotos de partidas)
│   ├── store.js            ← Zustand store (games, plays, friends, me)
│   └── utils.js            ← nanoid, formatDate, generateColor
├── pages/                  ← una por ruta, importan de features/
│   ├── Dashboard.jsx
│   ├── Collection.jsx
│   ├── BGGSearch.jsx
│   ├── GameDetail.jsx
│   ├── Plays.jsx
│   ├── NewPlay.jsx
│   └── Friends.jsx
└── App.jsx                 ← HashRouter + layout shell con sidebar
```

---

## Rutas

```
/#/                    → Dashboard
/#/coleccion           → Mi colección
/#/coleccion/buscar    → Buscar juego en BGG
/#/juego/:bggId        → Detalle de un juego
/#/partidas            → Todas las partidas
/#/partidas/nueva      → Registrar nueva partida
/#/amigos              → Lista de amigos
```

---

## Modelo de datos (localStorage)

### `ludo_games`
```json
{
  "bggId": "162082",
  "name": "Dune: Imperium",
  "thumbnail": "https://...",
  "image": "https://...",
  "yearPublished": 2020,
  "minPlayers": 1,
  "maxPlayers": 4,
  "playingTime": 120,
  "bggRank": 4,
  "bggRating": 8.5,
  "status": "owned",
  "addedAt": "2024-01-15T..."
}
```
`status`: `"owned"` | `"wishlist"` | `"played"`

### `ludo_friends`
```json
{
  "id": "abc123",
  "name": "Fede",
  "color": "#E07B54",
  "createdAt": "..."
}
```

### `ludo_plays`
```json
{
  "id": "xyz789",
  "bggId": "162082",
  "gameName": "Dune: Imperium",
  "playedAt": "2024-03-10T...",
  "location": "Casa de Santi",
  "notes": "Fede hizo trampa en la ronda 3",
  "photoId": "idb_abc123",
  "players": [
    {
      "friendId": null,
      "name": "Santi",
      "isMe": true,
      "position": 1,
      "score": "42 puntos",
      "winner": true
    },
    {
      "friendId": "abc123",
      "name": "Fede",
      "isMe": false,
      "position": 2,
      "score": "38 puntos",
      "winner": false
    }
  ]
}
```

### `ludo_me`
```json
{
  "name": "Santi",
  "color": "#C4622D"
}
```

---

## Layout general

**Shell:** sidebar fija izquierda + área de contenido principal. Topbar con el nombre "Los Juegos de Santi".

**Sidebar:**
- Dashboard
- Colección
- Partidas
- Amigos
- (separador)
- Config (onboarding / cambiar nombre)

**Responsive:** en mobile la sidebar se colapsa a bottom navigation bar.

---

## Pantallas

### Dashboard (`/#/`)

Layout de widgets de distintos tamaños:

| Widget | Tamaño | Contenido |
|---|---|---|
| Colección | pequeño | total de juegos |
| Partidas | pequeño | total de partidas |
| Tu rendimiento | pequeño | victorias + tasa % |
| Rival favorito | pequeño | amigo con más partidas juntos (excluye a "Yo") |
| Partidas por mes | ancho | gráfico de barras últimos 6 meses (Recharts) |
| Top juego | pequeño | juego más jugado + veces jugado |
| Últimas partidas | full | lista de las 5 últimas con resultado |
| Ranking amigos | full | amigos ordenados por victorias (excluye a "Yo") |

**Nota clave:** Las estadísticas de amigos (rival favorito, ranking) excluyen siempre al usuario principal (`isMe: true`) para que los números sean significativos.

### Colección (`/#/coleccion`)

- Grid responsive: 2 columnas en mobile, 3-4 en desktop
- Cada card: foto grande, nombre, año, ranking BGG, badge de estado
- Filtros: por estado, búsqueda por nombre
- Ordenar por: ranking BGG, nombre, fecha agregado
- FAB "+" → navega a `/coleccion/buscar`
- Estado vacío: mensaje simpático + CTA "Buscá tu primer juego"

### Buscar en BGG (`/#/coleccion/buscar`)

1. Input → `searchBGG(query)` → lista de resultados con nombre + año
2. Click resultado → `getBGGGame(id)` → preview card con imagen, rating, ranking, descripción, jugadores, duración
3. Botones: "Lo tengo" / "Lo quiero" / "Lo jugué" → guarda en `ludo_games` con el status elegido
4. Si el juego ya está en la colección: muestra estado actual con opción de cambiarlo

### Detalle de juego (`/#/juego/:bggId`)

- Hero: imagen grande, nombre, año, ranking BGG, rating, jugadores, duración
- Descripción truncada con botón "ver más"
- Badge de estado editable (cambiar owned/wishlist/played inline)
- Stats: veces jugado, quién ganó más veces con ese juego
- Historial de partidas con ese juego, ordenado por fecha
- Botón "Registrar partida" (pre-selecciona el juego en el form)

### Registrar partida (`/#/partidas/nueva`)

1. Selector de juego (busca en colección primero, con opción de buscar en BGG). Si se elige un juego de BGG que no está en la colección, se agrega automáticamente con status `"played"`
2. Date picker (default: hoy)
3. Lugar (opcional, text input)
4. Sección jugadores:
   - "Yo" aparece siempre precargado como primer jugador
   - Botón "Agregar jugador" → modal con lista de amigos existentes + buscador + opción "Nuevo amigo" (crea el amigo al guardar)
   - Por cada jugador: posición (número), score (texto libre), winner (checkbox — puede haber múltiples ganadores)
5. Notas (textarea, opcional)
6. Foto (file input → preview → guarda en IndexedDB, referencia en play)
7. Guardar → crea amigos nuevos si los hay, guarda partida

### Partidas (`/#/partidas`)

- Lista de todas las partidas, ordenadas por fecha desc
- Cada item: nombre del juego, fecha, jugadores, quién ganó
- Filtro por juego

### Amigos (`/#/amigos`)

- Lista con avatar de color (generado automáticamente) y nombre
- Stats por amigo: partidas juntos, victorias
- Botón "Agregar amigo"
- Click en amigo → modal con stats detalladas: juegos favoritos, historial de victorias reciente

---

## BGG API

**Proxy:** `https://api.allorigins.win/raw?url=` (CORS workaround)

```js
// src/lib/bgg.js
const BGG_PROXY = "https://api.allorigins.win/raw?url=";

export async function searchBGG(query) { ... }
export async function getBGGGame(id) { ... }
```

**Campos a extraer de BGG:**
- `id`, `name` (type="primary"), `yearpublished`, `thumbnail`, `image`
- `description`, `minplayers`, `maxplayers`, `playingtime`
- `statistics > ratings > bayesaverage` (rating BGG)
- `statistics > ratings > ranks > rank[name="boardgame"]` (ranking global)

**Error handling:** si BGG no responde, mostrar mensaje amigable. La colección funciona offline con datos ya guardados.

---

## Persistencia

- **localStorage:** `ludo_games`, `ludo_friends`, `ludo_plays`, `ludo_me` — gestionado por Zustand `persist` middleware
- **IndexedDB:** fotos de partidas guardadas como base64, referenciadas por ID desde `ludo_plays.photoId`

---

## Zustand store

Un solo store con slices:
```js
{
  me: { name, color },
  games: [...],
  plays: [...],
  friends: [...],
  // actions: addGame, updateGameStatus, addPlay, addFriend, ...
}
```

Toda la persistencia pasa por Zustand `persist` — no se escribe a localStorage directamente.

---

## GitHub Pages

- `vite.config.js`: `base: '/los-juegos-de-santi/'`
- `public/404.html`: script de redirect para que React Router (HashRouter) funcione al abrir una URL directa
- Al hacer `git push`, Vite buildea y se deploya vía GitHub Actions o `gh-pages` branch

---

## Onboarding

Primera visita: modal simple "¿Cómo te llamás?" → guarda en `ludo_me`. Sin este paso la app no funciona. El nombre se usa en el saludo del dashboard ("Buen día, Santi 👋") y como jugador "Yo" en las partidas.

---

## Estados vacíos

Cada pantalla sin datos tiene un mensaje simpático y un CTA:
- Colección vacía: "Todavía no tenés juegos. ¡Buscá el primero!" → botón a BGG Search
- Sin partidas: "Registrá tu primera partida" → botón a Nueva Partida
- Sin amigos: "Agregá a tus rivales" → botón Agregar Amigo
- Dashboard sin datos: mostrar el onboarding primero, luego los widgets vacíos con placeholders

---

## Orden de implementación

1. Setup: Vite + React + Tailwind + Zustand + React Router (HashRouter)
2. Design system: variables CSS, componentes base (Button, Card, Badge, Modal, EmptyState)
3. Lib: `bgg.js`, `db.js`, `store.js`, `utils.js`
4. Onboarding (modal nombre)
5. Layout shell: sidebar + routing
6. Flujo colección: buscar BGG → agregar → ver colección → detalle de juego
7. Flujo partidas: registrar → ver historial
8. Amigos
9. Dashboard con stats y gráficos
10. GitHub Pages config + deploy
11. Pulido: animaciones, responsive mobile, estados vacíos con SVG simples
