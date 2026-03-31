import { BodyDataPanel } from './panels/BodyDataPanel'
import { DebugPanel } from './panels/DebugPanel'
import { EclipticReferencePanel } from './panels/EclipticReferencePanel'
import { TimePanel } from './panels/TimePanel'
import { ViewPanel } from './panels/ViewPanel'

export function ControlPanel() {
  return (
    <aside className="control-panel">
      <div>
        <p className="eyebrow">Astrolabium</p>
        <h1>Sun-Earth-Moon</h1>
      </div>

      <TimePanel />
      <ViewPanel />
      <BodyDataPanel />
      <EclipticReferencePanel />
      <DebugPanel />
    </aside>
  )
}