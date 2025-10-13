/**
 * Hook for managing transmission line placement
 */

import { useState, useCallback } from 'react'
import type { Component, TransmissionLine, Point, PowerPlant, City, Substation } from '@/types'
import { InteractionMode, VoltageLevel, ComponentState } from '@/types'

export interface LineDrawingState {
  isDrawing: boolean
  sourceNode: Component | null
  previewPosition: Point | null
  errorMessage: string | null
}

export interface UseLinePlacementReturn {
  lineDrawingState: LineDrawingState
  handleNodeClickForLine: (node: Component) => void
  handleMouseMoveForLine: (x: number, y: number) => void
  resetLineDrawing: () => void
  canConnectNodes: (source: Component, target: Component) => { valid: boolean; error?: string }
  clearError: () => void
}

interface UseLinePlacementProps {
  mode: InteractionMode
  existingLines: TransmissionLine[]
}

let lineIdCounter = 2000

export const useLinePlacement = ({ mode, existingLines }: UseLinePlacementProps): UseLinePlacementReturn => {
  const [lineDrawingState, setLineDrawingState] = useState<LineDrawingState>({
    isDrawing: false,
    sourceNode: null,
    previewPosition: null,
    errorMessage: null,
  })

  const resetLineDrawing = useCallback((): void => {
    setLineDrawingState({
      isDrawing: false,
      sourceNode: null,
      previewPosition: null,
      errorMessage: null,
    })
  }, [])

  const canConnectNodes = useCallback(
    (source: Component, target: Component): { valid: boolean; error?: string } => {
      // Can't connect node to itself
      if (source.id === target.id) {
        return { valid: false, error: 'Cannot connect component to itself' }
      }

      // Can't connect two cities
      if (isCity(source) && isCity(target)) {
        return { valid: false, error: 'Cannot connect two cities directly' }
      }

      // Check if line already exists
      const lineExists = existingLines.some(
        line => (line.from === source.id && line.to === target.id) || (line.from === target.id && line.to === source.id)
      )

      if (lineExists) {
        return { valid: false, error: 'Line already exists between these components' }
      }

      // Voltage compatibility check (simplified for Phase 0)
      const sourceVoltage = getComponentVoltage(source)
      const targetVoltage = getComponentVoltage(target)

      if (sourceVoltage !== null && targetVoltage !== null && sourceVoltage !== targetVoltage) {
        return {
          valid: false,
          error: `Voltage mismatch: ${sourceVoltage}kV → ${targetVoltage}kV (use substation)`,
        }
      }

      return { valid: true }
    },
    [existingLines]
  )

  const handleNodeClickForLine = useCallback(
    (node: Component): void => {
      if (mode !== InteractionMode.AddTransmissionLine) return

      if (!lineDrawingState.isDrawing) {
        // Start drawing from this node
        setLineDrawingState({
          isDrawing: true,
          sourceNode: node,
          previewPosition: node.location,
          errorMessage: null,
        })
      } else if (lineDrawingState.sourceNode !== null) {
        // Complete the line
        const validation = canConnectNodes(lineDrawingState.sourceNode, node)

        if (validation.valid) {
          // Line is valid - App will handle creating it
          resetLineDrawing()
        } else {
          // Show error message
          setLineDrawingState(prev => ({
            ...prev,
            errorMessage: validation.error ?? 'Invalid connection',
          }))

          // Clear error after 3 seconds
          setTimeout(() => {
            setLineDrawingState(prev => ({
              ...prev,
              errorMessage: null,
            }))
          }, 3000)
        }
      }
    },
    [mode, lineDrawingState, canConnectNodes, resetLineDrawing]
  )

  const handleMouseMoveForLine = useCallback(
    (x: number, y: number): void => {
      if (mode === InteractionMode.AddTransmissionLine && lineDrawingState.isDrawing) {
        setLineDrawingState(prev => ({
          ...prev,
          previewPosition: { x, y },
        }))
      }
    },
    [mode, lineDrawingState.isDrawing]
  )

  const clearError = useCallback((): void => {
    setLineDrawingState(prev => ({
      ...prev,
      errorMessage: null,
    }))
  }, [])

  return {
    lineDrawingState,
    handleNodeClickForLine,
    handleMouseMoveForLine,
    resetLineDrawing,
    canConnectNodes,
    clearError,
  }
}

// Helper functions
const isCity = (component: Component): component is City => {
  return 'name' in component && 'size' in component
}

const isPowerPlant = (component: Component): component is PowerPlant => {
  return 'type' in component && 'capacity' in component && 'currentOutput' in component
}

const isSubstation = (component: Component): component is Substation => {
  return 'voltageIn' in component && 'voltageOut' in component
}

const getComponentVoltage = (component: Component): VoltageLevel | null => {
  if (isPowerPlant(component)) {
    return VoltageLevel.KV400 // Power plants output at 400kV
  }

  if (isCity(component)) {
    return VoltageLevel.KV110 // Cities accept 110kV
  }

  if (isSubstation(component)) {
    // Substations have both input and output voltages
    // For connection purposes, we'll return null to allow more flexible validation
    return null
  }

  // Pylons and switching stations can carry any voltage
  return null
}

export const createTransmissionLine = (source: Component, target: Component): TransmissionLine => {
  const id = `line-${lineIdCounter++}`

  // Determine voltage based on endpoints
  const voltage = determineLineVoltage(source, target)

  // Calculate distance (simple Euclidean distance)
  const distance = Math.sqrt(
    Math.pow(target.location.x - source.location.x, 2) + Math.pow(target.location.y - source.location.y, 2)
  )

  // Convert pixel distance to km (assuming 1 pixel = 1 km for Phase 0)
  const distanceKm = Math.round(distance)

  // Determine capacity based on voltage
  const capacity = getLineCapacity(voltage)

  return {
    id,
    from: source.id,
    to: target.id,
    path: [source.location, target.location],
    voltage,
    capacity,
    currentLoad: 0,
    resistance: calculateResistance(voltage, distanceKm),
    distance: distanceKm,
    breakerClosed: true,
    breakerTripped: false,
    state: ComponentState.Healthy,
  }
}

const determineLineVoltage = (source: Component, target: Component): VoltageLevel => {
  const sourceVoltage = getComponentVoltage(source)
  const targetVoltage = getComponentVoltage(target)

  // If both have defined voltages and they match, use that
  if (sourceVoltage !== null && targetVoltage !== null && sourceVoltage === targetVoltage) {
    return sourceVoltage
  }

  // If one endpoint is a power plant, use 400kV
  if (isPowerPlant(source) || isPowerPlant(target)) {
    return VoltageLevel.KV400
  }

  // If one endpoint is a city, use 110kV
  if (isCity(source) || isCity(target)) {
    return VoltageLevel.KV110
  }

  // If connected to substation, check its voltages
  if (isSubstation(source)) {
    return source.voltageIn
  }

  if (isSubstation(target)) {
    return isSubstation(target) ? target.voltageIn : VoltageLevel.KV220
  }

  // Default to 220kV for intermediate connections
  return VoltageLevel.KV220
}

const getLineCapacity = (voltage: VoltageLevel): number => {
  switch (voltage) {
    case VoltageLevel.KV400:
      return 1500
    case VoltageLevel.KV220:
      return 600
    case VoltageLevel.KV110:
      return 250
    default:
      return 500
  }
}

const calculateResistance = (voltage: VoltageLevel, distanceKm: number): number => {
  // Simplified resistance calculation: base resistance per km * distance
  const baseResistance = voltage === VoltageLevel.KV400 ? 0.0003 : voltage === VoltageLevel.KV220 ? 0.0005 : 0.0008

  return baseResistance * distanceKm
}
