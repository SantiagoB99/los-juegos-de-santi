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
