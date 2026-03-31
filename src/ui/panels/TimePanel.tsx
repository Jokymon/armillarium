import { formatDate, formatJulianDate } from '../formatters'
import { useSimulationStore } from '../../state/simulation-store'

export function TimePanel() {
  const currentDate = useSimulationStore((state) => state.currentDate)
  const sliderDays = useSimulationStore((state) => state.sliderDays)
  const playing = useSimulationStore((state) => state.playing)
  const speedDaysPerSecond = useSimulationStore((state) => state.speedDaysPerSecond)
  const setSliderDays = useSimulationStore((state) => state.setSliderDays)
  const setPlaying = useSimulationStore((state) => state.setPlaying)
  const setSpeedDaysPerSecond = useSimulationStore((state) => state.setSpeedDaysPerSecond)
  const stepDays = useSimulationStore((state) => state.stepDays)
  const resetNow = useSimulationStore((state) => state.resetNow)

  return (
    <section>
      <h2>Time</h2>
      <div className="button-row">
        <button onClick={() => stepDays(-5)}>Back 5d</button>
        <button onClick={() => setPlaying(!playing)}>{playing ? 'Pause' : 'Play'}</button>
        <button onClick={() => stepDays(5)}>Forward 5d</button>
        <button onClick={resetNow}>Reset</button>
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
      <label className="range-field">
        <span>Playback speed: {speedDaysPerSecond.toFixed(0)} days/sec</span>
        <input
          type="range"
          min={-120}
          max={120}
          step={5}
          value={speedDaysPerSecond}
          onChange={(event) => setSpeedDaysPerSecond(Number(event.target.value))}
        />
      </label>
      <p className="readout">Current UTC: {formatDate(currentDate)}</p>
      <p className="readout">Julian Date: {formatJulianDate(currentDate)}</p>
    </section>
  )
}
