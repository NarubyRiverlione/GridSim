/**
 * Mock data for Phase 0 UI testing
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
    location: { x: 100, y: 200 },
    capacity: 1000,
    currentOutput: 950,
    buildCost: 5_000_000_000,
    rampRate: 10,
    state: ComponentState.Healthy,
  },
  {
    id: 'plant-2',
    type: PlantType.CCGT,
    location: { x: 400, y: 150 },
    capacity: 600,
    currentOutput: 480,
    buildCost: 1_000_000_000,
    rampRate: 50,
    state: ComponentState.Healthy,
  },
  {
    id: 'plant-3',
    type: PlantType.WindOffshore,
    location: { x: 50, y: 400 },
    capacity: 800,
    currentOutput: 720,
    buildCost: 2_000_000_000,
    rampRate: 0,
    state: ComponentState.Healthy,
  },
]

export const mockCities: City[] = [
  {
    id: 'city-1',
    name: 'Berlin',
    size: CitySize.MajorMetro,
    location: { x: 600, y: 300 },
    baseDemand: 3000,
    currentDemand: 2800,
    powerReceived: 2800,
    connected: true,
    state: ComponentState.Healthy,
  },
  {
    id: 'city-2',
    name: 'Hamburg',
    size: CitySize.LargeCity,
    location: { x: 500, y: 100 },
    baseDemand: 650,
    currentDemand: 600,
    powerReceived: 600,
    connected: true,
    state: ComponentState.Healthy,
  },
  {
    id: 'city-3',
    name: 'Dresden',
    size: CitySize.MediumCity,
    location: { x: 800, y: 350 },
    baseDemand: 150,
    currentDemand: 130,
    powerReceived: 0,
    connected: false,
    state: ComponentState.Disconnected,
  },
]

export const mockTransmissionLines: TransmissionLine[] = [
  {
    id: 'line-1',
    from: 'plant-1',
    to: 'substation-1',
    path: [
      { x: 100, y: 200 },
      { x: 300, y: 250 },
    ],
    voltage: VoltageLevel.KV400,
    capacity: 1500,
    currentLoad: 1200,
    resistance: 0.05,
    distance: 210,
    breakerClosed: true,
    breakerTripped: false,
    state: ComponentState.Stressed,
  },
  {
    id: 'line-2',
    from: 'plant-2',
    to: 'city-2',
    path: [
      { x: 400, y: 150 },
      { x: 500, y: 100 },
    ],
    voltage: VoltageLevel.KV220,
    capacity: 600,
    currentLoad: 480,
    resistance: 0.03,
    distance: 110,
    breakerClosed: true,
    breakerTripped: false,
    state: ComponentState.Healthy,
  },
  {
    id: 'line-3',
    from: 'substation-1',
    to: 'city-1',
    path: [
      { x: 300, y: 250 },
      { x: 600, y: 300 },
    ],
    voltage: VoltageLevel.KV220,
    capacity: 2000,
    currentLoad: 1800,
    resistance: 0.04,
    distance: 310,
    breakerClosed: true,
    breakerTripped: false,
    state: ComponentState.Stressed,
  },
]

export const mockSubstations: Substation[] = [
  {
    id: 'substation-1',
    location: { x: 300, y: 250 },
    substationType: SubstationType.Grid,
    voltageIn: VoltageLevel.KV400,
    voltageOut: VoltageLevel.KV220,
    capacity: 2000,
    currentLoad: 1800,
    losses: 1.5,
    breakers: [
      { id: 'breaker-1', closed: true, tripped: false },
      { id: 'breaker-2', closed: true, tripped: false },
    ],
    state: ComponentState.Healthy,
  },
  {
    id: 'substation-2',
    location: { x: 550, y: 200 },
    substationType: SubstationType.Zone,
    voltageIn: VoltageLevel.KV220,
    voltageOut: VoltageLevel.KV110,
    capacity: 800,
    currentLoad: 650,
    losses: 1.2,
    breakers: [
      { id: 'breaker-3', closed: true, tripped: false },
      { id: 'breaker-4', closed: true, tripped: false },
    ],
    state: ComponentState.Healthy,
  },
]

export const mockSwitchingStations: SwitchingStation[] = [
  {
    id: 'switching-1',
    location: { x: 450, y: 400 },
    breakers: [
      { id: 'breaker-sw-1', closed: true, tripped: false },
      { id: 'breaker-sw-2', closed: true, tripped: false },
      { id: 'breaker-sw-3', closed: false, tripped: false },
    ],
    connectedLines: ['line-4', 'line-5', 'line-6'],
    state: ComponentState.Healthy,
  },
]

export const mockPylons: Pylon[] = [
  {
    id: 'pylon-1',
    location: { x: 200, y: 225 },
    maxLines: 4,
    connectedLines: ['line-1'],
    voltageLevel: VoltageLevel.KV400,
    state: ComponentState.Healthy,
  },
  {
    id: 'pylon-2',
    location: { x: 350, y: 350 },
    maxLines: 4,
    connectedLines: ['line-7', 'line-8'],
    voltageLevel: VoltageLevel.KV220,
    state: ComponentState.Healthy,
  },
  {
    id: 'pylon-3',
    location: { x: 700, y: 250 },
    maxLines: 4,
    connectedLines: ['line-9', 'line-10', 'line-11'],
    voltageLevel: VoltageLevel.KV110,
    state: ComponentState.Healthy,
  },
]

export const mockMetrics: GameMetrics = {
  totalGenerationCapacity: 2400,
  currentDemand: 3530,
  utilization: 0.85,
  citiesPowered: 2,
  totalCities: 3,
  totalRevenue: 1_250_000_000,
  blackoutCount: 1,
  totalUptime: 0.98,
}

export const mockGridState: GridState = {
  currentTime: new Date('2025-06-15T14:30:00'),
  season: Season.Summer,
  budget: 50_000_000,
  happiness: 72,
  electricityPrice: 65,
  metrics: mockMetrics,
}
