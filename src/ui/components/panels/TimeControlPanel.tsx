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
    return new Intl.DateTimeFormat('en-GB', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    }).format(date)
  }

  return (
    <div className="panel time-control-panel time-control-header">
      <h2 className="panel-title" style={{ display: 'none' }}>
        Time Control
      </h2>

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
