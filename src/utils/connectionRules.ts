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
  switch (true) {
    case isPowerPlant(component):
      return { maxInbound: 0, maxOutbound: 1 } // Power plants only output, 1 connection max

    case isCity(component):
      return { maxInbound: 6, maxOutbound: 0 } // Cities only input, 6 connections max

    case isSubstation(component):
      return { maxInbound: 1, maxOutbound: 1 } // Substations: 1 input, 1 output

    case isSwitchingStation(component):
      return { maxInbound: 4, maxOutbound: 4 } // Switching stations: 4 each direction

    case isPylon(component):
      return { maxInbound: 4, maxOutbound: 4 } // Pylons: 4 each direction

    default:
      // Default fallback
      return { maxInbound: 0, maxOutbound: 0 }
  }
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
        return {
          allowed: false,
          reason: `Switching station at capacity (${counts.outbound}/${limits.maxOutbound} sources used)`,
        }
      }
      if (isPylon(component)) {
        return {
          allowed: false,
          reason: `Pylon at capacity (${counts.outbound}/${limits.maxOutbound} lines connected)`,
        }
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
        return {
          allowed: false,
          reason: `Switching station at capacity (${counts.inbound}/${limits.maxInbound} targets used)`,
        }
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

  // helper functions for each component type
  const getPowerPlantHandles = (counts: ConnectionCounts, limits: ConnectionLimits): HandleInfo[] => {
    const enabled = counts.outbound < limits.maxOutbound
    return [
      { id: 'source-right', position: Position.Right, type: 'source', enabled, connectionCount: counts.outbound },
      { id: 'source-top', position: Position.Top, type: 'source', enabled, connectionCount: counts.outbound },
      { id: 'source-bottom', position: Position.Bottom, type: 'source', enabled, connectionCount: counts.outbound },
      { id: 'source-left', position: Position.Left, type: 'source', enabled, connectionCount: counts.outbound },
    ]
  }
  const getCityHandles = (counts: ConnectionCounts, limits: ConnectionLimits): HandleInfo[] => {
    const enabled = counts.inbound < limits.maxInbound
    const handles: HandleInfo[] = []
    // Add 4 Top-positioned handles  (React Flow will space them)
    for (let i = 0; i < 4; i++) {
      handles.push({
        id: `target-top-${i}`,
        position: Position.Top,
        type: 'target',
        enabled,
        connectionCount: counts.inbound,
      })
      // Add 4 Bottom-positioned handles  (React Flow will space them)
      for (let i = 0; i < 4; i++) {
        handles.push({
          id: `target-bottom-${i}`,
          position: Position.Bottom,
          type: 'target',
          enabled,
          connectionCount: counts.inbound,
        })
      }
    }
    return handles
  }
  const getSubstationHandles = (counts: ConnectionCounts, limits: ConnectionLimits): HandleInfo[] => {
    const inputEnabled = counts.inbound < limits.maxInbound
    const outputEnabled = counts.outbound < limits.maxOutbound

    return [
      // Input handles (Left & Top side)
      {
        id: 'target-left-input',
        position: Position.Left,
        type: 'target',
        enabled: inputEnabled,
        connectionCount: counts.inbound,
      },
      {
        id: 'target-top-input',
        position: Position.Top,
        type: 'target',
        enabled: inputEnabled,
        connectionCount: counts.inbound,
      },

      // Output handles (Right & Bottom side)
      {
        id: 'source-right-output',
        position: Position.Right,
        type: 'source',
        enabled: outputEnabled,
        connectionCount: counts.outbound,
      },
      {
        id: 'source-bottom-output',
        position: Position.Bottom,
        type: 'source',
        enabled: outputEnabled,
        connectionCount: counts.outbound,
      },
    ]
  }
  const getSwitchingStationHandles = (counts: ConnectionCounts, limits: ConnectionLimits): HandleInfo[] => {
    const inputEnabled = counts.inbound < limits.maxInbound
    const outputEnabled = counts.outbound < limits.maxOutbound

    return [
      // Input handles (Left, Top, Bottom positions)
      {
        id: 'target-left',
        position: Position.Left,
        type: 'target',
        enabled: inputEnabled,
        connectionCount: counts.inbound,
      },
      {
        id: 'target-top',
        position: Position.Top,
        type: 'target',
        enabled: inputEnabled,
        connectionCount: counts.inbound,
      },
      {
        id: 'target-bottom',
        position: Position.Bottom,
        type: 'target',
        enabled: inputEnabled,
        connectionCount: counts.inbound,
      },
      {
        id: 'target-left-2',
        position: Position.Left,
        type: 'target',
        enabled: inputEnabled,
        connectionCount: counts.inbound,
      },

      // Output handles (Right, Top, Bottom positions)
      {
        id: 'source-right',
        position: Position.Right,
        type: 'source',
        enabled: outputEnabled,
        connectionCount: counts.outbound,
      },
      {
        id: 'source-top-2',
        position: Position.Top,
        type: 'source',
        enabled: outputEnabled,
        connectionCount: counts.outbound,
      },
      {
        id: 'source-bottom-2',
        position: Position.Bottom,
        type: 'source',
        enabled: outputEnabled,
        connectionCount: counts.outbound,
      },
      {
        id: 'source-right-2',
        position: Position.Right,
        type: 'source',
        enabled: outputEnabled,
        connectionCount: counts.outbound,
      },
    ]
  }
  const getPylonHandles = (counts: ConnectionCounts, limits: ConnectionLimits): HandleInfo[] => {
    const inputEnabled = counts.inbound < limits.maxInbound
    const outputEnabled = counts.outbound < limits.maxOutbound

    return [
      // Input handles (Left, Top, Bottom positions)
      {
        id: 'target-left',
        position: Position.Left,
        type: 'target',
        enabled: inputEnabled,
        connectionCount: counts.inbound,
      },
      {
        id: 'target-top',
        position: Position.Top,
        type: 'target',
        enabled: inputEnabled,
        connectionCount: counts.inbound,
      },
      {
        id: 'target-bottom',
        position: Position.Bottom,
        type: 'target',
        enabled: inputEnabled,
        connectionCount: counts.inbound,
      },
      {
        id: 'target-left-2',
        position: Position.Left,
        type: 'target',
        enabled: inputEnabled,
        connectionCount: counts.inbound,
      },

      // Output handles (Right, Top, Bottom positions)
      {
        id: 'source-right',
        position: Position.Right,
        type: 'source',
        enabled: outputEnabled,
        connectionCount: counts.outbound,
      },
      {
        id: 'source-top-2',
        position: Position.Top,
        type: 'source',
        enabled: outputEnabled,
        connectionCount: counts.outbound,
      },
      {
        id: 'source-bottom-2',
        position: Position.Bottom,
        type: 'source',
        enabled: outputEnabled,
        connectionCount: counts.outbound,
      },
      {
        id: 'source-right-2',
        position: Position.Right,
        type: 'source',
        enabled: outputEnabled,
        connectionCount: counts.outbound,
      },
    ]
  }

  // use a switch on boolean checks to select the component handler
  switch (true) {
    case isPowerPlant(component):
      return getPowerPlantHandles(counts, limits)
    case isCity(component):
      return getCityHandles(counts, limits)
    case isSubstation(component):
      return getSubstationHandles(counts, limits)
    case isSwitchingStation(component):
      return getSwitchingStationHandles(counts, limits)
    case isPylon(component):
      return getPylonHandles(counts, limits)
    default:
      // no specific handles for unknown component types
      return []
  }
}
