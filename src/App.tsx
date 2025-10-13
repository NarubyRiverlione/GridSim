/**
 * Main App component for GridSim
 */

import React, { useState } from 'react'
import { GridCanvas } from './ui/components/canvas'
import { ComponentDetailsPanel, GridStatusPanel, TimeControlPanel } from './ui/components/panels'
import { ModeSwitcher, BuildMenu } from './ui/components/toolbar'
import { ErrorToast } from './ui/components/ErrorToast'
import { useInteractionMode, useComponentPlacement, useLinePlacement, createTransmissionLine } from './ui/hooks'
import {
  mockPowerPlants,
  mockCities,
  mockTransmissionLines,
  mockSubstations,
  mockSwitchingStations,
  mockPylons,
  mockGridState,
} from './data/mockData'
import type { Component, TransmissionLine } from './types'
import './App.css'

export const App = (): React.ReactElement => {
  const { mode, setMode } = useInteractionMode()
  const [selectedComponent, setSelectedComponent] = useState<Component | TransmissionLine | null>(null)

  // Stateful component data
  const [powerPlants, setPowerPlants] = useState(mockPowerPlants)
  const [cities, setCities] = useState(mockCities)
  const [substations, setSubstations] = useState(mockSubstations)
  const [switchingStations, setSwitchingStations] = useState(mockSwitchingStations)
  const [pylons, setPylons] = useState(mockPylons)
  const [transmissionLines, setTransmissionLines] = useState(mockTransmissionLines)

  // Combine all components for placement collision detection
  const allComponents: Component[] = [...powerPlants, ...cities, ...substations, ...switchingStations, ...pylons]

  // Component placement hook
  const placement = useComponentPlacement({
    mode,
    existingComponents: allComponents,
  })

  // Line placement hook
  const linePlacement = useLinePlacement({
    mode,
    existingLines: transmissionLines,
  })

  // Handler for adding new components
  const handleComponentAdd = (component: Component): void => {
    if ('type' in component && 'capacity' in component && 'currentOutput' in component) {
      setPowerPlants([...powerPlants, component])
    } else if ('name' in component && 'size' in component) {
      setCities([...cities, component])
    } else if ('voltageIn' in component && 'voltageOut' in component) {
      setSubstations([...substations, component])
    } else if ('breakers' in component && 'connectedLines' in component) {
      setSwitchingStations([...switchingStations, component])
    } else if ('maxLines' in component && !('breakers' in component)) {
      setPylons([...pylons, component])
    }
  }

  // Handler for adding new transmission lines
  const handleLineAdd = (source: Component, target: Component): void => {
    // Check if connection is valid
    const validation = linePlacement.canConnectNodes(source, target)

    if (!validation.valid) {
      // Error is already set in lineDrawingState by handleNodeClickForLine
      return
    }

    const newLine = createTransmissionLine(source, target)
    setTransmissionLines([...transmissionLines, newLine])
  }

  return (
    <div className="app">
      <ErrorToast message={linePlacement.lineDrawingState.errorMessage} onDismiss={linePlacement.clearError} />

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
          <BuildMenu
            currentMode={mode}
            selectedPlantType={placement.placementConfig.plantType}
            selectedCitySize={placement.placementConfig.citySize}
            selectedSubstationType={placement.placementConfig.substationType}
            onPlantTypeChange={placement.setPlantType}
            onCitySizeChange={placement.setCitySize}
            onSubstationTypeChange={placement.setSubstationType}
          />
          <ComponentDetailsPanel component={selectedComponent} />
        </div>

        <div className="canvas-container">
          <div className="canvas-area">
            <GridCanvas
              components={allComponents}
              transmissionLines={transmissionLines}
              onComponentSelect={setSelectedComponent}
              mode={mode}
              placementState={placement.placementState}
              placementConfig={placement.placementConfig}
              onMouseMove={placement.handleMouseMove}
              onPlacementClick={placement.handleClick}
              onComponentAdd={handleComponentAdd}
              lineDrawingState={linePlacement.lineDrawingState}
              onNodeClickForLine={linePlacement.handleNodeClickForLine}
              onMouseMoveForLine={linePlacement.handleMouseMoveForLine}
              onLineAdd={handleLineAdd}
            />
          </div>
          <div className="canvas-footer">
            <GridStatusPanel gridState={mockGridState} />
          </div>
        </div>
      </div>
    </div>
  )
}
