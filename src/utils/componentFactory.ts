/**
 * Centralized component factory functions
 */

import type { Component, PowerPlant, City, Substation, SwitchingStation, Pylon, Point } from '@/types'
import { PlantType, CitySize, SubstationType, VoltageLevel, ComponentState } from '@/types'
import { POWER_PLANT_SPECS, CITY_SPECS, CITY_NAMES } from './componentSpecs'

let componentIdCounter = 1000

/**
 * Reset the component ID counter (useful for testing)
 */
export const resetComponentIdCounter = (): void => {
  componentIdCounter = 1000
}

/**
 * Generate a unique component ID
 */
const generateId = (prefix: string): string => {
  return `${prefix}-${componentIdCounter++}`
}

/**
 * Get a random city name from the pool
 */
const getRandomCityName = (): string => {
  const randomIndex = Math.floor(Math.random() * CITY_NAMES.length)
  return CITY_NAMES[randomIndex] ?? 'Newtown'
}

/**
 * Create a new power plant component
 */
export const createPowerPlant = (location: Point, type: PlantType): PowerPlant => {
  const specs = POWER_PLANT_SPECS[type]
  return {
    id: generateId('plant'),
    type,
    location,
    capacity: specs.capacity,
    currentOutput: 0,
    buildCost: specs.buildCost,
    rampRate: specs.rampRate,
    state: ComponentState.Healthy,
  }
}

/**
 * Create a new city component
 */
export const createCity = (location: Point, size: CitySize): City => {
  const specs = CITY_SPECS[size]
  return {
    id: generateId('city'),
    name: getRandomCityName(),
    size,
    location,
    baseDemand: specs.baseDemand,
    currentDemand: specs.baseDemand,
    powerReceived: 0,
    connected: false,
    state: ComponentState.Disconnected,
  }
}

/**
 * Create a new substation component
 */
export const createSubstation = (location: Point, substationType: SubstationType): Substation => {
  const isGrid = substationType === SubstationType.Grid
  const id = generateId('substation')
  return {
    id,
    location,
    substationType,
    voltageIn: isGrid ? VoltageLevel.KV400 : VoltageLevel.KV220,
    voltageOut: isGrid ? VoltageLevel.KV220 : VoltageLevel.KV110,
    capacity: isGrid ? 2000 : 800,
    currentLoad: 0,
    losses: isGrid ? 1.5 : 1.2,
    breakers: [
      { id: `${id}-breaker-1`, closed: true, tripped: false },
      { id: `${id}-breaker-2`, closed: true, tripped: false },
    ],
    state: ComponentState.Healthy,
  }
}

/**
 * Create a new switching station component
 */
export const createSwitchingStation = (location: Point): SwitchingStation => {
  const id = generateId('switching')
  return {
    id,
    location,
    breakers: [
      { id: `${id}-breaker-1`, closed: true, tripped: false },
      { id: `${id}-breaker-2`, closed: true, tripped: false },
    ],
    connectedLines: [],
    state: ComponentState.Healthy,
  }
}

/**
 * Create a new pylon component
 */
export const createPylon = (location: Point): Pylon => {
  return {
    id: generateId('pylon'),
    location,
    maxLines: 4,
    connectedLines: [],
    state: ComponentState.Healthy,
  }
}

/**
 * Generic component factory based on mode and config
 */
export interface ComponentFactoryConfig {
  plantType?: PlantType
  citySize?: CitySize
  substationType?: SubstationType
}

export const createComponent = (
  componentType: 'powerPlant' | 'city' | 'substation' | 'switchingStation' | 'pylon',
  location: Point,
  config: ComponentFactoryConfig
): Component | null => {
  switch (componentType) {
    case 'powerPlant':
      return config.plantType !== undefined ? createPowerPlant(location, config.plantType) : null
    case 'city':
      return config.citySize !== undefined ? createCity(location, config.citySize) : null
    case 'substation':
      return config.substationType !== undefined ? createSubstation(location, config.substationType) : null
    case 'switchingStation':
      return createSwitchingStation(location)
    case 'pylon':
      return createPylon(location)
    default:
      return null
  }
}
