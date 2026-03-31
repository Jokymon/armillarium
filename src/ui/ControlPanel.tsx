import { BodyDataPanel } from './panels/BodyDataPanel'
import { DebugPanel } from './panels/DebugPanel'
import { EclipticReferencePanel } from './panels/EclipticReferencePanel'
import { TimePanel } from './panels/TimePanel'
import { ViewPanel } from './panels/ViewPanel'

export function ControlPanel() {
  return (
    <aside className="control-panel">
      <div className="control-panel-header">
        <p className="eyebrow">Astrolabium</p>
        <h1>Sun-Earth-Moon</h1>
      </div>
      <div className="control-panel-content">
        <TimePanel />
        <ViewPanel />
        <BodyDataPanel />
        <EclipticReferencePanel />
        <DebugPanel />
      </div>
    </aside>
  )
}
