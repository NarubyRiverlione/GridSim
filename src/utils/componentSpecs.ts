/**
 * Component specifications and constants
 */

import { PlantType, CitySize, VoltageLevel } from '@/types'

/**
 * Power plant specifications
 */
export interface PowerPlantSpec {
  capacity: number
  buildCost: number
  rampRate: number
}

export const POWER_PLANT_SPECS: Record<PlantType, PowerPlantSpec> = {
  [PlantType.Nuclear]: { capacity: 1000, buildCost: 5_000_000_000, rampRate: 10 },
  [PlantType.Coal]: { capacity: 800, buildCost: 1_500_000_000, rampRate: 30 },
  [PlantType.CCGT]: { capacity: 600, buildCost: 1_000_000_000, rampRate: 50 },
  [PlantType.Hydro]: { capacity: 400, buildCost: 800_000_000, rampRate: 100 },
  [PlantType.WindOffshore]: { capacity: 800, buildCost: 2_000_000_000, rampRate: 0 },
  [PlantType.WindOnshore]: { capacity: 300, buildCost: 600_000_000, rampRate: 0 },
  [PlantType.Solar]: { capacity: 200, buildCost: 400_000_000, rampRate: 0 },
}

/**
 * City specifications
 */
export interface CitySpec {
  baseDemand: number
  displaySize: string
}

export const CITY_SPECS: Record<CitySize, CitySpec> = {
  [CitySize.SmallTown]: { baseDemand: 35, displaySize: 'Small Town' },
  [CitySize.MediumCity]: { baseDemand: 150, displaySize: 'Medium City' },
  [CitySize.LargeCity]: { baseDemand: 600, displaySize: 'Large City' },
  // major metro is possible to big demand to have a clean UX : 1MW * 2 seasons = 7x 110kv lines
  [CitySize.MajorMetro]: { baseDemand: 1000, displaySize: 'Major Metro' },
}

/**
 * City name pool for random selection
 */
export const CITY_NAMES = [
  'Newtown',
  'Springfield',
  'Riverside',
  'Hillside',
  'Lakeside',
  'Parkville',
  'Oakland',
  'Greenfield',
  'Westport',
  'Eastville',
]

/**
 * Transmission line capacity by voltage level
 */
export const LINE_CAPACITY_BY_VOLTAGE: Record<VoltageLevel, number> = {
  [VoltageLevel.KV400]: 1500,
  [VoltageLevel.KV220]: 600,
  [VoltageLevel.KV110]: 250,
  [VoltageLevel.KV33]: 50, // Low voltage distribution
}

/**
 * Base resistance per km by voltage level
 */
export const BASE_RESISTANCE_BY_VOLTAGE: Record<VoltageLevel, number> = {
  [VoltageLevel.KV400]: 0.0003,
  [VoltageLevel.KV220]: 0.0005,
  [VoltageLevel.KV110]: 0.0008,
  [VoltageLevel.KV33]: 0.0015, // Higher resistance for low voltage
}

/**
 * Plant type display names
 */
export const PLANT_TYPE_NAMES: Record<PlantType, string> = {
  [PlantType.Nuclear]: 'Nuclear',
  [PlantType.Coal]: 'Coal',
  [PlantType.CCGT]: 'CCGT',
  [PlantType.Hydro]: 'Hydro',
  [PlantType.WindOffshore]: 'Wind (Offshore)',
  [PlantType.WindOnshore]: 'Wind (Onshore)',
  [PlantType.Solar]: 'Solar',
}
