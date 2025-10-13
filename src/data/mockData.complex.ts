/**
 * Mock data for Phase 0 UI testing
 * Topology:
 * plant-1 --line-1(400kV)-- substation-G1 --line-2(220kV)-- switching-1 --line-3(220kV)-- substation-Z1 --line-4(110kV)-- pylon-1 --line-5(110kV)-- city-1
 * plant-2 --line-6(400kV)-- substation-G2 --line-7(220kV)-- substation-Z2 --line-8(110kV)-- city-2
 * pylon-2 (isolated for testing)
 * substation-G3 (isolated for testing voltage connections)
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
    location: { x: 100, y: 100 },
    capacity: 1000,
    currentOutput: 950,
    buildCost: 5_000_000_000,
    rampRate: 10,
    state: ComponentState.Healthy,
  },
  {
    id: 'plant-2',
    type: PlantType.CCGT,
    location: { x: 800, y: 100 },
    capacity: 600,
    currentOutput: 580,
    buildCost: 1_000_000_000,
    rampRate: 60,
    state: ComponentState.Healthy,
  },
]

export const mockCities: City[] = [
  {
    id: 'city-1',
    name: 'Berlin',
    size: CitySize.MajorMetro,
    location: { x: 100, y: 500 },
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
    location: { x: 800, y: 500 },
    baseDemand: 500,
    currentDemand: 480,
    powerReceived: 480,
    connected: true,
    state: ComponentState.Healthy,
  },
]

export const mockTransmissionLines: TransmissionLine[] = [
  // Chain 1: plant-1 → substation-G1 → switching-1 → substation-Z1 → pylon-1 → city-1
  {
    id: 'line-1',
    from: 'plant-1',
    to: 'substation-G1',
    path: [
      { x: 100, y: 100 },
      { x: 300, y: 150 },
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
    from: 'substation-G1',
    to: 'switching-1',
    path: [
      { x: 300, y: 150 },
      { x: 450, y: 200 },
    ],
    voltage: VoltageLevel.KV220,
    capacity: 600,
    currentLoad: 500,
    resistance: 0.04,
    distance: 170,
    breakerClosed: true,
    breakerTripped: false,
    state: ComponentState.Healthy,
  },
  {
    id: 'line-3',
    from: 'switching-1',
    to: 'substation-Z1',
    path: [
      { x: 450, y: 200 },
      { x: 300, y: 300 },
    ],
    voltage: VoltageLevel.KV220,
    capacity: 600,
    currentLoad: 500,
    resistance: 0.04,
    distance: 180,
    breakerClosed: true,
    breakerTripped: false,
    state: ComponentState.Healthy,
  },
  {
    id: 'line-4',
    from: 'substation-Z1',
    to: 'pylon-1',
    path: [
      { x: 300, y: 300 },
      { x: 200, y: 400 },
    ],
    voltage: VoltageLevel.KV110,
    capacity: 250,
    currentLoad: 200,
    resistance: 0.04,
    distance: 140,
    breakerClosed: true,
    breakerTripped: false,
    state: ComponentState.Healthy,
  },
  {
    id: 'line-5',
    from: 'pylon-1',
    to: 'city-1',
    path: [
      { x: 200, y: 400 },
      { x: 100, y: 500 },
    ],
    voltage: VoltageLevel.KV110,
    capacity: 250,
    currentLoad: 200,
    resistance: 0.04,
    distance: 140,
    breakerClosed: true,
    breakerTripped: false,
    state: ComponentState.Healthy,
  },
  // Chain 2: plant-2 → substation-G2 → substation-Z2 → city-2
  {
    id: 'line-6',
    from: 'plant-2',
    to: 'substation-G2',
    path: [
      { x: 800, y: 100 },
      { x: 800, y: 200 },
    ],
    voltage: VoltageLevel.KV400,
    capacity: 1500,
    currentLoad: 600,
    resistance: 0.05,
    distance: 100,
    breakerClosed: true,
    breakerTripped: false,
    state: ComponentState.Healthy,
  },
  {
    id: 'line-7',
    from: 'substation-G2',
    to: 'substation-Z2',
    path: [
      { x: 800, y: 200 },
      { x: 800, y: 350 },
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
    id: 'line-8',
    from: 'substation-Z2',
    to: 'city-2',
    path: [
      { x: 800, y: 350 },
      { x: 800, y: 500 },
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
  // Additional connections for testing
  {
    id: 'line-9',
    from: 'pylon-1',
    to: 'switching-1',
    path: [
      { x: 200, y: 400 },
      { x: 450, y: 200 },
    ],
    voltage: VoltageLevel.KV220,
    capacity: 600,
    currentLoad: 100,
    resistance: 0.04,
    distance: 280,
    breakerClosed: true,
    breakerTripped: false,
    state: ComponentState.Healthy,
  },
  {
    id: 'line-10',
    from: 'pylon-2',
    to: 'switching-1',
    path: [
      { x: 600, y: 400 },
      { x: 450, y: 200 },
    ],
    voltage: VoltageLevel.KV220,
    capacity: 600,
    currentLoad: 50,
    resistance: 0.04,
    distance: 250,
    breakerClosed: true,
    breakerTripped: false,
    state: ComponentState.Healthy,
  },
]

export const mockSubstations: Substation[] = [
  {
    id: 'substation-G1',
    location: { x: 300, y: 150 },
    substationType: SubstationType.Grid,
    voltageIn: VoltageLevel.KV400,
    voltageOut: VoltageLevel.KV220,
    capacity: 2000,
    currentLoad: 1200,
    losses: 1.5,
    breakers: [
      { id: 'breaker-1', closed: true, tripped: false },
      { id: 'breaker-2', closed: true, tripped: false },
    ],
    state: ComponentState.Healthy,
  },
  {
    id: 'substation-Z1',
    location: { x: 300, y: 300 },
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
  {
    id: 'substation-G2',
    location: { x: 800, y: 200 },
    substationType: SubstationType.Grid,
    voltageIn: VoltageLevel.KV400,
    voltageOut: VoltageLevel.KV220,
    capacity: 2000,
    currentLoad: 600,
    losses: 1.5,
    breakers: [
      { id: 'breaker-5', closed: true, tripped: false },
      { id: 'breaker-6', closed: true, tripped: false },
    ],
    state: ComponentState.Healthy,
  },
  {
    id: 'substation-Z2',
    location: { x: 800, y: 350 },
    substationType: SubstationType.Zone,
    voltageIn: VoltageLevel.KV220,
    voltageOut: VoltageLevel.KV110,
    capacity: 800,
    currentLoad: 500,
    losses: 1.2,
    breakers: [
      { id: 'breaker-7', closed: true, tripped: false },
      { id: 'breaker-8', closed: true, tripped: false },
    ],
    state: ComponentState.Healthy,
  },
  {
    id: 'substation-G3',
    location: { x: 500, y: 100 },
    substationType: SubstationType.Grid,
    voltageIn: VoltageLevel.KV400,
    voltageOut: VoltageLevel.KV220,
    capacity: 2000,
    currentLoad: 0,
    losses: 1.5,
    breakers: [
      { id: 'breaker-9', closed: true, tripped: false },
      { id: 'breaker-10', closed: true, tripped: false },
    ],
    state: ComponentState.Healthy,
  },
]

export const mockSwitchingStations: SwitchingStation[] = [
  {
    id: 'switching-1',
    location: { x: 450, y: 200 },
    breakers: [
      { id: 'breaker-sw-1', closed: true, tripped: false },
      { id: 'breaker-sw-2', closed: true, tripped: false },
      { id: 'breaker-sw-3', closed: false, tripped: false },
    ],
    connectedLines: ['line-2', 'line-3', 'line-9', 'line-10'],
    state: ComponentState.Healthy,
  },
]

export const mockPylons: Pylon[] = [
  {
    id: 'pylon-1',
    location: { x: 200, y: 400 },
    maxLines: 4,
    connectedLines: ['line-4', 'line-5', 'line-9'],
    voltageLevel: VoltageLevel.KV110,
    state: ComponentState.Healthy,
  },
  {
    id: 'pylon-2',
    location: { x: 600, y: 400 },
    maxLines: 4,
    connectedLines: ['line-10'],
    voltageLevel: VoltageLevel.KV220,
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
