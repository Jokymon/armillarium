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

export function formatDegrees(value: number | null) {
  return value === null ? 'n/a' : `${value.toFixed(3)}°`
}

export function formatDistanceAu(value: number) {
  return `${value.toFixed(6)} AU`
}