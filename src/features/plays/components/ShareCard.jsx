import { forwardRef } from 'react'

const COLORS = {
  cream:      '#fdf6ee',
  beige:      '#f5ede0',
  brown:      '#3d2b1f',
  brownMid:   'rgba(61,43,31,0.5)',
  brownLight: 'rgba(61,43,31,0.3)',
  brownLine:  'rgba(61,43,31,0.08)',
  orange:     '#e8650a',
  orangeBg:   'rgba(232,101,10,0.08)',
}

function sortedPlayers(players) {
  return [...players].sort((a, b) => {
    if (a.position && b.position) return a.position - b.position
    if (a.position) return -1
    if (b.position) return 1
    return 0
  })
}

export const ShareCard = forwardRef(function ShareCard({ play, photo }, ref) {
  const players = sortedPlayers(play.players)

  return (
    <div ref={ref} style={{
      width: '375px',
      backgroundColor: COLORS.cream,
      fontFamily: '"DM Sans", system-ui, sans-serif',
      overflow: 'hidden',
      borderRadius: '16px',
      boxShadow: '0 4px 24px rgba(61,43,31,0.12)',
    }}>

      {/* Header */}
      <div style={{
        backgroundColor: COLORS.beige,
        padding: '10px 16px',
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
      }}>
        <span style={{ fontSize: '14px' }}>🎲</span>
        <span style={{
          fontSize: '11px',
          fontWeight: '700',
          color: COLORS.orange,
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
        }}>
          Los Juegos de Santi
        </span>
      </div>

      {/* Game name */}
      <div style={{ padding: '16px 16px 4px' }}>
        <div style={{
          fontSize: '22px',
          fontWeight: '700',
          color: COLORS.brown,
          fontFamily: '"Fraunces", Georgia, serif',
          lineHeight: '1.2',
        }}>
          {play.gameName}
        </div>
      </div>

      {/* Date + location */}
      <div style={{
        padding: '4px 16px 12px',
        fontSize: '13px',
        color: COLORS.brownMid,
      }}>
        {new Date(play.playedAt).toLocaleDateString('es-AR', {
          day: 'numeric', month: 'long', year: 'numeric',
        })}
        {play.location && ` · ${play.location}`}
      </div>

      {/* Photo */}
      {photo && (
        <img
          src={photo}
          alt=""
          style={{
            width: '100%',
            maxHeight: '200px',
            objectFit: 'cover',
            display: 'block',
          }}
        />
      )}

      {/* Players */}
      <div style={{ padding: '12px 16px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
        {players.map((p, i) => (
          <div key={i} style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            padding: '8px 12px',
            borderRadius: '8px',
            backgroundColor: p.winner ? COLORS.orangeBg : COLORS.beige,
          }}>
            <span style={{ fontSize: '14px', width: '18px', textAlign: 'center' }}>
              {p.winner ? '🏆' : (p.position ? `#${p.position}` : '')}
            </span>
            <span style={{
              flex: 1,
              fontSize: '14px',
              fontWeight: p.winner ? '600' : '400',
              color: p.winner ? COLORS.orange : COLORS.brown,
            }}>
              {p.name}
            </span>
            {p.score && (
              <span style={{ fontSize: '12px', color: COLORS.brownMid }}>
                {p.score}
              </span>
            )}
          </div>
        ))}
      </div>

      {/* Notes */}
      {play.notes && (
        <div style={{
          padding: '10px 16px 12px',
          fontSize: '13px',
          color: COLORS.brownMid,
          fontStyle: 'italic',
          borderTop: `1px solid ${COLORS.brownLine}`,
        }}>
          "{play.notes}"
        </div>
      )}

      {/* Footer */}
      <div style={{
        padding: '10px 16px',
        borderTop: `1px solid ${COLORS.brownLine}`,
        fontSize: '11px',
        color: COLORS.brownLight,
        textAlign: 'center',
      }}>
        santiagob99.github.io/los-juegos-de-santi
      </div>
    </div>
  )
})
