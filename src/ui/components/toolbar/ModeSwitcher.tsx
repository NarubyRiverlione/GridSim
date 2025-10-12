/**
 * Mode switcher toolbar for interaction modes
 */

import React from 'react'
import { InteractionMode } from '@/types'
import './ToolbarStyles.css'

interface ModeSwitcherProps {
  currentMode: InteractionMode
  onModeChange: (mode: InteractionMode) => void
}

export const ModeSwitcher = ({ currentMode, onModeChange }: ModeSwitcherProps): React.ReactElement => {
  const modes = [
    { id: InteractionMode.Select, label: 'Select', icon: '👆' },
    { id: InteractionMode.AddPowerPlant, label: 'Power Plant', icon: '⚡' },
    { id: InteractionMode.AddCity, label: 'City', icon: '🏙️' },
    { id: InteractionMode.AddTransmissionLine, label: 'Line', icon: '🗼' },
    { id: InteractionMode.AddSubstation, label: 'Substation', icon: '🏭' },
    { id: InteractionMode.AddSwitchingStation, label: 'Switching', icon: '🔀' },
    { id: InteractionMode.AddPylon, label: 'Pylon', icon: '⚡' },
  ]

  return (
    <div className="mode-switcher">
      <div className="mode-switcher-title">Tool Mode</div>
      <div className="mode-buttons">
        {modes.map(mode => (
          <button
            key={mode.id}
            className={`mode-button ${currentMode === mode.id ? 'active' : ''}`}
            onClick={() => {
              onModeChange(mode.id)
            }}
            title={mode.label}
          >
            <span className="mode-icon">{mode.icon}</span>
            <span className="mode-label">{mode.label}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
