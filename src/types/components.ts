/**
 * Component type definitions for all grid elements
 */

import type { CitySize, ComponentState, PlantType, VoltageLevel } from './enums'
import type { NodeId, Point } from './grid'

export interface BaseComponent {
  id: NodeId
  location: Point
  state: ComponentState
}

export interface PowerPlant extends BaseComponent {
  type: PlantType
  capacity: number
  currentOutput: number
  buildCost: number
  rampRate: number
}

export interface City extends BaseComponent {
  name: string
  size: CitySize
  baseDemand: number
  currentDemand: number
  powerReceived: number
  connected: boolean
}

export interface TransmissionLine {
  id: string
  from: NodeId
  to: NodeId
  path: Point[]
  voltage: VoltageLevel
  capacity: number
  currentLoad: number
  resistance: number
  distance: number
  breakerClosed: boolean
  breakerTripped: boolean
  state: ComponentState
}

export interface Substation extends BaseComponent {
  voltageIn: VoltageLevel
  voltageOut: VoltageLevel
  capacity: number
  currentLoad: number
  losses: number
  breakers: Breaker[]
}

export interface SwitchingStation extends BaseComponent {
  breakers: Breaker[]
  connectedLines: string[]
}

export interface Breaker {
  id: string
  closed: boolean
  tripped: boolean
}

export interface DemandProfile {
  timeOfDayMultipliers: number[]
  seasonalMultipliers: Record<string, number>
  profileType: 'residential' | 'industrial' | 'commercial' | 'mixed'
}

export type Component = PowerPlant | City | Substation | SwitchingStation
