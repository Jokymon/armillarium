import { useState } from 'react'
import { formatDate, formatJulianDate } from '../formatters'
import {
  PLAYBACK_RATE_OPTIONS,
  STEP_INCREMENT_OPTIONS,
  useSimulationStore,
} from '../../state/simulation-store'
import { SetNowHomeDialog } from './SetNowHomeDialog'

export function TimePanel() {
  const currentDate = useSimulationStore((state) => state.currentDate)
  const sliderDays = useSimulationStore((state) => state.sliderDays)
  const playing = useSimulationStore((state) => state.playing)
  const stepIncrementDays = useSimulationStore((state) => state.stepIncrementDays)
  const speedDaysPerSecond = useSimulationStore((state) => state.speedDaysPerSecond)
  const setSliderDays = useSimulationStore((state) => state.setSliderDays)
  const setPlaying = useSimulationStore((state) => state.setPlaying)
  const setStepIncrementDays = useSimulationStore((state) => state.setStepIncrementDays)
  const setSpeedDaysPerSecond = useSimulationStore((state) => state.setSpeedDaysPerSecond)
  const stepDays = useSimulationStore((state) => state.stepDays)
  const resetNow = useSimulationStore((state) => state.resetNow)
  const [isReferenceDialogOpen, setIsReferenceDialogOpen] = useState(false)

  return (
    <section>
      <h2>Time</h2>
      <div className="button-row">
        <button onClick={() => stepDays(-stepIncrementDays)}>Back</button>
        <button onClick={() => setPlaying(!playing)}>{playing ? 'Pause' : 'Play'}</button>
        <button onClick={() => stepDays(stepIncrementDays)}>Forward</button>
        <button onClick={resetNow}>Reset</button>
        <button onClick={() => setIsReferenceDialogOpen(true)}>Set Now / Home</button>
      </div>
      <div className="segmented-field">
        <span>Step size</span>
        <div className="button-row compact-buttons">
          {STEP_INCREMENT_OPTIONS.map((option) => (
            <button
              key={option.label}
              className={option.days === stepIncrementDays ? 'active' : undefined}
              onClick={() => setStepIncrementDays(option.days)}
              type="button"
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>
      <div className="segmented-field">
        <span>Playback rate</span>
        <div className="button-row compact-buttons">
          {PLAYBACK_RATE_OPTIONS.map((option) => (
            <button
              key={option.label}
              className={option.daysPerSecond === speedDaysPerSecond ? 'active' : undefined}
              onClick={() => setSpeedDaysPerSecond(option.daysPerSecond)}
              type="button"
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>
      <label className="range-field">
        <span>Days from now: {sliderDays.toFixed(1)}</span>
        <input
          type="range"
          min={-365}
          max={365}
          step={0.5}
          value={sliderDays}
          onChange={(event) => setSliderDays(Number(event.target.value))}
        />
      </label>
      <p className="readout">Current UTC: {formatDate(currentDate)}</p>
      <p className="readout">Julian Date: {formatJulianDate(currentDate)}</p>
      <SetNowHomeDialog isOpen={isReferenceDialogOpen} onClose={() => setIsReferenceDialogOpen(false)} />
    </section>
  )
}
