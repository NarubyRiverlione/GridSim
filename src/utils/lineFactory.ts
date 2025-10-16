/**
 * Factory functions for creating transmission lines
 */

import type { Component, TransmissionLine, Point } from '@/types'
import { VoltageLevel, ComponentState } from '@/types'
import { isPowerPlant, isCity, isSubstation, getComponentVoltage } from './componentUtils'
import { LINE_CAPACITY_BY_VOLTAGE, BASE_RESISTANCE_BY_VOLTAGE } from './componentSpecs'

let lineIdCounter = 2000

/**
 * Reset the line ID counter (useful for testing)
 */
export const resetLineIdCounter = (): void => {
  lineIdCounter = 2000
}

/**
 * Determine the voltage level for a line based on its endpoints
 */
export const determineLineVoltage = (source: Component, target: Component): VoltageLevel => {
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

/**
 * Calculate line resistance based on voltage and distance
 */
export const calculateLineResistance = (voltage: VoltageLevel, distanceKm: number): number => {
  const baseResistance = BASE_RESISTANCE_BY_VOLTAGE[voltage]
  return baseResistance * distanceKm
}

/**
 * Calculate Euclidean distance between two points (in pixels, converted to km)
 */
export const calculateDistance = (source: Point, target: Point): number => {
  const distancePixels = Math.sqrt(Math.pow(target.x - source.x, 2) + Math.pow(target.y - source.y, 2))
  // Convert pixel distance to km (assuming 1 pixel = 1 km for Phase 0)
  return Math.round(distancePixels)
}

/**
 * Create a new transmission line between two components
 */
export const createTransmissionLine = (
  source: Component,
  target: Component,
  sourceHandle: string,
  targetHandle: string
): TransmissionLine => {
  const id = `line-${lineIdCounter++}`

  // Determine voltage based on endpoints
  const voltage = determineLineVoltage(source, target)

  // Calculate distance
  const distanceKm = calculateDistance(source.location, target.location)

  // Determine capacity based on voltage
  const capacity = LINE_CAPACITY_BY_VOLTAGE[voltage]

  return {
    id,
    from: source.id,
    to: target.id,
    sourceHandle,
    targetHandle,
    path: [source.location, target.location],
    voltage,
    capacity,
    currentLoad: 0,
    resistance: calculateLineResistance(voltage, distanceKm),
    distance: distanceKm,
    breakerClosed: true,
    breakerTripped: false,
    state: ComponentState.Healthy,
  }
}
