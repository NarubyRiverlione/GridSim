/**
 * Main App component for GridSim
 */

import React, { useState } from 'react'
import { GridCanvas } from './ui/components/canvas'
import { ComponentDetailsPanel, GridStatusPanel, TimeControlPanel } from './ui/components/panels'
import { ModeSwitcher } from './ui/components/toolbar'
import { useInteractionMode } from './ui/hooks'
import {
  mockPowerPlants,
  mockCities,
  mockTransmissionLines,
  mockSubstations,
  mockSwitchingStations,
  mockGridState,
} from './data/mockData'
import type { Component, TransmissionLine } from './types'
import './App.css'

export const App = (): React.ReactElement => {
  const { mode, setMode } = useInteractionMode()
  const [selectedComponent, setSelectedComponent] = useState<Component | TransmissionLine | null>(null)

  // Combine all components
  const allComponents: Component[] = [...mockPowerPlants, ...mockCities, ...mockSubstations, ...mockSwitchingStations]

  return (
    <div className="app">
      <div className="app-header">
        <div className="header-left">
          <h1 className="app-title">GridSim</h1>
          <p className="app-subtitle">Electrical Grid Management Simulation - Phase 0 UI Proof of Concept</p>
        </div>
        <div className="header-right">
          <TimeControlPanel gridState={mockGridState} />
        </div>
      </div>

      <div className="app-content">
        <div className="sidebar-left">
          <ModeSwitcher currentMode={mode} onModeChange={setMode} />
        </div>

        <div className="canvas-area">
          <GridCanvas
            components={allComponents}
            transmissionLines={mockTransmissionLines}
            onComponentSelect={setSelectedComponent}
          />
        </div>

        <div className="sidebar-right">
          <GridStatusPanel gridState={mockGridState} />
          <ComponentDetailsPanel component={selectedComponent} />
        </div>
      </div>
    </div>
  )
}
