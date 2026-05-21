# Prompt para Claude Code — Board Game Tracker

## Contexto general

Construí una aplicación web llamada **Ludoteca** (o propone un nombre mejor si se te ocurre). Es una app personal (un solo usuario, sin login) para:

1. **Catalogar / hacer inventario** de juegos de mesa, usando BoardGameGeek (BGG) como fuente de datos.
2. **Registrar y hacer seguimiento de partidas** con amigos, con estadísticas y un dashboard.

La app debe funcionar **sin backend propio**: toda la persistencia va en `localStorage` (o IndexedDB si es necesario para imágenes). La API de BGG es pública, XML-based, sin clave.

---

## Stack recomendado

- **Framework**: React + Vite
- **Styling**: Tailwind CSS v3 + variables CSS custom para el tema
- **Routing**: React Router v6
- **Estado global**: Zustand (simple, sin Redux)
- **Persistencia**: localStorage con un helper tipo `useLocalStorage`
- **Imágenes de partidas**: guardadas en IndexedDB como base64, referenciadas por ID en localStorage
- **Fechas**: date-fns
- **Gráficos**: Recharts
- **HTTP/XML (BGG)**: fetch nativo + DOMParser para parsear XML

---

## Diseño visual — IMPORTANTE

Leer y aplicar la skill de frontend design antes de codear cualquier componente.

**Dirección estética**: cálida, familiar, artesanal. Inspirada en la textura visual de una mesa de juegos real: madera, cartón, fichas.

- **Paleta**: beige cálido (`#F5ECD7`), marrón oscuro (`#3D2B1F`), naranja quemado (`#C4622D`), verde oliva (`#6B7C45`), crema (`#FDF6E3`)
- **Tipografía**: 
  - Títulos: `Fraunces` (Google Fonts) — serif expresivo, tiene personalidad
  - Cuerpo: `DM Sans` — legible, moderno pero cálido
- **NO usar**: Inter, Roboto, fondos oscuros con violeta/azul, estética "SaaS genérica"
- **Detalles**: sutil textura de papel/grano en el fondo, bordes con leve radio redondeado, sombras cálidas (no box-shadow negro frío), iconos de Lucide React
- **Cards de juegos**: foto grande del juego, efecto hover con leve elevación y sombra cálida

---

## Estructura de rutas

```
/                    → Dashboard / Stats
/coleccion           → Mi colección (inventario)
/coleccion/buscar    → Buscar juego en BGG para agregar
/juego/:bggId        → Detalle de un juego (info BGG + historial de partidas)
/partidas            → Todas las partidas registradas
/partidas/nueva      → Registrar nueva partida
/amigos              → Lista de amigos
```

---

## Modelo de datos (localStorage)

### `ludo_games` — array de juegos en la colección

```json
[
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
    "status": "owned",       // "owned" | "wishlist" | "played"
    "addedAt": "2024-01-15T..."
  }
]
```

### `ludo_friends` — array de amigos

```json
[
  {
    "id": "uuid",
    "name": "Fede",
    "color": "#E07B54",   // color avatar generado automáticamente
    "createdAt": "..."
  }
]
```

### `ludo_plays` — array de partidas

```json
[
  {
    "id": "uuid",
    "bggId": "162082",
    "gameName": "Dune: Imperium",
    "playedAt": "2024-03-10T...",
    "location": "Casa de Santi",   // opcional
    "notes": "Fede hizo trampa en la ronda 3",  // opcional
    "photoId": "idb_abc123",   // referencia a IndexedDB, opcional
    "players": [
      {
        "friendId": "uuid",    // null si es el usuario principal ("Yo")
        "name": "Santi",
        "isMe": true,
        "position": 1,
        "score": "42 puntos de influencia",  // string libre
        "winner": true
      }
    ]
  }
]
```

### `ludo_me` — datos del usuario

```json
{
  "name": "Santi",
  "color": "#C4622D"
}
```

---

## Pantallas y funcionalidades

### 1. Dashboard (`/`)

- Tarjetas de resumen: total de juegos, total de partidas, juego más jugado, amigo más frecuente
- Gráfico de barras: partidas por mes (últimos 6 meses) — Recharts
- Gráfico de torta o barras: top 5 juegos más jugados
- Tabla: "últimas 5 partidas" con link a detalle
- Tabla o lista: ranking de amigos por victorias

### 2. Mi Colección (`/coleccion`)

- Grid de cards con la foto del juego, nombre, ranking BGG, badge de estado (tengo / quiero / jugué)
- Filtros: por estado, búsqueda por nombre
- Ordenar por: ranking BGG, nombre, fecha agregado
- Botón flotante "+" para ir a buscar juego nuevo

### 3. Buscar en BGG (`/coleccion/buscar`)

- Input de búsqueda → llama a `https://boardgamegeek.com/xmlapi2/search?query=...&type=boardgame`
- Resultados en lista con nombre y año
- Al clickear un resultado → fetch de `https://boardgamegeek.com/xmlapi2/thing?id=...&stats=1` para obtener todos los datos
- Card de preview con imagen, ranking, rating, descripción corta, min/max jugadores, duración
- Botones para agregar con estado: "Lo tengo" / "Lo quiero" / "Lo jugué"
- Si el juego ya está en la colección, mostrar el estado actual con opción de cambiar

### 4. Detalle de juego (`/juego/:bggId`)

- Hero con imagen grande, nombre, año, ranking BGG, rating, info básica (jugadores, duración)
- Descripción del juego (de BGG, truncada con "ver más")
- Estado en mi colección (badge editable)
- Sección "Mis partidas con este juego": historial ordenado por fecha
- Botón "Registrar partida" (lleva a `/partidas/nueva?juego=bggId`)
- Stats rápidas del juego: veces jugado, quién ganó más veces

### 5. Registrar partida (`/partidas/nueva`)

- Selector de juego (searchable, de mi colección primero, con opción de buscar en BGG)
- Date picker (default: hoy)
- Campo opcional: lugar
- Sección "Jugadores":
  - Lista de jugadores agregados
  - Botón "Agregar jugador" → modal/drawer con:
    - Lista de amigos existentes (con buscador)
    - Opción "Soy yo" (siempre disponible como primer jugador)
    - Botón "Nuevo amigo" → campo de nombre inline, se crea al guardar la partida
  - Por cada jugador: campo de posición (número) y score (texto libre, ej: "42 puntos")
  - Checkbox o estrella para marcar al ganador (puede haber empate: múltiples ganadores)
- Campo opcional: notas (textarea)
- Botón "Agregar foto" → file input, preview de la imagen, se guarda en IndexedDB
- Botón "Guardar partida"

### 6. Amigos (`/amigos`)

- Lista de amigos con avatar de color, nombre
- Stats por amigo: partidas jugadas juntos, victorias
- Botón "Agregar amigo"
- Click en amigo → mini modal con sus stats detalladas (juegos favoritos, historial de victorias)

---

## Integración con BGG API

La API XML de BGG no tiene CORS habilitado directamente. Usar un proxy público:

```
https://api.allorigins.win/raw?url=https://boardgamegeek.com/xmlapi2/search?query=QUERY&type=boardgame
```

Parser helper sugerido:

```javascript
// src/lib/bgg.js
const BGG_PROXY = "https://api.allorigins.win/raw?url=";

export async function searchBGG(query) {
  const url = `https://boardgamegeek.com/xmlapi2/search?query=${encodeURIComponent(query)}&type=boardgame`;
  const res = await fetch(BGG_PROXY + encodeURIComponent(url));
  const text = await res.text();
  const parser = new DOMParser();
  const xml = parser.parseFromString(text, "text/xml");
  // parsear <item> elements...
}

export async function getBGGGame(id) {
  const url = `https://boardgamegeek.com/xmlapi2/thing?id=${id}&stats=1`;
  const res = await fetch(BGG_PROXY + encodeURIComponent(url));
  // parsear y retornar objeto normalizado
}
```

Campos a extraer de BGG:
- `id`, `name` (type="primary"), `yearpublished`, `thumbnail`, `image`
- `description`, `minplayers`, `maxplayers`, `playingtime`
- `statistics > ratings > bayesaverage` (rating), `statistics > ratings > ranks > rank[name="boardgame"]` (ranking global)

---

## Helpers a implementar

- `src/lib/bgg.js` — integración BGG (search + getGame)
- `src/lib/db.js` — wrapper de IndexedDB para guardar fotos de partidas
- `src/lib/store.js` — Zustand store con slices para games, plays, friends, me
- `src/lib/utils.js` — uuid, formatDate, generateColor (para avatares)

---

## UX / detalles importantes

- **Crear amigo al vuelo**: en el formulario de partida, si el amigo no existe, aparece un campo inline para escribir el nombre. Al guardar la partida, el amigo nuevo se crea automáticamente en `ludo_friends`.
- **"Yo" siempre presente**: el primer jugador es siempre el usuario principal. Su nombre se configura en primera ejecución (onboarding mínimo: "¿Cómo te llamás?").
- **Score libre**: el campo de puntuación es texto libre para acomodar cualquier sistema de puntuación de cualquier juego.
- **Múltiples ganadores**: el campo "ganador" es un checkbox, no radio. Puede haber empate.
- **Sin internet**: si BGG no responde, mostrar mensaje amigable. Los datos ya guardados funcionan offline.
- **Responsive**: diseñar mobile-first aunque sea web. El grid de colección debe ser 2 columnas en mobile, 3-4 en desktop.

---

## Orden de implementación sugerido

1. Setup: Vite + React + Tailwind + Zustand + React Router
2. Design system: variables CSS, componentes base (Button, Card, Badge, Modal)
3. Store + localStorage persistence
4. Flujo de colección: buscar en BGG → agregar → ver colección
5. Flujo de partidas: registrar → ver historial
6. Amigos
7. Dashboard con stats y gráficos
8. Pulido visual: animaciones, responsive, estados vacíos con ilustraciones simples SVG

---

## Notas finales para Claude Code

- Leer la skill de **frontend-design** en `/mnt/skills/public/frontend-design/SKILL.md` antes de crear cualquier componente visual.
- El tono de la app es **cálido, personal y familiar** — como una libreta de anotaciones física, no como un dashboard corporativo.
- Cada pantalla de estado vacío debe tener un mensaje simpático y un CTA claro (ej: "Todavía no tenés juegos. ¡Buscá el primero!" con un botón).
- Usar `uuid` (nanoid está bien también) para IDs generados en cliente.
- No hay tests requeridos para este MVP.
