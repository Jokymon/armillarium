import { useSimulationStore } from '../../state/simulation-store'

export function OverlayPanel() {
  const showHeliocentricEcliptic = useSimulationStore((state) => state.showHeliocentricEcliptic)
  const showGeocentricEcliptic = useSimulationStore((state) => state.showGeocentricEcliptic)
  const showGeocentricEquatorial = useSimulationStore((state) => state.showGeocentricEquatorial)
  const showTopocentricHorizontal = useSimulationStore((state) => state.showTopocentricHorizontal)
  const setShowHeliocentricEcliptic = useSimulationStore((state) => state.setShowHeliocentricEcliptic)
  const setShowGeocentricEcliptic = useSimulationStore((state) => state.setShowGeocentricEcliptic)
  const setShowGeocentricEquatorial = useSimulationStore((state) => state.setShowGeocentricEquatorial)
  const setShowTopocentricHorizontal = useSimulationStore((state) => state.setShowTopocentricHorizontal)

  return (
    <section>
      <h2>Overlays</h2>
      <label className="toggle-field compact-toggle">
        <input
          type="checkbox"
          checked={showHeliocentricEcliptic}
          onChange={(event) => setShowHeliocentricEcliptic(event.target.checked)}
        />
        <span>Heliocentric ecliptic J2000</span>
      </label>
      <label className="toggle-field second-toggle">
        <input
          type="checkbox"
          checked={showGeocentricEcliptic}
          onChange={(event) => setShowGeocentricEcliptic(event.target.checked)}
        />
        <span>Geocentric ecliptic J2000</span>
      </label>
      <label className="toggle-field second-toggle">
        <input
          type="checkbox"
          checked={showGeocentricEquatorial}
          onChange={(event) => setShowGeocentricEquatorial(event.target.checked)}
        />
        <span>Geocentric equatorial J2000</span>
      </label>
      <label className="toggle-field second-toggle">
        <input
          type="checkbox"
          checked={showTopocentricHorizontal}
          onChange={(event) => setShowTopocentricHorizontal(event.target.checked)}
        />
        <span>Topocentric horizontal</span>
      </label>
    </section>
  )
}
