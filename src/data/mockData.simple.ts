/**
 * Simple mock data for Phase 0 UI development
 * Minimal topology with one of each component type:
 * plant-1 --line-1(400kV)-- substation-G1 --line-2(220kV)-- substation-Z1 --line-3(110kV)--switch -- line 4 -- city-1
 */

import {
  CitySize,
  ComponentState,
  PlantType,
  Season,
  SubstationType,
  VoltageLevel,
  type City,
  type GameMetrics,
  type GridState,
  type PowerPlant,
  type Pylon,
  type Substation,
  type SwitchingStation,
  type TransmissionLine,
} from '@/types'

export const mockPowerPlants: PowerPlant[] = [
  {
    id: 'plant-1',
    type: PlantType.Nuclear,
    location: { x: 200, y: 150 },
    capacity: 1000,
    currentOutput: 500,
    buildCost: 5_000_000_000,
    rampRate: 10,
    state: ComponentState.Healthy,
  },
]

export const mockCities: City[] = [
  {
    id: 'city-1',
    name: 'Berlin',
    size: CitySize.LargeCity,
    location: { x: 200, y: 600 },
    baseDemand: 500,
    currentDemand: 480,
    powerReceived: 480,
    connected: true,
    state: ComponentState.Healthy,
  },
]

export const mockTransmissionLines: TransmissionLine[] = [
  {
    id: 'line-1',
    from: 'plant-1',
    to: 'substation-G1',
    path: [
      { x: 200, y: 150 },
      { x: 200, y: 300 },
    ],
    voltage: VoltageLevel.KV400,
    capacity: 1500,
    currentLoad: 500,
    resistance: 0.05,
    distance: 150,
    breakerClosed: true,
    breakerTripped: false,
    state: ComponentState.Healthy,
  },
  {
    id: 'line-2',
    from: 'substation-G1',
    to: 'substation-Z1',
    path: [
      { x: 200, y: 300 },
      { x: 200, y: 450 },
    ],
    voltage: VoltageLevel.KV220,
    capacity: 600,
    currentLoad: 500,
    resistance: 0.04,
    distance: 150,
    breakerClosed: true,
    breakerTripped: false,
    state: ComponentState.Healthy,
  },
  {
    id: 'line-3',
    from: 'substation-Z1',
    to: 'city-1',
    path: [
      { x: 200, y: 450 },
      { x: 200, y: 600 },
    ],
    voltage: VoltageLevel.KV110,
    capacity: 250,
    currentLoad: 150,
    resistance: 0.04,
    distance: 150,
    breakerClosed: true,
    breakerTripped: false,
    state: ComponentState.Healthy,
  },
]

export const mockSubstations: Substation[] = [
  {
    id: 'substation-G1',
    location: { x: 200, y: 300 },
    substationType: SubstationType.Grid,
    voltageIn: VoltageLevel.KV400,
    voltageOut: VoltageLevel.KV220,
    capacity: 2000,
    currentLoad: 500,
    losses: 1.5,
    breakers: [
      { id: 'breaker-1', closed: true, tripped: false },
      { id: 'breaker-2', closed: true, tripped: false },
    ],
    state: ComponentState.Healthy,
  },
  {
    id: 'substation-Z1',
    location: { x: 200, y: 450 },
    substationType: SubstationType.Zone,
    voltageIn: VoltageLevel.KV220,
    voltageOut: VoltageLevel.KV110,
    capacity: 800,
    currentLoad: 500,
    losses: 1.2,
    breakers: [
      { id: 'breaker-3', closed: true, tripped: false },
      { id: 'breaker-4', closed: true, tripped: false },
    ],
    state: ComponentState.Healthy,
  },
]

export const mockSwitchingStations: SwitchingStation[] = []

export const mockPylons: Pylon[] = []

export const mockMetrics: GameMetrics = {
  totalGenerationCapacity: 1000,
  currentDemand: 500,
  utilization: 0.5,
  citiesPowered: 1,
  totalCities: 1,
  totalRevenue: 250_000_000,
  blackoutCount: 0,
  totalUptime: 1.0,
}

export const mockGridState: GridState = {
  currentTime: new Date('2025-06-15T14:30:00'),
  season: Season.Summer,
  budget: 50_000_000,
  happiness: 85,
  electricityPrice: 65,
  metrics: mockMetrics,
}
