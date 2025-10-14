/**
 * Connection rules engine - centralized business logic for grid connections
 * Manages dynamic handle availability based on component type and existing connections
 */

import { Position } from 'reactflow'
import type { Component, TransmissionLine } from '@/types'
import { isPowerPlant, isCity, isSubstation, isSwitchingStation, isPylon } from './componentUtils'

export interface ConnectionCounts {
  inbound: number
  outbound: number
}

export interface ConnectionLimits {
  maxInbound: number
  maxOutbound: number
}

export interface HandleInfo {
  id: string
  position: Position
  type: 'source' | 'target'
  enabled: boolean
  connectionCount?: number
}

/**
 * Count existing connections for a component
 */
export function getConnectionCounts(componentId: string, lines: TransmissionLine[]): ConnectionCounts {
  const inbound = lines.filter(line => line.to === componentId).length
  const outbound = lines.filter(line => line.from === componentId).length

  return { inbound, outbound }
}

/**
 * Get connection limits for a component type
 */
export function getMaxConnections(component: Component): ConnectionLimits {
  if (isPowerPlant(component)) {
    return { maxInbound: 0, maxOutbound: 1 } // Power plants only output, 1 connection max
  }

  if (isCity(component)) {
    return { maxInbound: 6, maxOutbound: 0 } // Cities only input, 6 connections max
  }

  if (isSubstation(component)) {
    return { maxInbound: 1, maxOutbound: 1 } // Substations: 1 input, 1 output
  }

  if (isSwitchingStation(component)) {
    return { maxInbound: 4, maxOutbound: 4 } // Switching stations: 4 each direction
  }

  if (isPylon(component)) {
    return { maxInbound: 4, maxOutbound: 4 } // Pylons: 4 each direction
  }

  // Default fallback
  return { maxInbound: 0, maxOutbound: 0 }
}

/**
 * Check if a component can accept a new connection
 */
export function canAcceptConnection(
  component: Component,
  lines: TransmissionLine[],
  direction: 'source' | 'target'
): { allowed: boolean; reason?: string } {
  const counts = getConnectionCounts(component.id, lines)
  const limits = getMaxConnections(component)

  if (direction === 'source') {
    // Trying to connect FROM this component (outbound)
    if (counts.outbound >= limits.maxOutbound) {
      // Component-specific error messages
      if (isPowerPlant(component)) {
        return { allowed: false, reason: 'Power plant already connected (1/1 source used)' }
      }
      if (isSubstation(component)) {
        return { allowed: false, reason: 'Substation output occupied (1/1 source used)' }
      }
      if (isSwitchingStation(component)) {
        return { allowed: false, reason: `Switching station at capacity (${counts.outbound}/${limits.maxOutbound} sources used)` }
      }
      if (isPylon(component)) {
        return { allowed: false, reason: `Pylon at capacity (${counts.outbound}/${limits.maxOutbound} lines connected)` }
      }
      return { allowed: false, reason: 'Component at capacity' }
    }
  } else {
    // Trying to connect TO this component (inbound)
    if (counts.inbound >= limits.maxInbound) {
      // Component-specific error messages
      if (isCity(component)) {
        return { allowed: false, reason: `City at capacity (${counts.inbound}/${limits.maxInbound} lines connected)` }
      }
      if (isSubstation(component)) {
        return { allowed: false, reason: 'Substation input occupied (1/1 target used)' }
      }
      if (isSwitchingStation(component)) {
        return { allowed: false, reason: `Switching station at capacity (${counts.inbound}/${limits.maxInbound} targets used)` }
      }
      if (isPylon(component)) {
        return { allowed: false, reason: `Pylon at capacity (${counts.inbound}/${limits.maxInbound} lines connected)` }
      }
      return { allowed: false, reason: 'Component at capacity' }
    }
  }

  return { allowed: true }
}

/**
 * Get available handle information for rendering
 */
export function getHandleAvailability(component: Component, lines: TransmissionLine[]): HandleInfo[] {
  const counts = getConnectionCounts(component.id, lines)
  const limits = getMaxConnections(component)
  const handles: HandleInfo[] = []

  if (isPowerPlant(component)) {
    // Power plant: 4 source handles (Right, Top, Bottom, Left)
    // All disable when 1 connection exists
    const enabled = counts.outbound < limits.maxOutbound
    handles.push(
      { id: 'source-right', position: Position.Right, type: 'source', enabled, connectionCount: counts.outbound },
      { id: 'source-top', position: Position.Top, type: 'source', enabled, connectionCount: counts.outbound },
      { id: 'source-bottom', position: Position.Bottom, type: 'source', enabled, connectionCount: counts.outbound },
      { id: 'source-left', position: Position.Left, type: 'source', enabled, connectionCount: counts.outbound }
    )
  } else if (isCity(component)) {
    // City: 6 target handles (Left, Top-Left, Top, Bottom-Left, Bottom, Left-Center)
    // All always enabled
    const enabled = counts.inbound < limits.maxInbound
    handles.push(
      { id: 'target-left', position: Position.Left, type: 'target', enabled, connectionCount: counts.inbound },
      { id: 'target-top', position: Position.Top, type: 'target', enabled, connectionCount: counts.inbound },
      { id: 'target-bottom', position: Position.Bottom, type: 'target', enabled, connectionCount: counts.inbound }
    )
    // Add additional Left-positioned handles for 6 total
    // React Flow will space them automatically
    for (let i = 0; i < 3; i++) {
      handles.push({
        id: `target-left-${i}`,
        position: Position.Left,
        type: 'target',
        enabled,
        connectionCount: counts.inbound,
      })
    }
  } else if (isSubstation(component)) {
    // Substation: 4 input handles (Left) + 4 output handles (Right)
    const inputEnabled = counts.inbound < limits.maxInbound
    const outputEnabled = counts.outbound < limits.maxOutbound

    // Input handles (Left side)
    handles.push(
      { id: 'target-left-1', position: Position.Left, type: 'target', enabled: inputEnabled, connectionCount: counts.inbound },
      { id: 'target-left-2', position: Position.Left, type: 'target', enabled: inputEnabled, connectionCount: counts.inbound },
      { id: 'target-left-3', position: Position.Left, type: 'target', enabled: inputEnabled, connectionCount: counts.inbound },
      { id: 'target-left-4', position: Position.Left, type: 'target', enabled: inputEnabled, connectionCount: counts.inbound }
    )

    // Output handles (Right side)
    handles.push(
      { id: 'source-right-1', position: Position.Right, type: 'source', enabled: outputEnabled, connectionCount: counts.outbound },
      { id: 'source-right-2', position: Position.Right, type: 'source', enabled: outputEnabled, connectionCount: counts.outbound },
      { id: 'source-right-3', position: Position.Right, type: 'source', enabled: outputEnabled, connectionCount: counts.outbound },
      { id: 'source-right-4', position: Position.Right, type: 'source', enabled: outputEnabled, connectionCount: counts.outbound }
    )
  } else if (isSwitchingStation(component) || isPylon(component)) {
    // Switching Station / Pylon: 4 input handles + 4 output handles
    const inputEnabled = counts.inbound < limits.maxInbound
    const outputEnabled = counts.outbound < limits.maxOutbound

    // Input handles (Left, Top, Bottom positions)
    handles.push(
      { id: 'target-left', position: Position.Left, type: 'target', enabled: inputEnabled, connectionCount: counts.inbound },
      { id: 'target-top', position: Position.Top, type: 'target', enabled: inputEnabled, connectionCount: counts.inbound },
      { id: 'target-bottom', position: Position.Bottom, type: 'target', enabled: inputEnabled, connectionCount: counts.inbound },
      { id: 'target-left-2', position: Position.Left, type: 'target', enabled: inputEnabled, connectionCount: counts.inbound }
    )

    // Output handles (Right, Top, Bottom positions)
    handles.push(
      { id: 'source-right', position: Position.Right, type: 'source', enabled: outputEnabled, connectionCount: counts.outbound },
      { id: 'source-top-2', position: Position.Top, type: 'source', enabled: outputEnabled, connectionCount: counts.outbound },
      { id: 'source-bottom-2', position: Position.Bottom, type: 'source', enabled: outputEnabled, connectionCount: counts.outbound },
      { id: 'source-right-2', position: Position.Right, type: 'source', enabled: outputEnabled, connectionCount: counts.outbound }
    )
  }

  return handles
}
