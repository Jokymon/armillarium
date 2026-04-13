export function formatDate(date: Date) {
  return new Intl.DateTimeFormat('en-GB', {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    timeZone: 'UTC',
    timeZoneName: 'short',
  }).format(date)
}

export function formatJulianDate(date: Date) {
  const julianDate = date.getTime() / 86400000 + 2440587.5
  return julianDate.toFixed(5)
}

export function formatDegrees(value: number | null) {
  return value === null ? 'n/a' : `${value.toFixed(3)}°`
}

export function formatHours(value: number | null) {
  return value === null ? 'n/a' : `${value.toFixed(3)}h`
}

export function formatDistanceAu(value: number) {
  return `${value.toFixed(6)} AU`
}

export function formatLatitude(value: number) {
  const hemisphere = value >= 0 ? 'N' : 'S'
  return `${Math.abs(value).toFixed(3)}° ${hemisphere}`
}

export function formatLongitude(value: number) {
  const hemisphere = value >= 0 ? 'E' : 'W'
  return `${Math.abs(value).toFixed(3)}° ${hemisphere}`
}
