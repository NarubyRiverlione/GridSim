/**
 * Hook for managing component placement interactions
 */

import { useState, useCallback, useEffect } from 'react'
import type { Component, PowerPlant, City, Substation, SwitchingStation, Pylon, Point } from '@/types'
import { InteractionMode, PlantType, CitySize, SubstationType, VoltageLevel, ComponentState } from '@/types'
import { snapPointToGrid, isValidPlacement } from '../utils/placement'

export interface PlacementConfig {
  plantType: PlantType
  citySize: CitySize
  substationType: SubstationType
}

export interface PlacementState {
  isPlacing: boolean
  ghostPosition: Point | null
  isValidPosition: boolean
}

export interface UseComponentPlacementReturn {
  placementState: PlacementState
  placementConfig: PlacementConfig
  setPlantType: (type: PlantType) => void
  setCitySize: (size: CitySize) => void
  setSubstationType: (type: SubstationType) => void
  handleMouseMove: (x: number, y: number) => void
  handleClick: (x: number, y: number) => Component | null
  resetPlacement: () => void
}

interface UseComponentPlacementProps {
  mode: InteractionMode
  existingComponents: Component[]
  placementBuffer?: number
}

export const useComponentPlacement = ({
  mode,
  existingComponents,
  placementBuffer = 10,
}: UseComponentPlacementProps): UseComponentPlacementReturn => {
  const [placementConfig, setPlacementConfig] = useState<PlacementConfig>({
    plantType: PlantType.Nuclear,
    citySize: CitySize.SmallTown,
    substationType: SubstationType.Grid,
  })

  const [placementState, setPlacementState] = useState<PlacementState>({
    isPlacing: false,
    ghostPosition: null,
    isValidPosition: false,
  })

  const resetPlacement = useCallback((): void => {
    setPlacementState({
      isPlacing: false,
      ghostPosition: null,
      isValidPosition: false,
    })
  }, [])

  // Reset placement when mode changes to Select
  useEffect(() => {
    if (mode === InteractionMode.Select) {
      resetPlacement()
    }
  }, [mode, resetPlacement])

  const setPlantType = useCallback((type: PlantType): void => {
    setPlacementConfig(prev => ({ ...prev, plantType: type }))
  }, [])

  const setCitySize = useCallback((size: CitySize): void => {
    setPlacementConfig(prev => ({ ...prev, citySize: size }))
  }, [])

  const setSubstationType = useCallback((type: SubstationType): void => {
    setPlacementConfig(prev => ({ ...prev, substationType: type }))
  }, [])

  const handleMouseMove = useCallback(
    (x: number, y: number): void => {
      // Only show ghost in placement modes
      const isPlacementMode =
        mode === InteractionMode.AddPowerPlant ||
        mode === InteractionMode.AddCity ||
        mode === InteractionMode.AddSubstation ||
        mode === InteractionMode.AddSwitchingStation ||
        mode === InteractionMode.AddPylon

      if (!isPlacementMode) {
        resetPlacement()
        return
      }

      const snappedPos = snapPointToGrid(x, y)
      const componentSize = getComponentSizeForMode(mode, placementConfig)
      const buffer = placementBuffer
      const isValid = isValidPlacement(snappedPos.x, snappedPos.y, componentSize, existingComponents, buffer)

      setPlacementState({
        isPlacing: true,
        ghostPosition: snappedPos,
        isValidPosition: isValid,
      })
    },
    [mode, placementConfig, existingComponents, resetPlacement, placementBuffer]
  )

  const handleClick = useCallback(
    (x: number, y: number): Component | null => {
      const snappedPos = snapPointToGrid(x, y)
      const componentSize = getComponentSizeForMode(mode, placementConfig)
      const buffer = placementBuffer
      const isValid = isValidPlacement(snappedPos.x, snappedPos.y, componentSize, existingComponents, buffer)

      if (!isValid) {
        return null
      }

      // Create the appropriate component based on mode
      const newComponent = createComponentForMode(mode, snappedPos, placementConfig)
      return newComponent
    },
    [mode, placementConfig, existingComponents, placementBuffer]
  )

  return {
    placementState,
    placementConfig,
    setPlantType,
    setCitySize,
    setSubstationType,
    handleMouseMove,
    handleClick,
    resetPlacement,
  }
}

const getComponentSizeForMode = (mode: InteractionMode, config: PlacementConfig): number => {
  switch (mode) {
    case InteractionMode.AddPowerPlant:
      return 80
    case InteractionMode.AddCity: {
      const citySize = config.citySize
      if (citySize === CitySize.MajorMetro) return 80
      if (citySize === CitySize.LargeCity) return 70
      if (citySize === CitySize.MediumCity) return 60
      if (citySize === CitySize.SmallTown) return 50
      return 50
    }
    case InteractionMode.AddSubstation:
      return config.substationType === SubstationType.Grid ? 60 : 50
    case InteractionMode.AddSwitchingStation:
      return 40
    case InteractionMode.AddPylon:
      return 30
    default:
      return 50
  }
}

let componentIdCounter = 1000

const createComponentForMode = (mode: InteractionMode, position: Point, config: PlacementConfig): Component | null => {
  const id = `${mode}-${componentIdCounter++}`

  switch (mode) {
    case InteractionMode.AddPowerPlant:
      return createPowerPlant(id, position, config.plantType)
    case InteractionMode.AddCity:
      return createCity(id, position, config.citySize)
    case InteractionMode.AddSubstation:
      return createSubstation(id, position, config.substationType)
    case InteractionMode.AddSwitchingStation:
      return createSwitchingStation(id, position)
    case InteractionMode.AddPylon:
      return createPylon(id, position)
    default:
      return null
  }
}

const createPowerPlant = (id: string, location: Point, type: PlantType): PowerPlant => {
  const specs = getPowerPlantSpecs(type)
  return {
    id,
    type,
    location,
    capacity: specs.capacity,
    currentOutput: 0,
    buildCost: specs.buildCost,
    rampRate: specs.rampRate,
    state: ComponentState.Healthy,
  }
}

const createCity = (id: string, location: Point, size: CitySize): City => {
  const specs = getCitySpecs(size)
  return {
    id,
    name: specs.name,
    size,
    location,
    baseDemand: specs.baseDemand,
    currentDemand: specs.baseDemand,
    powerReceived: 0,
    connected: false,
    state: ComponentState.Disconnected,
  }
}

const createSubstation = (id: string, location: Point, substationType: SubstationType): Substation => {
  const isGrid = substationType === SubstationType.Grid
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

const createSwitchingStation = (id: string, location: Point): SwitchingStation => {
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

const createPylon = (id: string, location: Point): Pylon => {
  return {
    id,
    location,
    maxLines: 4,
    connectedLines: [],
    state: ComponentState.Healthy,
  }
}

const getPowerPlantSpecs = (type: PlantType): { capacity: number; buildCost: number; rampRate: number } => {
  switch (type) {
    case PlantType.Nuclear:
      return { capacity: 1000, buildCost: 5_000_000_000, rampRate: 10 }
    case PlantType.Coal:
      return { capacity: 800, buildCost: 1_500_000_000, rampRate: 30 }
    case PlantType.CCGT:
      return { capacity: 600, buildCost: 1_000_000_000, rampRate: 50 }
    case PlantType.Hydro:
      return { capacity: 400, buildCost: 800_000_000, rampRate: 100 }
    case PlantType.WindOffshore:
      return { capacity: 800, buildCost: 2_000_000_000, rampRate: 0 }
    case PlantType.WindOnshore:
      return { capacity: 300, buildCost: 600_000_000, rampRate: 0 }
    case PlantType.Solar:
      return { capacity: 200, buildCost: 400_000_000, rampRate: 0 }
    default:
      return { capacity: 500, buildCost: 1_000_000_000, rampRate: 50 }
  }
}

const getCitySpecs = (size: CitySize): { name: string; baseDemand: number } => {
  const cityNames = ['Newtown', 'Springfield', 'Riverside', 'Hillside', 'Lakeside', 'Parkville']
  const randomIndex = Math.floor(Math.random() * cityNames.length)
  const randomName = cityNames[randomIndex] ?? 'Newtown'

  switch (size) {
    case CitySize.SmallTown:
      return { name: randomName, baseDemand: 35 }
    case CitySize.MediumCity:
      return { name: randomName, baseDemand: 150 }
    case CitySize.LargeCity:
      return { name: randomName, baseDemand: 650 }
    case CitySize.MajorMetro:
      return { name: randomName, baseDemand: 3000 }
    default:
      return { name: randomName, baseDemand: 100 }
  }
}
