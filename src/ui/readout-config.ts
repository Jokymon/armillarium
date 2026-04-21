import type { ReadoutReferenceFrame } from '../state/simulation-store'
import { formatDegrees, formatHours } from './formatters'

type ValueFormatter = (value: number | null) => string

type ReadoutConfig = {
  primaryLabel: string
  secondaryLabel: string
  distanceLabel: string
  primaryFormatter: ValueFormatter
  secondaryFormatter: ValueFormatter
}

export const READOUT_CONFIG: Record<ReadoutReferenceFrame, ReadoutConfig> = {
  'heliocentric-ecliptic-j2000': {
    primaryLabel: 'l',
    secondaryLabel: 'b',
    distanceLabel: 'r',
    primaryFormatter: formatDegrees,
    secondaryFormatter: formatDegrees,
  },
  'geocentric-ecliptic-j2000': {
    primaryLabel: 'λ',
    secondaryLabel: 'β',
    distanceLabel: 'Δ',
    primaryFormatter: formatDegrees,
    secondaryFormatter: formatDegrees,
  },
  'geocentric-equatorial-j2000': {
    primaryLabel: 'α',
    secondaryLabel: 'δ',
    distanceLabel: 'Δ',
    primaryFormatter: formatHours,
    secondaryFormatter: formatDegrees,
  },
  'topocentric-horizontal': {
    primaryLabel: 'Az',
    secondaryLabel: 'h',
    distanceLabel: 'ρ',
    primaryFormatter: formatDegrees,
    secondaryFormatter: formatDegrees,
  },
}
