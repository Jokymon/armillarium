import { BodyDataPanel } from './panels/BodyDataPanel'
import { EclipticReferencePanel } from './panels/EclipticReferencePanel'
import { NotesPanel } from './panels/NotesPanel'
import { TimePanel } from './panels/TimePanel'
import { ViewPanel } from './panels/ViewPanel'

export function ControlPanel() {
  return (
    <aside className="control-panel">
      <div>
        <p className="eyebrow">Astrolabium Prototype</p>
        <h1>Sun-Earth-Moon Slice</h1>
        <p className="lede">
          The current MVP slice uses sampled ephemeris positions in Ecliptic J2000 for the Sun, Earth, and Moon while keeping the UI deliberately light.
        </p>
      </div>

      <TimePanel />
      <ViewPanel />
      <BodyDataPanel />
      <EclipticReferencePanel />
      <NotesPanel />
    </aside>
  )
}