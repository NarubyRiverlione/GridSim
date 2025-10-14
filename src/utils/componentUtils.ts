/**
 * Shared component utilities for type guards and common operations
 */

import type { Component, PowerPlant, City, Substation, SwitchingStation, Pylon } from '@/types'
import { CitySize, SubstationType, VoltageLevel } from '@/types'

/**
 * Type guard to check if a component is a PowerPlant
 */
export const isPowerPlant = (component: Component): component is PowerPlant => {
  return 'type' in component && 'capacity' in component && 'currentOutput' in component
}

/**
 * Type guard to check if a component is a City
 */
export const isCity = (component: Component): component is City => {
  return 'name' in component && 'size' in component
}

/**
 * Type guard to check if a component is a Substation
 */
export const isSubstation = (component: Component): component is Substation => {
  return 'voltageIn' in component && 'voltageOut' in component
}

/**
 * Type guard to check if a component is a SwitchingStation
 */
export const isSwitchingStation = (component: Component): component is SwitchingStation => {
  return 'breakers' in component && 'connectedLines' in component
}

/**
 * Type guard to check if a component is a Pylon
 */
export const isPylon = (component: Component): component is Pylon => {
  return 'maxLines' in component && !('breakers' in component)
}

/**
 * Gets the bounding box size for a component in pixels
 */
export const getComponentSize = (component: Component | { type: string; size?: CitySize }): number => {
  // Power plant
  if ('capacity' in component && 'currentOutput' in component) {
    return 80
  }

  // City - check size
  if ('size' in component) {
    const citySize = component.size
    if (citySize === CitySize.MajorMetro) return 80
    if (citySize === CitySize.LargeCity) return 70
    if (citySize === CitySize.MediumCity) return 60
    if (citySize === CitySize.SmallTown) return 50
  }

  // Substation
  if ('voltageIn' in component && 'voltageOut' in component) {
    const substation = component
    return substation.substationType === SubstationType.Grid ? 60 : 50
  }

  // Switching station
  if ('breakers' in component && 'connectedLines' in component) {
    return 40
  }

  // Pylon
  if ('maxLines' in component && !('breakers' in component)) {
    return 30
  }

  // Default fallback
  return 50
}

/**
 * Gets the voltage level of a component for connection validation
 * Returns null for components that can adapt to any voltage (pylons, switching stations)
 */
export const getComponentVoltage = (component: Component): VoltageLevel | null => {
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

/**
 * Determines the node type string for React Flow based on component type
 */
export const getNodeType = (component: Component): string => {
  if (isPowerPlant(component)) {
    return 'powerPlant'
  }
  if (isCity(component)) {
    return 'city'
  }
  if (isSubstation(component)) {
    return 'substation'
  }
  if (isPylon(component)) {
    return 'pylon'
  }
  if (isSwitchingStation(component)) {
    return 'switchingStation'
  }
  return 'default'
}
