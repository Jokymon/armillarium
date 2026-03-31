export function NotesPanel() {
  return (
    <section>
      <h2>Notes</h2>
      <ul>
        <li>The Sun is fixed at the origin of the heliocentric scene.</li>
        <li>Earth and Moon positions come from Astronomy Engine heliocentric vectors converted from EQJ to Ecliptic J2000.</li>
        <li>The Body Data panel uses physical ecliptic coordinates, not the exaggerated Moon display position.</li>
        <li>The Body Data frame selector now supports heliocentric and geocentric ecliptic J2000 readouts.</li>
        <li>The visible ecliptic overlay follows the active reference frame origin while keeping the same axis directions.</li>
        <li>The Moon uses display-only Earth-Moon distance exaggeration so the underlying ephemeris remains unchanged.</li>
        <li>Earth orbit and Moon track are sampled from the ephemeris and rendered in the same Ecliptic J2000 reference frame.</li>
        <li>Visual sizes and some displayed distances are exaggerated for readability.</li>
      </ul>
    </section>
  )
}