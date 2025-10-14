/**
 * Hook for managing transmission line placement
 */

import { useState, useCallback } from 'react'
import type { Component, TransmissionLine, Point } from '@/types'
import { InteractionMode } from '@/types'
import { isCity, getComponentVoltage } from '@/utils/componentUtils'
import { canAcceptConnection } from '@/utils/connectionRules'

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

      // Check connection capacity FIRST (before other validations)
      const sourceCapacityCheck = canAcceptConnection(source, existingLines, 'source')
      if (!sourceCapacityCheck.allowed) {
        return { valid: false, error: sourceCapacityCheck.reason }
      }

      const targetCapacityCheck = canAcceptConnection(target, existingLines, 'target')
      if (!targetCapacityCheck.allowed) {
        return { valid: false, error: targetCapacityCheck.reason }
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
