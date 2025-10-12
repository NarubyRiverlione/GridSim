/**
 * Hook for managing interaction modes
 */

import { useState, useCallback } from 'react'
import { InteractionMode } from '@/types'

export interface UseInteractionModeReturn {
  mode: InteractionMode
  setMode: (mode: InteractionMode) => void
  isSelectMode: boolean
  isAddPowerPlantMode: boolean
  isAddCityMode: boolean
  isAddTransmissionLineMode: boolean
  isAddSubstationMode: boolean
  isAddSwitchingStationMode: boolean
}

export const useInteractionMode = (): UseInteractionModeReturn => {
  const [mode, setModeInternal] = useState<InteractionMode>(InteractionMode.Select)

  const setMode = useCallback((newMode: InteractionMode): void => {
    setModeInternal(newMode)
  }, [])

  return {
    mode,
    setMode,
    isSelectMode: mode === InteractionMode.Select,
    isAddPowerPlantMode: mode === InteractionMode.AddPowerPlant,
    isAddCityMode: mode === InteractionMode.AddCity,
    isAddTransmissionLineMode: mode === InteractionMode.AddTransmissionLine,
    isAddSubstationMode: mode === InteractionMode.AddSubstation,
    isAddSwitchingStationMode: mode === InteractionMode.AddSwitchingStation,
  }
}
