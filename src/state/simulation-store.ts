import { create } from 'zustand'

export type CameraPreset = 'free' | 'top'
export type SelectableBody = 'Sun' | 'Earth' | 'Moon'

export type SimulationState = {
  baseDate: Date
  currentDate: Date
  sliderDays: number
  playing: boolean
  speedDaysPerSecond: number
  cameraPreset: CameraPreset
  showEclipticReference: boolean
  moonDistanceExaggeration: number
  selectedBody: SelectableBody
  setSliderDays: (days: number) => void
  setPlaying: (playing: boolean) => void
  setSpeedDaysPerSecond: (speed: number) => void
  setCameraPreset: (preset: CameraPreset) => void
  setShowEclipticReference: (show: boolean) => void
  setMoonDistanceExaggeration: (factor: number) => void
  setSelectedBody: (body: SelectableBody) => void
  stepDays: (days: number) => void
  tick: (deltaSeconds: number) => void
  resetNow: () => void
}

export const MS_PER_DAY = 24 * 60 * 60 * 1000
export const SELECTABLE_BODIES: SelectableBody[] = ['Sun', 'Earth', 'Moon']

export const useSimulationStore = create<SimulationState>((set) => {
  const baseDate = new Date()

  return {
    baseDate,
    currentDate: baseDate,
    sliderDays: 0,
    playing: false,
    speedDaysPerSecond: 20,
    cameraPreset: 'free',
    showEclipticReference: true,
    moonDistanceExaggeration: 14,
    selectedBody: 'Earth',
    setSliderDays: (days) =>
      set((state) => ({
        sliderDays: days,
        currentDate: new Date(state.baseDate.getTime() + days * MS_PER_DAY),
      })),
    setPlaying: (playing) => set({ playing }),
    setSpeedDaysPerSecond: (speedDaysPerSecond) => set({ speedDaysPerSecond }),
    setCameraPreset: (cameraPreset) => set({ cameraPreset }),
    setShowEclipticReference: (showEclipticReference) => set({ showEclipticReference }),
    setMoonDistanceExaggeration: (moonDistanceExaggeration) => set({ moonDistanceExaggeration }),
    setSelectedBody: (selectedBody) => set({ selectedBody }),
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