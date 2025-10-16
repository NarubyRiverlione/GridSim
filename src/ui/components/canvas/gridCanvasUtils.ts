/**
 * Utility functions for GridCanvas component
 */

import type { Node, Edge } from 'reactflow'
import type { Component, TransmissionLine, Point } from '@/types'
import { InteractionMode, SubstationType } from '@/types'
import { getNodeType } from '@/utils/componentUtils'
import type { PlacementConfig } from '@/ui/hooks/useComponentPlacement'

export const GHOST_NODE_ID = 'ghost-preview-node'

/**
 * Convert components to React Flow nodes
 */
export const componentsToNodes = (components: Component[], transmissionLines: TransmissionLine[]): Node[] => {
  return components.map(component => ({
    id: component.id,
    type: getNodeType(component),
    position: component.location,
    data: {
      ...component,
      transmissionLines, // Pass transmission lines for handle availability calculation
    },
  }))
}

/**
 * Convert transmission lines to React Flow edges
 */
export const linesToEdges = (transmissionLines: TransmissionLine[]): Edge[] => {
  return transmissionLines.map(line => ({
    id: line.id,
    source: line.from,
    target: line.to,
    sourceHandle: line.sourceHandle,
    targetHandle: line.targetHandle,
    type: 'transmission',
    data: line,
  }))
}

/**
 * Create a ghost node for placement preview
 */
export const createGhostNode = (position: Point, isValid: boolean, size: number, label: string): Node => {
  return {
    id: GHOST_NODE_ID,
    type: 'ghost',
    position,
    data: {
      isValid,
      size,
      label,
    },
    draggable: false,
    selectable: false,
  }
}

/**
 * Get component size based on mode and config
 */
export const getSizeForMode = (mode: InteractionMode, config: PlacementConfig): number => {
  switch (mode) {
    case InteractionMode.AddPowerPlant:
      return 80
    case InteractionMode.AddCity: {
      const citySize = config.citySize
      if (citySize === undefined) return 50
      return 60
    }
    case InteractionMode.AddSubstation:
      return config.substationType === SubstationType.Grid ? 60 : 50
    case InteractionMode.AddSwitchingStation:
      return 40
    case InteractionMode.AddPylon:
      return 30
    default:
      return 50
  }
}

/**
 * Get label for placement ghost node
 */
export const getPlacementLabel = (mode: InteractionMode, config: PlacementConfig): string => {
  if (mode === InteractionMode.AddPowerPlant) {
    return config.plantType
  }
  if (mode === InteractionMode.AddCity) {
    return config.citySize
  }
  if (mode === InteractionMode.AddSubstation) {
    return config.substationType === SubstationType.Grid ? 'Grid Sub' : 'Zone Sub'
  }
  if (mode === InteractionMode.AddSwitchingStation) {
    return 'Switching'
  }
  if (mode === InteractionMode.AddPylon) {
    return 'Pylon'
  }
  return 'Component'
}

/**
 * Check if mode is a placement mode
 */
export const isPlacementMode = (mode: InteractionMode): boolean => {
  return (
    mode === InteractionMode.AddPowerPlant ||
    mode === InteractionMode.AddCity ||
    mode === InteractionMode.AddSubstation ||
    mode === InteractionMode.AddSwitchingStation ||
    mode === InteractionMode.AddPylon
  )
}

/**
 * Shallow equality check for nodes array
 */
export const shallowNodesEqual = (a: Node[], b: Node[] | null): boolean => {
  if (b === null) return false
  if (a.length !== b.length) return false
  for (let i = 0; i < a.length; i++) {
    const na = a[i]
    const nb = b[i]
    if (!na || !nb) return false
    if (na.id !== nb.id) return false
    const pa = na.position as { x?: number; y?: number } | undefined
    const pb = nb.position as { x?: number; y?: number } | undefined
    if ((pa?.x ?? 0) !== (pb?.x ?? 0) || (pa?.y ?? 0) !== (pb?.y ?? 0)) return false
    if ((na.className ?? '') !== (nb.className ?? '')) return false
    const da = na.data as { id?: string } | undefined
    const db = nb.data as { id?: string } | undefined
    if ((da?.id ?? '') !== (db?.id ?? '')) return false
  }
  return true
}

/**
 * Shallow equality check for edges array
 */
export const shallowEdgesEqual = (a: Edge[], b: Edge[] | null): boolean => {
  if (b === null) return false
  if (a.length !== b.length) return false
  for (let i = 0; i < a.length; i++) {
    const ea = a[i]
    const eb = b[i]
    if (!ea || !eb) return false
    if (ea.id !== eb.id) return false
    if (ea.source !== eb.source || ea.target !== eb.target) return false
    // assume data content identity matters; if it's the same reference it's fine
    if (ea.data !== eb.data) return false
  }
  return true
}
