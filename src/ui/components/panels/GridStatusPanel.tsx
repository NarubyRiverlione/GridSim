/**
 * Panel displaying overall grid status and metrics
 */

import React from 'react'
import type { GridState } from '@/types'
import './PanelStyles.css'

interface GridStatusPanelProps {
  gridState: GridState
}

export const GridStatusPanel = ({ gridState }: GridStatusPanelProps): React.ReactElement => {
  const { budget, happiness, electricityPrice, metrics } = gridState

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-EU', {
      style: 'currency',
      currency: 'EUR',
      notation: 'compact',
      maximumFractionDigits: 1,
    }).format(amount)
  }

  return (
    <div className="panel grid-status-panel">
      <h2 className="panel-title">Grid Status</h2>

      <div className="status-grid">
        <div className="status-item">
          <span className="status-label">Budget</span>
          <span className="status-value">{formatCurrency(budget)}</span>
        </div>

        <div className="status-item happiness-item">
          <span className="status-label">Happiness</span>
          <div className="happiness-bar-container">
            <div
              className="happiness-bar"
              style={{ width: `${happiness}%`, background: getHappinessColor(happiness) }}
            />
          </div>
          <span className="status-value happiness-value" style={{ color: getHappinessColor(happiness) }}>
            {happiness}%
          </span>
        </div>

        <div className="status-item">
          <span className="status-label">Price</span>
          <span className="status-value">€{electricityPrice}/MWh</span>
        </div>

        <div className="status-item">
          <span className="status-label">Generation</span>
          <span className="status-value">{metrics.totalGenerationCapacity} MW</span>
        </div>

        <div className="status-item">
          <span className="status-label">Demand</span>
          <span className="status-value">{metrics.currentDemand} MW</span>
        </div>

        <div className="status-item">
          <span className="status-label">Utilization</span>
          <span className="status-value">{Math.round(metrics.utilization * 100)}%</span>
        </div>

        <div className="status-item">
          <span className="status-label">Cities Powered</span>
          <span className="status-value">
            {metrics.citiesPowered} / {metrics.totalCities}
          </span>
        </div>

        <div className="status-item">
          <span className="status-label">Uptime</span>
          <span className="status-value">{Math.round(metrics.totalUptime * 100)}%</span>
        </div>
      </div>
    </div>
  )
}

const getHappinessColor = (happiness: number): string => {
  if (happiness >= 70) return '#22c55e'
  if (happiness >= 40) return '#eab308'
  return '#ef4444'
}
