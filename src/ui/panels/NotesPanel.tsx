export function NotesPanel() {
  return (
    <section>
      <h2>Notes</h2>
      <ul>
        <li>The Sun is fixed at the origin.</li>
        <li>Earth and Moon positions come from Astronomy Engine heliocentric vectors converted from EQJ to Ecliptic J2000.</li>
        <li>The Body Data panel uses the physical ecliptic coordinates, not the exaggerated Moon display position.</li>
        <li>The Moon uses display-only Earth-Moon distance exaggeration so the underlying ephemeris remains unchanged.</li>
        <li>Earth orbit and Moon track are sampled from the ephemeris and rendered in the same Ecliptic J2000 reference frame.</li>
        <li>Visual sizes and some displayed distances are exaggerated for readability.</li>
      </ul>
    </section>
  )
}