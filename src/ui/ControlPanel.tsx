import { BodyDataPanel } from './panels/BodyDataPanel'
import { DebugPanel } from './panels/DebugPanel'
import { ObserverLocationPanel } from './panels/ObserverLocationPanel'
import { OverlayPanel } from './panels/OverlayPanel'
import { TimePanel } from './panels/TimePanel'
import { ViewPanel } from './panels/ViewPanel'

export function ControlPanel() {
  return (
    <aside className="control-panel">
      <div className="control-panel-header">
        <p className="eyebrow">Armillarium</p>
        <h1>Sun-Earth-Moon</h1>
      </div>
      <div className="control-panel-content">
        <TimePanel />
        <BodyDataPanel />
        <ViewPanel />
        <ObserverLocationPanel />
        <OverlayPanel />
        <DebugPanel />
      </div>
    </aside>
  )
}
