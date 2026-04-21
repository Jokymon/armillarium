import { useEffect, useState } from 'react'
import { useSimulationStore } from '../../state/simulation-store'
import { formatJulianDate } from '../formatters'

function formatUtcInputValue(date: Date) {
  const iso = new Date(date.getTime() - date.getMilliseconds()).toISOString()
  return iso.slice(0, 19)
}

function parseUtcDateTime(value: string) {
  if (!value) {
    return null
  }

  const [datePart, timePart] = value.split('T')

  if (!datePart || !timePart) {
    return null
  }

  const dateParts = datePart.split('-').map(Number)
  const timeParts = timePart.split(':').map(Number)

  if (dateParts.length !== 3 || timeParts.length < 2 || timeParts.length > 3) {
    return null
  }

  const [year, month, day] = dateParts
  const [hours, minutes, seconds = 0] = timeParts

  if (
    ![year, month, day, hours, minutes, seconds].every(Number.isFinite) ||
    month < 1 ||
    month > 12 ||
    day < 1 ||
    day > 31 ||
    hours < 0 ||
    hours > 23 ||
    minutes < 0 ||
    minutes > 59 ||
    seconds < 0 ||
    seconds > 59
  ) {
    return null
  }

  const parsed = new Date(Date.UTC(year, month - 1, day, hours, minutes, seconds))

  if (
    parsed.getUTCFullYear() !== year ||
    parsed.getUTCMonth() !== month - 1 ||
    parsed.getUTCDate() !== day ||
    parsed.getUTCHours() !== hours ||
    parsed.getUTCMinutes() !== minutes ||
    parsed.getUTCSeconds() !== seconds
  ) {
    return null
  }

  return parsed
}

function parseJulianDate(value: string) {
  const julianDate = Number(value)

  if (!Number.isFinite(julianDate)) {
    return null
  }

  const unixMs = (julianDate - 2440587.5) * 86400000
  const parsed = new Date(unixMs)
  return Number.isNaN(parsed.getTime()) ? null : parsed
}

export function SetNowHomeDialog({
  isOpen,
  onClose,
}: {
  isOpen: boolean
  onClose: () => void
}) {
  const currentDate = useSimulationStore((state) => state.currentDate)
  const observerLatitude = useSimulationStore((state) => state.observerLatitude)
  const observerLongitude = useSimulationStore((state) => state.observerLongitude)
  const setReferenceNowAndHome = useSimulationStore((state) => state.setReferenceNowAndHome)
  const [timeInputMode, setTimeInputMode] = useState<'utc' | 'julian'>('utc')
  const [utcDateTime, setUtcDateTime] = useState(formatUtcInputValue(currentDate))
  const [julianDate, setJulianDate] = useState(formatJulianDate(currentDate))
  const [latitudeHemisphere, setLatitudeHemisphere] = useState<'N' | 'S'>(observerLatitude >= 0 ? 'N' : 'S')
  const [longitudeHemisphere, setLongitudeHemisphere] = useState<'E' | 'W'>(observerLongitude >= 0 ? 'E' : 'W')
  const [latitudeValue, setLatitudeValue] = useState(Math.abs(observerLatitude).toFixed(6))
  const [longitudeValue, setLongitudeValue] = useState(Math.abs(observerLongitude).toFixed(6))
  const [dialogError, setDialogError] = useState<string | null>(null)

  useEffect(() => {
    if (!isOpen) {
      return
    }

    setUtcDateTime(formatUtcInputValue(currentDate))
    setJulianDate(formatJulianDate(currentDate))
    setLatitudeHemisphere(observerLatitude >= 0 ? 'N' : 'S')
    setLongitudeHemisphere(observerLongitude >= 0 ? 'E' : 'W')
    setLatitudeValue(Math.abs(observerLatitude).toFixed(6))
    setLongitudeValue(Math.abs(observerLongitude).toFixed(6))
    setDialogError(null)
  }, [currentDate, isOpen, observerLatitude, observerLongitude])

  function handleApplyReference() {
    const parsedDate = timeInputMode === 'utc' ? parseUtcDateTime(utcDateTime) : parseJulianDate(julianDate)

    if (!parsedDate) {
      setDialogError(
        timeInputMode === 'utc'
          ? 'Enter a valid UTC date and time with the browser picker.'
          : 'Enter a valid Julian Date.',
      )
      return
    }

    const latitude = Number(latitudeValue)
    const longitude = Number(longitudeValue)

    if (!Number.isFinite(latitude) || latitude < 0 || latitude > 90) {
      setDialogError('Latitude must be a decimal value between 0 and 90.')
      return
    }

    if (!Number.isFinite(longitude) || longitude < 0 || longitude > 180) {
      setDialogError('Longitude must be a decimal value between 0 and 180.')
      return
    }

    setReferenceNowAndHome(
      parsedDate,
      latitudeHemisphere === 'N' ? latitude : -latitude,
      longitudeHemisphere === 'E' ? longitude : -longitude,
    )
    onClose()
  }

  if (!isOpen) {
    return null
  }

  return (
    <div className="modal-backdrop" role="presentation" onClick={onClose}>
      <div
        className="modal-card"
        role="dialog"
        aria-modal="true"
        aria-labelledby="reference-dialog-title"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="modal-header">
          <h3 id="reference-dialog-title">Set Reference Now / Home</h3>
          <button type="button" onClick={onClose}>
            Close
          </button>
        </div>
        <div className="segmented-field">
          <span>Time input</span>
          <div className="button-row compact-buttons">
            <button
              type="button"
              className={timeInputMode === 'utc' ? 'active' : undefined}
              onClick={() => setTimeInputMode('utc')}
            >
              UTC
            </button>
            <button
              type="button"
              className={timeInputMode === 'julian' ? 'active' : undefined}
              onClick={() => setTimeInputMode('julian')}
            >
              Julian Date
            </button>
          </div>
        </div>
        {timeInputMode === 'utc' ? (
          <label className="form-field">
            <span>UTC date and time</span>
            <input
              type="datetime-local"
              step={1}
              value={utcDateTime}
              onChange={(event) => setUtcDateTime(event.target.value)}
            />
            <small>Interpreted as UTC. The browser may display this in your local date/time format.</small>
          </label>
        ) : (
          <label className="form-field">
            <span>Julian Date</span>
            <input type="text" inputMode="decimal" value={julianDate} onChange={(event) => setJulianDate(event.target.value)} />
          </label>
        )}
        <div className="coordinate-grid">
          <label className="form-field">
            <span>Latitude</span>
            <div className="inline-field">
              <select value={latitudeHemisphere} onChange={(event) => setLatitudeHemisphere(event.target.value as 'N' | 'S')}>
                <option value="N">N</option>
                <option value="S">S</option>
              </select>
              <input
                type="number"
                min={0}
                max={90}
                step="any"
                value={latitudeValue}
                onChange={(event) => setLatitudeValue(event.target.value)}
              />
            </div>
          </label>
          <label className="form-field">
            <span>Longitude</span>
            <div className="inline-field">
              <select value={longitudeHemisphere} onChange={(event) => setLongitudeHemisphere(event.target.value as 'E' | 'W')}>
                <option value="E">E</option>
                <option value="W">W</option>
              </select>
              <input
                type="number"
                min={0}
                max={180}
                step="any"
                value={longitudeValue}
                onChange={(event) => setLongitudeValue(event.target.value)}
              />
            </div>
          </label>
        </div>
        {dialogError ? <p className="readout error-readout">{dialogError}</p> : null}
        <div className="button-row modal-actions">
          <button type="button" onClick={onClose}>
            Cancel
          </button>
          <button type="button" className="active" onClick={handleApplyReference}>
            Apply
          </button>
        </div>
      </div>
    </div>
  )
}
