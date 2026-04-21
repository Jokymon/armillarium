import { create } from 'zustand'

export type CameraPreset = 'free' | 'top'
export type CameraTrackingTarget = 'none' | 'selected-body'
export type InteractionMode = 'select-body' | 'pick-earth-location'
export type SelectableBody =
  | 'Sun'
  | 'Mercury'
  | 'Venus'
  | 'Earth'
  | 'Mars'
  | 'Jupiter'
  | 'Saturn'
  | 'Uranus'
  | 'Neptune'
  | 'Moon'
export type ReadoutReferenceFrame =
  | 'heliocentric-ecliptic-j2000'
  | 'geocentric-ecliptic-j2000'
  | 'geocentric-equatorial-j2000'
  | 'topocentric-horizontal'

export type SimulationState = {
  baseDate: Date
  currentDate: Date
  sliderDays: number
  playing: boolean
  stepIncrementDays: number
  speedDaysPerSecond: number
  cameraPreset: CameraPreset
  cameraTrackingTarget: CameraTrackingTarget
  interactionMode: InteractionMode
  showHeliocentricEcliptic: boolean
  showGeocentricEcliptic: boolean
  showGeocentricEquatorial: boolean
  showTopocentricHorizontal: boolean
  moonDistanceExaggeration: number
  selectedBody: SelectableBody
  observerLatitude: number
  observerLongitude: number
  observerElevationMeters: number
  readoutReferenceFrame: ReadoutReferenceFrame
  setSliderDays: (days: number) => void
  setPlaying: (playing: boolean) => void
  setStepIncrementDays: (days: number) => void
  setSpeedDaysPerSecond: (speed: number) => void
  setCameraPreset: (preset: CameraPreset) => void
  setCameraTrackingTarget: (target: CameraTrackingTarget) => void
  setInteractionMode: (mode: InteractionMode) => void
  setShowHeliocentricEcliptic: (show: boolean) => void
  setShowGeocentricEcliptic: (show: boolean) => void
  setShowGeocentricEquatorial: (show: boolean) => void
  setShowTopocentricHorizontal: (show: boolean) => void
  setMoonDistanceExaggeration: (factor: number) => void
  setSelectedBody: (body: SelectableBody) => void
  setObserverLocation: (latitude: number, longitude: number) => void
  setReadoutReferenceFrame: (frame: ReadoutReferenceFrame) => void
  stepDays: (days: number) => void
  tick: (deltaSeconds: number) => void
  resetNow: () => void
}

export const MS_PER_DAY = 24 * 60 * 60 * 1000
export const SELECTABLE_BODIES: SelectableBody[] = [
  'Sun',
  'Mercury',
  'Venus',
  'Earth',
  'Mars',
  'Jupiter',
  'Saturn',
  'Uranus',
  'Neptune',
  'Moon',
]
export const STEP_INCREMENT_OPTIONS = [
  { days: 1 / 24, label: '1h' },
  { days: 6 / 24, label: '6h' },
  { days: 1, label: '1d' },
  { days: 10, label: '10d' },
  { days: 30, label: '30d' },
] as const
export const PLAYBACK_RATE_OPTIONS = [
  { daysPerSecond: 1 / 24, label: '1h/s' },
  { daysPerSecond: 6 / 24, label: '6h/s' },
  { daysPerSecond: 1, label: '1d/s' },
  { daysPerSecond: 10, label: '10d/s' },
  { daysPerSecond: 30, label: '30d/s' },
  { daysPerSecond: 100, label: '100d/s' },
] as const
export const READOUT_REFERENCE_FRAME_OPTIONS: Array<{
  value: ReadoutReferenceFrame
  shortLabel: string
  label: string
}> = [
  {
    value: 'heliocentric-ecliptic-j2000',
    shortLabel: 'Heliocentric',
    label: 'Heliocentric Ecliptic J2000',
  },
  {
    value: 'geocentric-ecliptic-j2000',
    shortLabel: 'Geo Ecliptic',
    label: 'Geocentric Ecliptic J2000',
  },
  {
    value: 'geocentric-equatorial-j2000',
    shortLabel: 'Geo Equatorial',
    label: 'Geocentric Equatorial J2000',
  },
  {
    value: 'topocentric-horizontal',
    shortLabel: 'Topo Horizontal',
    label: 'Topocentric Horizontal',
  },
]

export const useSimulationStore = create<SimulationState>((set) => {
  const baseDate = new Date()

  return {
    baseDate,
    currentDate: baseDate,
    sliderDays: 0,
    playing: false,
    stepIncrementDays: 1,
    speedDaysPerSecond: 1,
    cameraPreset: 'free',
    cameraTrackingTarget: 'none',
    interactionMode: 'select-body',
    showHeliocentricEcliptic: true,
    showGeocentricEcliptic: false,
    showGeocentricEquatorial: false,
    showTopocentricHorizontal: false,
    moonDistanceExaggeration: 14,
    selectedBody: 'Earth',
    observerLatitude: 0,
    observerLongitude: 0,
    observerElevationMeters: 0,
    readoutReferenceFrame: 'heliocentric-ecliptic-j2000',
    setSliderDays: (days) =>
      set((state) => ({
        sliderDays: days,
        currentDate: new Date(state.baseDate.getTime() + days * MS_PER_DAY),
      })),
    setPlaying: (playing) => set({ playing }),
    setStepIncrementDays: (stepIncrementDays) => set({ stepIncrementDays }),
    setSpeedDaysPerSecond: (speedDaysPerSecond) => set({ speedDaysPerSecond }),
    setCameraPreset: (cameraPreset) => set({ cameraPreset }),
    setCameraTrackingTarget: (cameraTrackingTarget) => set({ cameraTrackingTarget }),
    setInteractionMode: (interactionMode) => set({ interactionMode }),
    setShowHeliocentricEcliptic: (showHeliocentricEcliptic) => set({ showHeliocentricEcliptic }),
    setShowGeocentricEcliptic: (showGeocentricEcliptic) => set({ showGeocentricEcliptic }),
    setShowGeocentricEquatorial: (showGeocentricEquatorial) => set({ showGeocentricEquatorial }),
    setShowTopocentricHorizontal: (showTopocentricHorizontal) => set({ showTopocentricHorizontal }),
    setMoonDistanceExaggeration: (moonDistanceExaggeration) => set({ moonDistanceExaggeration }),
    setSelectedBody: (selectedBody) => set({ selectedBody }),
    setObserverLocation: (observerLatitude, observerLongitude) => set({ observerLatitude, observerLongitude }),
    setReadoutReferenceFrame: (readoutReferenceFrame) => set({ readoutReferenceFrame }),
    stepDays: (days) =>
      set((state) => {
        const sliderDays = state.sliderDays + days
        return {
          sliderDays,
          currentDate: new Date(state.baseDate.getTime() + sliderDays * MS_PER_DAY),
        }
      }),
    tick: (deltaSeconds) =>
      set((state) => {
        if (!state.playing) {
          return state
        }

        const sliderDays = state.sliderDays + deltaSeconds * state.speedDaysPerSecond
        return {
          sliderDays,
          currentDate: new Date(state.baseDate.getTime() + sliderDays * MS_PER_DAY),
        }
      }),
    resetNow: () => {
      const nextBaseDate = new Date()
      set({
        baseDate: nextBaseDate,
        currentDate: nextBaseDate,
        sliderDays: 0,
        playing: false,
      })
    },
  }
})
