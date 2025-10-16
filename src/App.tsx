/**
 * Main App component for GridSim
 */

import React, { useState, useEffect } from 'react'
import { GridCanvas } from './ui/components/canvas'
import { ComponentDetailsPanel, GridStatusPanel, TimeControlPanel } from './ui/components/panels'
import { ModeSwitcher, BuildMenu } from './ui/components/toolbar'
import { ErrorToast } from './ui/components/ErrorToast'
import { useInteractionMode, useComponentPlacement, useLinePlacement } from './ui/hooks'
import { checkCollision, getComponentSize } from './ui/utils/placement'
import { createTransmissionLine } from './utils/lineFactory'
import * as simpleMockData from './data/mockdata.simple'
import * as complexMockData from './data/mockdata.complex'
import type { Component, TransmissionLine } from './types'
import './App.css'

// Check if complex mock data should be loaded via query parameter (mockdata=e2e)
const useComplexMockData = new URLSearchParams(window.location.search).get('mockdata') === 'e2e'
const mockdata = useComplexMockData ? complexMockData : simpleMockData

const {
  mockPowerPlants,
  mockCities,
  mockTransmissionLines,
  mockSubstations,
  mockSwitchingStations,
  mockPylons,
  mockGridState,
} = mockdata

export const App = (): React.ReactElement => {
  const { mode, setMode } = useInteractionMode()
  const [selectedComponent, setSelectedComponent] = useState<Component | TransmissionLine | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const PLACEMENT_BUFFER_KEY = 'gridsim.placementBuffer'
  const [placementBuffer, setPlacementBuffer] = useState<number>(() => {
    try {
      if (typeof window === 'undefined') return 10
      const raw = window.localStorage.getItem(PLACEMENT_BUFFER_KEY)
      if (raw === null) return 10
      const parsed = Number(raw)
      return Number.isFinite(parsed) ? parsed : 10
    } catch (e) {
      void e
      return 10
    }
  })

  // Persist placementBuffer to localStorage
  useEffect(() => {
    try {
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(PLACEMENT_BUFFER_KEY, String(placementBuffer))
      }
    } catch (err) {
      void err
      // ignore storage errors
    }
  }, [placementBuffer])

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
    placementBuffer,
  })

  // Line placement hook
  const linePlacement = useLinePlacement({
    mode,
    existingLines: transmissionLines,
  })

  // Handler for adding new components
  const handleComponentAdd = (component: Component): void => {
    // console.log('App.handleComponentAdd:', component)
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
  const handleLineAdd = (sourceId: string, targetId: string, sourceHandle: string, targetHandle: string): void => {
    // Find the source and target components
    const source = allComponents.find(c => c.id === sourceId)
    const target = allComponents.find(c => c.id === targetId)

    if (!source || !target) {
      setErrorMessage('Invalid connection: component not found')
      return
    }

    // Check if connection is valid
    const validation = linePlacement.canConnectNodes(source, target)

    if (!validation.valid) {
      setErrorMessage(validation.error ?? 'Invalid connection')
      return
    }

    const newLine = createTransmissionLine(source, target, sourceHandle, targetHandle)
    setTransmissionLines([...transmissionLines, newLine])
  }

  // Handler to persist node drag positions
  const handleNodeDragStop = (id: string, x: number, y: number): void => {
    // Find the dragged component to compute its size
    const findComponentById = (identifier: string): Component | undefined =>
      powerPlants.find(p => p.id === identifier) ??
      cities.find(c => c.id === identifier) ??
      substations.find(s => s.id === identifier) ??
      switchingStations.find(s => s.id === identifier) ??
      pylons.find(p => p.id === identifier)

    const dragged = findComponentById(id)
    if (!dragged) return

    const componentSize = getComponentSize(dragged)

    // Check collision against all components excluding the dragged one
    const collision = checkCollision(x, y, componentSize, allComponents, id, 10)
    if (collision) {
      setErrorMessage('Placement blocked: space occupied')
      return
    }
    type Mutable<T> = T & { location: { x: number; y: number } }
    const updateLocation = <T extends Component>(
      items: T[],
      setFn: React.Dispatch<React.SetStateAction<T[]>>
    ): boolean => {
      const idx = items.findIndex(i => i.id === id)
      if (idx === -1) return false
      const updated = [...items]
      // create a new object with updated location
      const updatedItem = { ...(updated[idx] as unknown as Mutable<T>), location: { x, y } }
      updated[idx] = updatedItem as T
      setFn(updated)
      return true
    }

    if (updateLocation(powerPlants, setPowerPlants)) return
    if (updateLocation(cities, setCities)) return
    if (updateLocation(substations, setSubstations)) return
    if (updateLocation(switchingStations, setSwitchingStations)) return
    if (updateLocation(pylons, setPylons)) return
  }

  return (
    <div className="app">
      <ErrorToast
        message={errorMessage ?? linePlacement.lineDrawingState.errorMessage}
        onDismiss={() => {
          setErrorMessage(null)
          linePlacement.clearError()
        }}
      />

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
          <div className="buffer-control-section">
            <h3>Placement Buffer</h3>
            <input
              type="range"
              id="placement-buffer"
              min="0"
              max="50"
              value={placementBuffer}
              onChange={e => setPlacementBuffer(Number(e.target.value))}
            />
            <div className="buffer-value">Buffer: {placementBuffer}px</div>
          </div>
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
              onNodeDragStop={handleNodeDragStop}
              onPlacementBlocked={(msg: string) => setErrorMessage(msg)}
              placementBuffer={placementBuffer}
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
