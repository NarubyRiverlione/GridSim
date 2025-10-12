/**
 * Panel for time controls (placeholder for Phase 0)
 */

import React from 'react'
import type { GridState } from '@/types'
import './PanelStyles.css'

interface TimeControlPanelProps {
  gridState: GridState
}

export const TimeControlPanel = ({ gridState }: TimeControlPanelProps): React.ReactElement => {
  const formatDate = (date: Date): string => {
    return new Intl.DateTimeFormat('en-EU', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date)
  }

  return (
    <div className="panel time-control-panel time-control-header">
      <div className="time-display">
        <div className="current-time">{formatDate(gridState.currentTime)}</div>
        <div className="season-badge">{gridState.season}</div>
      </div>

      <div className="control-buttons">
        <button className="control-btn" disabled title="Pause (Phase 1)">
          ⏸️
        </button>
        <button className="control-btn" disabled title="Play (Phase 1)">
          ▶️
        </button>
      </div>

      <div className="speed-controls">
        <span className="speed-label">Speed:</span>
        <div className="speed-buttons">
          <button className="speed-btn" disabled>
            1x
          </button>
          <button className="speed-btn" disabled>
            2x
          </button>
          <button className="speed-btn" disabled>
            5x
          </button>
          <button className="speed-btn" disabled>
            10x
          </button>
        </div>
      </div>
    </div>
  )
}
