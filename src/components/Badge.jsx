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
