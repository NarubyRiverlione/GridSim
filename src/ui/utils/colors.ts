/**
 * Color utilities for component visualization
 */

import { ComponentState, PlantType, CitySize } from '@/types'

export const getStateColor = (state: ComponentState): string => {
  switch (state) {
    case ComponentState.Healthy:
      return '#22c55e'
    case ComponentState.Stressed:
      return '#eab308'
    case ComponentState.Failed:
      return '#ef4444'
    case ComponentState.Disconnected:
      return '#9ca3af'
  }
}

export const getPlantColor = (type: PlantType): string => {
  switch (type) {
    case PlantType.Nuclear:
      return '#8b5cf6'
    case PlantType.Coal:
      return '#78716c'
    case PlantType.CCGT:
      return '#3b82f6'
    case PlantType.Hydro:
      return '#06b6d4'
    case PlantType.WindOffshore:
      return '#0ea5e9'
    case PlantType.WindOnshore:
      return '#38bdf8'
    case PlantType.Solar:
      return '#fbbf24'
  }
}

export const getCitySizeRadius = (size: CitySize): number => {
  switch (size) {
    case CitySize.SmallTown:
      return 12
    case CitySize.MediumCity:
      return 18
    case CitySize.LargeCity:
      return 24
    case CitySize.MajorMetro:
      return 32
  }
}
