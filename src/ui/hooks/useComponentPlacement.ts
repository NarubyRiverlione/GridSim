/**
 * Hook for managing component placement interactions
 */

import { useState, useCallback, useEffect } from 'react'
import type { Component, Point } from '@/types'
import { InteractionMode, PlantType, CitySize, SubstationType } from '@/types'
import { snapPointToGrid, isValidPlacement } from '../utils/placement'
import { getComponentSize } from '@/utils/componentUtils'
import {
  createPowerPlant,
  createCity,
  createSubstation,
  createSwitchingStation,
  createPylon,
} from '@/utils/componentFactory'

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

      console.debug(
        'useComponentPlacement.handleMouseMove: snappedPos=',
        snappedPos,
        'size=',
        componentSize,
        'buffer=',
        buffer,
        'isValid=',
        isValid
      )

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
      console.debug(
        'useComponentPlacement.handleClick: snappedPos=',
        snappedPos,
        'size=',
        componentSize,
        'buffer=',
        buffer,
        'isValid=',
        isValid
      )

      if (!isValid) {
        return null
      }

      // Create the appropriate component based on mode
      const newComponent = createComponentForMode(mode, snappedPos, placementConfig)
      // Clear placement ghost/preview now that placement was confirmed
      setPlacementState({
        isPlacing: false,
        ghostPosition: null,
        isValidPosition: false,
      })
      // Emit an explicit console log so e2e runner will capture placement success
      // console.log('useComponentPlacement.handleClick: placed component', newComponent)
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

/**
 * Get component size for mode - uses getComponentSize from componentUtils
 */
const getComponentSizeForMode = (mode: InteractionMode, config: PlacementConfig): number => {
  // Create a mock component object for size calculation
  switch (mode) {
    case InteractionMode.AddPowerPlant:
      return 80
    case InteractionMode.AddCity:
      return getComponentSize({ type: 'city', size: config.citySize })
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

/**
 * Create component based on mode and configuration
 */
const createComponentForMode = (mode: InteractionMode, position: Point, config: PlacementConfig): Component | null => {
  switch (mode) {
    case InteractionMode.AddPowerPlant:
      return createPowerPlant(position, config.plantType)
    case InteractionMode.AddCity:
      return createCity(position, config.citySize)
    case InteractionMode.AddSubstation:
      return createSubstation(position, config.substationType)
    case InteractionMode.AddSwitchingStation:
      return createSwitchingStation(position)
    case InteractionMode.AddPylon:
      return createPylon(position)
    default:
      return null
  }
}
