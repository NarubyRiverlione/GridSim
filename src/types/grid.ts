/**
 * Core grid and geometry types
 */

import type { Season } from './enums'

export interface Point {
  x: number
  y: number
}

export type NodeId = string

export interface GridState {
  currentTime: Date
  season: Season
  budget: number
  happiness: number
  electricityPrice: number
  metrics: GameMetrics
}

export interface GameMetrics {
  totalGenerationCapacity: number
  currentDemand: number
  utilization: number
  citiesPowered: number
  totalCities: number
  totalRevenue: number
  blackoutCount: number
  totalUptime: number
}
